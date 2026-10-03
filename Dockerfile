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
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install backend dependencies
COPY backend/requirements.txt ./backend/requirements.txt

RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy backend
COPY backend/ ./backend/

# Copy built React application into the location
# expected by backend/app/main.py
COPY --from=frontend-build /app/frontend/dist ./backend/dist/

WORKDIR /app/backend

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]