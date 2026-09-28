import logging
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from app.config import settings
from app.config.db import get_engine
from app.routers.test import router as test_router

load_dotenv()

logger = logging.getLogger("cfbr")
logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")


def _log_env_check() -> None:
    # Mimics your ENV CHECK log without leaking secrets
    logger.info(
        "ENV CHECK %s",
        {
            "DATABASE_URL": os.getenv("DATABASE_URL"),
        },
    )


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """
    Application startup/shutdown lifecycle.
    """
    _log_env_check()

    # Ensure settings loads
    _ = settings

    # Validate DB connectivity early (fail fast)
    try:
        engine = get_engine()

        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))

        logger.info("DB connection OK")

    except Exception:
        logger.exception("Startup failed")
        raise

    yield


app = FastAPI(lifespan=lifespan, docs_url="/docs", redoc_url="/redoc", openapi_url="/openapi.json")

app.include_router(test_router)

# CORS: match your app.use(cors()) (wide open)
# You can tighten this later to your frontend origin(s).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # same behavior as default cors() in many dev setups
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health endpoint
@app.get("/api/health")
def health() -> str:
    return "Backend is running"


dist_path = os.path.join(os.path.dirname(__file__), "..", "dist")

if os.path.exists(dist_path):
    assets_path = os.path.join(dist_path, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    @app.get("/{catchall:path}")
    def serve_react_app(catchall: str):
        file_path = os.path.join(dist_path, catchall)

        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)

        index_file = os.path.join(dist_path, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)

        return {"detail": "Frontend not built yet"}
