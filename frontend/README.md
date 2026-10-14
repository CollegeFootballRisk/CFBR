# CFBR Frontend

React and TypeScript frontend for College Football Risk.

The frontend provides game maps, team and player information, statistics, leaderboards, and eventually interactive gameplay.

## Tech Stack

| Component | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| Charts | Recharts |
| Component Variants | class-variance-authority |
| Class Utilities | clsx, tailwind-merge |
| Linting / Formatting | Biome |
| Unused Code Detection | Knip |
| SVG Optimization | SVGO |

## Directory Structure

```text
frontend/
├── public/                # Static assets
├── scripts/               # Local development utilities
├── src/
│   ├── app/               # App setup, routes, settings
│   ├── features/          # Feature-specific UI and logic
│   ├── shared/
│   │   ├── components/    # Reusable components
│   │   ├── layouts/       # Shared page layouts
│   │   ├── pages/         # Shared pages
│   │   ├── styles/        # Global styling and themes
│   │   └── utils/         # Shared utilities
│   └── main.tsx           # Application entry point
├── package.json
├── vite.config.ts
└── README.md
```

## Local Development

### Requirements

- Node.js compatible with the project's Vite version
- npm
- Backend API for data-dependent features

### Install Dependencies

```bash
cd frontend
npm ci
```

### Start Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## Code Quality

The frontend uses several automated checks.

| Command | Purpose |
|---|---|
| `npm run biome` | Format and lint with automatic fixes |
| `npm run biome:ci` | Check formatting and lint without changes |
| `npm run architecture` | Validate frontend architecture rules |
| `npm run typecheck` | TypeScript type checking |
| `npm run knip` | Detect unused code and dependencies |
| `npm run svgo` | Optimize SVG assets |
| `npm run tailwind:wrap` | Normalize Tailwind class formatting |
| `npm run tailwind:check` | Validate Tailwind class formatting |
| `npm run build` | TypeScript build and Vite production build |
| `npm run review` | Run local review workflow |
| `npm run review:ci` | Run CI review workflow |

For details, see [Development Scripts](scripts/README.md).

## Related Documentation

- [Project Overview](../README.md)
- [Backend Architecture](../backend/README.md)
- [Development Scripts](scripts/README.md)
- [Smart Commits](../documentation/smart-commits.md)