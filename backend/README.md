# CFBR Backend

Python/FastAPI backend for College Football Risk.

The backend provides REST APIs, database access, and eventually game logic for the rewritten CFBR application.

## Tech Stack

| Component | Technology |
|---|---|
| Language | Python 3.12 |
| API Framework | FastAPI |
| Database | PostgreSQL |
| Database Toolkit | SQLAlchemy 2.x |
| PostgreSQL Driver | psycopg |
| Configuration | Pydantic Settings |
| ASGI Server | Uvicorn |
| Linting / Formatting | Ruff |
| Dependency Management | uv |

## Directory Structure

```text
backend/
├── app
│   ├── config                  # DB and App Config files
│   ├── middleware              # JWT authentication/validation
│   ├── repositories            # Only getting data from SQL, no logic
│   ├── routers                 # API endpoints, HTTP and JSON requests
│   ├── schemas                 # Types that are called from API to be used in frontend
│   ├── security                # Authentication helpers
│   ├── services                # Business logic layer and data transformations
│   ├── main.py                 # Application entry point
│   └── __init__.py
├── .env.example
├── uv.lock                     # Locked Python dependency versions
├── openapi.json
└── README.md
```


## Local Development

### Requirements

- Python 3.12
- uv
- PostgreSQL connection

### Install Dependencies

From `backend/`:

```bash
uv sync
```

### Configure Environment

Copy `.env.example` to `.env` and configure `DATABASE_URL`.

### Start API

```bash
uv run uvicorn app.main:app --reload
```

Default API address:

`http://localhost:8000`

FastAPI documentation:

- `/docs` — Swagger UI
- `/redoc` — ReDoc
- `/openapi.json` — OpenAPI schema

## Code Quality

Ruff handles Python linting, import sorting, and formatting.

```bash
uv run ruff check .
uv run ruff format --check .
```

To apply automatic fixes:

```bash
uv run ruff check --fix .
uv run ruff format .
```

Ruff configuration is maintained in `pyproject.toml`.

## Related Documentation

- [Project Overview](../README.md)
- [Frontend Architecture](../frontend/README.md)
- [Deployment](../documentation/deployment.md)