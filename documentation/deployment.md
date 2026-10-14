# CFBR Deployment

Deployment architecture, CI/CD, Docker infrastructure, and operational procedures for College Football Risk.

## Overview

CFBR is self-hosted on a Synology NAS using Docker and Portainer.

The application is built through GitHub Actions, published to GitHub Container Registry (GHCR), and deployed through an existing webhook-based deployment workflow.

The target architecture uses a single Portainer stack containing separate application, database, and administration containers.

## Technology

| Component | Technology |
|---|---|
| Source Control | GitHub |
| CI/CD | GitHub Actions |
| Container Registry | GHCR |
| Container Runtime | Docker |
| Stack Management | Portainer |
| Host | Synology NAS |
| Database | PostgreSQL 18 |
| Database Administration | pgAdmin 4 |
| Authentication | Keycloak (planned) |

## Architecture

```text
GitHub — CollegeFootballRisk/CFBR
              |
              | Push to main
              v
       Smart Commits
              |
              | Dispatch build workflow
              v
      GitHub Actions
              |
              | Build Docker image
              v
             GHCR
              |
              | Deployment request
              v
    Webhook Dispatcher
              |
              v
          Portainer
              |
              v
         CFBR Stack
              |
       +------+------+
       |      |      |
      App  Postgres pgAdmin
       |
    FastAPI
       |
      React

```

## Repository Organization

```text
CFBR/
├── .github/
│   └── workflows/
│       ├── docker.yml
│       └── smart-commits.yml
├── backend/
├── frontend/
├── documentation/
│   └── deployment.md
├── Dockerfile
└── compose.yml
```

### Dockerfile

The root Dockerfile uses a multi-stage build.

**Stage 1 — Frontend**

- Uses Node.js 22 Alpine.
- Installs dependencies using `npm ci`.
- Builds React application using Vite.
- Injects application version and Git metadata.

**Stage 2 — Backend**

- Uses Python 3.12 slim.
- Installs backend dependencies using uv.
- Copies compiled frontend into backend runtime.
- Starts Uvicorn on port 8000.

The resulting image contains both frontend and backend.

## Docker Compose

The target deployment contains the following services:

| Service | Purpose | Image |
|---|---|---|
| `cfbr-app` | React and FastAPI application | `ghcr.io/collegefootballrisk/cfbr:main` |
| `cfbr-postgres` | Application PostgreSQL database | `postgres:18` |
| `cfbr-pgadmin` | Database administration | `dpage/pgadmin4` |
| `cfbr-keycloak` | Identity and authentication | Keycloak |

All services are managed from the root `compose.yml`.

### Networking

Services connect through the existing external Docker network:

`internal`

Containers communicate using Docker service names.

For example, the database hostname within the stack is:

`cfbr-postgres`

The application currently publishes:

`127.0.0.1:8010:8000`

This binds the application port to the Docker host's loopback interface.

External access requires a correctly configured reverse proxy or other network path.

### Persistent Storage

Existing NAS storage locations:

| Service | NAS Path | Container Path |
|---|---|---|
| PostgreSQL | `/volume1/databases/cfbr-postgres` | `/var/lib/postgresql` |
| pgAdmin | `/volume1/docker/cfbr-pgadmin` | `/var/lib/pgadmin` |

Persistent data must remain independent of application image deployments.

Do not change PostgreSQL's mount target without verifying compatibility with the selected PostgreSQL image.

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | FastAPI PostgreSQL connection string |
| `CFBR_DATABASE_PASSWORD` | PostgreSQL password |
| `CFBR_PGADMIN_EMAIL` | pgAdmin administrator email |
| `CFBR_PGADMIN_PASSWORD` | pgAdmin administrator password |

Example application connection string:

```text
postgresql+psycopg://cfbr:<password>@cfbr-postgres:5432/cfbr
```

Configure actual credentials through Portainer environment variables or another secure secret-management mechanism.

Never commit production credentials, `.env` files, or database dumps containing sensitive data.

## CI/CD

### Smart Commits

Workflow:

`.github/workflows/smart-commits.yml`

This workflow runs on pushes to `main`.

It handles issue references, project statuses, and versioning directives.

It also coordinates the Docker build workflow.

See [Smart Commits](smart-commits.md) for details.

### Docker Build

Workflow:

`.github/workflows/docker.yml`

The Docker workflow uses `workflow_dispatch` and accepts a commit SHA.

Its main responsibilities are:

1. Check out the requested commit.
2. Read frontend application version.
3. Authenticate with GHCR.
4. Build the Docker image.
5. Push `main` and commit-SHA image tags.
6. Trigger deployment after a successful build.

### Image Tags

Images are published under:

```text
ghcr.io/collegefootballrisk/cfbr:main
ghcr.io/collegefootballrisk/cfbr:<commit-sha>
```

The `main` tag is used by the current Compose configuration.

Commit-SHA tags provide a way to identify and redeploy specific builds.

### Deployment Trigger

GitHub Actions sends a POST request to the configured deployment endpoint.

Required repository secrets:

- `CFBR_DEPLOYMENT_URL`
- `CFBR_DEPLOYMENT_SECRET`
- `CFBR_PROJECT_TOKEN` for Smart Commits project integration

The deployment request includes an `X-CFBR-Deployment-Key` header.

The deployment endpoint must be configured to redeploy the correct Portainer stack.

### Important Deployment Behavior

Pushing to `main` starts Smart Commits processing.

The Docker build workflow is dispatched according to Smart Commits workflow logic.

A successful build publishes an image and sends the deployment request.

Deployment is therefore conditional on successful workflow execution, rather than an unconditional rebuild for every push.

## Updating the Application

Normal application deployment:

1. Make changes locally.
2. Run relevant code-quality checks.
3. Commit and push to `main`.
4. Confirm Smart Commits processing.
5. Confirm Docker image build and push.
6. Confirm successful deployment request.
7. Verify application availability.

Database and pgAdmin containers should retain their data across app image updates.

### Updating Compose

Compose changes require the deployment mechanism to fetch the latest Compose file.

An image redeploy alone does not guarantee updated Compose configuration is applied.

Confirm that Portainer or the webhook dispatcher updates stack definitions from the CFBR repository.

## Rollback

### Application

To roll back application code:

1. Identify a previously working commit-SHA image.
2. Set application image to that immutable tag.
3. Redeploy the application.
4. Verify application functionality.

Do not immediately republish `main` without identifying the failed change.

### Database

Database rollback is separate from application rollback.

Restore from a verified backup or use an explicitly designed reverse migration.

Never assume reverting application code reverses schema or data changes.

## Related Documentation

- [Project Overview](../README.md)
- [Backend Architecture](../backend/README.md)
- [Frontend Architecture](../frontend/README.md)
- [Smart Commits](smart-commits.md)