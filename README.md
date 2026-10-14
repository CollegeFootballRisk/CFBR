# College Football Risk (CFBR)

College Football Risk is a community-driven strategy game where college football fanbases compete for control of territories across a shared map.

This repository contains the next-generation CFBR application, replacing the legacy frontend and backend with a modern, unified architecture.

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| Authentication | Keycloak |
| Containers | Docker Compose |
| CI/CD | GitHub Actions |
| Container Registry | GitHub Container Registry (GHCR) |
| Deployment | Portainer |
| Hosting | Self-hosted Synology NAS |

## Repository Structure

```text
CFBR/
├── .github/
│   └── workflows/          # CI/CD and automated versioning
├── backend/                # FastAPI backend
│   └── README.md
├── frontend/               # React/TypeScript frontend
│   └── README.md
|   ├── scripts/            # Local development utilities
│       └── README.md
├── documentation/          # Technical documentation and guides
│   ├── smart-commits.md
│   ├── deployment.md
├── Dockerfile              # Application container build
├── compose.yml             # Docker Compose stack
└── README.md               # Project overview
```

## Architecture

CFBR uses a monorepo architecture containing the frontend, backend, and deployment configuration.

### Frontend

React and TypeScript provide the user interface, with Tailwind CSS for styling.

The frontend supports light and dark themes, browser-based preference persistence, and reusable UI components.

### Backend

FastAPI provides the application's REST API, handles game logic, and manages database access.

### Database

PostgreSQL stores player accounts, teams, territories, maps, turns, game statistics, and historical game data.

The rewrite introduces a normalized schema designed to preserve legacy history while supporting future gameplay.

### Deployment

The application is deployed through a single Docker Compose stack managed by Portainer.

The stack contains separate containers for:

- **cfbr-app** — React frontend and FastAPI backend
- **cfbr-postgres** — PostgreSQL database
- **cfbr-pgadmin** — Database administration
- **cfbr-keycloak** — Authentication and identity management (planned)

Application images are published to GHCR:

`ghcr.io/collegefootballrisk/cfbr:main`

GitHub Actions builds and publishes application images, then triggers deployment through Portainer.

## Documentation

Documentation is organized alongside the code it describes. Cross-cutting technical guides are maintained in `documentation/`.

### Architecture

- [Backend Architecture](backend/README.md) — FastAPI structure, API conventions, database access, and architecture decisions.
- [Frontend Architecture](frontend/README.md) — React components, routing, Tailwind CSS, theming, and browser storage.
- [Development Scripts](frontend/scripts/README.md) — Local linting, formatting, validation, and development utilities.

### Technical Guides

- [Smart Commits](documentation/smart-commits.md) — Automated commit workflows, versioning, and CI/CD integration.
- [Deployment](documentation/deployment.md) — Docker Compose, GHCR, GitHub Actions, and Portainer deployment.

## Legacy Repositories

CFBR replaces two existing applications:

| Repository | Purpose |
|---|---|
| [CollegeFootballRisk/gia](https://github.com/CollegeFootballRisk/gia) | Legacy frontend |
| [CollegeFootballRisk/Risk](https://github.com/CollegeFootballRisk/Risk) | Legacy backend |

These repositories remain available as references for existing game logic, database structures, historical data, and application behavior during migration.

The legacy database remains read-only throughout the migration process.

## License

This project is licensed under the Mozilla Public License 2.0 (MPL 2.0). 
See the [LICENSE](LICENSE) file for the full text. 

* You must disclose and share source code for any modifications made to MPL-2.0 files.
* You can combine MPL-2.0 files with proprietary code in larger works.
