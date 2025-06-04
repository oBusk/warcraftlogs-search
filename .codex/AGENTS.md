# Agent Instructions

These instructions apply to all files in this repository.

## Setup

Run the setup script once per session to install dependencies:

```bash
./.codex/setup.sh
```

## Workflow

1. After making any changes to the repository, run:

```bash
npm run lint-fix
```

This command auto-fixes lint and formatting issues. Ensure it completes without errors before committing.

2. When possible, run the tests with:

```bash
npm run test-ci
```

If tests fail or dependencies are missing, attempt to resolve them or note the failure in the pull request description.

3. Use concise commit messages that summarize the change.
