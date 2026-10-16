"""Discord bug ticket worker with persistent controls and HTML transcripts."""

from __future__ import annotations

import asyncio
import html
import logging
import re
from io import BytesIO
from typing import Any

import discord
from sqlalchemy import select, update
from sqlalchemy.orm import Session, sessionmaker

from app.config.db import get_engine
from app.config.settings import settings
from app.models.generated import Bugs, BugStatus

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("cfbr.discord_worker")

POLL_SECONDS = 10
RETRY_SECONDS = 30
TOPIC_MARKER = "CFBR-BUG-ID:"
TRANSCRIPT_MARKER = "CFBR-BUG-ID:"


def _session_factory() -> sessionmaker[Session]:
    return sessionmaker(bind=get_engine(), autoflush=False, expire_on_commit=False)


def _claim_next_bug(factory: sessionmaker[Session]) -> dict[str, Any] | None:
    with factory.begin() as db:
        bug = db.scalar(
            select(Bugs)
            .where(Bugs.discord_ticket_status == "pending")
            .order_by(Bugs.id)
            .with_for_update(skip_locked=True)
            .limit(1)
        )
        if bug is None:
            return None
        bug.discord_ticket_status = "creating"
        db.flush()
        return {
            "id": bug.id,
            "title": bug.title,
            "category": bug.category.value,
            "severity": bug.severity.value,
            "status": bug.status.value,
            "description": bug.description,
            "reproduction_steps": bug.reproduction_steps,
            "expected_behavior": bug.expected_behavior,
            "actual_behavior": bug.actual_behavior,
            "can_produce_consistently": bug.can_produce_consistently,
            "app_version": bug.app_version,
            "git_commit": bug.git_commit,
            "username": bug.username,
            "page_url": bug.page_url,
            "ip_address": str(bug.ip_address) if bug.ip_address else None,
            "user_agent": bug.user_agent,
            "viewport_width": bug.viewport_width,
            "viewport_height": bug.viewport_height,
            "locale": bug.locale,
            "timezone": bug.timezone,
            "created_at": str(bug.created_at) if bug.created_at else "Unknown",
            "discord_thread_id": bug.discord_thread_id,
            "discord_message_id": bug.discord_message_id,
        }


def _requeue(factory: sessionmaker[Session], bug_id: int) -> None:
    # Do not erase a channel ID that may have been saved before an interrupted send.
    with factory.begin() as db:
        db.execute(update(Bugs).where(Bugs.id == bug_id).values(discord_ticket_status="pending"))


def _reset_abandoned_claims(factory: sessionmaker[Session]) -> None:
    with factory.begin() as db:
        db.execute(
            update(Bugs)
            .where(Bugs.discord_ticket_status == "creating")
            .values(discord_ticket_status="pending")
        )


def _recover_transcript_claims(factory: sessionmaker[Session]) -> None:
    with factory.begin() as db:
        db.execute(
            update(Bugs)
            .where(Bugs.transcript_status == "generating")
            .values(transcript_status="failed")
        )


def _save_channel(factory: sessionmaker[Session], bug_id: int, channel_id: str) -> None:
    with factory.begin() as db:
        db.execute(update(Bugs).where(Bugs.id == bug_id).values(discord_thread_id=channel_id))


def _set_ticket_created(
    factory: sessionmaker[Session], bug_id: int, channel_id: str, message_id: str
) -> None:
    with factory.begin() as db:
        db.execute(
            update(Bugs)
            .where(Bugs.id == bug_id)
            .values(
                discord_ticket_status="created",
                discord_thread_id=channel_id,
                discord_message_id=message_id,
            )
        )


def _get_ticket_refs(
    factory: sessionmaker[Session], bug_id: int
) -> tuple[str | None, str | None, str | None]:
    with factory() as db:
        bug = db.get(Bugs, bug_id)
        return (
            (bug.discord_thread_id, bug.discord_message_id, bug.status.value)
            if bug
            else (None, None, None)
        )


