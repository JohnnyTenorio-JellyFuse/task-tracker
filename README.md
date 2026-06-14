# Task Tracker

A single-file, self-contained to-do list app — vanilla HTML, CSS, and JavaScript with zero dependencies and no build step.

---

## Run It

Open `index.html` directly in any browser. That's it.

---

## Architecture

- **State** — Tasks stored as a JSON array in `localStorage` under the key `tasks`. Each task: `{ id: number (Date.now()), text: string, done: boolean }`.
- **Rendering** — A single `render()` function rebuilds the task list DOM on every state change. Filter state (`all` / `active` / `done`) is held in a module-level variable.
- **Event handling** — Uses event delegation on the task list container for toggle, delete, and double-click-to-edit interactions.
- **Inline editing** — Double-clicking a task replaces its text with an input field; commits on blur or Enter, cancels on Escape.
- **XSS protection** — All task text is escaped before being injected into the DOM via `innerHTML`.

---

## Why this is here

A minimal example of building a small interactive app with correct state management, event delegation, and basic security hygiene (XSS escaping) without reaching for a framework.
