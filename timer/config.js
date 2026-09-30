// Writing Stream Timer configuration
// Edit this file to customize the timer. No manuscript or writing content is ever read by this app.

const TIMER_CONFIG = {
  activePlan: "standard-session",
  streamName: "TLC Storyworks",

  plans: {
    "standard-session": {
      name: "Standard Writing Session",
      stages: [
        { name: "Setup", minutes: 10, writing: false },
        { name: "Writing Sprint 1", minutes: 25, writing: true },
        { name: "Break", minutes: 5, writing: false },
        { name: "Writing Sprint 2", minutes: 25, writing: true },
        { name: "Break", minutes: 5, writing: false },
        { name: "Writing Sprint 3", minutes: 25, writing: true },
        { name: "Wrap-Up", minutes: 10, writing: false }
      ]
    },

    "classic-25-5": {
      name: "Classic 25/5",
      stages: [
        { name: "Setup & Chat", minutes: 10, writing: false },
        { name: "Writing Sprint 1", minutes: 25, writing: true },
        { name: "Chat & Break", minutes: 5, writing: false },
        { name: "Writing Sprint 2", minutes: 25, writing: true },
        { name: "Chat & Break", minutes: 5, writing: false },
        { name: "Wrap-Up", minutes: 10, writing: false }
      ]
    }
  },

  display: {
    showWritingProgress: true,
    showStreamProgress: true,
    showNextStage: true,
    showPlanName: false
  },

  labels: {
    writingIcon: "Writing",
    breakIcon: "Break",
    nextPrefix: "Next",
    writingProgressLabel: "Writing progress",
    streamProgressLabel: "Stream progress"
  }
};

const TIMER_PLAN = TIMER_CONFIG.plans[TIMER_CONFIG.activePlan] || Object.values(TIMER_CONFIG.plans)[0];
