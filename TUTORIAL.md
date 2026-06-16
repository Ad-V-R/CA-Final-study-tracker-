# PARAM - Distraction-Free Study & Revision Tutorial
## Guide Prepared by Adarsh R (CA Finalist) & Antigravity AI

Param is a specialized Focus & Revision tracker designed specifically for the rigorous requirements of CA Final preparation. This guide is designed to help you utilize every feature in a distraction-free environment to maximize syllabus coverage and retention.

---

## 1. Scientific Focus Methods: Dual-Focus Architecture
Param separates study hours into two core cognitive states using the Focus Clock:
1. **Engross Mode (Deep Study):** Optimized for initial readings, solving tough direct/indirect tax calculations, or reading heavy audit clauses.
   - *Time block:* 25 to 50 minutes (Pomodoro method).
   - *Behavior:* Pure concentration. Shut down all background tasks, emails, and phone notifications.
   - *Soundscapes:* Connect headphones and use **White Noise**, **Brown Noise**, or **Beta Binaural Beats** (Beta frequencies around 14Hz help stimulate focus and analytical reasoning).

2. **Regain Mode (Consolidation & Recovery):** Used for breaks or active revision.
   - *Time block:* 5 to 15 minutes.
   - *Behavior:* Close your eyes, review what you read in your mind, stretch, or log daily stats.
   - *Soundscapes:* Silence, ambient soft noise, or low-level beats.

### The Procedural Lofi Study Radio
Built natively using the Web Audio API, the Lofi Study Radio generates beats and mellow chords procedurally in real-time. Since it is synthesized mathematically, it works **100% offline**, consumes minimal memory, and requires no internet connection—preventing you from visiting YouTube or music streaming platforms where you can easily get distracted.
- *How to play:* Open the Focus Timer tab, set sound selector to **Lofi Radio**, and start the clock. A boom-bap rhythm, warm lowpass chord sweeps, and vinyl dust crackles will begin playing.

---

## 2. Active Recall & The Revision Matrix
Passively re-reading study materials results in the "illusion of competence". Param implements active recall testing through:

1. **The Spaced Repetition Matrix:**
   - Go to the **Revision Rounds** tab.
   - Each of the 6 CA Final papers is split into:
     - **Initial Read:** First comprehensive understanding and class lectures.
     - **Round 1 (Detailed Study):** Deep study, writing summary notes, and solving full practice manuals.
     - **Round 2 (Summary Recall):** Recalling key summary charts and solving target questions.
     - **Round 3 (Mock / LDR):** Quick revision under mock conditions and preparing for the 1.5-day exam gap.
   - Checking off these cells updates the progress bar on your dashboard. Focus on the paper with the lowest percentage!

2. **The Feynman Technique Editor:**
   - Under the **Study Hub** tab, use the Feynman tool.
   - Write a summary of a complicated topic (e.g., *Ind AS 109 derivatives*, *Clause 34 of tax audit*, or *SA 240 fraud responsibilities*) in plain English, as if explaining it to a middle-school student.
   - If you cannot explain it simply, it means you do not fully understand the core concept yet. Revise those sections immediately.

---

## 3. RPG Gamification & Story Quest Campaigns
Param maps your real-life exam achievements to a 10-level gamification loop to reward consistency:

- **XP Progression:**
  - **+100 XP** for every Pomodoro clock completion.
  - **+200 XP** for checking off planner targets.
  - **+50 XP** for adding daily health metric updates or hobby logs.
- **Level Skill & Theme Locks:**
  - **Level 1:** Novice Initiate (*Steve*).
  - **Level 5:** Concept Commander (*Commander Shepard*). Unlocks: **Daily Tracker Log**.
  - **Level 6:** Audit Assassin (*Ezio Auditore*). Unlocks: **Hobby Tracker**.
  - **Level 7:** Tax Tactician (*Arthas Menethil*). Unlocks: **Lofi Study Radio**.
  - **Level 10:** Grandmaster CA (*Master Chief*). Unlocks: **All Theme Presets** and the coveted **"CA" prefix signature stamp** for your username.
- **Story Quests (Syllabus Bosses):**
  - Your study hours deal direct damage to procrastination monsters (bosses) on the dashboard (e.g., Overtime Overlord, Finance Act Golem).
  - Defeating the boss clears the chapter, advances the story logs, and grants massive XP rewards to help you level up faster!

---

## 4. Multi-Workspace Management
Keep different areas of study segregated:
- Use the dropdown in the header to switch workspaces.
- Create new workspaces for separate attempts (e.g., *Nov 2026 Focus*, *Mock Exams Run*, or *Group 1 Intensive*).
- Each workspace holds its own independent list of checklist tasks, revision completion matrices, daily health logs, character ranks, and theme settings.
- Customize each workspace with famous PC game character profiles (Steve, Gordon, Lara Croft, Agent 47, Ezio, Arthas, Geralt, Doom Slayer, Master Chief) to match your leveling theme.

---

## 5. Exports, Imports, and Data Backups
Maintain absolute control over your study data:

1. **Automatic Daily Snapshots:**
   - Every day you make study logs, the app automatically creates a timestamped JSON file inside the local app data path: `AppData/Roaming/Param/backups/ca_tracker_backup_YYYY-MM-DD.json`.
   - Toggle **Auto-cleanup daily backups older than 30 days** in the Backups settings panel to automatically purge old snapshots and prevent disk space buildup.
   - Click **Open Daily Backups Folder** to locate and retrieve any backup.

2. **Native Save Export/Import:**
   - In Settings -> Saves & Backups, click **Export Progress File** to save a snapshot `.json` file anywhere on your desktop or secondary drive.
   - Click **Import Progress File** to load an external save. Overwriting state requires the Admin Passcode (if enabled).

3. **Google Drive Sync (Encrypted):**
   - Save your developer Client ID and Secret in settings and connect your Drive. Click **Sync Up** to upload your save, or **Restore Down** to load it onto a new computer.

---

## 6. Distraction-Free Keyboard Shortcuts
Navigate and control Param without using the mouse:
- **`Space`**: Start / Pause the Focus Timer.
- **`R`**: Reset active timer.
- **`S`**: Skip current timer session / break.
- **`Ctrl + Shift + W`**: Quickly cycle through your active workspaces.
- **`Ctrl + Shift + H`**: Instantly toggle the User Guide tab on/off.
- **`Esc`**: Close any active modal dialog (Settings, Passcode Prompt, Create Workspace).
