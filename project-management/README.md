# Project Management

A future home for writing-project planning and organization tools.

This directory is intentionally scaffolding-only for now. Individual tools can be added here when there is a concrete use case rather than exposing an empty widget on the public toolbox.

## What belongs here

Project management tools should help writers plan and organize the work itself, such as:

- project planning boards
- milestone trackers
- project dashboards
- sprint planning
- writing goals and deadlines
- chapter or scene planning
- project-level progress views

These are distinct from:

- `timer/` — writing sessions and time
- `countdown/` — standalone deadlines and events
- `word-tracker/` — manuscript/session progress
- future `prompt-deck/` — creative generation
- future `crawl/` — writing-game experiences
- future `excerpt/` — book/page-style presentation

## Shared standards

When tools are added here, they should use the repository's shared appearance system and accessibility foundation:

- `../theme.css`
- `../theme.js`
- `../embed.js`
- `../links.css`

Viewer links should follow [VIEWER_LINKS.md](../VIEWER_LINKS.md). In particular, use the shared viewer-link helper rather than serializing project data, configuration, or custom settings into URLs.

Project data should remain local to the browser unless a future tool explicitly establishes another storage model.

## Status

Scaffolding only. No project-management tool is currently linked from the public toolbox.
