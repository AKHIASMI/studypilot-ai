# StudyPilot AI (VS Code template)

Plan. Adapt. Achieve.

## Run it
1. Unzip and double-click `studypilot-ai.code-workspace` (or File > Open Folder).
2. Install the recommended extensions when VS Code asks.
3. Pick one:
   - **Live Server:** right-click `index.html` > Open with Live Server
   - **Terminal:** `npm start` (needs Node.js), then open http://localhost:3000
   - **Simplest:** double-click `index.html`

No build step. Plain HTML, CSS and JavaScript.

## Structure
```
index.html             app shell (loads the scripts in order)
css/styles.css         all styles, light + dark theme
js/01-core.js          state, storage, helpers
js/02-priority.js      priority scoring and reasons
js/03-scheduler.js     7-day scheduler, plan diffs
js/04-syllabus-tasks.js  topics, revision, practice tests
js/05-overload.js      "more work than time" warning
js/06-actions.js       done, missed, undo, add, delete
js/07-dashboard.js     Dashboard screen
js/08-tasks.js         Tasks screen
js/09-planner.js       Planner screen
js/10-profile.js       Profile screen
js/11-syllabus.js      syllabus import, subject cards
js/12-nav.js           navigation, render, theme
js/15-extras.js        focus timer, calendar, insights, backup, reminders
js/13-cloud.js         optional sync (only active inside Claude pages)
js/14-main.js          starts the app
landing/index.html     landing page
```
Script order in `index.html` matters: later files use functions from earlier ones.

## Data
Saved in the browser (`localStorage`, key `studypilot_v1`). No accounts or server yet.

## Added in v2
Focus timer (logs real time), month calendar, insights + weekly review, estimate check, practice scores, task notes and steps, lighter days, browser reminders, JSON backup/restore, .ics export.

## Not built yet
Login and cloud database, AI chat, PDF/image reading, group projects (all need a server).
Next step: Supabase for auth and database; keep AI API keys on a server.
