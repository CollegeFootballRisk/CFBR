"""Read-only team metadata endpoints."""

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.config.db import get_session
from app.schemas.api import ApiResponse
from app.schemas.team import TeamResponse
from app.services import team as team_service

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/teams",
    tags=["teams"],
)


@router.get(
    "",
    response_model=ApiResponse[list[TeamResponse]],
    status_code=status.HTTP_200_OK,
)
def get_teams(
    db: Session = Depends(get_session),
) -> ApiResponse[list[TeamResponse]]:
    """Lists all teams, including those from past seasons."""
    try:
        teams = team_service.get_teams(db)
    except SQLAlchemyError as exc:
        logger.exception("Database error while listing teams")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve teams",
        ) from exc

    return ApiResponse(
        status=status.HTTP_200_OK,
        message="Teams retrieved successfully.",
        data=[TeamResponse.model_validate(team) for team in teams],
    )
