# SPDX-License-Identifier: MPL-2.0

from __future__ import annotations

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database
    database_url: str = Field(alias="DATABASE_URL")
    # Discord bug-ticket worker
    discord_bot_token: str | None = Field(default=None, alias="DISCORD_BOT_TOKEN")
    discord_guild_id: int | None = Field(default=None, alias="DISCORD_GUILD_ID")
    discord_ticket_category_id: int | None = Field(default=None, alias="DISCORD_TICKET_CATEGORY_ID")
    discord_game_dev_role_id: int | None = Field(default=None, alias="DISCORD_GAME_DEV_ROLE_ID")
    discord_transcripts_channel_id: int | None = Field(
        default=None,
        alias="DISCORD_TRANSCRIPTS_CHANNEL_ID",
    )
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
