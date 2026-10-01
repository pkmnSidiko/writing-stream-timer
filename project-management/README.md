# Project Tracker

A small, local-first project dashboard for writers and storytellers.

## Current scope

The MVP tracks multiple projects with:

- project name and type
- status
- goal
- optional deadline
- current task
- generic milestones
- external links
- notes
- local-browser storage
- JSON export/import for backup or moving data between browsers

It intentionally does **not** duplicate the Word Tracker. Word count history remains the responsibility of `word-tracker/`.

## Storage

Project data stays in the browser's local storage. Nothing is sent to a server.

Because local storage is browser/device-specific, use **Export projects** for backup or transfer.

## Viewer mode

Viewer mode is not enabled yet. Project state is local to the browser, so a URL alone cannot safely identify a project for another display device without a future sharing/sync design.

## Future possibilities

- optional integration with Word Tracker
- project-level progress summaries
- chapter/scene trackers
- challenge/deadline connections
- display/viewer mode once a sharing model exists

This tool remains deliberately smaller than a general-purpose project-management suite.
