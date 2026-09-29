(() => {
  "use strict";

  const stages = TIMER_CONFIG.stages;
  const totalWritingSeconds = stages
    .filter(stage => stage.writing)
    .reduce((sum, stage) => sum + stage.minutes * 60, 0);

  const state = {
    stageIndex: 0,
    remaining: stages[0].minutes * 60,
    running: false,
    lastTick: null
  };

  const $ = id => document.getElementById(id);
  const viewerMode = new URLSearchParams(location.search).has("viewer");
  if (viewerMode) document.body.classList.add("viewer");

  function formatTime(seconds) {
    seconds = Math.max(0, Math.ceil(seconds));
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return String(minutes).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
  }

  function writingBlockNumber() {
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

  function render() {
    const stage = stages[state.stageIndex];
    const progress = Math.min(100, (completedWritingSeconds() / totalWritingSeconds) * 100);
    const next = stages[state.stageIndex + 1];

    $("stream-name").textContent = TIMER_CONFIG.streamName;
    $("stage-name").textContent = stage
      ? (stage.writing ? TIMER_CONFIG.labels.writingIcon : TIMER_CONFIG.labels.breakIcon) + " " + stage.name
      : "Finished";
    $("time").textContent = formatTime(state.remaining);
    $("progress-percent").textContent = Math.round(progress) + "%";
    $("writing-progress").style.width = progress + "%";
    $("writing-progress").parentElement.setAttribute("aria-valuenow", Math.round(progress));
    $("block-count").textContent = writingBlockNumber() + " / " +
      stages.filter(stage => stage.writing).length + " writing blocks";
    $("next-stage").textContent = next
      ? TIMER_CONFIG.labels.nextPrefix + ": " + next.name + " — " + formatTime(next.minutes * 60)
      : "All done!";
  }

  function tick(now) {
    if (!state.running) return;
    if (state.lastTick === null) state.lastTick = now;
    state.remaining -= (now - state.lastTick) / 1000;
    state.lastTick = now;

    if (state.remaining <= 0) advance();
    render();
    requestAnimationFrame(tick);
  }

  function start() {
    if (state.running) return;
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

  $("start").addEventListener("click", start);
  $("pause").addEventListener("click", pause);
  $("restart").addEventListener("click", restart);
  $("skip").addEventListener("click", () => { advance(); render(); });
  $("reset").addEventListener("click", reset);
  render();
})();
