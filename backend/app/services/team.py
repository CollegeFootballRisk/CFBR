from sqlalchemy.orm import Session

from app.models.generated import Teams
from app.repositories import team as team_repository


def get_teams(db: Session) -> list[Teams]:
    """Get all teams."""
    return team_repository.get_teams(db)
