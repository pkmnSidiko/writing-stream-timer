# TLC Storyworks · Writing Tools

A small collection of customizable browser-based tools for writers and other storytellers.

The goal is to make useful, lightweight tools that can work in several places: standalone in a browser, embedded on a website, used as an OBS/Streamlabs browser source, or adapted for a community.

TLC Storyworks is also an open community project. If you have ideas, feedback, or questions, join the [GitHub Discussions](https://github.com/tlcstoryworks/writer-tools/discussions). If these tools are useful to you and you'd like to help support their development, you can [sponsor TLC Storyworks](https://github.com/sponsors/tlcstoryworks).

## Current tools

### Writing Stream Timer

A customizable timer for writing sprints, body doubling, creative streams, and focused work.

- Configurable stages and durations
- Marks stages as writing or non-writing
- Tracks writing progress by scheduled time rather than manuscript content
- Shows current stage, countdown, writing-block count, and next stage
- Viewer mode for OBS/Streamlabs
- Embed mode for websites and other workspaces
- No manuscript integration or writing-content tracking
- Static GitHub Pages-friendly setup

Open it at:

- `/timer/` — full timer and controls
- `/timer/?viewer` — transparent viewer/stream overlay
- `/timer/?embed` — clean transparent embed

The timer's schedule is configured in `timer/config.js`.

## Project structure

```
/
├── index.html          # Writing Tools landing page
├── style.css           # Landing page styles
├── timer/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── config.js
└── ...
```

Future tools will live in their own folders so each widget can remain small, understandable, and independently useful.

Possible additions include word trackers, project/progress widgets, countdowns, session notes, prompt tools, writing games, and community-focused helpers.

## Design principles

### Writer-first, not manuscript-first

These tools should not need to read someone's manuscript to be useful. When a tool can work from manual input or configuration, that is the default.

### Platform-neutral

A tool should be useful whether someone is writing in Word, Scrivener, Google Docs, a web editor, Notion, or something else entirely.

### Adaptable

Tools should be easy to customize, fork, theme, and reuse in different communities or creative spaces.

### Small and composable

Rather than building one giant application, this project is a toolbox of focused widgets that can eventually share common infrastructure.

## GitHub Pages

This repository is intended to be hosted with GitHub Pages.

The project site will use the repository's GitHub Pages URL with relative links, so the tools can also be forked without rewriting their paths.

## Roadmap

- [x] Move the timer into its own tool directory
- [x] Create a toolbox landing page
- [x] Add viewer and embed URL modes
- [ ] More visual themes
- [ ] Shared configuration/theme infrastructure
- [ ] Configurable colors and fonts
- [ ] Word tracker
- [ ] Project/progress tracker
- [ ] Prompt and writing-game tools
- [ ] Accessibility polish
- [ ] Documentation for stream software and embeds

## License

MIT. See LICENSE.
