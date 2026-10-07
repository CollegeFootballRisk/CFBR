# ============================================
# Stage 1: Build frontend
# ============================================
FROM node:22-alpine AS frontend-build

ARG APP_VERSION=0.0.0
ARG GIT_BRANCH=local
ARG GIT_COMMIT=local

ENV APP_VERSION=$APP_VERSION
ENV GITHUB_REF_NAME=$GIT_BRANCH
ENV GITHUB_SHA=$GIT_COMMIT

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./

RUN npm run build


# ============================================
# Stage 2: Backend/runtime
# ============================================
FROM ghcr.io/astral-sh/uv:latest AS uv

FROM python:3.12-slim

ARG APP_VERSION=0.0.0

ENV APP_VERSION=$APP_VERSION
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy
ENV PATH="/app/backend/.venv/bin:$PATH"

COPY --from=uv /uv /uvx /bin/

WORKDIR /app

COPY backend/pyproject.toml backend/uv.lock ./backend/

WORKDIR /app/backend

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev --no-install-project

COPY backend/ ./

COPY --from=frontend-build /app/frontend/dist ./dist/

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]