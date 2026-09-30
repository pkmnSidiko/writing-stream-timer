(() => {
  "use strict";

  const STORAGE_KEY = "tlc-storyworks-writing-timer";
  const DEFAULT_CONFIG = JSON.parse(JSON.stringify(TIMER_CONFIG));
  const params = new URLSearchParams(location.search);
  const viewerMode = params.has("viewer");
  const embedMode = params.has("embed");

  if (viewerMode) document.body.classList.add("viewer");
  if (embedMode) document.body.classList.add("embed");

  const $ = id => document.getElementById(id);

  function setupUsageLinks() {
    const baseUrl = new URL(location.href);
    baseUrl.search = "";
    baseUrl.hash = "";
    const directUrl = baseUrl.href;
    const viewerUrl = new URL(directUrl);
    viewerUrl.search = "?viewer";
    const embedUrl = new URL(directUrl);
    embedUrl.search = "?embed";

    $("direct-url").textContent = directUrl;
    $("viewer-url").textContent = viewerUrl.href;
    $("embed-url").textContent = embedUrl.href;
    $("iframe-code").textContent = `<iframe src="${embedUrl.href}" width="100%" height="500" frameborder="0" title="Writing Stream Timer"></iframe>`;

    document.querySelectorAll(".copy-url").forEach(button => {
      button.addEventListener("click", async () => {
        const source = $(button.dataset.url).textContent;
        try {
          await navigator.clipboard.writeText(source);
          const original = button.textContent;
          button.textContent = "Copied!";
          setTimeout(() => { button.textContent = original; }, 1200);
        } catch {
          button.textContent = "Copy failed";
          setTimeout(() => { button.textContent = button.dataset.url === "iframe-code" ? "Copy iframe" : "Copy"; }, 1500);
        }
      });
    });
  }

  function loadConfig() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && saved.streamName && Array.isArray(saved.stages) && saved.stages.length) {
        // Migrate the old personal default without overwriting intentional custom names.
        if (saved.streamName === "Writing with Ceri") {
          saved.streamName = "TLC Storyworks";
          localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        }
        return normalizeConfig(saved);
      }
    } catch (error) {
      console.warn("Could not load saved timer settings.", error);
    }
    return normalizeConfig({
      ...TIMER_CONFIG,
      stages: TIMER_PLAN.stages
    });
  }

  function normalizeConfig(source) {
    return {
      streamName: String(source.streamName || "TLC Storyworks"),
      planName: String(source.planName || source.name || "Writing Session"),
      stages: source.stages.map(stage => ({
        name: String(stage.name || "Stage"),
        minutes: Math.max(1, Math.round(Number(stage.minutes) || 1)),
        writing: Boolean(stage.writing)
      })),
      display: {
        showWritingProgress: source.display?.showWritingProgress !== false,
        showStreamProgress: source.display?.showStreamProgress !== false,
        showNextStage: source.display?.showNextStage !== false,
        showPlanName: Boolean(source.display?.showPlanName)
      },
      labels: {
        writingIcon: source.labels?.writingIcon ?? "✍️",
        breakIcon: source.labels?.breakIcon ?? "☕",
        nextPrefix: source.labels?.nextPrefix ?? "Next",
        writingProgressLabel: source.labels?.writingProgressLabel ?? "Writing progress",
        streamProgressLabel: source.labels?.streamProgressLabel ?? "Stream progress"
      }
    };
  }

  let config = loadConfig();
  let stages = config.stages;
  let totalStreamSeconds = 0;
  let totalWritingSeconds = 0;

  const state = {
    stageIndex: 0,
    remaining: 0,
    running: false,
    lastTick: null
  };

  function recalculateTotals() {
    totalStreamSeconds = stages.reduce((sum, stage) => sum + stage.minutes * 60, 0);
    totalWritingSeconds = stages
      .filter(stage => stage.writing)
      .reduce((sum, stage) => sum + stage.minutes * 60, 0);
  }

  function formatTime(seconds) {
    seconds = Math.max(0, Math.ceil(seconds));
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return String(minutes).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
  }

  function writingStages() {
    return stages.filter(stage => stage.writing);
  }

  function writingBlockNumber() {
    if (!stages[state.stageIndex]) return writingStages().length;
    return stages.slice(0, state.stageIndex + 1).filter(stage => stage.writing).length;
  }

  function completedWritingSeconds() {
    return stages.slice(0, state.stageIndex)
      .filter(stage => stage.writing)
      .reduce((sum, stage) => sum + stage.minutes * 60, 0)
      + (stages[state.stageIndex]?.writing
        ? stages[state.stageIndex].minutes * 60 - state.remaining
        : 0);
  }

  function completedStreamSeconds() {
    return stages.slice(0, state.stageIndex)
      .reduce((sum, stage) => sum + stage.minutes * 60, 0)
      + (stages[state.stageIndex]
        ? stages[state.stageIndex].minutes * 60 - state.remaining
        : 0);
  }

  function setProgressVisibility() {
    $("writing-progress-wrap").hidden = !config.display.showWritingProgress;
    $("stream-progress-wrap").hidden = !config.display.showStreamProgress;
    $("next-stage").hidden = !config.display.showNextStage;
    $("plan-name").hidden = !config.display.showPlanName;
  }

  function render() {
    const stage = stages[state.stageIndex];
    const writingProgress = totalWritingSeconds
      ? Math.min(100, (completedWritingSeconds() / totalWritingSeconds) * 100)
      : 0;
    const streamProgress = totalStreamSeconds
      ? Math.min(100, (completedStreamSeconds() / totalStreamSeconds) * 100)
      : 0;
    const next = stages[state.stageIndex + 1];
    const writingCount = writingStages().length;

    $("stream-name").textContent = config.streamName;
    $("plan-name").textContent = config.planName;
    const stagePrefix = stage
      ? (stage.writing ? config.labels.writingIcon : config.labels.breakIcon).trim()
      : "";
    $("stage-name").textContent = stage
      ? (stagePrefix ? stagePrefix + " " : "") + stage.name
      : "Finished";
    $("time").textContent = formatTime(state.remaining);

    $("writing-progress-percent").textContent = Math.round(writingProgress) + "%";
    $("writing-progress").style.width = writingProgress + "%";
    $("writing-progress").parentElement.setAttribute("aria-valuenow", Math.round(writingProgress));
    $("writing-progress").parentElement.setAttribute("aria-label", config.labels.writingProgressLabel);
    $("writing-progress-label").textContent = config.labels.writingProgressLabel;
    $("block-count").textContent = writingBlockNumber() + " / " + writingCount + " writing blocks";

    $("stream-progress-percent").textContent = Math.round(streamProgress) + "%";
    $("stream-progress").style.width = streamProgress + "%";
    $("stream-progress").parentElement.setAttribute("aria-valuenow", Math.round(streamProgress));
    $("stream-progress").parentElement.setAttribute("aria-label", config.labels.streamProgressLabel);
    $("stream-progress-label").textContent = config.labels.streamProgressLabel;

    $("next-stage").textContent = next
      ? config.labels.nextPrefix + ": " + next.name + " — " + formatTime(next.minutes * 60)
      : "All done!";

    setProgressVisibility();
  }

  function tick(now) {
    if (!state.running) return;
    if (state.lastTick === null) state.lastTick = now;
    state.remaining -= (now - state.lastTick) / 1000;
    state.lastTick = now;

    if (state.remaining <= 0) advance();
    render();
    if (state.running) requestAnimationFrame(tick);
  }

  function start() {
    if (state.running || !stages.length) return;
    state.running = true;
    state.lastTick = null;
    requestAnimationFrame(tick);
  }

  function pause() {
    state.running = false;
    state.lastTick = null;
    render();
  }

  function restart() {
    if (!stages[state.stageIndex]) return;
    state.remaining = stages[state.stageIndex].minutes * 60;
    state.lastTick = null;
    render();
  }

  function reset() {
    state.running = false;
    state.stageIndex = 0;
    state.remaining = stages[0].minutes * 60;
    state.lastTick = null;
    render();
  }

  function advance() {
    if (state.stageIndex >= stages.length - 1) {
      state.running = false;
      state.remaining = 0;
      state.lastTick = null;
      return;
    }

    state.stageIndex += 1;
    state.remaining = stages[state.stageIndex].minutes * 60;
    state.lastTick = null;
  }

  function saveConfig() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }

  function applyConfig(nextConfig) {
    config = normalizeConfig(nextConfig);
    stages = config.stages;
    recalculateTotals();
    state.running = false;
    state.stageIndex = 0;
    state.remaining = stages[0].minutes * 60;
    state.lastTick = null;
    saveConfig();
    render();
  }

  function populateSettings() {
    $("setting-stream-name").value = config.streamName;
    $("setting-plan-name").value = config.planName;
    $("setting-writing-progress").checked = config.display.showWritingProgress;
    $("setting-stream-progress").checked = config.display.showStreamProgress;
    $("setting-next-stage").checked = config.display.showNextStage;
    $("setting-plan-display").checked = config.display.showPlanName;
    $("setting-writing-icon").value = config.labels.writingIcon;
    $("setting-break-icon").value = config.labels.breakIcon;
    $("setting-next-prefix").value = config.labels.nextPrefix;
    $("setting-writing-label").value = config.labels.writingProgressLabel;
    $("setting-stream-label").value = config.labels.streamProgressLabel;
    renderStageEditors();
  }

  function renderStageEditors() {
    const list = $("stage-list");
    list.innerHTML = "";

    config.stages.forEach((stage, index) => {
      const row = document.createElement("div");
      row.className = "stage-editor";
      row.innerHTML = `
        <div class="stage-number">${index + 1}</div>
        <label class="stage-name-input">Name<input type="text" data-field="name" maxlength="80" value="${escapeAttribute(stage.name)}"></label>
        <label class="stage-minutes">Minutes<input type="number" data-field="minutes" min="1" max="1440" step="1" value="${stage.minutes}"></label>
        <label class="stage-writing"><input type="checkbox" data-field="writing" ${stage.writing ? "checked" : ""}> Writing</label>
        <button type="button" class="icon-button remove-stage" title="Remove stage" aria-label="Remove stage">×</button>
      `;

      row.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", () => updateStageFromEditor(row, index));
        input.addEventListener("change", () => updateStageFromEditor(row, index));
      });
      row.querySelector(".remove-stage").addEventListener("click", () => {
        if (config.stages.length <= 1) return;
        config.stages.splice(index, 1);
        renderStageEditors();
      });
      list.appendChild(row);
    });
  }

  function escapeAttribute(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function updateStageFromEditor(row, index) {
    const stage = config.stages[index];
    if (!stage) return;
    stage.name = row.querySelector('[data-field="name"]').value;
    stage.minutes = Math.max(1, Math.round(Number(row.querySelector('[data-field="minutes"]').value) || 1));
    stage.writing = row.querySelector('[data-field="writing"]').checked;
  }

  function readSettingsForm() {
    config.streamName = $("setting-stream-name").value.trim() || "TLC Storyworks";
    config.planName = $("setting-plan-name").value.trim() || "Writing Session";
    config.display = {
      showWritingProgress: $("setting-writing-progress").checked,
      showStreamProgress: $("setting-stream-progress").checked,
      showNextStage: $("setting-next-stage").checked,
      showPlanName: $("setting-plan-display").checked
    };
    config.labels = {
      writingIcon: $("setting-writing-icon").value || "✍️",
      breakIcon: $("setting-break-icon").value || "☕",
      nextPrefix: $("setting-next-prefix").value.trim() || "Next",
      writingProgressLabel: $("setting-writing-label").value.trim() || "Writing progress",
      streamProgressLabel: $("setting-stream-label").value.trim() || "Stream progress"
    };
    config.stages.forEach(stage => {
      stage.name = stage.name.trim() || "Stage";
      stage.minutes = Math.max(1, Math.round(Number(stage.minutes) || 1));
    });
    return config;
  }

  function openSettings() {
    if (viewerMode || embedMode) return;
    populateSettings();
    $("settings-dialog").showModal();
  }

  function closeSettings() {
    $("settings-dialog").close();
  }

  $("start").addEventListener("click", start);
  $("pause").addEventListener("click", pause);
  $("restart").addEventListener("click", restart);
  $("skip").addEventListener("click", () => { advance(); render(); });
  $("reset").addEventListener("click", reset);
  $("configure").addEventListener("click", openSettings);
  $("close-settings").addEventListener("click", closeSettings);
  $("cancel-settings").addEventListener("click", closeSettings);

  $("add-stage").addEventListener("click", () => {
    config.stages.push({
      name: "New Stage",
      minutes: 10,
      writing: false
    });
    renderStageEditors();
  });

  $("restore-defaults").addEventListener("click", () => {
    config = normalizeConfig({
      ...DEFAULT_CONFIG,
      stages: DEFAULT_CONFIG.plans[DEFAULT_CONFIG.activePlan]?.stages || DEFAULT_CONFIG.stages
    });
    populateSettings();
  });

  $("settings-form").addEventListener("submit", event => {
    event.preventDefault();
    applyConfig(readSettingsForm());
    closeSettings();
  });

  $("settings-dialog").addEventListener("click", event => {
    if (event.target === $("settings-dialog")) closeSettings();
  });

  if (viewerMode || embedMode) $("configure").style.display = "none";

  recalculateTotals();
  state.remaining = stages[0].minutes * 60;
  if (!viewerMode && !embedMode) setupUsageLinks();
  render();
})();