import datetime
import enum
from typing import Optional

from sqlalchemy import (
    BigInteger,
    Boolean,
    CheckConstraint,
    DateTime,
    Enum,
    ForeignKeyConstraint,
    Identity,
    Index,
    Integer,
    PrimaryKeyConstraint,
    String,
    Text,
    UniqueConstraint,
    text,
)
from sqlalchemy.dialects.postgresql import ARRAY, CITEXT, INET, JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


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
        CheckConstraint("length(TRIM(BOTH FROM app_version)) > 0", name="bugs_app_version_not_blank"),
        CheckConstraint("length(TRIM(BOTH FROM description)) > 0", name="bugs_description_not_blank"),
        CheckConstraint("length(TRIM(BOTH FROM git_commit)) > 0", name="bugs_git_commit_not_blank"),
        CheckConstraint("length(TRIM(BOTH FROM title)) > 0", name="bugs_title_not_blank"),
        CheckConstraint(
            "transcript_status::text = ANY (ARRAY['pending'::character varying, 'generating'::character varying, 'published'::character varying, 'failed'::character varying]::text[])",
            name="bugs_transcript_status_valid",
        ),
        CheckConstraint("viewport_height IS NULL OR viewport_height >= 0", name="bugs_viewport_height_nonnegative"),
        CheckConstraint("viewport_width IS NULL OR viewport_width >= 0", name="bugs_viewport_width_nonnegative"),
        PrimaryKeyConstraint("id", name="bugs_pkey"),
        UniqueConstraint("discord_thread_id", name="bugs_discord_thread_id_key"),
        {"schema": "public"},
    )
    id: Mapped[int] = mapped_column(
        BigInteger,
        Identity(always=True, start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1),
        primary_key=True,
        autoincrement=True,
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[BugCategory] = mapped_column(
        Enum(BugCategory, values_callable=lambda cls: [member.value for member in cls], name="bug_category"),
        nullable=False,
    )
    severity: Mapped[BugSeverity] = mapped_column(
        Enum(BugSeverity, values_callable=lambda cls: [member.value for member in cls], name="bug_severity"),
        nullable=False,
    )
    description: Mapped[str] = mapped_column(Text, nullable=False)
    can_produce_consistently: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
    app_version: Mapped[str] = mapped_column(String(100), nullable=False)
    git_commit: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[BugStatus] = mapped_column(
        Enum(BugStatus, values_callable=lambda cls: [member.value for member in cls], name="bug_status"),
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
        CheckConstraint("primary_color ~ '^#[0-9A-Fa-f]{6}$'::text", name="teams_primary_color_valid"),
        CheckConstraint("secondary_color ~ '^#[0-9A-Fa-f]{6}$'::text", name="teams_secondary_color_valid"),
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
    seasons: Mapped[list[int]] = mapped_column(ARRAY(Integer()), nullable=False, server_default=text("'{}'::integer[]"))
    legacy_team_id: Mapped[int | None] = mapped_column(Integer)
    player_memberships_current_team: Mapped[list["PlayerMemberships"]] = relationship(
        "PlayerMemberships", foreign_keys="[PlayerMemberships.current_team_id]", back_populates="current_team"
    )
    player_memberships_playing_for_team: Mapped[list["PlayerMemberships"]] = relationship(
        "PlayerMemberships", foreign_keys="[PlayerMemberships.playing_for_team_id]", back_populates="playing_for_team"
    )


class Users(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint("merged_into_user_id IS NULL OR merged_into_user_id <> id", name="users_no_self_merge"),
        ForeignKeyConstraint(
            ["merged_into_user_id"], ["public.users.id"], ondelete="RESTRICT", name="users_merged_into_user_id_fkey"
        ),
        PrimaryKeyConstraint("id", name="users_pkey"),
        UniqueConstraint("keycloak_subject", name="users_keycloak_subject_key"),
        Index("ix_users_merged_into_user_id", "merged_into_user_id"),
        {"schema": "public"},
    )
    id: Mapped[int] = mapped_column(
        BigInteger,
        Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1),
        primary_key=True,
        autoincrement=True,
    )
    is_admin: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text("now()"))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text("now()"))
    keycloak_subject: Mapped[str | None] = mapped_column(Text)
    display_name: Mapped[str | None] = mapped_column(Text)
    merged_into_user_id: Mapped[int | None] = mapped_column(BigInteger)
    merged_into_user: Mapped[Optional["Users"]] = relationship(
        "Users", remote_side=[id], back_populates="merged_into_user_reverse"
    )
    merged_into_user_reverse: Mapped[list["Users"]] = relationship(
        "Users", remote_side=[merged_into_user_id], back_populates="merged_into_user"
    )
    legacy_user_mappings: Mapped[list["LegacyUserMappings"]] = relationship("LegacyUserMappings", back_populates="user")
    player_memberships: Mapped[list["PlayerMemberships"]] = relationship("PlayerMemberships", back_populates="user")
    user_auth: Mapped[list["UserAuth"]] = relationship("UserAuth", back_populates="user")
    user_merge_events_actor_user: Mapped[list["UserMergeEvents"]] = relationship(
        "UserMergeEvents", foreign_keys="[UserMergeEvents.actor_user_id]", back_populates="actor_user"
    )
    user_merge_events_source_user: Mapped[list["UserMergeEvents"]] = relationship(
        "UserMergeEvents", foreign_keys="[UserMergeEvents.source_user_id]", back_populates="source_user"
    )
    user_merge_events_target_user: Mapped[list["UserMergeEvents"]] = relationship(
        "UserMergeEvents", foreign_keys="[UserMergeEvents.target_user_id]", back_populates="target_user"
    )


