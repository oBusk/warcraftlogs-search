# Agent Instructions

These instructions apply to all files in this repository.

## Setup

Run the setup script once per session to install dependencies and prepare the Node.js environment:

```bash
./.codex/setup.sh
```

This script will:

- Check for the correct Node.js version (22.x as required by package.json)
- Attempt to install/switch to the correct version if a Node version manager is available (nvm, fnm, or volta)
- Install npm dependencies
- Provide helpful information about available commands

If you don't have Node.js 22.x installed, the script will still work but you may see warnings about unsupported engine versions.

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
