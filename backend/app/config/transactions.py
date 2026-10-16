from collections.abc import Callable
from functools import wraps
from inspect import signature
from typing import Any

from sqlalchemy.orm import Session


def transactional[**P, R](func: Callable[P, R]) -> Callable[P, R]:
    """Execute a service operation in a database transaction.

    Supports positional and keyword `db` arguments.
    Commits on success and rolls back on exceptions.
    """
    func_signature = signature(func)

    @wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        bound = func_signature.bind(*args, **kwargs)
        db: Any = bound.arguments.get("db")

        if not isinstance(db, Session):
            raise TypeError(f"{func.__name__} requires a SQLAlchemy Session named 'db'")

        with db.begin():
            return func(*args, **kwargs)

    return wrapper
