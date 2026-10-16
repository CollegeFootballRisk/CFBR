from __future__ import annotations

import os
import shutil
import subprocess
from pathlib import Path

from sqlalchemy.engine import make_url

from app.config.settings import settings

DB_DIR = Path(__file__).resolve().parent
OUTPUT_FILE = DB_DIR / "schema.sql"


def main() -> None:
    pg_dump = shutil.which("pg_dump")
    if not pg_dump:
        raise RuntimeError(
            "pg_dump was not found. Install PostgreSQL client tools and ensure pg_dump is on PATH."
        )

    # Convert SQLAlchemy's driver-qualified URL into a libpq URL.
    url = make_url(settings.database_url)
    if url.drivername.startswith("postgresql+"):
        url = url.set(drivername="postgresql")

    env = os.environ.copy()

    # Keep credentials out of command-line arguments.
    env["PGPASSWORD"] = url.password or ""

    args = [
        pg_dump,
        "--schema-only",
        "--no-owner",
        "--no-privileges",
        "--host",
        url.host or "localhost",
        "--port",
        str(url.port or 5432),
        "--username",
        url.username or "",
        "--dbname",
        url.database or "",
        "--file",
        str(OUTPUT_FILE),
    ]

    try:
        subprocess.run(args, env=env, check=True)
    finally:
        env.pop("PGPASSWORD", None)

    sql = OUTPUT_FILE.read_text(encoding="utf-8")

    sql = "\n".join(
        line
        for line in sql.splitlines()
        if not line.startswith(
            (
                r"\restrict ",
                r"\unrestrict ",
            )
        )
    )

    OUTPUT_FILE.write_text(
        sql.rstrip() + "\n",
        encoding="utf-8",
    )

    print(f"Generated {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
