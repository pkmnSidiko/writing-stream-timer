# TLC Storyworks Project Management Framework

The framework is the conceptual layer behind the Project Tracker and future project/progress tools.

It is a shared vocabulary, not a productivity methodology.

## Core model

Project
- identity
- goal / deadline
- current task
- milestones
- optional structure: chapters/sections and scenes
- writing/session log
- links / references
- notes

## Project
One creative undertaking. Core fields are name, type, status, description, goal, deadline, current task, and notes.

## Milestone
A meaningful checkpoint such as finishing an outline, completing a draft, sending to beta readers, or submitting work. A milestone has a title and completion state.

## Structure
Structure is optional. The first implementation uses chapters -> scenes. A chapter has a title, status, notes, and ordered scenes. A scene has a title, status, goal, and notes. Other structural types can be added later.

## Writing/session log
A history of work done without reading the manuscript. Entries contain date, activity, optional words, optional minutes, optional chapter, optional scene, and an optional note. The log is not a timer.

## Progress
The tracker provides a lightweight descriptive percentage based on available milestone and structural completion data. It is not a productivity score. Detailed word-count progress remains the Word Tracker's responsibility.

## Tool boundaries

- Writing Stream Timer: live session timing.
- Countdown: standalone deadlines/events.
- Word Tracker: detailed word-count history and pace.
- Project Tracker: project organization, structure, milestones, and work history.
- Future Chapter/Scene tools: specialized views over the same concepts.
- Future Challenge tools: may associate challenge work with projects without owning project data.

## Local-first rule

Project content remains browser-local unless explicitly exported or a future sharing system is deliberately added. Project data must not be placed into viewer URLs.

## Design principles

1. Useful without adopting a methodology.
2. Generic across creative work.
3. Small pieces rather than one giant application.
4. Manual-first and manuscript-independent.
5. Exportable and understandable.
6. Accessible and themeable.
7. Future-compatible without requiring future features today.