class LegacyUserMappings(Base):
    __tablename__ = "legacy_user_mappings"
    __table_args__ = (
        ForeignKeyConstraint(
            ["user_id"], ["public.users.id"], ondelete="RESTRICT", name="legacy_user_mappings_user_id_fkey"
        ),
        PrimaryKeyConstraint("id", name="legacy_user_mappings_pkey"),
        UniqueConstraint("source_system", "legacy_user_id", name="legacy_user_mapping_source_id_unique"),
        UniqueConstraint("source_system", "user_id", name="legacy_user_mapping_user_unique"),
        Index("ix_legacy_user_mappings_user_id", "user_id"),
        {"schema": "public"},
    )
    id: Mapped[int] = mapped_column(
        BigInteger,
        Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1),
        primary_key=True,
        autoincrement=True,
    )
    source_system: Mapped[str] = mapped_column(Text, nullable=False, server_default=text("'risk'::text"))
    legacy_user_id: Mapped[int] = mapped_column(Integer, nullable=False)
    user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    migrated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text("now()"))
    user: Mapped["Users"] = relationship("Users", back_populates="legacy_user_mappings")


class PlayerMemberships(Base):
    __tablename__ = "player_memberships"
    __table_args__ = (
        ForeignKeyConstraint(
            ["current_team_id"],
            ["public.teams.id"],
            ondelete="RESTRICT",
            name="player_memberships_current_team_id_fkey",
        ),
        ForeignKeyConstraint(
            ["playing_for_team_id"],
            ["public.teams.id"],
            ondelete="RESTRICT",
            name="player_memberships_playing_for_team_id_fkey",
        ),
        ForeignKeyConstraint(
            ["user_id"], ["public.users.id"], ondelete="RESTRICT", name="player_memberships_user_id_fkey"
        ),
        PrimaryKeyConstraint("id", name="player_memberships_pkey"),
        UniqueConstraint("user_id", "game_id", name="player_memberships_user_game_unique"),
        {"schema": "public"},
    )
    id: Mapped[int] = mapped_column(
        BigInteger,
        Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1),
        primary_key=True,
        autoincrement=True,
    )
    user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    game_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    current_team_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    playing_for_team_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    joined_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text("now()"))
    current_team: Mapped["Teams"] = relationship(
        "Teams", foreign_keys=[current_team_id], back_populates="player_memberships_current_team"
    )
    playing_for_team: Mapped["Teams"] = relationship(
        "Teams", foreign_keys=[playing_for_team_id], back_populates="player_memberships_playing_for_team"
    )
    user: Mapped["Users"] = relationship("Users", back_populates="player_memberships")


class UserAuth(Base):
    __tablename__ = "user_auth"
    __table_args__ = (
        CheckConstraint("provider = ANY (ARRAY['reddit'::text, 'discord'::text])", name="user_auth_provider_check"),
        ForeignKeyConstraint(["user_id"], ["public.users.id"], ondelete="RESTRICT", name="user_auth_user_id_fkey"),
        PrimaryKeyConstraint("id", name="user_auth_pkey"),
        UniqueConstraint("provider", "provider_subject", name="user_auth_provider_subject_unique"),
        UniqueConstraint("user_id", "provider", name="user_auth_user_provider_unique"),
        Index("ix_user_auth_user_id", "user_id"),
        {"schema": "public"},
    )
    id: Mapped[int] = mapped_column(
        BigInteger,
        Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1),
        primary_key=True,
        autoincrement=True,
    )
    user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    provider: Mapped[str] = mapped_column(Text, nullable=False)
    provider_subject: Mapped[str] = mapped_column(Text, nullable=False)
    linked_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text("now()"))
    provider_username: Mapped[str | None] = mapped_column(Text)
    user: Mapped["Users"] = relationship("Users", back_populates="user_auth")


class UserMergeEvents(Base):
    __tablename__ = "user_merge_events"
    __table_args__ = (
        CheckConstraint("source_user_id <> target_user_id", name="user_merge_events_no_self_merge"),
        ForeignKeyConstraint(
            ["actor_user_id"], ["public.users.id"], ondelete="RESTRICT", name="user_merge_events_actor_user_id_fkey"
        ),
        ForeignKeyConstraint(
            ["source_user_id"], ["public.users.id"], ondelete="RESTRICT", name="user_merge_events_source_user_id_fkey"
        ),
        ForeignKeyConstraint(
            ["target_user_id"], ["public.users.id"], ondelete="RESTRICT", name="user_merge_events_target_user_id_fkey"
        ),
        PrimaryKeyConstraint("id", name="user_merge_events_pkey"),
        Index("ix_user_merge_events_source_user_id", "source_user_id"),
        Index("ix_user_merge_events_target_user_id", "target_user_id"),
        {"schema": "public"},
    )
    id: Mapped[int] = mapped_column(
        BigInteger,
        Identity(start=1, increment=1, minvalue=1, maxvalue=9223372036854775807, cycle=False, cache=1),
        primary_key=True,
        autoincrement=True,
    )
    source_user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    target_user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    merged_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text("now()"))
    details: Mapped[object] = mapped_column(JSONB, nullable=False, server_default=text("'{}'::jsonb"))
    actor_user_id: Mapped[int | None] = mapped_column(BigInteger)
    actor_user: Mapped[Optional["Users"]] = relationship(
        "Users", foreign_keys=[actor_user_id], back_populates="user_merge_events_actor_user"
    )
    source_user: Mapped["Users"] = relationship(
        "Users", foreign_keys=[source_user_id], back_populates="user_merge_events_source_user"
    )
    target_user: Mapped["Users"] = relationship(
        "Users", foreign_keys=[target_user_id], back_populates="user_merge_events_target_user"
    )
