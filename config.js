// Customize the timer here. No manuscript or writing content is ever read by this app.

const TIMER_CONFIG = {
  streamName: "Writing With Ceri",
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
  ],
  labels: {
    writingIcon: "✍️",
    breakIcon: "☕",
    nextPrefix: "Next"
  }
};
