(() => {
  "use strict";
  const STORAGE_KEY = "tlc-storyworks-countdown";
  const DEFAULTS = { label:"Countdown", mode:"duration", hours:0, minutes:10, seconds:0, target:"", countUp:true };
  const viewerMode = TLC_EMBED.viewer, embedMode = TLC_EMBED.embed;
  TLC_EMBED.applyMode();
  const $ = id => document.getElementById(id);
  const state = { config:loadConfig(), remaining:0, running:false, finished:false, lastTick:null, lastTimeLabel:null, settingsOpener:null };

  function normalize(source) {
    return {
      label:String(source.label || DEFAULTS.label),
      mode:source.mode === "target" ? "target" : "duration",
      hours:Math.max(0,Math.min(999,Math.round(Number(source.hours)||0))),
      minutes:Math.max(0,Math.min(59,Math.round(Number(source.minutes)||0))),
      seconds:Math.max(0,Math.min(59,Math.round(Number(source.seconds)||0))),
      target:String(source.target || ""),
      countUp:source.countUp !== false
    };
  }
  function loadConfig() {
    try { const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)); if(saved && typeof saved==="object") return normalize(saved); } catch {}
    return normalize(DEFAULTS);
  }
  function saveConfig() { localStorage.setItem(STORAGE_KEY,JSON.stringify(state.config)); }
  function durationSeconds(c=state.config) { return c.hours*3600+c.minutes*60+c.seconds; }
  function targetSeconds() { const t=Date.parse(state.config.target); return Number.isFinite(t) ? Math.max(0,(t-Date.now())/1000) : 0; }
  function formatTime(total) {
    const s=Math.max(0,Math.floor(total)), h=Math.floor(s/3600), m=Math.floor((s%3600)/60), sec=s%60;
    return h>0 ? String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")+":"+String(sec).padStart(2,"0") : String(m).padStart(2,"0")+":"+String(sec).padStart(2,"0");
  }
  function announce(message) { $("live-status").textContent=""; requestAnimationFrame(()=>{$("live-status").textContent=message;}); }
  function resetState() { state.running=false; state.finished=false; state.lastTick=null; state.remaining=state.config.mode==="target"?targetSeconds():durationSeconds(); render(); }
  function render() {
    const display=Math.max(0,state.finished && state.config.countUp ? -state.remaining : state.remaining);
    $("countdown-label").textContent=state.config.label;
    $("countdown-title").textContent=state.finished ? (state.config.countUp ? "Time's up" : "Finished") : (state.running ? "Running" : "Ready");
    $("time").textContent=formatTime(display);
    const unit=display===1?"second":"seconds";
    $("time").setAttribute("aria-label",state.finished && state.config.countUp ? display+" "+unit+" elapsed" : display+" "+unit+" remaining");
    $("countdown-status").textContent=state.finished ? (state.config.countUp ? "Elapsed since the countdown ended." : "The countdown has finished.") : (state.running ? "Counting down." : "Ready to start.");
    $("start").disabled=state.running; $("pause").disabled=!state.running;
  }
  function tick(now) {
    if(!state.running) return;
    if(state.config.mode==="target") state.remaining=(Date.parse(state.config.target)-Date.now())/1000;
    else { if(state.lastTick===null) state.lastTick=now; state.remaining-=(now-state.lastTick)/1000; state.lastTick=now; }
    if(state.remaining<=0) { state.running=false; state.finished=true; state.lastTick=null; announce("Countdown finished."); }
    render(); if(state.running) requestAnimationFrame(tick);
  }
  function start() {
    if(state.running) return;
    if(state.finished) resetState();
    if(state.config.mode==="target" && targetSeconds()<=0) { announce("Choose a future target time before starting."); return; }
    if(state.config.mode==="duration" && durationSeconds()<=0) { announce("Set a duration greater than zero before starting."); return; }
    state.running=true; state.finished=false; state.lastTick=null; announce("Countdown started."); requestAnimationFrame(tick); render();
  }
  function pause() { if(!state.running)return; state.running=false; state.lastTick=null; announce("Countdown paused."); render(); }
  function reset() { resetState(); announce("Countdown reset."); }
  function openSettings() { if(viewerMode||embedMode)return; state.settingsOpener=document.activeElement; populateSettings(); $("settings-dialog").showModal(); $("setting-label").focus(); }
  function populateSettings() { const c=state.config; $("setting-label").value=c.label; $("setting-mode").value=c.mode; $("setting-hours").value=c.hours; $("setting-minutes").value=c.minutes; $("setting-seconds").value=c.seconds; $("setting-target").value=c.target; $("setting-count-up").checked=c.countUp; toggleModeFields(); }
  function toggleModeFields() { const target=$("setting-mode").value==="target"; $("duration-fields").hidden=target; $("target-fields").hidden=!target; }
  function restoreDefaults() { state.config=normalize(DEFAULTS); saveConfig(); resetState(); populateSettings(); announce("Default countdown settings restored."); }
  function saveSettings() {
    const next=normalize({label:$("setting-label").value.trim()||DEFAULTS.label,mode:$("setting-mode").value,hours:$("setting-hours").value,minutes:$("setting-minutes").value,seconds:$("setting-seconds").value,target:$("setting-target").value,countUp:$("setting-count-up").checked});
    if(next.mode==="duration" && durationSeconds(next)<=0) { announce("Set a duration greater than zero."); return false; }
    if(next.mode==="target" && (!next.target || !Number.isFinite(Date.parse(next.target)))) { announce("Choose a valid target date and time."); return false; }
    state.config=next; saveConfig(); resetState(); return true;
  }
  function closeSettings() { $("settings-dialog").close(); if(state.settingsOpener && document.contains(state.settingsOpener)) state.settingsOpener.focus(); state.settingsOpener=null; }
  function setupUsageLinks() {
    const directUrl=TLC_EMBED.url(), viewerUrl=TLC_EMBED.url("viewer"), embedUrl=TLC_EMBED.url("embed");
    $("direct-url").textContent=directUrl; $("viewer-url").textContent=viewerUrl; $("embed-url").textContent=embedUrl;
    $("iframe-code").textContent='<iframe src="'+embedUrl+'" width="100%" height="260" frameborder="0" title="TLC Storyworks Countdown"></iframe>';
    document.querySelectorAll(".copy-url").forEach(button=>button.addEventListener("click",async()=>{
      const source=$(button.dataset.url).textContent;
      try { await navigator.clipboard.writeText(source); const original=button.textContent; button.textContent="Copied!"; announce(button.dataset.url==="iframe-code"?"Iframe code copied.":"URL copied."); setTimeout(()=>button.textContent=original,1200); }
      catch { button.textContent="Copy failed"; announce("Copy failed."); setTimeout(()=>button.textContent="Copy",1500); }
    }));
  }
  $("start").addEventListener("click",start); $("pause").addEventListener("click",pause); $("reset").addEventListener("click",reset); $("configure").addEventListener("click",openSettings);
  $("setting-mode").addEventListener("change",toggleModeFields); $("close-settings").addEventListener("click",closeSettings); $("cancel-settings").addEventListener("click",closeSettings);
  $("settings-dialog").addEventListener("cancel",e=>{e.preventDefault();closeSettings();});
  $("settings-form").addEventListener("submit",e=>{e.preventDefault();if(saveSettings()){closeSettings();announce("Countdown settings saved.");render();}});
  $("restore-defaults").addEventListener("click",restoreDefaults);
  resetState(); if(!viewerMode&&!embedMode) setupUsageLinks(); render();
})();