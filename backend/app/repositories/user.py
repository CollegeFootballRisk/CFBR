# SPDX-License-Identifier: MPL-2.0

"""Database queries for CFBR users."""

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.generated import Users


def search_players(
    db: Session,
    query: str,
    limit: int = 10,
) -> list[Users]:
    """Search active, unmerged users by case-insensitive display-name prefix."""
    # Escape LIKE wildcards so user input is treated literally.
    escaped_query = query.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")

    statement = (
        select(Users)
        .where(
            Users.is_active.is_(True),
            Users.merged_into_user_id.is_(None),
            Users.display_name.is_not(None),
            func.btrim(Users.display_name) != "",
            Users.display_name.ilike(f"{escaped_query}%", escape="\\"),
        )
        .order_by(func.lower(Users.display_name), Users.id)
        .limit(limit)
    )

    return list(db.scalars(statement).all())
