"""Shared PostgreSQL connections and inspection helpers for CFBR migrations.

Expected layout:
    .env
    migration/
        common.py
        notebooks/

Required .env variables:
    DATABASE_URL=postgresql+psycopg://...
    LEGACY_DATABASE_URL=postgresql+psycopg://...

Importing this module creates SQLAlchemy engines but does not execute queries.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import Engine, create_engine, text

# backend/migrations/common.py
BACKEND_DIR = Path(__file__).resolve().parents[1]
REPO_ROOT = BACKEND_DIR.parent

# Prefer backend/.env if that's where your .env lives.
ENV_PATH = BACKEND_DIR / ".env"

if not ENV_PATH.exists():
    ENV_PATH = REPO_ROOT / ".env"

if not ENV_PATH.exists():
    raise FileNotFoundError(f"Could not find .env in {BACKEND_DIR} or {REPO_ROOT}")

load_dotenv(ENV_PATH, override=False)


def _required_env(name: str) -> str:
    value = os.getenv(name)
    if not value or not value.strip():
        raise RuntimeError(
            f"Missing required environment variable {name!r} in {ENV_PATH}. "
            "Add it to the repository-root .env file."
        )
    return value.strip()


DATABASE_URL = _required_env("DATABASE_URL")
LEGACY_DATABASE_URL = _required_env("LEGACY_DATABASE_URL")

# Credentials are never printed. pool_pre_ping checks stale connections.
new_engine: Engine = create_engine(DATABASE_URL, pool_pre_ping=True, future=True)
legacy_engine: Engine = create_engine(LEGACY_DATABASE_URL, pool_pre_ping=True, future=True)

IDENTITY_SQL = text("""
    SELECT
        current_database() AS database_name,
        current_user AS username,
        inet_server_addr()::text AS server_address,
        inet_server_port() AS server_port,
        current_setting('transaction_read_only') AS read_only
""")

TABLE_SCHEMA_SQL = text("""
    SELECT
        table_schema,
        table_name,
        ordinal_position,
        column_name,
        data_type,
        udt_name,
        is_nullable,
        column_default
    FROM information_schema.columns
    WHERE table_schema = :schema_name
      AND table_name = :table_name
    ORDER BY ordinal_position
""")

TABLE_CONSTRAINTS_SQL = text("""
    SELECT
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name
    FROM information_schema.table_constraints AS tc
    LEFT JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_catalog = kcu.constraint_catalog
     AND tc.constraint_schema = kcu.constraint_schema
     AND tc.table_name = kcu.table_name
     AND tc.constraint_name = kcu.constraint_name
    WHERE tc.table_schema = :schema_name
      AND tc.table_name = :table_name
    ORDER BY tc.constraint_type, tc.constraint_name, kcu.ordinal_position
""")


def connection_identity(engine: Engine, *, readonly: bool = False) -> pd.DataFrame:
    """Return DB/server identity. Optionally make this transaction read-only."""
    with engine.connect() as conn:
        with conn.begin():
            if readonly:
                conn.execute(text("SET TRANSACTION READ ONLY"))
            return pd.read_sql(IDENTITY_SQL, conn)


def inspect_table_schema(
    engine: Engine, table_name: str, *, schema_name: str = "public"
) -> pd.DataFrame:
    """Return ordered column metadata for a table."""
    with engine.connect() as conn:
        return pd.read_sql(
            TABLE_SCHEMA_SQL,
            conn,
            params={"schema_name": schema_name, "table_name": table_name},
        )


def inspect_table_constraints(
    engine: Engine, table_name: str, *, schema_name: str = "public"
) -> pd.DataFrame:
    """Return constraints and their columns for a table."""
    with engine.connect() as conn:
        return pd.read_sql(
            TABLE_CONSTRAINTS_SQL,
            conn,
            params={"schema_name": schema_name, "table_name": table_name},
        )


def read_sql(
    engine: Engine,
    query: str,
    *,
    params: dict[str, Any] | None = None,
    readonly: bool = False,
) -> pd.DataFrame:
    """Execute a query and return a DataFrame.

    For legacy reads, pass readonly=True. Use :name-bound parameters rather
    than interpolating values into SQL strings.
    """
    with engine.connect() as conn:
        with conn.begin():
            if readonly:
                conn.execute(text("SET TRANSACTION READ ONLY"))
            return pd.read_sql(text(query), conn, params=params)


def close_engines() -> None:
    """Dispose pooled connections at the end of a notebook session."""
    legacy_engine.dispose()
    new_engine.dispose()


__all__ = [
    "DATABASE_URL",
    "ENV_PATH",
    "LEGACY_DATABASE_URL",
    "REPO_ROOT",
    "close_engines",
    "connection_identity",
    "inspect_table_constraints",
    "inspect_table_schema",
    "legacy_engine",
    "new_engine",
    "read_sql",
]
