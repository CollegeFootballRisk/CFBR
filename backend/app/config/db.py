# SPDX-License-Identifier: MPL-2.0

from __future__ import annotations

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.engine import Connection, Engine
from sqlalchemy.orm import Session, sessionmaker

from app.config.settings import settings

_ENGINE: Engine | None = None
_SessionLocal: sessionmaker[Session] | None = None


def get_engine() -> Engine:
    global _ENGINE, _SessionLocal

    if _ENGINE is not None:
        return _ENGINE

    _ENGINE = create_engine(
        settings.database_url,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
    )

    _SessionLocal = sessionmaker(
        bind=_ENGINE,
        autoflush=False,
        autocommit=False,
    )

    return _ENGINE


def get_conn() -> Connection:
    return get_engine().connect()


def get_session() -> Generator[Session, None, None]:
    global _SessionLocal

    if _SessionLocal is None:
        get_engine()

    assert _SessionLocal is not None

    db = _SessionLocal()

    try:
        yield db
    finally:
        db.close()
