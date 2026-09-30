(() => {
  "use strict";

  const STORAGE_KEY = "tlc-storyworks-theme";
  const DEFAULT_THEME = {
    preset: "tlc", bg:"#17131a", panel:"#241d29", panelHover:"#2d2433", text:"#f7f1f5", muted:"#c6b8c5", accent:"#d7a9c9", accentStrong:"#efc8df", track:"#3a2e3d",
    fontFamily:"dm-sans", headingFontFamily:"libre-baskerville", textScale:"1", lineHeight:"1.6"
  };
  const TIMER_DEFAULT_THEME = {
    name:"Timer Neutral", preset:"neutral", bg:"#f2f2f0", panel:"#ffffff", panelHover:"#e7e7e4", text:"#202020", muted:"#5f5f5b", accent:"#555555", accentStrong:"#303030", track:"#d0d0cc",
    fontFamily:"system-sans", headingFontFamily:"system-serif", textScale:"1", lineHeight:"1.6"
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
  const FONT_OPTIONS = {
    "system-sans": { label:"System Sans", family:"system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif", google:null },
    "system-serif": { label:"System Serif", family:"Georgia, \"Times New Roman\", serif", google:null },
    "dm-sans": { label:"DM Sans", family:"\"DM Sans\", system-ui, sans-serif", google:"DM+Sans:wght@400;500;700" },
    "atkinson": { label:"Atkinson Hyperlegible", family:"\"Atkinson Hyperlegible\", system-ui, sans-serif", google:"Atkinson+Hyperlegible:wght@400;700" },
    "nunito-sans": { label:"Nunito Sans", family:"\"Nunito Sans\", system-ui, sans-serif", google:"Nunito+Sans:wght@400;600;700" },
    "lora": { label:"Lora", family:"\"Lora\", Georgia, serif", google:"Lora:wght@400;500;600;700" },
    "libre-baskerville": { label:"Libre Baskerville", family:"\"Libre Baskerville\", Georgia, serif", google:"Libre+Baskerville:wght@400;700" },
    "jetbrains-mono": { label:"JetBrains Mono", family:"\"JetBrains Mono\", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", google:"JetBrains+Mono:wght@400;500;700" }
  };
  const TEXT_SCALE_OPTIONS = [["0.9","90%"],["1","100%"],["1.1","110%"],["1.25","125%"],["1.5","150%"]];
  const LINE_HEIGHT_OPTIONS = [["1.4","Compact"],["1.6","Comfortable"],["1.8","Relaxed"],["2","Loose"]];
  const $ = id => document.getElementById(id);
  function load() {
    const pageDefault = document.body?.dataset.tool === "timer" ? TIMER_DEFAULT_THEME : DEFAULT_THEME;
    try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); if (saved && saved.bg && saved.text && saved.accent) return { ...pageDefault, ...saved }; }
    catch {}
    return { ...pageDefault };
  }
  let theme = load(), originalTheme = null;
  function luminance(hex) { const value=String(hex).replace("#",""); if(!/^[0-9a-f]{6}$/i.test(value)) return 0; const rgb=[0,2,4].map(i=>parseInt(value.slice(i,i+2),16)/255); const linear=rgb.map(v=>v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)); return linear.reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0); }
  function contrast(a,b) { const x=luminance(a),y=luminance(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); }
  function loadFonts() { const families=[...new Set([theme.fontFamily,theme.headingFontFamily])].map(key=>FONT_OPTIONS[key]?.google).filter(Boolean); const href=families.length?"https://fonts.googleapis.com/css2?family="+families.join("&family=")+"&display=swap":""; let link=document.getElementById("tlc-google-fonts"); if(!href){if(link)link.remove();return;} if(!link){link=document.createElement("link");link.id="tlc-google-fonts";link.rel="stylesheet";document.head.appendChild(link);} if(link.href!==new URL(href,document.baseURI).href)link.href=href; }
  function apply() { const root=document.documentElement; root.style.setProperty("--theme-bg",theme.bg); root.style.setProperty("--theme-panel",theme.panel); root.style.setProperty("--theme-panel-hover",theme.panelHover); root.style.setProperty("--theme-text",theme.text); root.style.setProperty("--theme-muted",theme.muted); root.style.setProperty("--theme-accent",theme.accent); root.style.setProperty("--theme-accent-strong",theme.accentStrong); root.style.setProperty("--theme-track",theme.track); root.style.setProperty("--theme-border","color-mix(in srgb, "+theme.text+" 12%, transparent)"); const bodyFont=FONT_OPTIONS[theme.fontFamily]||FONT_OPTIONS["system-sans"], headingFont=FONT_OPTIONS[theme.headingFontFamily]||FONT_OPTIONS["system-serif"]; root.style.setProperty("--theme-font-family",bodyFont.family); root.style.setProperty("--theme-heading-font-family",headingFont.family); root.style.setProperty("--theme-text-scale",theme.textScale||"1"); root.style.setProperty("--theme-line-height",theme.lineHeight||"1.6"); loadFonts(); document.body.dataset.theme=theme.preset; }
  function save(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(theme)); window.dispatchEvent(new CustomEvent("tlc-theme-changed",{detail:{preset:theme.preset}})); }
  function populate(){ KEYS.forEach(key=>{$("theme-"+key).value=theme[key];$("theme-"+key+"-value").textContent=theme[key];}); $("theme-font-family").value=theme.fontFamily;$("theme-heading-font-family").value=theme.headingFontFamily;$("theme-text-scale").value=theme.textScale;$("theme-line-height").value=theme.lineHeight;updateContrast(); }
  function updateContrast(){ const bg=$("theme-bg").value,text=$("theme-text").value,muted=$("theme-muted").value,accent=$("theme-accent").value; $("theme-contrast").textContent="Text on background: "+contrast(text,bg).toFixed(1)+":1 · Muted text: "+contrast(muted,bg).toFixed(1)+":1 · Accent: "+contrast(accent,bg).toFixed(1)+":1. Higher ratios generally improve readability."; }
  function addDialog(){
    if(document.querySelector(".theme-button"))return;
    const button=document.createElement("button"); button.type="button";button.className="theme-button";button.textContent="Appearance";button.setAttribute("aria-label","Customize appearance");document.body.appendChild(button);
    const dialog=document.createElement("dialog");dialog.className="theme-dialog";dialog.id="theme-dialog";dialog.setAttribute("aria-labelledby","theme-dialog-title");
    const form=document.createElement("form");form.method="dialog";form.className="theme-card";form.id="theme-form";
    const header=document.createElement("div");header.className="theme-header";const headerTitle=document.createElement("div");const eyebrow=document.createElement("div");eyebrow.className="eyebrow";eyebrow.textContent="TLC Storyworks · Appearance";const heading=document.createElement("h2");heading.id="theme-dialog-title";heading.textContent="Customize appearance";headerTitle.append(eyebrow,heading);const closeButton=document.createElement("button");closeButton.type="button";closeButton.className="theme-close";closeButton.id="theme-close";closeButton.setAttribute("aria-label","Close");closeButton.textContent="×";header.append(headerTitle,closeButton);
    const presetsSection=document.createElement("section");presetsSection.className="theme-section";const presetsHeading=document.createElement("h3");presetsHeading.textContent="Theme presets";const presetsGrid=document.createElement("div");presetsGrid.className="theme-presets";
    Object.entries(PRESETS).forEach(([key,p])=>{const presetButton=document.createElement("button");presetButton.type="button";presetButton.className="theme-preset";presetButton.dataset.preset=key;const swatch=document.createElement("span");swatch.className="theme-swatch";swatch.style.background=p.accent;presetButton.append(swatch,document.createTextNode(p.name));presetsGrid.appendChild(presetButton);}); presetsSection.append(presetsHeading,presetsGrid);
    const customSection=document.createElement("section");customSection.className="theme-section";const customHeading=document.createElement("h3");customHeading.textContent="Custom colors";const customGrid=document.createElement("div");customGrid.className="theme-custom-grid";const colorFields=[["Background","bg"],["Panels","panel"],["Panel hover","panelHover"],["Text","text"],["Muted text","muted"],["Accent","accent"],["Accent strong","accentStrong"],["Progress track","track"]];
    colorFields.forEach(([label,key])=>{const field=document.createElement("label");field.className="theme-field";field.appendChild(document.createTextNode(label));const row=document.createElement("span");row.className="theme-field-row";const input=document.createElement("input");input.id="theme-"+key;input.type="color";input.value=theme[key];const value=document.createElement("code");value.id="theme-"+key+"-value";value.textContent=theme[key];row.append(input,value);field.appendChild(row);customGrid.appendChild(field);}); const contrastText=document.createElement("p");contrastText.id="theme-contrast";contrastText.className="theme-contrast";customSection.append(customHeading,customGrid,contrastText);
    const typographySection=document.createElement("section");typographySection.className="theme-section";const typographyHeading=document.createElement("h3");typographyHeading.textContent="Typography";const typographyGrid=document.createElement("div");typographyGrid.className="theme-typography-grid";const selectField=(labelText,id,options,value)=>{const field=document.createElement("label");field.className="theme-field";field.appendChild(document.createTextNode(labelText));const select=document.createElement("select");select.id=id;options.forEach(([optionValue,label])=>{const option=document.createElement("option");option.value=optionValue;option.textContent=label;select.appendChild(option);});select.value=value;field.appendChild(select);return field;};const fontOptions=Object.entries(FONT_OPTIONS).map(([key,font])=>[key,font.label]);typographyGrid.append(selectField("Body font","theme-font-family",fontOptions,theme.fontFamily),selectField("Heading font","theme-heading-font-family",fontOptions,theme.headingFontFamily),selectField("Text size","theme-text-scale",TEXT_SCALE_OPTIONS,theme.textScale),selectField("Line spacing","theme-line-height",LINE_HEIGHT_OPTIONS,theme.lineHeight));const typographyHelp=document.createElement("p");typographyHelp.className="theme-typography-help";typographyHelp.textContent="Font choices use Google Fonts when available and fall back to system fonts. No manuscript or writing content is sent to Google Fonts.";typographySection.append(typographyHeading,typographyGrid,typographyHelp);
    const actions=document.createElement("div");actions.className="theme-actions";const resetButton=document.createElement("button");resetButton.type="button";resetButton.className="theme-reset";resetButton.id="theme-reset";resetButton.textContent="Reset to default";const spacer=document.createElement("span");spacer.className="theme-spacer";const cancelButton=document.createElement("button");cancelButton.type="button";cancelButton.id="theme-cancel";cancelButton.textContent="Cancel";const saveButton=document.createElement("button");saveButton.type="submit";saveButton.className="theme-save";saveButton.textContent="Save & Apply";actions.append(resetButton,spacer,cancelButton,saveButton);
    form.append(header,presetsSection,customSection,typographySection,actions);dialog.appendChild(form);document.body.appendChild(dialog);
    function cancelChanges(){if(originalTheme){theme={...originalTheme};apply();}originalTheme=null;dialog.close();}
    button.addEventListener("click",()=>{originalTheme={...theme};populate();dialog.showModal();requestAnimationFrame(()=>closeButton.focus());});
    $("theme-close").addEventListener("click",cancelChanges);$("theme-cancel").addEventListener("click",cancelChanges);
    document.querySelectorAll(".theme-preset").forEach(btn=>btn.addEventListener("click",()=>{theme={...theme,...PRESETS[btn.dataset.preset]};apply();populate();}));
    KEYS.forEach(key=>$("theme-"+key).addEventListener("input",event=>{theme[key]=event.target.value;theme.preset="custom";apply();updateContrast();$("theme-"+key+"-value").textContent=event.target.value;}));
    $("theme-font-family").addEventListener("change",event=>{theme.fontFamily=event.target.value;theme.preset="custom";apply();});$("theme-heading-font-family").addEventListener("change",event=>{theme.headingFontFamily=event.target.value;theme.preset="custom";apply();});$("theme-text-scale").addEventListener("change",event=>{theme.textScale=event.target.value;theme.preset="custom";apply();});$("theme-line-height").addEventListener("change",event=>{theme.lineHeight=event.target.value;theme.preset="custom";apply();});
    $("theme-reset").addEventListener("click",()=>{theme={...(document.body.dataset.tool === "timer" ? TIMER_DEFAULT_THEME : DEFAULT_THEME)};apply();populate();});
    $("theme-form").addEventListener("submit",event=>{event.preventDefault();save();originalTheme=null;dialog.close();button.focus();});
    dialog.addEventListener("cancel",event=>{event.preventDefault();cancelChanges();button.focus();});dialog.addEventListener("click",event=>{if(event.target===dialog){cancelChanges();button.focus();}});
  }
  apply(); if(!document.body.classList.contains("viewer")&&!document.body.classList.contains("embed"))addDialog();
})();