# Copilot Instructions – WoW Logs Analyzer (Next.js 15)

### Tech stack snapshot

- Next.js 15 (App Router) + React 19 strict mode
- TypeScript – `"strict": true`
- Tailwind CSS v4 with shadcn/ui components
- TanStack Query 5 for client data fetching
- Jest + @testing-library/react for tests

### Coding idioms

- Use **function components** only; no class components.
- Prefer **React Server Components**; mark client-side files with `"use client"`.
- Keep side-effects inside `useEffect`; prefer `useCallback`/`useMemo` to inline functions.
- Use `zod` for runtime validation of external data.
- Do **not** use the `any` type (use generics or `unknown` + refinement).

### Styling & layout

- Tailwind first; avoid inline `style={{}}`.
- 4-space indent, LF line endings, ≤ 80 cols.
- Compose UI with shadcn `<Card/>`, `<Button/>`, etc., not custom CSS.

### Testing expectations

- For every utility in `src/lib/**`, generate a focused Jest unit test.
- For new pages, scaffold a React Testing Library integration test that mocks fetch calls.
- Use `npm run test-ci` before proposing edits.

### File & folder conventions

- Page route files live in `src/app/**/page.tsx`; keep co-located `loading.tsx` and `error.tsx`.
- Shared hooks belong in `src/lib/hooks/`.
- Keep API wrappers under `src/lib/wcl/` and `src/lib/raidbots/`; extend typings in `types.d.ts`.

### Commit & PR guidance

- Generate **conventional commits** (`feat:`, `fix:`, `chore:`…).
- Pull-request descriptions should include a one-sentence summary + checklist of Jest, ESLint, and lighthouse passes.

### When uncertain

- Ask a clarifying question instead of guessing.
- Offer the smallest viable diff; avoid sweeping rewrites unless explicitly requested.
