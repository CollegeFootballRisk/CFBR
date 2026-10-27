import datetime
import enum

from sqlalchemy import (
    BigInteger,
    Boolean,
    CheckConstraint,
    DateTime,
    Enum,
    Identity,
    Integer,
    PrimaryKeyConstraint,
    String,
    Text,
    UniqueConstraint,
    text,
)
from sqlalchemy.dialects.postgresql import ARRAY, CITEXT, INET
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class BugCategory(enum.StrEnum):
    MAP = "map"
    ACCOUNT = "account"
    GAMEPLAY = "gameplay"
    UI_DESIGN = "UI_design"
    PERFORMANCE = "performance"
    OTHER = "other"


class BugSeverity(enum.StrEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class BugStatus(enum.StrEnum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"


class Bugs(Base):
    __tablename__ = "bugs"
    __table_args__ = (
        CheckConstraint(
            "length(TRIM(BOTH FROM app_version)) > 0", name="bugs_app_version_not_blank"
        ),
        CheckConstraint(
            "length(TRIM(BOTH FROM description)) > 0", name="bugs_description_not_blank"
        ),
        CheckConstraint("length(TRIM(BOTH FROM git_commit)) > 0", name="bugs_git_commit_not_blank"),
        CheckConstraint("length(TRIM(BOTH FROM title)) > 0", name="bugs_title_not_blank"),
        CheckConstraint(
            "transcript_status::text = ANY (ARRAY['pending'::character varying, 'generating'::character varying, 'published'::character varying, 'failed'::character varying]::text[])",
            name="bugs_transcript_status_valid",
        ),
        CheckConstraint(
            "viewport_height IS NULL OR viewport_height >= 0",
            name="bugs_viewport_height_nonnegative",
        ),
        CheckConstraint(
            "viewport_width IS NULL OR viewport_width >= 0", name="bugs_viewport_width_nonnegative"
        ),
        PrimaryKeyConstraint("id", name="bugs_pkey"),
        UniqueConstraint("discord_thread_id", name="bugs_discord_thread_id_key"),
        {"schema": "public"},
    )
    id: Mapped[int] = mapped_column(
        BigInteger,
        Identity(
            always=True,
            start=1,
            increment=1,
            minvalue=1,
            maxvalue=9223372036854775807,
            cycle=False,
            cache=1,
        ),
        primary_key=True,
        autoincrement=True,
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[BugCategory] = mapped_column(
        Enum(
            BugCategory,
            values_callable=lambda cls: [member.value for member in cls],
            name="bug_category",
        ),
        nullable=False,
    )
    severity: Mapped[BugSeverity] = mapped_column(
        Enum(
            BugSeverity,
            values_callable=lambda cls: [member.value for member in cls],
            name="bug_severity",
        ),
        nullable=False,
    )
    description: Mapped[str] = mapped_column(Text, nullable=False)
    can_produce_consistently: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default=text("false")
    )
    app_version: Mapped[str] = mapped_column(String(100), nullable=False)
    git_commit: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[BugStatus] = mapped_column(
        Enum(
            BugStatus,
            values_callable=lambda cls: [member.value for member in cls],
            name="bug_status",
        ),
        nullable=False,
        server_default=text("'open'::bug_status"),
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("CURRENT_TIMESTAMP")
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(True), nullable=False, server_default=text("CURRENT_TIMESTAMP")
    )
    transcript_status: Mapped[str] = mapped_column(
        String(20), nullable=False, server_default=text("'pending'::character varying")
    )
    username: Mapped[str | None] = mapped_column(Text)
    reproduction_steps: Mapped[str | None] = mapped_column(Text)
    expected_behavior: Mapped[str | None] = mapped_column(Text)
    actual_behavior: Mapped[str | None] = mapped_column(Text)
    ip_address: Mapped[object | None] = mapped_column(INET)
    user_agent: Mapped[str | None] = mapped_column(Text)
    page_url: Mapped[str | None] = mapped_column(Text)
    viewport_width: Mapped[int | None] = mapped_column(Integer)
    viewport_height: Mapped[int | None] = mapped_column(Integer)
    locale: Mapped[str | None] = mapped_column(String(35))
    timezone: Mapped[str | None] = mapped_column(String(100))
    discord_ticket_status: Mapped[str | None] = mapped_column(String(30))
    discord_thread_id: Mapped[str | None] = mapped_column(String(30))
    resolved_at: Mapped[datetime.datetime | None] = mapped_column(DateTime(True))
    closed_at: Mapped[datetime.datetime | None] = mapped_column(DateTime(True))
    discord_message_id: Mapped[str | None] = mapped_column(String(30))
    discord_transcript_message_id: Mapped[str | None] = mapped_column(String(30))
    closed_by_discord_id: Mapped[str | None] = mapped_column(String(30))


class Teams(Base):
    __tablename__ = "teams"
    __table_args__ = (
        CheckConstraint("length(TRIM(BOTH FROM logo)) > 0", name="teams_logo_not_blank"),
        CheckConstraint("length(TRIM(BOTH FROM name::text)) > 0", name="teams_name_not_blank"),
        CheckConstraint(
            "primary_color ~ '^#[0-9A-Fa-f]{6}$'::text", name="teams_primary_color_valid"
        ),
        CheckConstraint(
            "secondary_color ~ '^#[0-9A-Fa-f]{6}$'::text", name="teams_secondary_color_valid"
        ),
        PrimaryKeyConstraint("id", name="teams_pkey"),
        UniqueConstraint("legacy_team_id", name="teams_legacy_team_id_key"),
        UniqueConstraint("name", name="teams_name_key"),
        {"schema": "public"},
    )
    id: Mapped[int] = mapped_column(
        Integer,
        Identity(start=1, increment=1, minvalue=1, maxvalue=2147483647, cycle=False, cache=1),
        primary_key=True,
        autoincrement=True,
    )
    name: Mapped[str] = mapped_column(CITEXT, nullable=False)
    primary_color: Mapped[str] = mapped_column(Text, nullable=False)
    secondary_color: Mapped[str] = mapped_column(Text, nullable=False)
    logo: Mapped[str] = mapped_column(Text, nullable=False)
    seasons: Mapped[list[int]] = mapped_column(
        ARRAY(Integer()), nullable=False, server_default=text("'{}'::integer[]")
    )
    legacy_team_id: Mapped[int | None] = mapped_column(Integer)
