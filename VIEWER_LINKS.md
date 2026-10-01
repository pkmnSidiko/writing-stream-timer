# Viewer link standard

TLC Storyworks widgets use a simple shared rule for viewer URLs.

## Viewer URLs

A viewer link may carry the selected appearance preset:

`?viewer&theme=<preset>`

Examples:

- `?viewer&theme=tlc`
- `?viewer&theme=dark`
- `?viewer&theme=ink-paper`
- `?viewer&theme=contrast`

Viewer links should **not** serialize widget configuration or project data into the URL. Do not put timer stages, project data, custom settings, or JSON blobs into a viewer URL. A widget may include a small non-content identifier such as a project ID when that identifier is only used to select data already present in the browser.

## Widget behavior

The normal widget page handles configuration and local saving. Viewer mode is display-only and receives the named appearance preset. Project Tracker additionally accepts a project ID so a stream/browser display can stay pointed at one local project while the project data remains in browser storage.

The shared `embed.js` helper:

- generates the clean viewer URL
- reads the current saved theme preset
- refreshes visible viewer-link fields after an appearance change
- applies the requested theme in viewer mode
- keeps `?embed` separate for widgets that support interactive embeds

When adding a new widget, load `../embed.js` and use `TLC_EMBED.url("viewer")` for its viewer link. The shared helper will keep the URL format and theme behavior consistent.

Custom color/font settings are intentionally not serialized into viewer URLs. If a user has a custom theme rather than a named preset, the viewer link falls back to the TLC Storyworks preset.
