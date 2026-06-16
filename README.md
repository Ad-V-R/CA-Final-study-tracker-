# CA Final Study & Revision Tracker

A premium single-page web application designed for Chartered Accountancy (CA) Final aspirants to track their study targets, manage revision rounds, focus with custom Pomodoro clocks, and analyze study statistics.

## Key Features

1. **Dashboard & Analytics:** Keep tabs on daily focus times, day streaks, and syllabus coverage across the 6 major papers. 
2. **Pomodoro Timer (Dual Modes):**
   - **Engross Mode (⚡ Cyan):** Tailored for deep study, reading study material, or solving practical problems.
   - **Regain Mode (🔄 Amber):** Tailored for active recall, revising notes, checking weak areas, or taking structured breaks.
   - Includes synthesizers for ambient focus sounds (White Noise, Brown Noise, Binaural Beats) using the Web Audio API (no external file dependencies).
3. **CA Final Target Planner:** Create structured tasks associated with specific papers (FR, AFM, Audit, DT, IDT, IBS) and assign them to specific revision rounds (Round 1, 2, or 3).
4. **Revision Round Matrix:** Track syllabus completion across Initial Readings and 3 separate detailed revision sweeps.
5. **NotebookLM Integration:** Compile all your tracker data (tasks, completed hours, weak areas, and revision coverage) into a cleanly formatted markdown source file. Upload this file to Google's NotebookLM to generate custom AI study briefs, revision summaries, or podcasts.

## Technologies Used

- **HTML5:** Semantic architecture.
- **CSS3 (Vanilla):** CSS Custom Properties (Variables) for theme controls (Dark/Light), Glassmorphism, animations, and responsive layouts.
- **JavaScript (Vanilla):** LocalStorage persistence, Custom Web Audio Synthesizer, Timer loop, and document generators.
- **Chart.js (CDN):** Beautiful animated graphs representing study trends, style ratios, and subject breakdowns.
- **FontAwesome & Google Fonts (Outfit, JetBrains Mono):** Typography and vector iconography.

## How to Run the App

1. Ensure all project files are in the same folder:
   - `index.html`
   - `style.css`
   - `app.js`
2. Open `index.html` in any modern web browser.
3. (Optional) Run a lightweight local HTTP server (like `npx live-server` or VS Code Live Server) to prevent local file protocol restrictions and allow Web Audio/Chart components to render smoothly.

## Working with Google NotebookLM

1. Add your study targets and log some focus sessions.
2. Go to the **NotebookLM Hub** tab in the app.
3. Click **Export Study Source File (.md)** to download your formatted study profile.
4. Go to [Google NotebookLM](https://notebooklm.google/).
5. Create a notebook for your CA Final Attempt and upload your downloaded file (`CA_Final_Study_Source_for_NotebookLM.md`) along with your ICAI materials.
6. Ask NotebookLM to create study guides or mock questions targeting your weaker subjects!
