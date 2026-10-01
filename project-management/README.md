# Project Tracker

A public, local-first project workspace for writers and storytellers.

## What it tracks

- project identity, type, status, goal, deadline, description, and current task
- milestones
- chapters or other structural sections
- scenes within chapters
- scene status, goals, and notes
- writing/session history
- optional word and minute totals for logged sessions
- chapter/scene associations for sessions
- external links and project notes
- JSON backup/import

It does not read manuscript files. Word Tracker remains the dedicated tool for detailed word-count tracking.

## Project Management Framework

The tracker uses a small, platform-neutral framework rather than a rigid methodology:

**Project → goals/deadlines → milestones → structure (chapters/scenes) → sessions → progress**

Not every project needs every layer. A poem can use only a project and milestones. A novel can use chapters and scenes. A research project can use milestones and a session log.

The framework is documented in [FRAMEWORK.md](FRAMEWORK.md).

## Storage

Project data stays in browser localStorage. Nothing is sent to a server.

Because browser storage is device/browser-specific, use **Export projects** for backup or transfer.

## Import compatibility

Version 1 project backups are accepted. Older projects automatically gain chapters, scenes, and writing-log fields.

## Viewer and embeds

The tracker supports an interactive `?embed` mode that removes the surrounding site chrome. A cross-device `?viewer` mode is intentionally not provided yet: local project data cannot safely be selected on another device without a sharing/sync model, and project data is never serialized into URLs.

## Design goal

The tracker should be useful to someone who has never used another TLC Storyworks tool. The framework exists to make future tools compatible, not to require writers to adopt a particular productivity method.
