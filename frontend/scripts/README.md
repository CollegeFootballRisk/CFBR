# Frontend Development Scripts

Utility scripts for maintaining code quality, architecture consistency, and formatting in the CFBR frontend.

Scripts are located in `frontend/scripts/` and are executed through commands defined in `frontend/package.json`.

Unless otherwise specified, run commands from the `frontend/` directory.

## Available Scripts

### `validate-frontend-architecture.mjs`

Runs custom architecture validation rules for the frontend.

```bash
npm run architecture
```

Use after changing feature structure, shared components, imports, or other code covered by architecture rules.

### `optimize-svgs.mjs`

Optimizes SVG assets using SVGO.

```bash
npm run svgo
```

Use after adding or modifying SVG assets.

This script may modify SVG files. Review resulting changes before committing.

### `wrap-tailwind-classes.mjs`

Normalizes formatting of Tailwind CSS class strings.

Apply formatting:

```bash
npm run tailwind:wrap
```

Check formatting without applying changes:

```bash
npm run tailwind:check
```

Use after adding or modifying components containing Tailwind classes.

### `review.ps1`

PowerShell entry point for the local frontend review workflow.

The script runs:

```powershell
npm run review
```

Execute from `frontend/`:

```powershell
.\scripts\review.ps1
```

## Additional Code Quality Tools

### Biome

Biome handles frontend linting and formatting.

Apply fixes:

```bash
npm run biome
```

Check without modifying files:

```bash
npm run biome:ci
```

Configuration is maintained in the repository root `biome.json`.

### TypeScript

Check TypeScript types without generating output:

```bash
npm run typecheck
```

CI variant:

```bash
npm run typecheck:ci
```

### Knip

Detect unused files, exports, and dependencies:

```bash
npm run knip
```

Configuration is maintained in `frontend/knip.json`.

### Production Build

Run TypeScript project build and Vite production build:

```bash
npm run build
```

## Full Local Review

Run all configured local checks:

```bash
npm run review
```

This executes, in order:

1. Biome linting and formatting with fixes.
2. Frontend architecture validation.
3. SVG optimization.
4. Tailwind class formatting.
5. TypeScript type checking.
6. Knip unused-code analysis.
7. Production build.

**Important:** Local review can modify files. Review changes before committing.

## CI Review

Run CI-oriented checks:

```bash
npm run review:ci
```

This executes:

1. Biome checks without fixes.
2. Frontend architecture validation.
3. Tailwind class formatting validation.
4. TypeScript type checking.
5. Knip unused-code analysis.
6. Production build.

CI review is intended to validate code without applying formatting changes.

Note that `review:ci` does not currently run SVG optimization or an SVG-specific check.

## Recommended Workflow

During development:

```bash
npm run dev
```

Before committing:

```bash
npm run review
```

Review modified files, then run:

```bash
npm run review:ci
```

This helps ensure committed code passes the same frontend checks without relying on automatic fixes.

## Related Documentation

- [Frontend Architecture](../README.md)
- [Project Overview](../../README.md)
- [Smart Commits](../../documentation/smart-commits.md)