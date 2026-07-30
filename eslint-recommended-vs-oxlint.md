# ESLint "recommended" vs Oxlint rule groups

Comparison of ESLint's built-in `recommended` config against how the
equivalent rules are categorized in oxlint, to help decide which oxlint
`categories` to enable for a stricter-than-default setup.

## Sources

- **ESLint recommended rules**: `packages/js/src/configs/eslint-recommended.js`
  in [eslint/eslint@main](https://github.com/eslint/eslint/blob/main/packages/js/src/configs/eslint-recommended.js)
  (the authoritative list — the docs page at eslint.org/docs/latest/rules/
  also shows many non-recommended rules with confusingly similar checkmarks,
  so it isn't reliable for this).
- **Oxlint categories/plugin mapping**: the rule table at
  [oxc.rs/docs/guide/usage/linter/rules.html](https://oxc.rs/docs/guide/usage/linter/rules.html),
  cross-checked against this repo's installed `oxlint@1.75.0`
  (`crates/oxc_linter/src/rules.rs` registry) to confirm which rules actually
  exist in that version.
- The two "missing" rules below were also verified empirically by running
  `oxlint` against small repro files — see [Missing rules](#missing-rules).

## Oxlint's category model (recap)

Oxlint rules are tagged with exactly one **category**, not a "recommended"
flag:

| Category      | Meaning                                                          |
| ------------- | ---------------------------------------------------------------- |
| `correctness` | Code that is outright wrong or useless — **on by default**       |
| `suspicious`  | Code that is most likely wrong or useless                        |
| `pedantic`    | Strict lints with occasional false positives                     |
| `perf`        | Code that could be written in a more performant way              |
| `style`       | Code that should be written in a more idiomatic way              |
| `restriction` | Lints which prevent the use of certain language/library features |
| `nursery`     | New lints still under development                                |

This repo's `oxlint.config.ts` sets `categories: { correctness: "error" }`,
so **every rule tagged `correctness`, across every enabled plugin, is
already an error** — regardless of whether that specific rule name is
listed anywhere in `rules`.

## Results: the 64 ESLint recommended rules, grouped by oxlint category

52 of the 64 rules (81%) land in `correctness`, which this project already
enables wholesale. The rest are spread across `pedantic`, `restriction`,
`suspicious`, and `nursery` — categories currently **off** in this repo.

### `correctness` (52) — already enabled here

| ESLint rule                     | Oxlint rule                               |
| ------------------------------- | ----------------------------------------- |
| constructor-super               | `eslint(constructor-super)`               |
| for-direction                   | `eslint(for-direction)`                   |
| getter-return                   | `eslint(getter-return)`                   |
| no-async-promise-executor       | `eslint(no-async-promise-executor)`       |
| no-class-assign                 | `eslint(no-class-assign)`                 |
| no-compare-neg-zero             | `eslint(no-compare-neg-zero)`             |
| no-cond-assign                  | `eslint(no-cond-assign)`                  |
| no-const-assign                 | `eslint(no-const-assign)`                 |
| no-constant-binary-expression   | `eslint(no-constant-binary-expression)`   |
| no-constant-condition           | `eslint(no-constant-condition)`           |
| no-control-regex                | `eslint(no-control-regex)`                |
| no-debugger                     | `eslint(no-debugger)`                     |
| no-delete-var                   | `eslint(no-delete-var)`                   |
| no-dupe-class-members           | `eslint(no-dupe-class-members)`           |
| no-dupe-else-if                 | `eslint(no-dupe-else-if)`                 |
| no-dupe-keys                    | `eslint(no-dupe-keys)`                    |
| no-duplicate-case               | `eslint(no-duplicate-case)`               |
| no-empty-character-class        | `eslint(no-empty-character-class)`        |
| no-empty-pattern                | `eslint(no-empty-pattern)`                |
| no-empty-static-block           | `eslint(no-empty-static-block)`           |
| no-ex-assign                    | `eslint(no-ex-assign)`                    |
| no-extra-boolean-cast           | `eslint(no-extra-boolean-cast)`           |
| no-func-assign                  | `eslint(no-func-assign)`                  |
| no-global-assign                | `eslint(no-global-assign)`                |
| no-import-assign                | `eslint(no-import-assign)`                |
| no-invalid-regexp               | `eslint(no-invalid-regexp)`               |
| no-irregular-whitespace         | `eslint(no-irregular-whitespace)`         |
| no-loss-of-precision            | `eslint(no-loss-of-precision)`            |
| no-misleading-character-class   | `eslint(no-misleading-character-class)`   |
| no-new-native-nonconstructor    | `eslint(no-new-native-nonconstructor)`    |
| no-nonoctal-decimal-escape      | `eslint(no-nonoctal-decimal-escape)`      |
| no-obj-calls                    | `eslint(no-obj-calls)`                    |
| no-self-assign                  | `eslint(no-self-assign)`                  |
| no-setter-return                | `eslint(no-setter-return)`                |
| no-shadow-restricted-names      | `eslint(no-shadow-restricted-names)`      |
| no-sparse-arrays                | `eslint(no-sparse-arrays)`                |
| no-this-before-super            | `eslint(no-this-before-super)`            |
| no-unassigned-vars              | `eslint(no-unassigned-vars)`              |
| no-unreachable                  | `eslint(no-unreachable)`                  |
| no-unsafe-finally               | `eslint(no-unsafe-finally)`               |
| no-unsafe-negation              | `eslint(no-unsafe-negation)`              |
| no-unsafe-optional-chaining     | `eslint(no-unsafe-optional-chaining)`     |
| no-unused-labels                | `eslint(no-unused-labels)`                |
| no-unused-private-class-members | `eslint(no-unused-private-class-members)` |
| no-unused-vars                  | `eslint(no-unused-vars)`                  |
| no-useless-backreference        | `eslint(no-useless-backreference)`        |
| no-useless-catch                | `eslint(no-useless-catch)`                |
| no-useless-escape               | `eslint(no-useless-escape)`               |
| no-with                         | `eslint(no-with)`                         |
| require-yield                   | `eslint(require-yield)`                   |
| use-isnan                       | `eslint(use-isnan)`                       |
| valid-typeof                    | `eslint(valid-typeof)`                    |

Note: this repo's config already customizes `no-unused-vars` with
`argsIgnorePattern`/`ignoreRestSiblings`, so it's active either way.

### `pedantic` (4) — off by default here

| ESLint rule           | Notes                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| no-case-declarations  | Lexical decl in unbraced `case` — real footgun, worth enabling individually even without full `pedantic` |
| no-fallthrough        | Missing `break` in `switch` — commonly wanted                                                            |
| no-prototype-builtins | `obj.hasOwnProperty(...)` direct calls                                                                   |
| no-redeclare          | Var/function redeclared in same scope                                                                    |

### `restriction` (2) — off by default here

| ESLint rule     | Notes                                                                                                          |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| no-empty        | Empty block statements (oxlint puts this in `restriction`, not `correctness`/`pedantic` like you might expect) |
| no-regex-spaces | Multiple spaces in a regex literal                                                                             |

### `suspicious` (2) — off by default here

| ESLint rule             | Notes                                                                 |
| ----------------------- | --------------------------------------------------------------------- |
| no-unexpected-multiline | ASI footgun (e.g. `return` followed by a newline + paren)             |
| preserve-caught-error   | New in ESLint 9.something; requires re-thrown errors to chain `cause` |

### `nursery` (2) — experimental, off by default here

| ESLint rule           | Notes                                                                                                                                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| no-undef              | Flags references to undeclared globals. Still `nursery` in oxlint 1.75, likely due to false positives around global/env resolution — worth testing individually before relying on it, since it's one of the more valuable recommended rules. |
| no-useless-assignment | Assignment whose value is never read                                                                                                                                                                                                         |

Rules tagged `nursery` can change behavior or move category in future
oxlint releases without a major version bump — treat them as
opt-in/experimental rather than "safe to blanket-enable via category".

## Missing rules

Two ESLint recommended rules have **no oxlint equivalent at all** — not in
any category, and not enforced by the oxc parser as a syntax error either.
Verified by running `oxlint@1.75.0` against repro files with `--no-ignore`
and getting zero diagnostics in both cases:

- **`no-dupe-args`** — duplicate parameter names in a non-strict function
  (e.g. `function f(a, a) {}`). Note TypeScript's own compiler _does_ flag
  this (`ts(2300)`), so in this all-TS codebase the gap is mostly
  theoretical — but oxlint's typescript-plugin type-aware rules don't cover
  it either, so a plain `.js` file (or type-checking turned off) would slip
  through.
- **`no-octal`** — legacy octal literals (`010`). Also would be a
  TypeScript/strict-mode concern more than an oxlint one.

If either matters in practice, the closest mitigation is leaning on
`tsc`/strict mode rather than oxlint for these two.

## Practical takeaway for this repo

Given `categories: { correctness: "error" }` is already set, **52/64
(81%)** of ESLint's recommended-equivalent behavior is already covered.
To close most of the remaining gap in one step:

```ts
categories: {
    correctness: "error",
    suspicious: "error",
    pedantic: "error",
},
```

This adds `no-unexpected-multiline`, `preserve-caught-error`,
`no-case-declarations`, `no-fallthrough`, `no-prototype-builtins`, and
`no-redeclare` — but also every _other_ rule oxlint classifies as
`suspicious`/`pedantic` across all enabled plugins (typescript, unicorn,
react, import, etc.), which is a much bigger surface than just these 6.
Given you already lean stricter than most, that's likely desirable, but
expect some new noise to triage (`pedantic` explicitly documents
"occasional false positives"). `restriction` is the one category ESLint's
own `recommended` barely touches (`no-empty`, `no-regex-spaces`) and is
generally about banning language features (e.g. `no-bitwise`,
`no-ternary`) — worth reviewing rule-by-rule rather than enabling wholesale.
