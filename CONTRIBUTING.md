# Contributing

Thanks for your interest in improving Chess.com Opponent Info. This document explains the workflow and a few conventions.

## Golden rule: never push to `main`

`main` is the release branch. The userscript's `@downloadURL` and `@updateURL` point directly at it, so anything merged into `main` is pushed to every installed user automatically. Treat it as protected.

All work happens on `dev` (and feature branches off it). `main` only ever receives reviewed, tested merges via pull request.

```
feature/* --> dev --> (PR + review) --> main
```

## Workflow

1. Fork the repository (or, if you have access, create a branch off `dev`).
2. Make sure your local `dev` is up to date:

   ```bash
   git checkout dev
   git pull origin dev
   ```

3. Create a feature branch off `dev`:

   ```bash
   git checkout -b feature/short-description
   ```

4. Commit your changes (see commit conventions below).
5. Push your branch and open a pull request **targeting `dev`**, not `main`:

   ```bash
   git push -u origin feature/short-description
   ```

6. Once the PR is reviewed and merged into `dev`, a maintainer handles the `dev -> main` release merge and bumps the version.

## Commit messages

Keep them short and prefixed by intent:

- `feat:` new feature
- `fix:` bug fix
- `refactor:` code change with no behavior change
- `docs:` documentation only
- `style:` formatting, no logic change
- `chore:` tooling, metadata, housekeeping

Example: `feat: add bullet rating to detailed panel`

## Versioning

This project follows [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`).

When a change reaches `main`, the `@version` field in the script header must be bumped accordingly:

- `PATCH` for bug fixes
- `MINOR` for new backward-compatible features
- `MAJOR` for breaking changes

Version bumps are done as part of the release merge into `main`, not in feature branches.

## Code style

- The script is a single self-contained `.user.js` file with no build step.
- Stay vanilla JS (no external dependencies) unless there is a strong reason.
- Match the existing style: 4-space indentation, `const`/`let`, no trailing whitespace.
- Keep the **fair play** principle intact: the script must rely only on public profile data from `api.chess.com/pub`. No engine, no board reading, no move suggestions. Any PR that touches this is rejected.

## Testing before a PR

- Load the modified script in Tampermonkey/Violentmonkey.
- Verify it works on both `chess.com/game/*` and `chess.com/play/*`.
- Check it against several opponent types: titled player, banned account, unrated, premium, streamer.
- Make sure the widget still drags and remembers its position.

## Bug reports

Open an [issue](https://github.com/lusowall/info-chesscom/issues) with:

- browser + extension and their versions
- the page URL where it happens
- steps to reproduce
- console errors if any

Thanks for contributing.
