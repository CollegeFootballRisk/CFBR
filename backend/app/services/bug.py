"""Business logic and transaction management for bug reports."""

from sqlalchemy.orm import Session

from app.config.transactions import transactional
from app.models.generated import Bugs
from app.repositories import bug as bug_repository
from app.schemas.bug import BugCreate, BugUpdate


class BugValidationError(ValueError):
    """Raised when a bug report update violates application rules."""


@transactional
def create_bug(
    db: Session,
    payload: BugCreate,
) -> Bugs:
    """Create a bug report."""
    return bug_repository.create_bug(db, payload)


@transactional
def update_bug(
    db: Session,
    bug_id: int,
    payload: BugUpdate,
) -> Bugs | None:
    """Update a bug report.

    Returns None when the report does not exist.
    """
    changes = payload.model_dump(exclude_unset=True)

    if "status" in changes and changes["status"] is None:
        raise BugValidationError("status cannot be null")

    bug = bug_repository.get_bug(db, bug_id)

    if bug is None:
        return None

    if changes:
        bug_repository.update_bug(db, bug, changes)

    return bug
