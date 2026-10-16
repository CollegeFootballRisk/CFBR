"""Pydantic schemas for bug reports."""

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.generated import BugCategory, BugSeverity, BugStatus


class Bug(BaseModel):
    """Shared bug-report fields."""

    model_config = ConfigDict(extra="forbid")

    title: str = Field(max_length=200)
    category: BugCategory
    severity: BugSeverity
    description: str
    reproduction_steps: str | None = None
    expected_behavior: str | None = None
    actual_behavior: str | None = None
    can_produce_consistently: bool = False
    user_agent: str | None = None
    page_url: str | None = None
    viewport_width: int | None = Field(default=None, ge=0)
    viewport_height: int | None = Field(default=None, ge=0)
    locale: str | None = Field(default=None, max_length=35)
    timezone: str | None = Field(default=None, max_length=100)
    app_version: str = Field(max_length=100)
    git_commit: str = Field(max_length=100)

    @field_validator("title", "description", "app_version", "git_commit")
    @classmethod
    def validate_not_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Field must not be blank")
        return value


class BugCreate(Bug):
    """Fields accepted when creating a report."""

    username: str | None = None


class BugUpdate(BaseModel):
    """Fields permitted when updating bug-report workflow and Discord data."""

    model_config = ConfigDict(extra="forbid")

    status: BugStatus | None = None
    discord_ticket_status: str | None = Field(default=None, max_length=30)
    discord_thread_id: str | None = Field(default=None, max_length=30)
