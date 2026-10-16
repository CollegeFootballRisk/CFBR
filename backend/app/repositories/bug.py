from sqlalchemy.orm import Session

from app.models.generated import Bugs
from app.schemas.bug import BugCreate


def create_bug(
    db: Session,
    payload: BugCreate,
    ip_address: str | None = None,
) -> Bugs:
    """Add a bug report to the current transaction."""
    bug = Bugs(
        **payload.model_dump(),
        ip_address=ip_address,
        discord_ticket_status="pending",
    )
    db.add(bug)
    db.flush()
    return bug


def update_bug(
    db: Session,
    bug: Bugs,
    changes: dict[str, object],
) -> Bugs:
    """Apply validated changes in the current transaction."""
    for field, value in changes.items():
        setattr(bug, field, value)

    db.flush()
    return bug


def get_bug(db: Session, bug_id: int) -> Bugs | None:
    """Return a bug report by ID."""
    return db.get(Bugs, bug_id)
