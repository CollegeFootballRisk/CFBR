# SPDX-License-Identifier: MPL-2.0

"""Player search endpoints."""

import logging

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.config.db import get_session
from app.schemas.api import ApiResponse
from app.schemas.user import PlayerSearchResult
from app.services import user as user_service

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/players",
    tags=["players"],
)


@router.get(
    "/search",
    response_model=ApiResponse[list[PlayerSearchResult]],
    status_code=status.HTTP_200_OK,
)
def search_players(
    q: str = Query(min_length=1, max_length=64),
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_session),
) -> ApiResponse[list[PlayerSearchResult]]:
    """Search active players by display-name prefix."""
    query = q.strip()

    if not query:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Search query cannot be blank",
        )

    try:
        players = user_service.search_players(
            db=db,
            query=query,
            limit=limit,
        )
    except SQLAlchemyError as exc:
        logger.exception("Database error while searching players")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to search players",
        ) from exc

    return ApiResponse(
        status=status.HTTP_200_OK,
        message="Players retrieved successfully.",
        data=[PlayerSearchResult.model_validate(player) for player in players],
    )
