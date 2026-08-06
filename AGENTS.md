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

**CRITICAL: Always run commands in this exact order to validate changes:**

1. **Install dependencies** (required after fresh clone):

    ```bash
    pnpm install
    ```

    Fast with a lockfile. pnpm only installs missing dependencies when the lockfile exists, so it's safe to run if you're unsure.

2. **Lint your changes** (required before committing):

    ```bash
    pnpm run lint
    ```

    This runs ESLint (which also checks Prettier formatting) on all `.ts`/`.tsx`/`.js`/`.jsx` files, then Prettier directly on `.css`/`.md`/`.yml`/`.yaml`/`.json` files. Both must pass.

3. **Auto-fix linting issues** (use when lint fails):

    ```bash
    pnpm run lint-fix
    ```

    Auto-fixes ESLint issues and reformats `.css`/`.md`/`.yml`/`.yaml`/`.json` files with Prettier where possible. You must still fix any remaining errors manually (e.g., unused variables).

4. **Run tests** (required before committing):

    ```bash
    pnpm run test
    ```

    Runs Jest unit tests in `src/lib/__tests__/` and `src/lib/wcl/__tests__/`. All tests must pass.

5. **Build the application** (recommended to verify changes):
    ```bash
    pnpm run build
    ```
    Compiles TypeScript, generates static pages, and creates production build. Build must complete successfully with no errors.

**Pre-commit Hook**: A git pre-commit hook runs `pnpm run lint-staged` automatically, which lints and formats only changed files.

## Continuous Integration

The `.github/workflows/nodejs.yml` workflow runs on every push/PR:

- **lint job**: Runs `pnpm run lint` (5 min timeout)
- **test job**: Runs `pnpm run test-ci` (5 min timeout)
- **build job**: Currently commented out but was running `pnpm run build`

Both lint and test jobs must pass for CI to succeed. Make sure to run these locally before pushing.

## Project Structure & Architecture

```
warcraftlogs-search/
├── src/
│   ├── app/              - Next.js App Router pages & layouts
│   │   ├── (main)/       - Main search page (primary entry point)
│   │   ├── raidbots/     - Experimental raidbots page
│   │   └── talents/      - Dynamic talent tree viewer pages
│   ├── components/       - Reusable React components
│   │   ├── ClassPickers/ - Class & spec selection UI
│   │   ├── ZonePickers/  - Zone, encounter, difficulty pickers
│   │   ├── TalentPicker/ - Talent selection component
│   │   └── ItemPicker/   - Item filtering component
│   └── lib/              - Utilities & API clients
│       ├── wcl/          - Warcraft Logs API integration
│       │                   (wclFetch, rankings, zones, classes, regions)
│       ├── raidbots/     - Raidbots API integration
│       └── __tests__/    - Jest unit tests (also in wcl/__tests__/)
├── .github/workflows/    - CI pipeline (nodejs.yml: lint + test)
├── public/               - Static assets (robots.txt)
├── next.config.ts        - Next.js configuration (cacheLife profiles)
├── tsconfig.json         - TypeScript configuration (^/ alias)
├── eslint.config.mjs     - ESLint configuration
├── jest.config.ts        - Jest test configuration
├── tailwind.config.ts    - TailwindCSS configuration
├── postcss.config.mjs    - PostCSS plugins
├── package.json          - Dependencies & scripts
└── pnpm-workspace.yaml   - pnpm settings & security policies
```

**Import Path Alias**: Use `^/` prefix for all internal imports (e.g., `import { foo } from '^/lib/foo'`). This is configured in `tsconfig.json` and avoids relative paths.

## Code Style & Conventions

**TypeScript**: Strict mode enabled. Always use proper types; avoid `any`.

**Imports**: Use `import type` for type-only imports. Sort imports:

1. External/builtin imports (alphabetically)
2. Internal imports with `^/` prefix (alphabetically)
3. Parent imports
4. Sibling imports
5. Index imports

**Formatting** (enforced by Prettier + EditorConfig):

- Indent: 4 spaces
- Max line length: 80 characters
- Double quotes for strings
- Insert final newline
- Trim trailing whitespace

