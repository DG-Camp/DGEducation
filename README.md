# Digital Generation Edu

A single-page working prototype of the platform described in the project docs — auth, course catalog,
lessons, quizzes, progress dashboard, certificate download, discussion, admin panel, and leaderboard —
built with React + TypeScript + Vite, using the **Waypoint Narrative** design tokens (Growth Blue /
Progress Green, Hanken Grotesk + JetBrains Mono, path/node visual language).

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

Demo accounts (see `src/data.ts`):
- `amina@digitalgen.edu` / `password123` (student)
- `admin@digitalgen.edu` / `admin123` (admin — unlocks the Admin panel tab)

## What's here

- `src/App.tsx` — the whole UI: navigation, auth, catalog, lesson/quiz flow, progress + certificate
  export (SVG), discussion, admin CRUD, and leaderboard. State persists to `localStorage`.
- `src/data.ts` — shared types (`User`, `Course`, `Lesson`, `Comment`, `ProgressState`) and seed content.
- `src/styles.css` — the design tokens and component styles pulled from the Waypoint Narrative system.
- `src/main.tsx` — entry point.

## Note on the team repo structure

The project docs (`digital-generation-edu-documentation.md`) describe a 10-person team build where each
module lives in its own folder (`frontend/src/modules/<name>/`) on its own git branch, talking to each
other only through shared interfaces. This app is currently one cohesive file rather than that structure —
that's fine for a working solo prototype/demo, but if you're handing pieces of this off to teammates on
separate branches per the docs, the natural next step is splitting `App.tsx` into:

```
src/
├── shared/
│   ├── types.ts        (from data.ts)
│   ├── components/      (Card, PathNode, Metric, CourseCard, EmptyState — already isolated as
│   │                     functions at the bottom of App.tsx)
├── modules/
│   ├── auth/
│   ├── courses/
│   ├── lessons/
│   ├── quiz/
│   ├── progress/
│   ├── certificate/
│   ├── discussion/
│   ├── admin/
│   └── leaderboard/
```

Say the word if you'd like me to do that split next — it's mechanical but sizeable, so I held off doing
it unasked.

## Where to put this

Copy everything in this folder into `C:\Users\Lucky\Desktop\projects\DG camp`, then run the commands
above from that folder. If you already have files there, back them up first — `npm install` will add a
`node_modules` folder and `package-lock.json`.
