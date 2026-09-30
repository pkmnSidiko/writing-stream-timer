(() => {
  "use strict";

  const STORAGE_KEY = "tlc-storyworks-word-tracker";
  const params = new URLSearchParams(location.search);
  const viewerMode = params.has("viewer");
  const embedMode = params.has("embed");

  if (viewerMode) document.body.classList.add("viewer");
  if (embedMode) document.body.classList.add("embed");

  const $ = id => document.getElementById(id);
  const dialogOpeners = new Map();

  function restoreDialogFocus(dialog) {
    const opener = dialogOpeners.get(dialog);
    dialogOpeners.delete(dialog);
    if (opener && document.contains(opener)) opener.focus();
  }

  function uid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function today() {
    const date = new Date();
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
  }

  function defaultProject() {
    return {
      projectName: "My Writing Project",
      goal: null,
      startingCount: 0,
      adjustment: 0,
      dailyTarget: null,
      startDate: "",
      endDate: "",
      entries: []
    };
  }

  function loadProject() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && Array.isArray(saved.entries)) {
        return {
          ...defaultProject(),
          ...saved,
          entries: saved.entries.map(entry => ({
            id: String(entry.id || uid()),
            date: String(entry.date || today()),
            words: Math.max(0, Math.round(Number(entry.words) || 0)),
            note: String(entry.note || ""),
            createdAt: String(entry.createdAt || "")
          }))
        };
      }
    } catch (error) {
      console.warn("Could not load saved word tracker data.", error);
    }
    return defaultProject();
  }

  let project = loadProject();

  function saveProject() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }

  function sumEntries() {
    return project.entries.reduce((sum, entry) => sum + entry.words, 0);
  }

  function currentTotal() {
    return Math.max(0, Math.round(Number(project.startingCount) || 0) + sumEntries() + (Number(project.adjustment) || 0));
  }

  function formatNumber(value) {
    return new Intl.NumberFormat().format(Math.max(0, Math.round(value)));
  }

  function formatDate(dateString, options) {
    if (!dateString) return "—";
    const date = new Date(dateString + "T12:00:00");
    return Number.isNaN(date.getTime()) ? dateString : new Intl.DateTimeFormat(undefined, options).format(date);
  }

  function daysBetween(start, end) {
    const a = new Date(start + "T12:00:00");
    const b = new Date(end + "T12:00:00");
    return Math.round((b - a) / 86400000);
  }

  function activeDays() {
    return new Set(project.entries.filter(entry => entry.words > 0).map(entry => entry.date)).size;
  }

  function daysRemaining() {
    if (!project.endDate) return null;
    return Math.max(0, daysBetween(today(), project.endDate));
  }

  function calculateRequiredPace() {
    if (!project.goal) return null;
    const remaining = Math.max(0, project.goal - currentTotal());
    if (!remaining) return 0;
    const days = daysRemaining();
    if (days === null) return null;
    return Math.ceil(remaining / Math.max(1, days + 1));
  }

  function todayTotal() {
    const date = today();
    return project.entries.filter(entry => entry.date === date).reduce((sum, entry) => sum + entry.words, 0);
  }

  function render() {
    const total = currentTotal();
    const todayWords = todayTotal();
    const goal = Number(project.goal) > 0 ? Number(project.goal) : null;
    const average = activeDays() ? Math.round(sumEntries() / activeDays()) : 0;
    const required = calculateRequiredPace();
    const remaining = daysRemaining();

    $("project-title").textContent = project.projectName || "Word Tracker";
    $("project-subtitle").textContent = goal
      ? formatNumber(goal) + " word goal" + (project.endDate ? " · due " + formatDate(project.endDate, { month: "short", day: "numeric", year: "numeric" }) : "")
      : "Track the words you add without giving the tool access to your manuscript.";

    $("current-total").textContent = formatNumber(total);
    $("goal-summary").textContent = goal ? formatNumber(Math.max(0, goal - total)) + " to go" : "No goal set";
    $("today-total").textContent = formatNumber(todayWords);
    $("today-target").textContent = project.dailyTarget ? formatNumber(project.dailyTarget) + " daily target" : "No daily target";
    $("average-total").textContent = formatNumber(average);
    $("required-pace").textContent = required === null ? "—" : formatNumber(required);
    $("days-remaining").textContent = remaining === null ? "No deadline" : remaining === 0 ? "Deadline today" : remaining + " day" + (remaining === 1 ? "" : "s") + " remaining";

    if (goal) {
      $("goal-section").hidden = false;
      const percent = Math.min(100, (total / goal) * 100);
      $("goal-progress-label").textContent = formatNumber(total) + " / " + formatNumber(goal) + " words";
      $("goal-progress-percent").textContent = Math.round(percent) + "%";
      $("goal-progress").style.width = percent + "%";
      $("goal-progress").parentElement.setAttribute("aria-valuenow", Math.round(percent));
    } else {
      $("goal-section").hidden = true;
    }

    renderHistory();
  }

  function renderHistory() {
    const list = $("history-list");
    list.innerHTML = "";
    const entries = [...project.entries].sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return String(b.createdAt).localeCompare(String(a.createdAt));
    });

    $("history-empty").hidden = entries.length > 0;

    entries.forEach(entry => {
      const row = document.createElement("div");
      row.className = "history-entry";

      const date = document.createElement("span");
      date.className = "entry-date";
      date.textContent = formatDate(entry.date, { month: "short", day: "numeric" });

      const content = document.createElement("div");
      const words = document.createElement("span");
      words.className = "entry-words";
      words.textContent = "+" + formatNumber(entry.words);
      content.appendChild(words);

      if (entry.note) {
        const note = document.createElement("span");
        note.className = "entry-note";
        note.textContent = entry.note;
        content.appendChild(note);
      }

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "entry-delete";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => {
        project.entries = project.entries.filter(item => item.id !== entry.id);
        saveProject();
        render();
      });

      row.append(date, content, remove);
      list.appendChild(row);
    });
  }

  function openDialog(dialog, opener = document.activeElement) {
    dialogOpeners.set(dialog, opener);
    if (!dialog.open) dialog.showModal();
  }

  function closeDialog(dialog) {
    if (dialog.open) dialog.close();
    restoreDialogFocus(dialog);
  }

  function populateSettings() {
    $("setting-project-name").value = project.projectName;
    $("setting-goal").value = project.goal ?? "";
    $("setting-starting-count").value = project.startingCount || 0;
    $("setting-daily-target").value = project.dailyTarget ?? "";
    $("setting-start-date").value = project.startDate || "";
    $("setting-end-date").value = project.endDate || "";
  }

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
    $("iframe-code").textContent = '<iframe src="' + embedUrl.href + '" width="100%" height="280" frameborder="0" title="Word Tracker"></iframe>';

    document.querySelectorAll(".copy-url").forEach(button => {
      button.addEventListener("click", async () => {
        const source = $(button.dataset.url).textContent;
        try {
          await navigator.clipboard.writeText(source);
          const original = button.textContent;
          button.textContent = "Copied!";
          setTimeout(() => { button.textContent = original; }, 1200);
        } catch {
          const original = button.textContent;
          button.textContent = "Copy failed";
          setTimeout(() => { button.textContent = original; }, 1500);
        }
      });
    });
  }

  $("add-words").addEventListener("click", () => {
    $("entry-words").value = "";
    $("entry-date").value = today();
    $("entry-note").value = "";
    openDialog($("entry-dialog"));
    setTimeout(() => $("entry-words").focus(), 0);
  });

  $("entry-form").addEventListener("submit", event => {
    event.preventDefault();
    const words = Math.max(1, Math.round(Number($("entry-words").value) || 0));
    if (!words) return;

    project.entries.push({
      id: uid(),
      date: $("entry-date").value || today(),
      words,
      note: $("entry-note").value.trim(),
      createdAt: new Date().toISOString()
    });

    saveProject();
    closeDialog($("entry-dialog"));
    render();
  });

  $("set-total").addEventListener("click", () => {
    $("total-words").value = currentTotal();
    openDialog($("total-dialog"));
    setTimeout(() => $("total-words").focus(), 0);
  });

  $("total-form").addEventListener("submit", event => {
    event.preventDefault();
    const desired = Math.max(0, Math.round(Number($("total-words").value) || 0));
    project.adjustment = desired - ((Number(project.startingCount) || 0) + sumEntries());
    saveProject();
    closeDialog($("total-dialog"));
    render();
  });

  $("settings").addEventListener("click", () => {
    populateSettings();
    openDialog($("settings-dialog"));
    setTimeout(() => $("setting-project-name").focus(), 0);
  });

  $("settings-form").addEventListener("submit", event => {
    event.preventDefault();
    const endDate = $("setting-end-date").value;
    const startDate = $("setting-start-date").value;

    if (startDate && endDate && endDate < startDate) {
      $("setting-end-date").setCustomValidity("End date must be on or after the start date.");
      $("setting-end-date").reportValidity();
      $("setting-end-date").setCustomValidity("");
      return;
    }

    project.projectName = $("setting-project-name").value.trim() || "My Writing Project";
    project.goal = Math.max(0, Math.round(Number($("setting-goal").value) || 0)) || null;
    project.startingCount = Math.max(0, Math.round(Number($("setting-starting-count").value) || 0));
    project.dailyTarget = Math.max(0, Math.round(Number($("setting-daily-target").value) || 0)) || null;
    project.startDate = startDate;
    project.endDate = endDate;

    saveProject();
    closeDialog($("settings-dialog"));
    render();
  });

  function wireClose(dialogId, closeId, cancelId) {
    const dialog = $(dialogId);
    $(closeId).addEventListener("click", () => closeDialog(dialog));
    $(cancelId).addEventListener("click", () => closeDialog(dialog));
    dialog.addEventListener("cancel", event => {
      event.preventDefault();
      closeDialog(dialog);
    });
    dialog.addEventListener("click", event => {
      if (event.target === dialog) closeDialog(dialog);
    });
  }

  wireClose("entry-dialog", "close-entry", "cancel-entry");
  wireClose("total-dialog", "close-total", "cancel-total");
  wireClose("settings-dialog", "close-settings", "cancel-settings");

  $("reset-project").addEventListener("click", () => {
    if (!window.confirm("Reset this word tracker? This removes the project settings and all logged entries.")) return;
    project = defaultProject();
    saveProject();
    closeDialog($("settings-dialog"));
    render();
  });

  $("clear-history").addEventListener("click", () => {
    if (!project.entries.length) return;
    if (!window.confirm("Remove all logged word entries? Your starting count and project settings will stay.")) return;
    project.entries = [];
    saveProject();
    render();
  });

  if (!viewerMode && !embedMode) setupUsageLinks();
  render();
})();