**ESLint**: Uses `@obusk/eslint-config-next`. Common errors:

- Unused variables/imports must be removed
- Missing dependencies in React hooks
- Type imports must use `import type` syntax

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

**Required for runtime** (not required for build/lint/test):

- `WCL_CLIENT_ID` - Warcraft Logs API client ID
- `WCL_CLIENT_SECRET` - Warcraft Logs API client secret

Copy `.env.local.example` to `.env.local` and fill in values. These are only needed when running the dev server or production build that fetches real data.

## Key Technical Details

**Data Fetching Strategy**: The Warcraft Logs API has limited search parameters. This app fetches broader result sets and filters server-side for talents/items/other criteria. Filtering happens in React Server Components before sending to the client.

**Authentication**: OAuth2 client credentials flow in `src/lib/wcl/wclFetch.ts`. The token is cached with a TTL derived from its `expires_in` (minus a safety margin).

**Caching**: Cache Components (`cacheComponents: true`). Data-fetching functions use `"use cache"` with `cacheLife()`, using either built-in profiles (`"max"`) or the custom profiles defined in `next.config.ts` (`"expansion"`, `"patch"`, `"rankings"`) — pick the profile matching how often the data changes. Do not use `next: { revalidate }` fetch options.

`"use cache: remote"` writes to Vercel's **Runtime Cache** — billed, and on Hobby shared across all of the team's projects with monthly read/write caps. Cost model: **reads** scale with how many remote entries are read per render; **writes** scale with the miss rate (a longer TTL cuts writes, not reads). Preserve these choices:

- Zones, classes and regions are fetched together as **one** `getGameData()` remote entry (a single combined GraphQL query); `getZones`/`getClasses`/`getRegions` delegate to it. Do not split it back into per-dataset remote caches — that multiplies reads and WCL requests.
- The OAuth token in `wclFetch.ts` uses plain in-memory `"use cache"` (not `: remote`); it is valid ~a year, so per-instance caching keeps it off the billed Runtime Cache. Do not re-add `: remote`.
- The `rankings` profile uses a long `revalidate === expire` (no stale-while-revalidate) so a key is rewritten at most once per window.
- Remote-cached functions call `cacheTag()` (`"gamedata"`, `"rankings"`) so Observability can attribute reads/writes/hit-rate per cache and entries can be purged with `expireTag`.

**Build Artifacts**: `.next/` directory is created during build. It's git-ignored and should not be committed.

**Dependencies**: `node_modules/` is created during `pnpm install`. It's git-ignored.

## Common Workflows

**Making a code change**:

1. Edit files in `src/`
2. Run `pnpm run lint` - fix any errors
3. Run `pnpm run test` - ensure tests pass
4. Run `pnpm run build` - verify builds successfully
5. Commit changes (pre-commit hook will run lint-staged)

**Adding a new dependency**:

```bash
pnpm add <package-name>
```

This updates `package.json` and `pnpm-lock.yaml`. Note: security defaults from the `@obusk/pnpm-plugin-defaults` config dependency (see `pnpm-workspace.yaml`) enforce a minimum release age that may block very new package versions.

**Running dev server**:

```bash
pnpm run dev
```

Starts on http://localhost:3001 with Turbopack for fast HMR.

**Debugging**: VS Code launch configs in `.vscode/launch.json` for server-side, client-side, and full-stack debugging.

## Troubleshooting

**Lint fails with unfixable errors**: Check for unused variables, incorrect imports, or missing type annotations. These must be fixed manually.

**Build fails**: Usually TypeScript errors. Check the output for specific file/line errors.

**Tests fail**: Run `pnpm run test` locally to see failures. Tests are in `src/lib/__tests__/` and `src/lib/wcl/__tests__/`.

**pnpm install warnings**: Some packages (unrs-resolver) may show warnings during install. These are expected and don't affect functionality.

## Trust These Instructions

These instructions are comprehensive and tested. Only search the codebase if:

- You need to understand specific implementation details not covered here
- Information here is incorrect or incomplete
- You're debugging an unexpected error

For routine tasks (build, test, lint, add dependencies), follow these instructions exactly.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
