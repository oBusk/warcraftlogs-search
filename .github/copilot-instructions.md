You're assisting in building an open-source tool called Warcraftlogs Search, hosted at "wcl.nulldozzer.io". This tool helps users find specific Warcraft logs data more easily. For example, a user can search for heroic logs of a specific boss, containing a player of a certain class with certain talents or items.

The tool runs as a Next.js 15.5.2 application, written in TypeScript, and styled using TailwindCSS.

The data is fetched from the Warcraft Logs GraphQL API (https://www.warcraftlogs.com/api/v2/client), as well as talent tree information from raidbots.com. Because the Warcraft Logs API has limited searching parameters, the application sometimes fetches many results and filters them client-side to provide more granular search capabilities.

## Project Structure

All code is located in the `src/` directory, which contains the following subdirectories:

- `app/` - Next.js App Router files (`page.tsx`, `layout.tsx`, etc.)
    - The main application is at `app/page.tsx`
    - Experimental pages exist in `app/raidbots/` and `app/talents/`
- `components/` - Reusable React components
- `lib/` - Utility functions, API clients, and other libraries
    - `wcl/` - Functions to fetch data from the Warcraft Logs GraphQL API
    - `raidbots/` - Functions to fetch talent tree data from raidbots.com
    - `__tests__/` - Unit tests

Import internal modules using the `^/` prefix, e.g. `import { foo } from '^/lib/foo'`. This path alias is configured in `tsconfig.json` and helps avoid relative paths, making refactoring easier.

## Code Style

- Strict typing using TypeScript
- Use of functional components and hooks in React
- TailwindCSS for styling
- Next.js App Router architecture
- Code formatting following Prettier standards:
    - Indent: 4 spaces
    - Max line length: 80
    - Single quotes for strings
    - Insert final newline
    - Trim trailing whitespace
- Use of ESLint for linting with `@obusk/eslint-config-next`
    - When importing types, use `import type` syntax
    - Sort imports in the following order:
        - First: all external and "builtin" imports
        - Then: all internal imports (`^/` imports)
        - Then: all parent imports
        - Then: all sibling imports
        - Then: index imports
        - Within each group, sort imports alphabetically

## Development Workflow

### Scripts

- `npm run dev` - Start development server with Turbopack on port 3001
- `npm run build` - Build production version
- `npm run start` - Start production server on port 3001
- `npm run lint` - Run ESLint and Prettier checks
- `npm run lint-fix` - Auto-fix ESLint and Prettier issues
- `npm run test` - Run Jest tests
- `npm run test-ci` - Run tests in CI mode

### Environment Setup

- Node.js 22.x is required (specified in package.json engines)
- Environment variables needed:
    - `WCL_CLIENT_ID` - Warcraft Logs API client ID
    - `WCL_CLIENT_SECRET` - Warcraft Logs API client secret

### API Integration

The application integrates with two main data sources:

1. **Warcraft Logs GraphQL API**: For fetching combat logs and rankings data
    - Authentication via OAuth2 client credentials flow
    - Endpoints defined in `src/lib/wcl/`
2. **Raidbots.com**: For fetching talent tree information
    - Simple REST API calls
    - Functions in `src/lib/raidbots/`

### Data Filtering Strategy

Due to limitations in the Warcraft Logs API search parameters, the application often:

1. Fetches broader result sets than needed
2. Applies client-side filtering for talents, items, and other specific criteria
3. Caches results appropriately to minimize API calls

### Testing

- Unit tests are written with Jest
- Tests are located in `src/lib/__tests__/`
- Run tests before making changes to ensure nothing is broken
- Focus on testing utility functions and data transformation logic
