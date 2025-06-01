You're assisting in building an open-source tool called Warcraftlogs Search, or "wcl.nulldozzer.io". This tool is to help users to find specific Warcraft logs data more easily. For example, a user can look for heroic logs of a specific boss, containing a player of a certain class with certain talents.

The tool runs as a Next.js 15.3 application, written in TypeScript, and styled using TailwindCSS.

The data is fetched from the Warcraft Logs (`wcl`) GraphQL API, as well as some extra information from raidbots.com.

## Project Structure

All code is located in the `src/` directory, which contains the following subdirectories:

- `app/` - Next.js routed files, `page.tsx` etc.
- `components/` - Reusable React components
- `lib/` - Utility functions, API clients, and other libraries
    - `raidbots/` - Functions to fetch data from raidbots.com
    - `wcl/` - Functions to fetch data from the Warcraft Logs API

Import internal modules using the `^/` prefix, e.g. `import { foo } from '^/lib/foo'`. This helps to avoid relative paths and makes it easier to refactor code.

There are some experimental pages in `app/raidbots/` and `app/talents`, but the actual application is `app/page.tsx`.

## Code Style

- Strict typing using TypeScript
- Use of functional components and hooks in React
- TailwindCSS for styling
- Next.js APP router
- Code formatting following Prettier standards
    - Indent: 4 spaces
    - Max line length: 80
    - Single quotes for strings
    - Insert final newline
    - Trim trailing whitespace
- Use of ESLint for linting
    - When importing types, use `import type` syntax
    - Sort imports
        - First put all external and "buitlin" imports
        - Then put all internal imports (`^/` imports)
        - Then put all parent imports
        - Then put all sibling imports
        - Then put index imports.
        - Within each group, sort imports alphabetically.
