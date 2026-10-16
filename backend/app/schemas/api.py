from typing import TypeVar

from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class ApiResponse[T](BaseModel):
    model_config = ConfigDict(from_attributes=True)

    status: int
    message: str
    data: T


class ApiValidationError(BaseModel):
    code: str
    message: str
    field: str | None = None


class ApiError(BaseModel):
    code: str
    message: str
    errors: list[ApiValidationError] | None = None


class ApiErrorResponse(BaseModel):
    status: int
    message: str
    error: ApiError
