from fastapi import APIRouter
from sqlalchemy import text

from app.config.db import get_engine

router = APIRouter(prefix="/api/test", tags=["test"])


@router.get("/users")
def test_users():
    engine = get_engine()

    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM users"))

        columns = list(result.keys())
        rows = [dict(row) for row in result.mappings().all()]

    print("USER COLUMNS:", columns)
    print("USER ROWS:", rows)

    return {
        "columns": columns,
        "rows": rows,
    }
