(() => {
  "use strict";

  const STORAGE_KEY = "tlc-storyworks-ceri-writing-timer-sound";
  const $ = id => document.getElementById(id);
  let audioContext = null;
  let soundEnabled = true;
  let soundVolume = 0.55;

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      soundEnabled = saved.enabled !== false;
      soundVolume = Number.isFinite(saved.volume) ? Math.min(1, Math.max(0, saved.volume)) : 0.55;
    }
  } catch {}

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ enabled: soundEnabled, volume: soundVolume }));
  }

  function getAudioContext() {
    if (!audioContext) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return null;
      audioContext = new AudioCtor();
    }
    if (audioContext.state === "suspended") audioContext.resume();
    return audioContext;
  }

  function tone(frequency, start, duration, volume, type = "sine") {
    const ctx = getAudioContext();
    if (!ctx || !soundEnabled) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + start);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * soundVolume), ctx.currentTime + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(ctx.currentTime + start);
    oscillator.stop(ctx.currentTime + start + duration + 0.02);
  }

  function playSound(kind) {
    if (!soundEnabled) return;
    if (kind === "work") {
      tone(659.25, 0, 0.22, 0.7);
      tone(783.99, 0.2, 0.28, 0.65);
    } else if (kind === "break") {
      tone(783.99, 0, 0.18, 0.65);
      tone(659.25, 0.18, 0.18, 0.55);
      tone(523.25, 0.36, 0.3, 0.5);
    } else if (kind === "longBreak") {
      tone(659.25, 0, 0.2, 0.65);
      tone(783.99, 0.22, 0.2, 0.65);
      tone(987.77, 0.44, 0.28, 0.6);
    } else if (kind === "complete") {
      tone(523.25, 0, 0.22, 0.55);
      tone(659.25, 0.25, 0.22, 0.55);
      tone(783.99, 0.5, 0.22, 0.6);
      tone(1046.5, 0.75, 0.45, 0.65);
    }
  }

  function stageSound(stageName) {
    const name = String(stageName || "").toLowerCase();
    if (name === "finished") return "complete";
    if (name.includes("long break")) return "longBreak";
    if (name.includes("break")) return "break";
    return "work";
  }

  function addControls() {
    const controls = document.querySelector(".controls");
    if (!controls || $("sound-controls")) return;

    const panel = document.createElement("div");
    panel.id = "sound-controls";
    panel.className = "sound-controls";
    panel.setAttribute("aria-label", "Timer sound settings");
    panel.innerHTML = `
      <label class="sound-toggle"><input id="sound-enabled" type="checkbox"> Sound cues</label>
      <label class="sound-volume"><span>Volume</span><input id="sound-volume" type="range" min="0" max="1" step="0.05" value="${soundVolume}" aria-label="Sound volume"></label>
      <button type="button" id="sound-test" class="secondary">Test sound</button>
    `;
    controls.insertAdjacentElement("afterend", panel);

    $("sound-enabled").checked = soundEnabled;
    $("sound-enabled").addEventListener("change", event => {
      soundEnabled = event.target.checked;
      save();
      if (soundEnabled) { getAudioContext(); playSound("work"); }
    });
    $("sound-volume").addEventListener("input", event => {
      soundVolume = Number(event.target.value);
      save();
    });
    $("sound-test").addEventListener("click", () => {
      getAudioContext();
      playSound("break");
    });
  }

  function setup() {
    if (new URLSearchParams(location.search).has("viewer")) return;
    addControls();

    const stageElement = $("stage-name");
    const startButton = $("start");
    if (!stageElement || !startButton) return;

    let previousStage = stageElement.textContent.trim();
    startButton.addEventListener("click", () => {
      getAudioContext();
      playSound(stageSound(stageElement.textContent));
    });

    const observer = new MutationObserver(() => {
      const currentStage = stageElement.textContent.trim();
      if (!currentStage || currentStage === previousStage) return;
      previousStage = currentStage;
      getAudioContext();
      playSound(stageSound(currentStage));
    });
    observer.observe(stageElement, { childList: true, characterData: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup);
  else setup();
})();
