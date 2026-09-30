// Writing Stream Timer configuration
// Edit this file to customize the timer. No manuscript or writing content is ever read by this app.

const TIMER_CONFIG = {
  activePlan: "ceri-2-5-hour",
  streamName: "Writing With Ceri",

  plans: {
    "ceri-2-5-hour": {
      name: "Ceri's 2.5 Hour Writing Stream",
      stages: [
        { name: "Setup & Chat", minutes: 15, writing: false },
        { name: "Writing Sprint 1", minutes: 20, writing: true },
        { name: "Chat & Break", minutes: 10, writing: false },
        { name: "Writing Sprint 2", minutes: 20, writing: true },
        { name: "Chat & Break", minutes: 10, writing: false },
        { name: "Writing Sprint 3", minutes: 20, writing: true },
        { name: "Chat & Break", minutes: 10, writing: false },
        { name: "The Last Minute Stretch", minutes: 30, writing: true },
        { name: "Wrap-Up", minutes: 15, writing: false }
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
    writingIcon: "✍️",
    breakIcon: "☕",
    nextPrefix: "Next",
    writingProgressLabel: "Writing progress",
    streamProgressLabel: "Stream progress"
  }
};

const TIMER_PLAN = TIMER_CONFIG.plans[TIMER_CONFIG.activePlan] || Object.values(TIMER_CONFIG.plans)[0];
