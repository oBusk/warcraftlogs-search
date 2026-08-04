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

    This runs ESLint on all `.ts`/`.tsx` files, then Oxfmt (`--check`) on all supported files (`.ts`/`.tsx`/`.js`/`.css`/`.md`/`.yml`/`.yaml`/`.json`). Both must pass.

3. **Auto-fix linting issues** (use when lint fails):

    ```bash
    pnpm run lint-fix
    ```

    Auto-fixes ESLint issues and reformats with Oxfmt where possible. You must still fix any remaining errors manually (e.g., unused variables).

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

**Formatting** (enforced by Oxfmt + EditorConfig):

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

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./node_modules/next/dist/docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.|If docs missing, run this command first: npx @next/codemod agents-md --output AGENTS.md|01-app:{04-glossary.md}|01-app/01-getting-started:{01-installation.md,02-project-structure.md,03-layouts-and-pages.md,04-linking-and-navigating.md,05-server-and-client-components.md,06-fetching-data.md,07-mutating-data.md,08-caching.md,09-revalidating.md,10-error-handling.md,11-css.md,12-images.md,13-fonts.md,14-metadata-and-og-images.md,15-route-handlers.md,16-proxy.md,17-deploying.md,18-upgrading.md}|01-app/02-guides:{adopting-partial-prefetching.md,ai-agents.md,analytics.md,authentication.md,backend-for-frontend.md,building.md,caching-without-cache-components.md,cdn-caching.md,ci-build-caching.md,content-security-policy.md,css-in-js.md,custom-server.md,data-security.md,debugging.md,deploying-to-platforms.md,draft-mode.md,environment-variables.md,forms.md,how-revalidation-works.md,incremental-static-regeneration-cache-components.md,incremental-static-regeneration.md,instant-navigation.md,instrumentation.md,interactive-apps.md,internationalization.md,json-ld.md,lazy-loading.md,local-development.md,mcp.md,mdx.md,memory-usage.md,migrating-to-cache-components.md,multi-tenant.md,multi-zones.md,offline-support.md,open-telemetry.md,package-bundling.md,ppr-platform-guide.md,prefetching.md,preserving-ui-state.md,preventing-flash-before-hydration.md,production-checklist.md,progressive-web-apps.md,public-static-pages.md,redirecting.md,rendering-philosophy.md,runtime-prefetching.md,sass.md,scripts.md,self-hosting.md,server-actions.md,single-page-applications.md,static-exports.md,streaming.md,tailwind-v3-css.md,third-party-libraries.md,videos.md,view-transitions.md}|01-app/02-guides/migrating:{app-router-migration.md,from-create-react-app.md,from-vite.md}|01-app/02-guides/testing:{cypress.md,jest.md,playwright.md,vitest.md}|01-app/02-guides/upgrading:{codemods.md,version-14.md,version-15.md,version-16.md}|01-app/03-api-reference:{07-edge.md,08-turbopack.md}|01-app/03-api-reference/01-directives:{use-cache-private.md,use-cache-remote.md,use-cache.md,use-client.md,use-server.md}|01-app/03-api-reference/02-components:{font.md,form.md,image.md,link.md,script.md}|01-app/03-api-reference/03-file-conventions/01-metadata:{app-icons.md,manifest.md,opengraph-image.md,robots.md,sitemap.md}|01-app/03-api-reference/03-file-conventions/02-route-segment-config:{dynamicParams.md,instant.md,maxDuration.md,preferredRegion.md,prefetch.md,runtime.md}|01-app/03-api-reference/03-file-conventions:{default.md,dynamic-routes.md,error.md,forbidden.md,instrumentation-client.md,instrumentation.md,intercepting-routes.md,layout.md,loading.md,mdx-components.md,middleware.md,not-found.md,page.md,parallel-routes.md,proxy.md,public-folder.md,route-groups.md,route.md,src-folder.md,template.md,unauthorized.md}|01-app/03-api-reference/04-functions:{after.md,cacheLife.md,cacheTag.md,catchError.md,connection.md,cookies.md,draft-mode.md,fetch.md,forbidden.md,generate-image-metadata.md,generate-metadata.md,generate-sitemaps.md,generate-static-params.md,generate-viewport.md,headers.md,image-response.md,io.md,next-request.md,next-response.md,next-root-params.md,not-found.md,permanentRedirect.md,redirect.md,refresh.md,revalidatePath.md,revalidateTag.md,unauthorized.md,unstable_cache.md,unstable_noStore.md,unstable_rethrow.md,updateTag.md,use-link-status.md,use-offline.md,use-params.md,use-pathname.md,use-report-web-vitals.md,use-router.md,use-search-params.md,use-selected-layout-segment.md,use-selected-layout-segments.md,userAgent.md}|01-app/03-api-reference/05-config/01-next-config-js:{adapterPath.md,allowedDevOrigins.md,appDir.md,assetPrefix.md,authInterrupts.md,basePath.md,cacheComponents.md,cacheHandlers.md,cacheLife.md,compress.md,crossOrigin.md,cssChunking.md,deploymentId.md,devIndicators.md,distDir.md,env.md,expireTime.md,exportPathMap.md,generateBuildId.md,generateEtags.md,headers.md,htmlLimitedBots.md,httpAgentOptions.md,images.md,incrementalCacheHandlerPath.md,inlineCss.md,instrumentationClientInject.md,logging.md,mdxRs.md,onDemandEntries.md,optimizePackageImports.md,output.md,outputHashSalt.md,pageExtensions.md,partialPrefetching.md,poweredByHeader.md,prefetchInlining.md,productionBrowserSourceMaps.md,proxyClientMaxBodySize.md,reactCompiler.md,reactMaxHeadersLength.md,reactStrictMode.md,redirects.md,rewrites.md,sassOptions.md,serverActions.md,serverComponentsHmrCache.md,serverExternalPackages.md,staleTimes.md,staticGeneration.md,supportsImmutableAssets.md,taint.md,trailingSlash.md,transpilePackages.md,turbopack.md,turbopackChunking.md,turbopackFileSystemCache.md,turbopackIgnoreIssue.md,turbopackLocalPostcssConfig.md,turbopackMemoryEviction.md,turbopackRustReactCompiler.md,typedRoutes.md,typescript.md,urlImports.md,useLightningcss.md,useOffline.md,useTypeScriptCli.md,webVitalsAttribution.md,webpack.md}|01-app/03-api-reference/05-config:{02-typescript.md,03-eslint.md}|01-app/03-api-reference/06-cli:{create-next-app.md,next.md}|01-app/03-api-reference/07-adapters:{01-configuration.md,02-creating-an-adapter.md,03-api-reference.md,04-testing-adapters.md,05-routing-with-next-routing.md,06-implementing-ppr-in-an-adapter.md,07-runtime-integration.md,08-invoking-entrypoints.md,09-output-types.md,10-routing-information.md,11-use-cases.md,12-immutable-static-assets.md}|02-pages/01-getting-started:{01-installation.md,02-project-structure.md,04-images.md,05-fonts.md,06-css.md,11-deploying.md}|02-pages/02-guides:{analytics.md,authentication.md,babel.md,ci-build-caching.md,content-security-policy.md,css-in-js.md,custom-server.md,debugging.md,draft-mode.md,environment-variables.md,forms.md,incremental-static-regeneration.md,instrumentation.md,internationalization.md,lazy-loading.md,mdx.md,multi-zones.md,open-telemetry.md,package-bundling.md,post-css.md,preview-mode.md,production-checklist.md,redirecting.md,sass.md,scripts.md,self-hosting.md,static-exports.md,tailwind-v3-css.md,third-party-libraries.md}|02-pages/02-guides/migrating:{app-router-migration.md,from-create-react-app.md,from-vite.md}|02-pages/02-guides/testing:{cypress.md,jest.md,playwright.md,vitest.md}|02-pages/02-guides/upgrading:{codemods.md,version-10.md,version-11.md,version-12.md,version-13.md,version-14.md,version-9.md}|02-pages/03-building-your-application/01-routing:{01-pages-and-layouts.md,02-dynamic-routes.md,03-linking-and-navigating.md,05-custom-app.md,06-custom-document.md,07-api-routes.md,08-custom-error.md}|02-pages/03-building-your-application/02-rendering:{01-server-side-rendering.md,02-static-site-generation.md,04-automatic-static-optimization.md,05-client-side-rendering.md}|02-pages/03-building-your-application/03-data-fetching:{01-get-static-props.md,02-get-static-paths.md,03-get-server-side-props.md,05-client-side.md}|02-pages/03-building-your-application/06-configuring:{12-error-handling.md}|02-pages/04-api-reference:{06-edge.md,08-turbopack.md}|02-pages/04-api-reference/01-components:{font.md,form.md,head.md,image-legacy.md,image.md,link.md,script.md}|02-pages/04-api-reference/02-file-conventions:{instrumentation.md,proxy.md,public-folder.md,src-folder.md}|02-pages/04-api-reference/03-functions:{get-initial-props.md,get-server-side-props.md,get-static-paths.md,get-static-props.md,next-request.md,next-response.md,use-params.md,use-report-web-vitals.md,use-router.md,use-search-params.md,userAgent.md}|02-pages/04-api-reference/04-config/01-next-config-js:{adapterPath.md,allowedDevOrigins.md,assetPrefix.md,basePath.md,bundlePagesRouterDependencies.md,compress.md,crossOrigin.md,deploymentId.md,devIndicators.md,distDir.md,env.md,exportPathMap.md,generateBuildId.md,generateEtags.md,headers.md,httpAgentOptions.md,images.md,logging.md,onDemandEntries.md,optimizePackageImports.md,output.md,pageExtensions.md,poweredByHeader.md,productionBrowserSourceMaps.md,proxyClientMaxBodySize.md,reactStrictMode.md,redirects.md,rewrites.md,serverExternalPackages.md,trailingSlash.md,transpilePackages.md,turbopack.md,typescript.md,urlImports.md,useLightningcss.md,useTypeScriptCli.md,webVitalsAttribution.md,webpack.md}|02-pages/04-api-reference/04-config:{01-typescript.md,02-eslint.md}|02-pages/04-api-reference/05-cli:{create-next-app.md,next.md}|02-pages/04-api-reference/06-adapters:{01-configuration.md,02-creating-an-adapter.md,03-api-reference.md,04-testing-adapters.md,05-routing-with-next-routing.md,06-runtime-integration.md,07-invoking-entrypoints.md,08-output-types.md,09-routing-information.md,10-use-cases.md}|03-architecture:{accessibility.md,fast-refresh.md,nextjs-compiler.md,supported-browsers.md}|04-community:{01-contribution-guide.md,02-rspack.md}<!-- NEXT-AGENTS-MD-END -->
