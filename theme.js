(() => {
  "use strict";

  const STORAGE_KEY = "tlc-storyworks-theme";
  const DEFAULT_THEME = {
    preset: "tlc", bg:"#17131a", panel:"#241d29", panelHover:"#2d2433",
    text:"#f7f1f5", muted:"#c6b8c5", accent:"#d7a9c9", accentStrong:"#efc8df", track:"#3a2e3d"
  };
  const PRESETS = {
    tlc: { name:"TLC Storyworks", ...DEFAULT_THEME },
    light: { name:"Light", preset:"light", bg:"#f5f1f4", panel:"#ffffff", panelHover:"#eee7ec", text:"#241d29", muted:"#625966", accent:"#8b4f7b", accentStrong:"#6d3b60", track:"#ded4dc" },
    dark: { name:"Dark", preset:"dark", bg:"#0f1115", panel:"#1a1e25", panelHover:"#252b34", text:"#f4f6f8", muted:"#b7bec8", accent:"#8bb8ff", accentStrong:"#b5d2ff", track:"#343b47" },
    contrast: { name:"High Contrast", preset:"contrast", bg:"#000000", panel:"#111111", panelHover:"#222222", text:"#ffffff", muted:"#e8e8e8", accent:"#ffff00", accentStrong:"#ffff00", track:"#666666" }
  };
  const KEYS = ["bg","panel","panelHover","text","muted","accent","accentStrong","track"];
  const $ = id => document.getElementById(id);

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && saved.bg && saved.text && saved.accent) return { ...DEFAULT_THEME, ...saved };
    } catch {}
    return { ...DEFAULT_THEME };
  }
  let theme = load();

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
          <button type="button" class="theme-reset" id="theme-reset">Reset to TLC Storyworks</button>
          <span class="theme-spacer"></span>
          <button type="button" id="theme-cancel">Cancel</button>
          <button type="submit" class="theme-save">Save &amp; Apply</button>
        </div>
      </form>`;
    document.body.appendChild(dialog);

    button.addEventListener("click",()=>{ populate(); dialog.showModal(); });
    $("theme-close").addEventListener("click",()=>dialog.close());
    $("theme-cancel").addEventListener("click",()=>dialog.close());
    document.querySelectorAll(".theme-preset").forEach(btn=>btn.addEventListener("click",()=>{
      theme={...theme,...PRESETS[btn.dataset.preset]}; apply(); populate();
    }));
    KEYS.forEach(key=>$("theme-"+key).addEventListener("input",event=>{
      theme[key]=event.target.value; theme.preset="custom"; apply(); updateContrast(); $("theme-"+key+"-value").textContent=event.target.value;
    }));
    $("theme-reset").addEventListener("click",()=>{theme={...DEFAULT_THEME};apply();populate();});
    $("theme-form").addEventListener("submit",event=>{event.preventDefault();save();dialog.close();});
    dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
  }

  apply();
  if(!document.body.classList.contains("viewer")&&!document.body.classList.contains("embed")) addDialog();
})();