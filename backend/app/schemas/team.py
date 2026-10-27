"""Pydantic response schemas for team metadata."""

from pydantic import BaseModel, ConfigDict, Field


class TeamResponse(BaseModel):
    """Public team metadata returned by GET /api/teams."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    primary_color: str = Field(serialization_alias="primaryColor")
    secondary_color: str = Field(serialization_alias="secondaryColor")
    logo: str
    seasons: list[int]
