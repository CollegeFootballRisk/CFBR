"""Background worker that creates private Discord channels for CFBR bug reports."""

from __future__ import annotations

import asyncio
import logging
import re
from typing import Any

import discord
from sqlalchemy import select, update
from sqlalchemy.orm import Session, sessionmaker

from app.config.db import get_engine
from app.config.settings import settings
from app.models.generated import Bugs

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("cfbr.discord_worker")

POLL_SECONDS = 10
RETRY_SECONDS = 30
TOPIC_MARKER = "CFBR-BUG-ID:"


def _session_factory() -> sessionmaker[Session]:
    return sessionmaker(bind=get_engine(), autoflush=False, expire_on_commit=False)


def _claim_next_bug(factory: sessionmaker[Session]) -> dict[str, Any] | None:
    """Claim one pending report in a short transaction, safe across worker replicas."""
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
        }


def _set_status(
    factory: sessionmaker[Session],
    bug_id: int,
    status: str,
    channel_id: str | None = None,
) -> None:
    with factory.begin() as db:
        db.execute(
            update(Bugs)
            .where(Bugs.id == bug_id)
            .values(discord_ticket_status=status, discord_thread_id=channel_id)
        )


def _reset_abandoned_claims(factory: sessionmaker[Session]) -> None:
    """Requeue work left in `creating` if the worker stopped unexpectedly."""
    with factory.begin() as db:
        db.execute(
            update(Bugs)
            .where(Bugs.discord_ticket_status == "creating")
            .values(discord_ticket_status="pending")
        )


def _channel_name(bug_id: int, title: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")[:70].strip("-")
    return f"bug-{bug_id}-{slug or 'report'}"[:100]


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


class BugTicketClient(discord.Client):
    def __init__(self, factory: sessionmaker[Session]) -> None:
        intents = discord.Intents.none()
        intents.guilds = True
        super().__init__(intents=intents)
        self.factory = factory
        self.worker_task: asyncio.Task[None] | None = None

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
                bug_id = bug.get("id", "unknown") if bug is not None else "unknown"
                logger.exception("Failed to process Discord ticket for bug %s", bug_id)
                if bug is not None:
                    try:
                        await asyncio.to_thread(
                            _set_status, self.factory, int(bug["id"]), "pending", None
                        )
                    except Exception:
                        logger.exception("Could not requeue bug %s", bug["id"])
                await asyncio.sleep(RETRY_SECONDS)

    async def _create_ticket(self, bug: dict[str, Any]) -> None:
        bug_id = int(bug["id"])
        guild_id = settings.discord_guild_id
        category_id = settings.discord_ticket_category_id
        moderator_role_id = settings.discord_moderator_role_id

        if not all((guild_id, category_id, moderator_role_id)):
            raise RuntimeError("Discord guild, category, and moderator role IDs must be configured")

        guild = self.get_guild(guild_id)
        if guild is None:
            raise RuntimeError(f"Bot is not connected to configured Discord guild {guild_id}")

        category = guild.get_channel(category_id)
        if not isinstance(category, discord.CategoryChannel):
            raise RuntimeError(f"Configured Discord category {category_id} was not found")

        moderator_role = guild.get_role(moderator_role_id)
        if moderator_role is None:
            raise RuntimeError(
                f"Configured Discord moderator role {moderator_role_id} was not found"
            )

        marker = f"{TOPIC_MARKER} {bug_id}"
        channel = next(
            (c for c in category.text_channels if c.topic and marker in c.topic),
            None,
        )

        if channel is None:
            bot_member = guild.me
            if bot_member is None:
                raise RuntimeError("Could not resolve bot member in Discord guild")

            overwrites = {
                guild.default_role: discord.PermissionOverwrite(
                    view_channel=False,
                ),
                moderator_role: discord.PermissionOverwrite(
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
            }

            channel = await guild.create_text_channel(
                name=_channel_name(bug_id, str(bug["title"])),
                category=category,
                overwrites=overwrites,
                topic=f"{marker} | Created automatically by CFBR",
                reason=f"CFBR bug report #{bug_id}",
            )
        # If a process stopped after channel creation but before the DB update,
        # the topic marker lets a retry find the existing channel.
        await channel.send(
            content=f"New CFBR bug report submitted. <@&{moderator_role_id}>",
            embed=_build_embed(bug),
            allowed_mentions=discord.AllowedMentions(roles=True, users=False, everyone=False),
        )

        await asyncio.to_thread(_set_status, self.factory, bug_id, "created", str(channel.id))
        logger.info(
            "Created/reconciled Discord ticket channel %s for bug %s",
            channel.id,
            bug_id,
        )


async def _run() -> None:
    if not settings.discord_bot_token:
        raise RuntimeError("DISCORD_BOT_TOKEN is required to run the Discord worker")

    factory = _session_factory()
    await asyncio.to_thread(_reset_abandoned_claims, factory)

    client = BugTicketClient(factory)
    await client.start(settings.discord_bot_token)


def main() -> None:
    asyncio.run(_run())


if __name__ == "__main__":
    main()
