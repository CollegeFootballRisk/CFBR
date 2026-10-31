# SPDX-License-Identifier: MPL-2.0

"""Pydantic response schemas for users and player search."""

from pydantic import BaseModel, ConfigDict, Field


class PlayerSearchResult(BaseModel):
    """Public player fields returned by GET /api/players/search."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    display_name: str = Field(serialization_alias="displayName")