def _set_bug_status(factory: sessionmaker[Session], bug_id: int, status: BugStatus) -> bool:
    with factory.begin() as db:
        result = db.execute(
            update(Bugs)
            .where(Bugs.id == bug_id, Bugs.status != BugStatus.CLOSED)
            .values(status=status)
        )
        return bool(result.rowcount)


def _claim_close(factory: sessionmaker[Session], bug_id: int, discord_user_id: str) -> bool:
    with factory.begin() as db:
        result = db.execute(
            update(Bugs)
            .where(Bugs.id == bug_id, Bugs.transcript_status.notin_(["generating", "published"]))
            .values(
                status=BugStatus.CLOSED,
                closed_by_discord_id=discord_user_id,
                transcript_status="generating",
            )
        )
        return bool(result.rowcount)


def _set_transcript_status(
    factory: sessionmaker[Session], bug_id: int, status: str, message_id: str | None = None
) -> None:
    values: dict[str, Any] = {"transcript_status": status}
    if message_id is not None:
        values["discord_transcript_message_id"] = message_id
    with factory.begin() as db:
        db.execute(update(Bugs).where(Bugs.id == bug_id).values(**values))


def _get_transcript_state(factory: sessionmaker[Session], bug_id: int) -> str | None:
    with factory() as db:
        bug = db.get(Bugs, bug_id)
        return bug.transcript_status if bug else None


