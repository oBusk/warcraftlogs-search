# Guidance for Claude Code

## Code comments

Don't write code comments by default. Convey meaning through names, types, and
structure instead.

If you think a comment is genuinely needed — a non-obvious constraint, an API
quirk, or a deliberate workaround that a developer could not infer from the code
itself — don't add it silently; surface it and let me decide.

Inline comments are read by developers years from now who have no knowledge of
the change that introduced them. Never write a comment that argues for a change,
describes what you just did, or references review feedback or our discussion.
That belongs in the pull request, not in the code.
