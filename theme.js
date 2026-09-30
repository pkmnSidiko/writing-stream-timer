(() => {
  "use strict";

  const STORAGE_KEY = "tlc-storyworks-theme";
  const DEFAULT_THEME = {
    preset: "tlc", bg:"#17131a", panel:"#241d29", panelHover:"#2d2433",
    text:"#f7f1f5", muted:"#c6b8c5", accent:"#d7a9c9", accentStrong:"#efc8df", track:"#3a2e3d"
  };
  const TIMER_DEFAULT_THEME = {
    name:"Timer Neutral", preset:"neutral", bg:"#f2f2f0", panel:"#ffffff", panelHover:"#e7e7e4",
    text:"#202020", muted:"#5f5f5b", accent:"#555555", accentStrong:"#303030", track:"#d0d0cc"
  };
  const PRESETS = {
    tlc: { name:"TLC Storyworks", ...DEFAULT_THEME },
    neutral: TIMER_DEFAULT_THEME,
    light: { name:"Light", preset:"light", bg:"#f7f1df", panel:"#fffdf6", panelHover:"#eee5cd", text:"#2d2921", muted:"#6d6659", accent:"#9a7a45", accentStrong:"#765b2f", track:"#d8ccb0" },
    dark: { name:"Dark", preset:"dark", bg:"#0b121c", panel:"#162333", panelHover:"#203247", text:"#f2f7fc", muted:"#b5c2cf", accent:"#82b6e8", accentStrong:"#b4d5f4", track:"#30465c" },
    warmNeutral: { name:"Warm Neutral", preset:"warm-neutral", bg:"#eee7de", panel:"#fbf7f1", panelHover:"#e5dcd1", text:"#302b27", muted:"#6d6259", accent:"#8a674d", accentStrong:"#694a35", track:"#d3c6b9" },
    coolNeutral: { name:"Cool Neutral", preset:"cool-neutral", bg:"#e9edef", panel:"#fafcfd", panelHover:"#dde3e7", text:"#263039", muted:"#5f6b74", accent:"#536878", accentStrong:"#394b59", track:"#c8d0d5" },
    softGray: { name:"Soft Gray", preset:"soft-gray", bg:"#e5e6e8", panel:"#f6f6f7", panelHover:"#dcdde0", text:"#25262a", muted:"#62646a", accent:"#686b73", accentStrong:"#4b4e55", track:"#c6c7ca" },
    inkPaper: { name:"Ink & Paper", preset:"ink-paper", bg:"#e5dccb", panel:"#f8f2e7", panelHover:"#dcd0bd", text:"#1f1c18", muted:"#5e564c", accent:"#6a6258", accentStrong:"#423c35", track:"#c7b9a5" },
    monochrome: { name:"Monochrome", preset:"monochrome", bg:"#171717", panel:"#252525", panelHover:"#333333", text:"#f5f5f5", muted:"#c2c2c2", accent:"#d0d0d0", accentStrong:"#ffffff", track:"#4a4a4a" },
    contrast: { name:"High Contrast", preset:"contrast", bg:"#000000", panel:"#111111", panelHover:"#222222", text:"#ffffff", muted:"#e8e8e8", accent:"#ffff00", accentStrong:"#ffff00", track:"#666666" }
  };
  const KEYS = ["bg","panel","panelHover","text","muted","accent","accentStrong","track"];
  const $ = id => document.getElementById(id);

  function load() {
    const pageDefault = document.body?.dataset.tool === "timer" ? TIMER_DEFAULT_THEME : DEFAULT_THEME;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && saved.bg && saved.text && saved.accent) return { ...pageDefault, ...saved };
    } catch {}
    return { ...pageDefault };
  }
  let theme = load();
  let originalTheme = null;

  function luminance(hex) {
    const value = String(hex).replace("#","");
    if (!/^[0-9a-f]{6}$/i.test(value)) return 0;
    const rgb = [0,2,4].map(i => parseInt(value.slice(i,i+2),16)/255);
    const linear = rgb.map(v => v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055,2.4));
    return linear.reduce((sum,v,i) => sum + v * [0.2126,0.7152,0.0722][i], 0);
  }
  function contrast(a,b) {
    const x=luminance(a), y=luminance(b);
    return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
  }
  function apply() {
    const root=document.documentElement;
    root.style.setProperty("--theme-bg",theme.bg);
    root.style.setProperty("--theme-panel",theme.panel);
    root.style.setProperty("--theme-panel-hover",theme.panelHover);
    root.style.setProperty("--theme-text",theme.text);
    root.style.setProperty("--theme-muted",theme.muted);
    root.style.setProperty("--theme-accent",theme.accent);
    root.style.setProperty("--theme-accent-strong",theme.accentStrong);
    root.style.setProperty("--theme-track",theme.track);
    root.style.setProperty("--theme-border","color-mix(in srgb, "+theme.text+" 12%, transparent)");
    document.body.dataset.theme=theme.preset;
  }
  function save(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(theme)); }
  function populate(){
    KEYS.forEach(key => {
      $("theme-"+key).value=theme[key];
      $("theme-"+key+"-value").textContent=theme[key];
    });
    updateContrast();
  }
  function updateContrast(){
    const bg=$("theme-bg").value, text=$("theme-text").value, muted=$("theme-muted").value, accent=$("theme-accent").value;
    $("theme-contrast").textContent="Text on background: "+contrast(text,bg).toFixed(1)+":1 · Muted text: "+contrast(muted,bg).toFixed(1)+":1 · Accent: "+contrast(accent,bg).toFixed(1)+":1. Higher ratios generally improve readability.";
  }
  function addDialog(){
    if(document.querySelector(".theme-button")) return;
    const button=document.createElement("button");
    button.type="button"; button.className="theme-button"; button.textContent="Appearance";
    button.setAttribute("aria-label","Customize appearance"); document.body.appendChild(button);

    const dialog=document.createElement("dialog");
    dialog.className="theme-dialog"; dialog.id="theme-dialog";
    dialog.innerHTML=`
      <form method="dialog" class="theme-card" id="theme-form">
        <div class="theme-header">
          <div><div class="eyebrow">TLC Storyworks · Appearance</div><h2>Customize appearance</h2></div>
          <button type="button" class="theme-close" id="theme-close" aria-label="Close">×</button>
        </div>
        <section class="theme-section">
          <h3>Theme presets</h3>
          <div class="theme-presets">${Object.entries(PRESETS).map(([key,p]) => `<button type="button" class="theme-preset" data-preset="${key}"><span class="theme-swatch" style="background:${p.accent}"></span>${p.name}</button>`).join("")}</div>
        </section>
        <section class="theme-section">
          <h3>Custom colors</h3>
          <div class="theme-custom-grid">
            ${[["Background","bg"],["Panels","panel"],["Panel hover","panelHover"],["Text","text"],["Muted text","muted"],["Accent","accent"],["Accent strong","accentStrong"],["Progress track","track"]].map(([label,key]) => `<label class="theme-field">${label}<span class="theme-field-row"><input id="theme-${key}" type="color" value="${theme[key]}"><code id="theme-${key}-value">${theme[key]}</code></span></label>`).join("")}
          </div>
          <p id="theme-contrast" class="theme-contrast"></p>
        </section>
        <div class="theme-actions">
          <button type="button" class="theme-reset" id="theme-reset">Reset to default</button>
          <span class="theme-spacer"></span>
          <button type="button" id="theme-cancel">Cancel</button>
          <button type="submit" class="theme-save">Save &amp; Apply</button>
        </div>
      </form>`;
    document.body.appendChild(dialog);

    function cancelChanges() {
      if (originalTheme) {
        theme = { ...originalTheme };
        apply();
      }
      originalTheme = null;
      dialog.close();
    }
    button.addEventListener("click",()=>{ originalTheme = { ...theme }; populate(); dialog.showModal(); });
    $("theme-close").addEventListener("click",cancelChanges);
    $("theme-cancel").addEventListener("click",cancelChanges);
    document.querySelectorAll(".theme-preset").forEach(btn=>btn.addEventListener("click",()=>{
      theme={...theme,...PRESETS[btn.dataset.preset]}; apply(); populate();
    }));
    KEYS.forEach(key=>$("theme-"+key).addEventListener("input",event=>{
      theme[key]=event.target.value; theme.preset="custom"; apply(); updateContrast(); $("theme-"+key+"-value").textContent=event.target.value;
    }));
    $("theme-reset").addEventListener("click",()=>{theme={...(document.body.dataset.tool === "timer" ? TIMER_DEFAULT_THEME : DEFAULT_THEME)};apply();populate();});
    $("theme-form").addEventListener("submit",event=>{event.preventDefault();save();originalTheme=null;dialog.close();});
    dialog.addEventListener("click",event=>{if(event.target===dialog)cancelChanges();});
  }

  apply();
  if(!document.body.classList.contains("viewer")&&!document.body.classList.contains("embed")) addDialog();
})();