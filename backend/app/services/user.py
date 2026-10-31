# SPDX-License-Identifier: MPL-2.0

"""Business logic for CFBR users."""

from sqlalchemy.orm import Session

from app.models.generated import Users
from app.repositories import user as user_repository


def search_players(
    db: Session,
    query: str,
    limit: int = 10,
) -> list[Users]:
    """Search players by display-name prefix."""
    normalized_query = query.strip()

    return user_repository.search_players(
        db=db,
        query=normalized_query,
        limit=limit,
    )
