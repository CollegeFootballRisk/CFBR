import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.config.db import get_session
from app.schemas.api import ApiResponse
from app.schemas.bug import BugCreate, BugUpdate
from app.services import bug as bug_service
from app.services.bug import BugValidationError

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/bugs",
    tags=["bugs"],
)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=ApiResponse[None],
)
def create_bug(
    payload: BugCreate,
    request: Request,
    db: Session = Depends(get_session),
) -> ApiResponse[None]:
    """Submit a new bug report."""
    try:
        ip_address = request.headers.get("cf-connecting-ip")
        bug_service.create_bug(db, payload, ip_address=ip_address)
    except SQLAlchemyError as exc:
        logger.exception("Database error while creating a bug report")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create bug report",
        ) from exc

    return ApiResponse(
        status=status.HTTP_201_CREATED,
        message="Bug report submitted successfully.",
        data=None,
    )


# TODO: Remove from Schema after users see the API, include_in_schema=False
@router.patch(
    "/{bug_id}",
    status_code=status.HTTP_200_OK,
    response_model=ApiResponse[None],
)
def update_bug(
    bug_id: int,
    payload: BugUpdate,
    db: Session = Depends(get_session),
) -> ApiResponse[None]:
    """Partially update a bug report."""
    try:
        bug = bug_service.update_bug(db, bug_id, payload)
    except BugValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc
    except SQLAlchemyError as exc:
        logger.exception("Database error while updating bug report %s", bug_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update bug report",
        ) from exc

    if bug is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bug report not found",
        )

    return ApiResponse(
        status=status.HTTP_200_OK,
        message="Bug report updated successfully.",
        data=None,
    )
