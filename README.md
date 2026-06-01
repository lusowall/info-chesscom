# Chess.com Opponent Info

A Tampermonkey/Violentmonkey userscript that displays **only your opponent's public statistics** on Chess.com, using the official public API (`api.chess.com/pub`). No move analysis, no engine, no cheating - **100% fair play**.

![version](https://img.shields.io/badge/version-1.0-brightgreen)
![license](https://img.shields.io/badge/license-MIT-blue)

## Overview

A small floating (draggable) widget appears next to the top player. It shows the peak Elo and win rate at a glance, and expands into a detailed panel on click.

> Add a screenshot here once the repo is set up:
> `![preview](docs/screenshot.png)`

## Features

- **Auto headline**: global peak Elo + win rate, no click needed
- **Detailed panel**: rapid, blitz, bullet, daily, tactics, puzzle rush
- Win/Loss/Draw record, total games, combined win rate
- Country (flag), account age, followers, league
- Streamer detection, title badge (GM, IM, FM...)
- "Account closed (fair play)" banner if the opponent was banned
- Last seen (online / X min / h / d ago)
- Draggable widget with position saved (localStorage)

Everything relies **exclusively** on public data exposed by the Chess.com API. Nothing is read from the board or the moves played.

## Installation

1. Install a userscript extension:
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Edge, Safari)
   - or [Violentmonkey](https://violentmonkey.github.io/) (open source)
2. Click the direct install link:

   [`chesscom-lichess-analyze.user.js`](https://raw.githubusercontent.com/lusowall/info-chesscom/main/chesscom-lichess-analyze.user.js)

3. The extension detects the script and prompts for installation. Confirm.
4. Start a game on Chess.com; the widget appears in the top-left corner.

> Updates are handled automatically by Tampermonkey via `@updateURL`.

## Usage

- The headline fills in automatically once an opponent is detected.
- **Click the icon or the headline** to open/close the detailed panel.
- **Click the pin button** to unlock the widget for dragging; click again to fix it in place.
- The position is remembered across sessions.

## Compatibility

| Page                          | Supported |
|-------------------------------|-----------|
| `chess.com/game/*`            | Yes       |
| `chess.com/play/*`            | Yes       |

## Privacy & fair play

This script **provides no gameplay assistance**. It does not read the position, does not suggest moves, and uses no chess engine. It simply aggregates the opponent's public profile statistics, exactly as if you visited their profile manually. This is consistent with Chess.com's fair play policy.

## Development

The script is a single file with no build step:

```
chesscom-lichess-analyze.user.js   # all the code
README.md
LICENSE
```

To contribute: fork -> branch -> PR. Bug reports go in the [issues](https://github.com/lusowall/info-chesscom/issues).

## License

[MIT](LICENSE) (c) LusoWall
