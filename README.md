# TLC Storyworks · Writing Tools

A small collection of customizable browser-based tools for writers and other storytellers.

The goal is to make useful, lightweight tools that can work in several places: standalone in a browser, embedded on a website, used as an OBS/Streamlabs browser source, or adapted for a community. TLC Storyworks provides a shared appearance system so each tool can keep the project’s default look while also being themed by the person using it.

See the [public roadmap](https://tlcstoryworks.github.io/writer-tools/roadmap/) for a quick look at what's brewing, or keep scrolling for the full development roadmap.

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

The timer's schedule is configured in `timer/config.js`. Use **Appearance** to choose a theme preset or customize the colors.

### Word Tracker

A manual word-count tracker for writers who want to log the words they add without giving the tool access to their manuscript.

- Project name and optional word-count goal
- Starting count for existing projects
- Primary “Add words” workflow
- Optional notes and dates for individual entries
- Current count, today's words, active-day average, and required pace
- Optional start and end dates
- Browser-local history
- Viewer mode for OBS/Streamlabs
- Embed mode for websites and other workspaces
- No manuscript integration or writing-content tracking

Open it at:

- `/word-tracker/` — full tracker and controls
- `/word-tracker/?viewer` — progress display for streams
- `/word-tracker/?embed` — clean transparent embed

The tracker stores its project data locally in the browser. Appearance settings are shared across TLC Storyworks tools in the same browser.

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
├── word-tracker/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── theme.css         # Shared appearance/theme styles
├── theme.js          # Shared appearance/theme controls
└── ...
```

Future tools will live in their own folders so each widget can remain small, understandable, and independently useful.

Possible additions include project/progress tools, countdowns, session notes, prompt tools, writing games, challenge helpers, and small stream widgets.

## Design principles

### Writer-first, not manuscript-first

These tools should not need to read someone's manuscript to be useful. When a tool can work from manual input or configuration, that is the default.

### Platform-neutral

A tool should be useful whether someone is writing in Word, Scrivener, Google Docs, a web editor, Notion, or something else entirely.

### Adaptable

Tools should be easy to customize, fork, theme, and reuse in different communities or creative spaces.

### Small and composable

Rather than building one giant application, this project is a toolbox of focused widgets that can eventually share common infrastructure.

### Accessible by design

Accessibility should be part of the foundation, not a final pass. Tools should aim to support keyboard navigation, screen readers, readable contrast and text, reduced motion, touch-friendly controls, responsive layouts, and users with different physical, sensory, and cognitive needs. Optional effects and displays should stay optional when practical.

## GitHub Pages

This repository is intended to be hosted with GitHub Pages.

The project site will use the repository's GitHub Pages URL with relative links, so the tools can also be forked without rewriting their paths.

## Roadmap

### Foundation
- [x] Move the timer into its own tool directory
- [x] Create a toolbox landing page
- [x] Add viewer and embed URL modes
- [x] Accessibility foundation and testing
- [x] Shared appearance/theme infrastructure
- [x] Theme presets and configurable colors
- [ ] Configurable fonts and typography
- [ ] Shared embed/display infrastructure
- [ ] Documentation for stream software and embeds

### Writing & Progress
- [x] Word tracker
- [x] Writing session / sprint tools
- [ ] Project and progress tracker
- [ ] Writing goals and deadlines
- [ ] Writing log / session history
- [ ] Optional gentle streak tracking
- [ ] Chapter tracker
- [ ] Scene tracker
- [ ] Book / series tracker

### Prompts & Creative Tools
- [ ] Prompt Generator / Prompt Deck — dice, card, or mixed generation using separate Who / What / When / Where / Why / How prompt pools
- [ ] Character prompt generator
- [ ] Scene prompt generator
- [ ] Conflict generator
- [ ] Sensory-detail and five-senses prompts
- [ ] Random word / object / detail tools
- [ ] Writing challenge generator
- [ ] Book Page Generator — turn pasted excerpts into novel-style page images for sharing

### Challenges & Community
- [ ] Challenge builder
- [ ] Challenge tracker
- [ ] Calendar / challenge progress view
- [ ] Submission and external-link tracking
- [ ] Writing game toolkit
- [ ] Customizable crawl/adventure-style writing games
- [ ] Shareable game configurations

### Stream & Embed Widgets
- [ ] Current activity widget
- [ ] Writing goal widget
- [ ] Session progress widget
- [ ] Break / chat widget
- [ ] Minimal stream display widgets
- [ ] Copyable embed URLs / iframe snippets
- [ ] OBS / Streamlabs display presets

### Utilities & Accessibility
- [ ] Random choice / dice / roll tools
- [ ] Writing math and conversion tools
- [ ] Countdown widget
- [ ] Session notes
- [ ] Large-text and low-stimulation display options
- [ ] Reduced-motion and high-contrast options
- [ ] Additional keyboard, screen-reader, and touch testing

### Future / Physical Extensions
- [ ] Design Prompt Deck data so digital cards can also support future printable/physical decks
- [ ] Explore printable Prompt Deck exports once the digital system is established

## License

MIT. See LICENSE.
