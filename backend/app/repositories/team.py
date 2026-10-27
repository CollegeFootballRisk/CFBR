from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.generated import Teams


def get_teams(db: Session) -> list[Teams]:
    """Get all teams, ordered by name."""
    statement = select(Teams).order_by(Teams.name, Teams.id)
    return list(db.scalars(statement).all())
