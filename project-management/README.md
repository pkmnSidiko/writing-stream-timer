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

**Project → goals/deadlines → milestones → structure (chapters/scenes) → sessions → progress**

Not every project needs every layer. The framework is documented in [FRAMEWORK.md](FRAMEWORK.md).

## Storage

Project data stays in browser localStorage. Nothing is sent to a server. Export projects to back up or move them.

## Import compatibility

Version 1 project backups are accepted and gain the newer chapters/scenes/log fields.

## Viewer and embeds

The tracker supports both an interactive `?embed` mode and a display-only `?viewer&theme=<preset>&project=<id>` mode for stream/browser displays. The viewer link carries only the named theme and project ID; project data remains in browser localStorage and is never serialized into the URL. The viewer is therefore tied to the browser that has the project data, rather than pretending to be a cross-device publishing system.

The tracker is designed to be useful on its own; the framework exists to make future TLC Storyworks tools compatible, not to impose a productivity method.
