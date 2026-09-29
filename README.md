# Writing Stream Timer

A customizable browser-based timer for writing sprints, body doubling, and creative streams.

Designed for browser sources in OBS/Streamlabs Desktop and for standalone use.

## Features

- Configurable stages and durations
- Marks any stage as a writing stage
- Tracks writing progress by time, not word count
- Shows current stage, countdown, writing-block count, and next stage
- Viewer mode with a transparent background
- No manuscript integration and no writing-content tracking
- Static GitHub Pages-friendly site

## Quick start

Edit config.js to change the schedule, then open index.html.

For a clean browser-source overlay, use:

    index.html?viewer

## Customizing

Each stage looks like:

    { name: "Writing Sprint", minutes: 20, writing: true }

Set writing to true for stages that should count toward writing progress.

Nothing in this app reads your document, editor, word count, or manuscript. Progress is simply the amount of scheduled writing time completed.

## GitHub Pages

This repository is intended to be hosted with GitHub Pages.

After enabling Pages for the main branch, the site will be available at:

https://pkmnsidiko.github.io/writing-stream-timer/

## Roadmap

- [ ] More visual themes
- [ ] Configurable colors/fonts
- [ ] Multiple progress-bar styles
- [ ] Optional controller layout
- [ ] Better mobile/iPad controls
- [ ] Optional synchronized controller for a second device
- [ ] Accessibility polish
- [ ] Documentation for stream software setup

## License

MIT. See LICENSE.