def _channel_name(bug_id: int, title: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")[:70].strip("-")
    return f"bug-{bug_id}-{slug or 'report'}"[:100]


def _bug_id_from_channel(channel: discord.abc.GuildChannel | None) -> int | None:
    topic = getattr(channel, "topic", None) or ""
    match = re.search(r"CFBR-BUG-ID:\s*(\d+)(?!\d)", topic)
    return int(match.group(1)) if match else None


def _is_game_dev(interaction: discord.Interaction) -> bool:
    role_id = settings.discord_game_dev_role_id
    return bool(
        role_id
        and isinstance(interaction.user, discord.Member)
        and any(role.id == role_id for role in interaction.user.roles)
    )


def _value(value: object | None, limit: int = 1024) -> str:
    if value is None or not str(value).strip():
        return "Not provided"
    rendered = str(value)
    return rendered if len(rendered) <= limit else rendered[: limit - 1] + "…"


def _build_embed(bug: dict[str, Any]) -> discord.Embed:
    severity = str(bug["severity"])
    embed = discord.Embed(
        title=f"Bug #{bug['id']}: {bug['title']}"[:256],
        description=_value(bug.get("description"), 4000),
        color=discord.Color.red() if severity == "critical" else discord.Color.orange(),
        timestamp=discord.utils.utcnow(),
    )
    embed.add_field(name="Severity", value=_value(severity), inline=True)
    embed.add_field(name="Category", value=_value(bug.get("category")), inline=True)
    embed.add_field(name="Submitted by", value=_value(bug.get("username")), inline=True)
    embed.add_field(
        name="Status", value=str(bug.get("status", "open")).replace("_", " ").title(), inline=True
    )
    for label, key in (
        ("Reproduction steps", "reproduction_steps"),
        ("Expected behavior", "expected_behavior"),
        ("Actual behavior", "actual_behavior"),
    ):
        if bug.get(key):
            embed.add_field(name=label, value=_value(bug[key]), inline=False)
    diagnostics = [
        f"Consistent reproduction: {'Yes' if bug.get('can_produce_consistently') else 'No'}",
        f"App version: {_value(bug.get('app_version'), 200)}",
        f"Git commit: {_value(bug.get('git_commit'), 200)}",
        f"IP address: {_value(bug.get('ip_address'), 100)}",
        f"Page: {_value(bug.get('page_url'), 500)}",
        f"Viewport: {bug.get('viewport_width') or '?'} × {bug.get('viewport_height') or '?'}",
        f"Locale / timezone: {_value(bug.get('locale'), 100)} / {_value(bug.get('timezone'), 100)}",
        f"Created: {_value(bug.get('created_at'), 100)}",
    ]
    embed.add_field(name="Diagnostics", value="\n".join(diagnostics)[:1024], inline=False)
    if bug.get("user_agent"):
        embed.add_field(name="User agent", value=_value(bug["user_agent"]), inline=False)
    return embed


class BugStatusSelect(discord.ui.Select):
    def __init__(self, client: BugTicketClient) -> None:
        super().__init__(
            placeholder="Choose a ticket status",
            min_values=1,
            max_values=1,
            options=[
                discord.SelectOption(label="In Progress", value="in_progress"),
                discord.SelectOption(label="Resolved", value="resolved"),
            ],
        )
        self.client = client

    async def callback(self, interaction: discord.Interaction) -> None:
        if not _is_game_dev(interaction):
            await interaction.response.send_message(
                "Only Game Devs can change ticket status.", ephemeral=True
            )
            return
        bug_id = _bug_id_from_channel(interaction.channel)
        if bug_id is None:
            await interaction.response.send_message(
                "This channel is not a CFBR bug ticket.", ephemeral=True
            )
            return
        await interaction.response.defer(ephemeral=True)
        status = BugStatus(self.values[0])
        changed = await asyncio.to_thread(_set_bug_status, self.client.factory, bug_id, status)
        if not changed:
            await interaction.followup.send("Ticket not found or already closed.", ephemeral=True)
            return
        try:
            await self.client.refresh_ticket_embed(bug_id)
        except Exception:
            logger.exception("Could not refresh ticket embed for bug %s", bug_id)
        await interaction.followup.send(
            f"Bug #{bug_id} marked **{status.value.replace('_', ' ').title()}**.", ephemeral=True
        )


class BugStatusView(discord.ui.View):
    def __init__(self, client: BugTicketClient) -> None:
        super().__init__(timeout=120)
        self.add_item(BugStatusSelect(client))


class BugTicketView(discord.ui.View):
    def __init__(self, client: BugTicketClient) -> None:
        super().__init__(timeout=None)
        self.client = client

    @discord.ui.button(
        label="Update Status", style=discord.ButtonStyle.primary, custom_id="cfbr:bug:update_status"
    )
    async def update_status(
        self, interaction: discord.Interaction, button: discord.ui.Button
    ) -> None:
        if not _is_game_dev(interaction):
            await interaction.response.send_message(
                "Only Game Devs can update tickets.", ephemeral=True
            )
            return
        bug_id = _bug_id_from_channel(interaction.channel)
        if bug_id is None:
            await interaction.response.send_message("Not a CFBR ticket channel.", ephemeral=True)
            return
        _, _, status = await asyncio.to_thread(_get_ticket_refs, self.client.factory, bug_id)
        if status == "closed":
            await interaction.response.send_message(
                "This ticket is already closed.", ephemeral=True
            )
            return
        await interaction.response.send_message(
            "Select the new status:", view=BugStatusView(self.client), ephemeral=True
        )

    @discord.ui.button(
        label="Close Ticket", style=discord.ButtonStyle.danger, custom_id="cfbr:bug:close_ticket"
    )
    async def close_ticket_button(
        self, interaction: discord.Interaction, button: discord.ui.Button
    ) -> None:
        if not _is_game_dev(interaction):
            await interaction.response.send_message(
                "Only Game Devs can close tickets.", ephemeral=True
            )
            return
        bug_id = _bug_id_from_channel(interaction.channel)
        if bug_id is None or not isinstance(interaction.channel, discord.TextChannel):
            await interaction.response.send_message("Not a CFBR ticket channel.", ephemeral=True)
            return
        await interaction.response.defer(ephemeral=True)
        try:
            result = await self.client.close_ticket(
                interaction.channel, bug_id, str(interaction.user.id)
            )
            await interaction.followup.send(result, ephemeral=True)
        except Exception:
            logger.exception("Failed closing bug ticket %s", bug_id)
            await interaction.followup.send(
                "Ticket close failed. Check worker logs; retry after fixing the error.",
                ephemeral=True,
            )


class BugTicketClient(discord.Client):
    def __init__(self, factory: sessionmaker[Session]) -> None:
        intents = discord.Intents.none()
        intents.guilds = True
        super().__init__(intents=intents)
        self.factory = factory
        self.worker_task: asyncio.Task[None] | None = None

    async def setup_hook(self) -> None:
        # A persistent view works after restart for messages with these custom IDs.
        self.add_view(BugTicketView(self))

    async def on_ready(self) -> None:
        logger.info("Discord bot connected as %s", self.user)
        if self.worker_task is None or self.worker_task.done():
            self.worker_task = asyncio.create_task(self._worker_loop())

    async def _worker_loop(self) -> None:
        while not self.is_closed():
            bug: dict[str, Any] | None = None
            try:
                bug = await asyncio.to_thread(_claim_next_bug, self.factory)
                if bug is None:
                    await asyncio.sleep(POLL_SECONDS)
                    continue
                await self._create_ticket(bug)
            except asyncio.CancelledError:
                raise
            except Exception:
                bug_id = bug.get("id", "unknown") if bug else "unknown"
                logger.exception("Failed to process Discord ticket for bug %s", bug_id)
                if bug is not None:
                    try:
                        await asyncio.to_thread(_requeue, self.factory, int(bug["id"]))
                    except Exception:
                        logger.exception("Could not requeue bug %s", bug_id)
                await asyncio.sleep(RETRY_SECONDS)

    async def _create_ticket(self, bug: dict[str, Any]) -> None:
        bug_id = int(bug["id"])
        guild_id = settings.discord_guild_id
        category_id = settings.discord_ticket_category_id
        game_dev_role_id = settings.discord_game_dev_role_id
        if not all((guild_id, category_id, game_dev_role_id)):
            raise RuntimeError(
                "DISCORD_GUILD_ID, DISCORD_TICKET_CATEGORY_ID,"
                "and DISCORD_GAME_DEV_ROLE_ID are required"
            )
        guild = self.get_guild(guild_id)
        if guild is None:
            raise RuntimeError(f"Discord guild {guild_id} unavailable")
        category = guild.get_channel(category_id)
        if not isinstance(category, discord.CategoryChannel):
            raise RuntimeError(f"Discord ticket category {category_id} unavailable")
        game_dev_role = guild.get_role(game_dev_role_id)
        if game_dev_role is None:
            raise RuntimeError(f"Game Dev role {game_dev_role_id} unavailable")

        marker = f"{TOPIC_MARKER} {bug_id}"
        channel: discord.TextChannel | None = None
        if bug.get("discord_thread_id"):
            candidate = guild.get_channel(int(bug["discord_thread_id"]))
            if (
                isinstance(candidate, discord.TextChannel)
                and _bug_id_from_channel(candidate) == bug_id
            ):
                channel = candidate
        if channel is None:
            channel = next(
                (c for c in category.text_channels if _bug_id_from_channel(c) == bug_id), None
            )
        if channel is None:
            bot_member = guild.me
            if bot_member is None:
                raise RuntimeError("Bot member not found in guild")
            channel = await guild.create_text_channel(
                name=_channel_name(bug_id, str(bug["title"])),
                category=category,
                overwrites={
                    guild.default_role: discord.PermissionOverwrite(view_channel=False),
                    game_dev_role: discord.PermissionOverwrite(
                        view_channel=True,
                        send_messages=True,
                        read_message_history=True,
                        embed_links=True,
                        attach_files=True,
                    ),
                    bot_member: discord.PermissionOverwrite(
                        view_channel=True,
                        send_messages=True,
                        read_message_history=True,
                        embed_links=True,
                        attach_files=True,
                        manage_channels=True,
                    ),
                },
                topic=f"{marker} | Created automatically by CFBR",
                reason=f"CFBR bug report #{bug_id}",
            )
        await asyncio.to_thread(_save_channel, self.factory, bug_id, str(channel.id))

        # Reconcile a previously posted message before sending a new one.
        message: discord.Message | None = None
        saved_message_id = bug.get("discord_message_id")
        if saved_message_id:
            try:
                message = await channel.fetch_message(int(saved_message_id))
            except discord.NotFound:
                pass
        if message is None:
            # A crash between send() and DB save can leave an untracked message.
            async for candidate in channel.history(limit=100, oldest_first=True):
                if (
                    candidate.author.id == self.user.id
                    and candidate.embeds
                    and candidate.embeds[0].title
                    and candidate.embeds[0].title.startswith(f"Bug #{bug_id}:")
                ):
                    message = candidate
                    break
        if message is None:
            message = await channel.send(
                content=f"New CFBR bug report submitted. <@&{game_dev_role_id}>",
                embed=_build_embed(bug),
                view=BugTicketView(self),
                allowed_mentions=discord.AllowedMentions(roles=True, users=False, everyone=False),
            )
        else:
            await message.edit(view=BugTicketView(self))
        await asyncio.to_thread(
            _set_ticket_created, self.factory, bug_id, str(channel.id), str(message.id)
        )
        logger.info("Discord ticket ready for bug %s in channel %s", bug_id, channel.id)

    async def refresh_ticket_embed(self, bug_id: int) -> None:
        channel_id, message_id, status = await asyncio.to_thread(
            _get_ticket_refs, self.factory, bug_id
        )
        if not channel_id or not message_id or not status:
            logger.warning("No Discord message reference for bug %s", bug_id)
            return
        channel = self.get_channel(int(channel_id)) or await self.fetch_channel(int(channel_id))
        if not isinstance(channel, discord.TextChannel):
            raise RuntimeError(f"Ticket channel {channel_id} unavailable")
        message = await channel.fetch_message(int(message_id))
        if not message.embeds:
            return
        embed = discord.Embed.from_dict(message.embeds[0].to_dict())
        fields = list(embed.fields)
        for index, field in enumerate(fields):
            if field.name == "Status":
                embed.set_field_at(
                    index, name="Status", value=status.replace("_", " ").title(), inline=True
                )
                break
        else:
            embed.add_field(name="Status", value=status.replace("_", " ").title(), inline=True)
        if status == "closed":
            embed.color = discord.Color.dark_grey()
        elif status == "resolved":
            embed.color = discord.Color.green()
        elif status == "in_progress":
            embed.color = discord.Color.blurple()
        await message.edit(embed=embed, view=BugTicketView(self))

    async def _make_transcript(self, channel: discord.TextChannel, bug_id: int) -> discord.File:
        lines = [
            "<!doctype html><html lang='en'><head><meta charset='utf-8'>",
            f"<title>CFBR Bug #{bug_id} Transcript</title>",
            "<style>body{font-family:system-ui,sans-serif;max-width:1000px;margin:2rem auto;"
            "padding:0 1rem;background:#111827;color:#f3f4f6}"
            "article{border-bottom:1px solid #374151;padding:1rem 0}small{color:#9ca3af}"
            "pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}a{color:#93c5fd}</style></head><body>",
            f"<h1>CFBR Bug #{bug_id} — #{html.escape(channel.name)}</h1>",
        ]
        async for message in channel.history(limit=None, oldest_first=True):
            author = html.escape(str(message.author))
            stamp = html.escape(message.created_at.isoformat())
            content = html.escape(message.content or "")
            lines.append(
                f"<article><strong>{author}</strong> "
                f"<small>ID {message.author.id} · {stamp}</small>"
                f"<pre>{content}</pre>"
            )
            for attachment in message.attachments:
                url = html.escape(attachment.url, quote=True)
                filename = html.escape(attachment.filename)
                lines.append(f'<p>Attachment: <a href="{url}">{filename}</a></p>')
            if message.embeds:
                lines.append(
                    f"<p><small>{len(message.embeds)} Discord embed(s) attached</small></p>"
                )
            lines.append("</article>")
        lines.append("</body></html>")
        return discord.File(
            BytesIO("\n".join(lines).encode("utf-8")), filename=f"bug-{bug_id}-transcript.html"
        )

    async def _find_existing_transcript(
        self, channel: discord.TextChannel, bug_id: int
    ) -> discord.Message | None:
        # Reconcile uploads if the process crashed after posting but before DB commit.
        marker = f"{TRANSCRIPT_MARKER} {bug_id}"
        async for message in channel.history(limit=500):
            if (
                message.author.id == self.user.id
                and marker in message.content
                and any(
                    attachment.filename == f"bug-{bug_id}-transcript.html"
                    for attachment in message.attachments
                )
            ):
                return message
        return None

    async def close_ticket(
        self, channel: discord.TextChannel, bug_id: int, discord_user_id: str
    ) -> str:
        claimed = await asyncio.to_thread(_claim_close, self.factory, bug_id, discord_user_id)
        if not claimed:
            state = await asyncio.to_thread(_get_transcript_state, self.factory, bug_id)
            if state == "published":
                await self._lock_ticket(channel)
                return f"Bug #{bug_id} is already closed; ticket locked."
            if state == "generating":
                return f"Bug #{bug_id} is already being closed. Try again shortly."
            raise RuntimeError(f"Cannot claim ticket close for bug {bug_id}: {state}")
        try:
            destination_id = settings.discord_transcripts_channel_id
            if not destination_id:
                raise RuntimeError("DISCORD_TRANSCRIPTS_CHANNEL_ID is not configured")
            destination = self.get_channel(destination_id) or await self.fetch_channel(
                destination_id
            )
            if not isinstance(destination, discord.TextChannel):
                raise RuntimeError("Transcript destination must be a text channel")
            existing = await self._find_existing_transcript(destination, bug_id)
            if existing is None:
                transcript = await self._make_transcript(channel, bug_id)
                try:
                    existing = await destination.send(
                        content=(
                            f"{TRANSCRIPT_MARKER} {bug_id} | "
                            f"Ticket closed by <@{discord_user_id}> | "
                            f"Source: {channel.mention}"
                        ),
                        file=transcript,
                        allowed_mentions=discord.AllowedMentions.none(),
                    )
                finally:
                    transcript.close()
            await asyncio.to_thread(
                _set_transcript_status, self.factory, bug_id, "published", str(existing.id)
            )
        except Exception:
            logger.exception("Transcript publication failed for bug %s", bug_id)
            await asyncio.to_thread(_set_transcript_status, self.factory, bug_id, "failed")
            raise
        # If locking fails, transcript stays published and another close click retries the lock.
        await self._lock_ticket(channel)
        try:
            await self.refresh_ticket_embed(bug_id)
        except Exception:
            logger.exception("Could not refresh closed ticket embed for bug %s", bug_id)
        return f"Bug #{bug_id} closed. Transcript posted and channel locked."

    async def _lock_ticket(self, channel: discord.TextChannel) -> None:
        role_id = settings.discord_game_dev_role_id
        role = channel.guild.get_role(role_id) if role_id else None
        if role is None:
            raise RuntimeError("Game Dev role unavailable; cannot lock ticket")
        overwrite = channel.overwrites_for(role)
        overwrite.send_messages = False
        overwrite.add_reactions = False
        await channel.set_permissions(role, overwrite=overwrite, reason="CFBR ticket closed")


async def _run() -> None:
    if not settings.discord_bot_token:
        raise RuntimeError("DISCORD_BOT_TOKEN is required")
    factory = _session_factory()
    await asyncio.to_thread(_reset_abandoned_claims, factory)
    await asyncio.to_thread(_recover_transcript_claims, factory)
    client = BugTicketClient(factory)
    await client.start(settings.discord_bot_token)


def main() -> None:
    asyncio.run(_run())


if __name__ == "__main__":
    main()
