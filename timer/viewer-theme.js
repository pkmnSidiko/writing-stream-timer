(() => {
  "use strict";

  if (!document.body.classList.contains("viewer")) return;

  const THEMES = {
    tlc: { bg:"#17131a", panel:"#241d29", panelHover:"#2d2433", text:"#f7f1f5", muted:"#c6b8c5", accent:"#d7a9c9", accentStrong:"#efc8df", track:"#3a2e3d", font:"\"DM Sans\", system-ui, sans-serif", heading:"\"Libre Baskerville\", Georgia, serif" },
    neutral: { bg:"#f2f2f0", panel:"#ffffff", panelHover:"#e7e7e4", text:"#202020", muted:"#5f5f5b", accent:"#555555", accentStrong:"#303030", track:"#d0d0cc", font:"system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif", heading:"Georgia, \"Times New Roman\", serif" },
    light: { bg:"#f7f1df", panel:"#fffdf6", panelHover:"#eee5cd", text:"#2d2921", muted:"#6d6659", accent:"#9a7a45", accentStrong:"#765b2f", track:"#d8ccb0" },
    dark: { bg:"#0b121c", panel:"#162333", panelHover:"#203247", text:"#f2f7fc", muted:"#b5c2cf", accent:"#82b6e8", accentStrong:"#b4d5f4", track:"#30465c" },
    "warm-neutral": { bg:"#eee7de", panel:"#fbf7f1", panelHover:"#e5dcd1", text:"#302b27", muted:"#6d6259", accent:"#8a674d", accentStrong:"#694a35", track:"#d3c6b9" },
    "cool-neutral": { bg:"#e9edef", panel:"#fafcfd", panelHover:"#dde3e7", text:"#263039", muted:"#5f6b74", accent:"#536878", accentStrong:"#394b59", track:"#c8d0d5" },
    "soft-gray": { bg:"#e5e6e8", panel:"#f6f6f7", panelHover:"#dcdde0", text:"#25262a", muted:"#62646a", accent:"#686b73", accentStrong:"#4b4e55", track:"#c6c7ca" },
    "ink-paper": { bg:"#e5dccb", panel:"#f8f2e7", panelHover:"#dcd0bd", text:"#1f1c18", muted:"#5e564c", accent:"#6a6258", accentStrong:"#423c35", track:"#c7b9a5" },
    monochrome: { bg:"#171717", panel:"#252525", panelHover:"#333333", text:"#f5f5f5", muted:"#c2c2c2", accent:"#d0d0d0", accentStrong:"#ffffff", track:"#4a4a4a" },
    contrast: { bg:"#000000", panel:"#111111", panelHover:"#222222", text:"#ffffff", muted:"#e8e8e8", accent:"#ffff00", accentStrong:"#ffff00", track:"#666666" }
  };

  const requested = new URLSearchParams(location.search).get("theme") || "neutral";
  const theme = THEMES[requested] || THEMES.neutral;
  const root = document.documentElement;

  Object.entries({
    "--theme-bg": theme.bg,
    "--theme-panel": theme.panel,
    "--theme-panel-hover": theme.panelHover,
    "--theme-text": theme.text,
    "--theme-muted": theme.muted,
    "--theme-accent": theme.accent,
    "--theme-accent-strong": theme.accentStrong,
    "--theme-track": theme.track,
    "--theme-font-family": theme.font || "system-ui, sans-serif",
    "--theme-heading-font-family": theme.heading || "Georgia, serif",
    "--theme-text-scale": "1",
    "--theme-line-height": "1.6"
  }).forEach(([key, value]) => root.style.setProperty(key, value));

  document.body.dataset.theme = requested;
})();
