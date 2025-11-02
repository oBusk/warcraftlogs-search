# Warcraftlogs Search - Copilot Instructions

## What This Tool Does

Warcraftlogs Search (hosted at wcl.nulldozzer.io) helps users find specific Warcraft logs data. Users can search for heroic logs of a specific boss, containing a player of a certain class with certain talents or items. This is primarily used by WowAnalyzer developers to find test logs.

## Repository Overview

- **Type**: Next.js 16.0.1 web application (App Router)
- **Languages**: TypeScript (strict mode), CSS (TailwindCSS)
- **Size**: ~45 TypeScript/TSX files, ~955 lines of code in src/
- **Runtime**: Node.js 22.x required
- **Package Manager**: pnpm 10.20.0 (mandatory - do not use npm or yarn)
- **Data Sources**: Warcraft Logs GraphQL API + Raidbots.com API

## Build & Validation Commands

**CRITICAL: Always run commands in this exact order to validate changes:**

1. **Install dependencies** (required after fresh clone):

    ```bash
    pnpm install
    ```

    Takes ~3 seconds with lockfile. Do NOT run `pnpm install` unnecessarily as it reinstalls everything.

2. **Lint your changes** (required before committing):

    ```bash
    pnpm run lint
    ```

    Takes ~7 seconds. This runs ESLint on all `.ts`/`.tsx` files, then Prettier on `.md`/`.yml`/`.yaml`/`.json` files. Both must pass.

3. **Auto-fix linting issues** (use when lint fails):

    ```bash
    pnpm run lint-fix
    ```

    Auto-fixes ESLint and Prettier issues where possible. You must still fix any remaining errors manually (e.g., unused variables).

4. **Run tests** (required before committing):

    ```bash
    pnpm run test
    ```

    Takes <1 second. Currently runs unit tests in `src/lib/__tests__/`. All tests must pass.

5. **Build the application** (recommended to verify changes):
    ```bash
    pnpm run build
    ```
    Takes ~11 seconds. Compiles TypeScript, generates static pages, and creates production build. Build must complete successfully with no errors.

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
│   │   ├── (main)/       - Main search page group
│   │   │   └── page.tsx  - Primary application entry point
│   │   ├── layout.tsx    - Root layout with header & analytics
│   │   ├── raidbots/     - Experimental raidbots page
│   │   └── talents/      - Dynamic talent tree viewer pages
│   ├── components/       - Reusable React components
│   │   ├── ClassPickers/ - Class & spec selection UI
│   │   ├── ZonePickers/  - Zone, encounter, difficulty pickers
│   │   ├── TalentPicker/ - Talent selection component
│   │   ├── ItemPicker/   - Item filtering component
│   │   └── Rankings.tsx  - Main results display
│   └── lib/              - Utilities & API clients
│       ├── wcl/          - Warcraft Logs API integration
│       │   ├── wclFetch.ts    - GraphQL fetch wrapper
│       │   ├── rankings.ts    - Fetch & filter rankings
│       │   ├── zones.ts       - Zone/encounter data
│       │   └── classes.ts     - Class/spec data
│       ├── raidbots/     - Raidbots API integration
│       ├── __tests__/    - Jest unit tests
│       └── Params.ts     - URL param parsing/serialization
├── .github/
│   └── workflows/
│       └── nodejs.yml    - CI pipeline (lint + test)
├── public/               - Static assets (robots.txt)
├── next.config.ts        - Next.js configuration
├── tsconfig.json         - TypeScript configuration (^/ alias)
├── eslint.config.mjs     - ESLint configuration
├── jest.config.mjs       - Jest test configuration
├── tailwind.config.ts    - TailwindCSS configuration
├── postcss.config.mjs    - PostCSS plugins
├── package.json          - Dependencies & scripts
└── pnpm-workspace.yaml   - pnpm monorepo config
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
- Single quotes for strings
- Insert final newline
- Trim trailing whitespace

**ESLint**: Uses `@obusk/eslint-config-next`. Common errors:

- Unused variables/imports must be removed
- Missing dependencies in React hooks
- Type imports must use `import type` syntax

## Environment Variables

**Required for runtime** (not required for build/lint/test):

- `WCL_CLIENT_ID` - Warcraft Logs API client ID
- `WCL_CLIENT_SECRET` - Warcraft Logs API client secret

Copy `.env.local.example` to `.env.local` and fill in values. These are only needed when running the dev server or production build that fetches real data.

## Key Technical Details

**Data Fetching Strategy**: The Warcraft Logs API has limited search parameters. This app fetches broader result sets and filters server-side for talents/items/other criteria. Filtering happens in React Server Components before sending to the client.

**Authentication**: OAuth2 client credentials flow in `src/lib/wcl/wclFetch.ts`. Tokens are fetched per-request (Next.js caches appropriately).

**Caching**: Next.js fetch calls use `next: { revalidate: 18000 }` (5 hours) to cache API responses.

**Build Artifacts**: `.next/` directory (~29MB) is created during build. It's git-ignored and should not be committed.

**Dependencies**: `node_modules/` (~677MB) is created during `pnpm install`. It's git-ignored.

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

This updates `package.json` and `pnpm-lock.yaml`. Note: `pnpm-workspace.yaml` has security settings (minimumReleaseAge: 4320 minutes) that may block very new packages.

**Running dev server**:

```bash
pnpm run dev
```

Starts on http://localhost:3001 with Turbopack for fast HMR.

**Debugging**: VS Code launch configs in `.vscode/launch.json` for server-side, client-side, and full-stack debugging.

## Troubleshooting

**Lint fails with unfixable errors**: Check for unused variables, incorrect imports, or missing type annotations. These must be fixed manually.

**Build fails**: Usually TypeScript errors. Check the output for specific file/line errors.

**Tests fail**: Run `pnpm run test` locally to see failures. Tests are in `src/lib/__tests__/`.

**pnpm install warnings**: Some packages (unrs-resolver) may show warnings during install. These are expected and don't affect functionality.

## Trust These Instructions

These instructions are comprehensive and tested. Only search the codebase if:

- You need to understand specific implementation details not covered here
- Information here is incorrect or incomplete
- You're debugging an unexpected error

For routine tasks (build, test, lint, add dependencies), follow these instructions exactly.
