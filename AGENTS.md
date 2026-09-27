# Warcraftlogs Search - Agent Instructions

## What This Tool Does

Warcraftlogs Search (hosted at wcl.nulldozzer.io) helps users find specific Warcraft logs data. Users can search for heroic logs of a specific boss, containing a player of a certain class with certain talents or items. This is primarily used by WowAnalyzer developers to find test logs.

## Repository Overview

- **Type**: Next.js web application (App Router, Cache Components)
- **Languages**: TypeScript (strict mode), CSS (TailwindCSS)
- **Runtime**: Node.js 24.x required
- **Package Manager**: pnpm (mandatory - do not use npm or yarn); exact
  versions are in `package.json` (`engines`, `packageManager`)
- **Data Sources**: Warcraft Logs GraphQL API + Raidbots.com API

## Build & Validation Commands

Run in this order to validate changes:

1. `pnpm install` -- install dependencies (safe to run repeatedly)
2. `pnpm run lint` -- required before committing (ESLint on JS/TS, Prettier on CSS/Markdown/YAML/JSON)
3. `pnpm run lint-fix` -- auto-fix when lint fails; fix remaining errors manually
4. `pnpm run test` -- Jest unit tests in `src/lib/__tests__/` and `src/lib/wcl/__tests__/`
5. `pnpm run build` -- full production build to verify TypeScript and static generation

A pre-commit hook runs `pnpm run lint-staged` on changed files automatically.

## Continuous Integration

`.github/workflows/nodejs.yml` runs on every push/PR:

- `pnpm run lint` (5 min timeout)
- `pnpm run test-ci` (5 min timeout)

Both must pass.

## Project Structure

```
src/
├── app/              - Next.js App Router pages & layouts
│   ├── (main)/       - Main search page (primary entry point)
│   ├── raidbots/     - Experimental raidbots page
│   └── talents/      - Dynamic talent tree viewer pages
├── components/       - Reusable React components
│   ├── ClassPickers/ - Class & spec selection UI
│   ├── ZonePickers/  - Zone, encounter, difficulty pickers
│   ├── TalentPicker/ - Talent selection component
│   └── ItemPicker/   - Item filtering component
└── lib/              - Utilities & API clients
    ├── wcl/          - Warcraft Logs API integration
    ├── raidbots/     - Raidbots API integration
    └── __tests__/    - Jest unit tests (also in wcl/__tests__/)
```

**Import alias**: Use `^/` for all internal imports (e.g., `import { foo } from '^/lib/foo'`).

## Code Comments

Don't write code comments by default. Convey meaning through names, types, and
structure instead.

If you think a comment is genuinely needed — a non-obvious constraint, an API
quirk, or a deliberate workaround that a developer could not infer from the code
itself — don't add it silently; surface it and let me decide.

Inline comments are read by developers years from now who have no knowledge of
the change that introduced them. Never write a comment that argues for a change,
describes what you just did, or references review feedback or our discussion.
That belongs in the pull request, not in the code.

## Environment Variables

Required for runtime only (not for build/lint/test):

- `WCL_CLIENT_ID` -- Warcraft Logs API client ID
- `WCL_CLIENT_SECRET` -- Warcraft Logs API client secret

Copy `.env.local.example` to `.env.local` and fill in values.

## Key Technical Details

**Data Fetching**: The WCL API has limited search parameters. This app fetches broader result sets and filters server-side in React Server Components for talents/items/other criteria.

**Authentication**: OAuth2 client credentials flow in `src/lib/wcl/wclFetch.ts`. Token is cached with a TTL derived from `expires_in` minus a safety margin.

**Caching**: Uses `"use cache"` with custom `cacheLife()` profiles (`"expansion"`, `"patch"`, `"rankings"`) from `next.config.ts`. Do not use `next: { revalidate }` fetch options.

`"use cache: remote"` writes to Vercel's billed Runtime Cache. Preserve these choices:

- `getGameData()` fetches zones, classes, and regions as **one** remote entry. Do not split into separate caches.
- The OAuth token in `wclFetch.ts` uses in-memory `"use cache"` (not `: remote`). Do not add `: remote`.
- The `rankings` profile uses `revalidate === expire` (no stale-while-revalidate).
- Remote-cached functions call `cacheTag()` (`"gamedata"`, `"rankings"`) for observability and `expireTag` purging.

## Dev Server

`pnpm run dev` -- starts on http://localhost:3001 with Turbopack.

## pnpm

> pnpm may have changed since your training data. The core CLI is unchanged; where syntax looks unfamiliar, check `pnpm help`.

### `@obusk/pnpm-plugin-defaults`

Config dependency for security and stability defaults. Updated with `pnpm add --config @obusk/pnpm-plugin-defaults`, not `pnpm update`.

### Security policies

pnpm in this repository will:

- not resolve releases less than 72 hours old (exemptions in `pnpm-workspace.yaml`)
- refuse packages lacking provenance/trusted publishers if older releases have it
- not execute install scripts unless explicitly enabled per-package in `pnpm-workspace.yaml`

**Do not change these settings.** If an install is blocked, stop and ask the developer.

- Avoid `-i` / `--interactive` flags (they hang).
- Use `pnpm exec <package>` to run locally installed packages.
- `pnpm update` and `pnpm outdated` also check `engines.node`, `devEngines.runtime`, and GitHub Actions pins.
- Use `pnpm why <package> --depth 0 --json` to check installed versions. Do not parse `pnpm-lock.yaml` or read `node_modules/`.
- `pnpm clean` deletes all `node_modules` folders in the workspace.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
