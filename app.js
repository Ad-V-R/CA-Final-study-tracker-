/**
 * CA Final Study & Revision Tracker - Core Logic
 * Author: Antigravity AI
 */

class CAFinalTrackerApp {
    constructor() {
        // Core data structures with default fallbacks (multi-workspace layout)
        this.state = {
            workspaces: [
                {
                    id: 'ws_default',
                    name: 'Core Attempt Tracker',
                    characterId: 'steve',
                    username: 'SteveCraft',
                    level: 1,
                    xp: 0,
                    tasks: [],
                    studyLogs: [],
                    revisionMatrix: {},
                    dailyHealthLogs: [],
                    hobbyLogs: [],
                    campaignChapter: 1,
                    campaignBossHp: 400,
                    settings: {
                        attempt: 'Nov 2026',
                        examDate: '',
                        dailyGoal: 8,
                        autoSwitch: true,
                        theme: 'midnight'
                    }
                }
            ],
            currentWorkspaceId: 'ws_default',
            globalSettings: {
                adminLockEnabled: false,
                adminPasswordHash: '',
                googleClientId: '',
                googleClientSecret: ''
            },
            streak: 0,
            lastActiveDate: ''
        };

        // Characters Database
        this.charactersDb = [
            { id: 'steve', name: 'Steve', game: 'Minecraft', rank: 'Novice Initiate', avatar: 'assets/images/characters/lara.png', icon: 'fa-solid fa-cube', xpReq: 0 },
            { id: 'gordon', name: 'Gordon Freeman', game: 'Half-Life', rank: 'Apprentice Scholar', avatar: 'assets/images/characters/geralt.png', icon: 'fa-solid fa-flask', xpReq: 500 },
            { id: 'lara', name: 'Lara Croft', game: 'Tomb Raider', rank: 'Revision Raider', avatar: 'assets/images/characters/lara.png', icon: 'fa-solid fa-compass', xpReq: 1200 },
            { id: 'hitman', name: 'Agent 47', game: 'Hitman', rank: 'Focus Sentinel', avatar: 'assets/images/characters/chief.png', icon: 'fa-solid fa-barcode', xpReq: 2200 },
            { id: 'shepard', name: 'Commander Shepard', game: 'Mass Effect', rank: 'Concept Commander', avatar: 'assets/images/characters/chief.png', icon: 'fa-solid fa-user-astronaut', xpReq: 3500 },
            { id: 'ezio', name: 'Ezio Auditore', game: 'Assassin\'s Creed', rank: 'Audit Assassin', avatar: 'assets/images/characters/geralt.png', icon: 'fa-solid fa-crosshairs', xpReq: 5000 },
            { id: 'arthas', name: 'Arthas Menethil', game: 'Warcraft', rank: 'Tax Tactician', avatar: 'assets/images/characters/geralt.png', icon: 'fa-solid fa-chess-knight', xpReq: 7000 },
            { id: 'geralt', name: 'Geralt of Rivia', game: 'The Witcher', rank: 'Financial Warlock', avatar: 'assets/images/characters/geralt.png', icon: 'fa-solid fa-paw', xpReq: 9500 },
            { id: 'doom', name: 'Doom Slayer', game: 'Doom', rank: 'Syllabus Conqueror', avatar: 'assets/images/characters/chief.png', icon: 'fa-solid fa-fire', xpReq: 12500 },
            { id: 'masterchief', name: 'Master Chief', game: 'Halo', rank: 'Grandmaster CA', avatar: 'assets/images/characters/chief.png', icon: 'fa-solid fa-shield-halved', xpReq: 16000 }
        ];

        // Boss Battle Campaign Quests
        this.campaignQuests = [
            {
                chapter: 1,
                bossName: 'Overtime Overlord',
                description: 'The office overtime grind is draining your prep energy! Defeat him to clear your articleship schedule.',
                maxHp: 400,
                rewardXp: 500,
                image: 'assets/images/characters/dragon.png'
            },
            {
                chapter: 2,
                bossName: 'Financial Instrument Titan',
                description: 'Mount Ind AS is covered in a thick fog of derivatives, amortized costs, and hedging. Solve them to find the path.',
                maxHp: 800,
                rewardXp: 800,
                image: 'assets/images/characters/dragon.png'
            },
            {
                chapter: 3,
                bossName: 'Clause Confusion Specter',
                description: 'The specter of professional ethics clauses is haunting your audits. Recite the clauses correctly to banish it.',
                maxHp: 1200,
                rewardXp: 1200,
                image: 'assets/images/characters/dragon.png'
            },
            {
                chapter: 4,
                bossName: 'Finance Act Golem',
                description: 'The direct tax laws have mutated with budget amendments. Log tax revision hours to break through the golem\'s armor.',
                maxHp: 1800,
                rewardXp: 1800,
                image: 'assets/images/characters/dragon.png'
            },
            {
                chapter: 5,
                bossName: 'Multi-Disciplinary Chimera',
                description: 'The Integrated Business Solutions case studies are attacking with combined concepts. Solve them one by one.',
                maxHp: 2500,
                rewardXp: 2500,
                image: 'assets/images/characters/dragon.png'
            },
            {
                chapter: 6,
                bossName: 'The Assessment Dragon',
                description: 'The final gatekeeper. Banish the dragon once and for all by maintaining focus streaks, and earn your "CA" prefix!',
                maxHp: 4000,
                rewardXp: 5000,
                image: 'assets/images/characters/dragon.png'
            }
        ];

        this.selectedWorkspaceCharId = 'steve';
        this.lofiState = null;

        // UI active state
        this.activeTab = 'dashboard';
        this.isAdminSessionUnlocked = false;
        this.pendingAdminAction = null;
        this.activeTimer = {
            remainingSeconds: 1500, // 25 min default
            totalDuration: 1500,
            mode: 'engross', // engross vs regain
            isRunning: false,
            linkedTaskId: null,
            endTime: null,
            timerInterval: null
        };

        // Web Audio components
        this.audioCtx = null;
        this.ambientSource = null;
        this.activeSoundType = 'none';

        // Chart instances
        this.charts = {
            dailyTrend: null,
            focusRatio: null,
            subjectDistribution: null
        };

        // Exam Dates Database
        this.attemptExamDates = {
            'Nov 2026': '2026-11-01',
            'May 2027': '2027-05-01',
            'Nov 2027': '2027-11-01',
            'May 2028': '2028-05-01'
        };

        // Subject Papers mapping
        this.subjectsList = [
            { code: 'FR', name: 'Paper 1: Financial Reporting' },
            { code: 'AFM', name: 'Paper 2: Advanced Financial Management' },
            { code: 'Audit', name: 'Paper 3: Advanced Auditing & Ethics' },
            { code: 'DT', name: 'Paper 4: Direct Tax Laws' },
            { code: 'IDT', name: 'Paper 5: Indirect Tax Laws' },
            { code: 'IBS', name: 'Paper 6: Integrated Business Solutions' }
        ];

        // Motivational Quotes pool for CA Final study motivation
        this.quotesPool = [
            "Success in CA is not about how smart you are, it's about how persistent you are.",
            "Focus on the prefix 'CA' - it is earned, not given.",
            "Your articleship grind is temporary. The prefix is permanent.",
            "Ind AS and Direct Taxes might be tough, but you are tougher.",
            "Every Pomodoro completed is one step closer to clearing your attempt.",
            "Discipline is choosing between what you want now and what you want most.",
            "Success is the sum of small details, repeated day in and day out.",
            "Keep your eyes on the syllabus, and let the lofi beats block the noise.",
            "Mock exams are practice. The real exam is your victory run.",
            "When you feel like quitting, remember why you started this journey."
        ];
    }

    async init() {
        await this.loadState();
        this.initTheme();
        this.initQuoteTicker();
        this.initEventListeners();
        this.updateStreak();
        this.initElectronSync();

        // Admin Security Lock indicator
        const lockBtn = document.getElementById('lock-toggle-btn');
        if (lockBtn) {
            lockBtn.addEventListener('click', () => this.toggleAdminLockState());
        }
        this.updateLockIcon();
        
        // Populate initial UI
        this.renderWorkspaceSelector();
        this.updateFeatureLocks();
        this.renderAll();
        
        // Sidebar collapse state restore
        const sidebar = document.querySelector('.app-header');
        if (sidebar && this.state.settings && this.state.settings.sidebarCollapsed) {
            sidebar.classList.add('collapsed');
        }
        this.updateSidebarLayout();

        // Start countdown ticker
        this.updateCountdownBadge();
        setInterval(() => this.updateCountdownBadge(), 60000); // every minute

        this.logActivity("Param Focus application initialized.");
    }

    // --- State Persistence ---
    async loadState() {
        let savedState = null;
        if (window.electronAPI) {
            savedState = await window.electronAPI.loadLocalData();
        } else {
            const raw = localStorage.getItem('ca_tracker_state');
            if (raw) {
                try { savedState = JSON.parse(raw); } catch(e){}
            }
        }

        if (savedState) {
            try {
                this.state = savedState;
                
                // Migration logic: if old state format (no workspaces array)
                if (!this.state.workspaces) {
                    const defaultWorkspace = {
                        id: 'ws_default',
                        name: 'Core Attempt Tracker',
                        characterId: 'steve',
                        username: 'SteveCraft',
                        level: 1,
                        xp: 0,
                        tasks: this.state.tasks || [],
                        studyLogs: this.state.studyLogs || [],
                        revisionMatrix: this.state.revisionMatrix || {},
                        dailyHealthLogs: this.state.dailyHealthLogs || [],
                        hobbyLogs: this.state.hobbyLogs || [],
                        campaignChapter: 1,
                        campaignBossHp: 400,
                        settings: this.state.settings || {
                            attempt: 'Nov 2026',
                            examDate: '',
                            dailyGoal: 8,
                            autoSwitch: true,
                            theme: 'midnight'
                        }
                    };
                    
                    this.state.workspaces = [defaultWorkspace];
                    this.state.currentWorkspaceId = 'ws_default';
                    this.state.globalSettings = {
                        adminLockEnabled: this.state.settings ? this.state.settings.adminLockEnabled : false,
                        adminPasswordHash: this.state.settings ? this.state.settings.adminPasswordHash : '',
                        googleClientId: this.state.settings ? this.state.settings.googleClientId : '',
                        googleClientSecret: this.state.settings ? this.state.settings.googleClientSecret : ''
                    };
                    
                    // Clean up root formats
                    delete this.state.tasks;
                    delete this.state.studyLogs;
                    delete this.state.revisionMatrix;
                    delete this.state.dailyHealthLogs;
                    delete this.state.hobbyLogs;
                    delete this.state.settings;
                }
            } catch (e) {
                console.error("Error migrating saved state. Resetting to default.", e);
            }
        }

        // Standard checks for each workspace
        if (!this.state.workspaces || this.state.workspaces.length === 0) {
            this.state.workspaces = [
                {
                    id: 'ws_default',
                    name: 'Core Attempt Tracker',
                    characterId: 'steve',
                    username: 'SteveCraft',
                    level: 1,
                    xp: 0,
                    tasks: [],
                    studyLogs: [],
                    revisionMatrix: {},
                    dailyHealthLogs: [],
                    hobbyLogs: [],
                    campaignChapter: 1,
                    campaignBossHp: 400,
                    settings: {
                        attempt: 'Nov 2026',
                        examDate: '',
                        dailyGoal: 8,
                        autoSwitch: true,
                        theme: 'midnight'
                    }
                }
            ];
            this.state.currentWorkspaceId = 'ws_default';
        }

        if (!this.state.globalSettings) {
            this.state.globalSettings = {
                adminLockEnabled: false,
                adminPasswordHash: '',
                googleClientId: '',
                googleClientSecret: ''
            };
        }

        // Ensure all workspaces have essential parameters populated
        this.state.workspaces.forEach(ws => {
            if (!ws.tasks) ws.tasks = [];
            if (!ws.studyLogs) ws.studyLogs = [];
            if (!ws.dailyHealthLogs) ws.dailyHealthLogs = [];
            if (!ws.hobbyLogs) ws.hobbyLogs = [];
            if (!ws.revisionMatrix) ws.revisionMatrix = {};
            if (ws.campaignChapter === undefined) ws.campaignChapter = 1;
            if (ws.campaignBossHp === undefined) ws.campaignBossHp = 400;
            if (!ws.settings) ws.settings = {};
            
            // Enforce strictly evolved character ID based on current workspace level
            const lvl = ws.level || 1;
            const charObj = this.charactersDb[Math.min(this.charactersDb.length, lvl) - 1] || this.charactersDb[0];
            ws.characterId = charObj.id;
            
            ws.settings = {
                attempt: 'Nov 2026',
                examDate: '',
                dailyGoal: 8,
                autoSwitch: true,
                theme: 'midnight',
                ...ws.settings
            };

            this.subjectsList.forEach(sub => {
                if (!ws.revisionMatrix[sub.code]) {
                    ws.revisionMatrix[sub.code] = {
                        initial: false,
                        rev1: false,
                        rev2: false,
                        rev3: false
                    };
                }
            });
        });
        
        this.bindStateGetters();
        await this.saveState();
    }

    async saveState() {
        if (window.electronAPI) {
            await window.electronAPI.saveLocalData(this.state);
        } else {
            localStorage.setItem('ca_tracker_state', JSON.stringify(this.state));
        }
    }

    getActiveWorkspace() {
        return this.state.workspaces.find(ws => ws.id === this.state.currentWorkspaceId) || this.state.workspaces[0];
    }

    bindStateGetters() {
        // Remove existing properties to allow redefining
        delete this.state.tasks;
        delete this.state.studyLogs;
        delete this.state.revisionMatrix;
        delete this.state.dailyHealthLogs;
        delete this.state.hobbyLogs;
        delete this.state.settings;
        
        Object.defineProperties(this.state, {
            tasks: {
                get: () => this.getActiveWorkspace().tasks,
                set: (val) => { this.getActiveWorkspace().tasks = val; },
                configurable: true,
                enumerable: false
            },
            studyLogs: {
                get: () => this.getActiveWorkspace().studyLogs,
                set: (val) => { this.getActiveWorkspace().studyLogs = val; },
                configurable: true,
                enumerable: false
            },
            revisionMatrix: {
                get: () => this.getActiveWorkspace().revisionMatrix,
                set: (val) => { this.getActiveWorkspace().revisionMatrix = val; },
                configurable: true,
                enumerable: false
            },
            dailyHealthLogs: {
                get: () => this.getActiveWorkspace().dailyHealthLogs,
                set: (val) => { this.getActiveWorkspace().dailyHealthLogs = val; },
                configurable: true,
                enumerable: false
            },
            hobbyLogs: {
                get: () => this.getActiveWorkspace().hobbyLogs,
                set: (val) => { this.getActiveWorkspace().hobbyLogs = val; },
                configurable: true,
                enumerable: false
            },
            settings: {
                get: () => {
                    const ws = this.getActiveWorkspace();
                    return new Proxy(ws.settings, {
                        get: (target, prop) => {
                            if (prop === 'adminLockEnabled') return this.state.globalSettings.adminLockEnabled;
                            if (prop === 'adminPasswordHash') return this.state.globalSettings.adminPasswordHash;
                            return target[prop];
                        },
                        set: (target, prop, value) => {
                            if (prop === 'adminLockEnabled') {
                                this.state.globalSettings.adminLockEnabled = value;
                                return true;
                            }
                            if (prop === 'adminPasswordHash') {
                                this.state.globalSettings.adminPasswordHash = value;
                                return true;
                            }
                            target[prop] = value;
                            return true;
                        }
                    });
                },
                configurable: true,
                enumerable: false
            }
        });
    }

    renderWorkspaceSelector() {
        const selectEl = document.getElementById('workspace-select');
        if (!selectEl) return;
        
        selectEl.innerHTML = '';
        this.state.workspaces.forEach(ws => {
            const opt = document.createElement('option');
            opt.value = ws.id;
            opt.textContent = ws.name;
            if (ws.id === this.state.currentWorkspaceId) {
                opt.selected = true;
            }
            selectEl.appendChild(opt);
        });

        // Also update the sidebar active avatar!
        const activeWs = this.getActiveWorkspace();
        const activeChar = this.charactersDb.find(c => c.id === activeWs.characterId) || this.charactersDb[0];
        const sidebarAvatarEl = document.getElementById('sidebar-active-avatar');
        if (sidebarAvatarEl) {
            sidebarAvatarEl.src = activeChar.avatar;
            sidebarAvatarEl.title = `Active Workspace: ${activeWs.name} (Gamer: ${activeWs.username} as ${activeChar.name}). Click to Cycle.`;
        }
    }

    handleSwitchWorkspace(wsId) {
        if (this.state.currentWorkspaceId === wsId) return;
        
        this.state.currentWorkspaceId = wsId;
        this.saveState();
        
        this.initTheme();
        this.renderWorkspaceSelector();
        this.updateFeatureLocks();
        this.renderAll();
        
        const wsName = this.getActiveWorkspace().name;
        this.showToast(`Switched workspace to: ${wsName}`);
        this.logActivity(`Switched to workspace: "${wsName}" (${wsId})`);
    }

    cycleWorkspaceShortcut() {
        if (this.state.workspaces.length <= 1) return;
        const currentIdx = this.state.workspaces.findIndex(ws => ws.id === this.state.currentWorkspaceId);
        const nextIdx = (currentIdx + 1) % this.state.workspaces.length;
        const nextWs = this.state.workspaces[nextIdx];
        this.handleSwitchWorkspace(nextWs.id);
    }

    toggleWorkspaceModal(show) {
        const modal = document.getElementById('workspace-modal');
        if (!modal) return;
        
        if (show) {
            document.getElementById('workspace-name-input').value = '';
            modal.classList.add('active');
        } else {
            modal.classList.remove('active');
        }
    }

    async handleCreateWorkspace() {
        const nameInput = document.getElementById('workspace-name-input');
        if (!nameInput) return;
        
        const name = nameInput.value.trim();
        if (!name) {
            alert("Please enter a workspace name.");
            return;
        }

        const newId = 'ws_' + Date.now();
        const newWorkspace = {
            id: newId,
            name: name,
            characterId: 'steve',
            username: 'SteveCraft',
            level: 1,
            xp: 0,
            tasks: [],
            studyLogs: [],
            revisionMatrix: {},
            dailyHealthLogs: [],
            hobbyLogs: [],
            campaignChapter: 1,
            campaignBossHp: 400,
            settings: {
                attempt: 'Nov 2026',
                examDate: '',
                dailyGoal: 8,
                autoSwitch: true,
                theme: 'midnight'
            }
        };

        // Populate basic revision matrix keys
        this.subjectsList.forEach(sub => {
            newWorkspace.revisionMatrix[sub.code] = {
                initial: false,
                rev1: false,
                rev2: false,
                rev3: false
            };
        });

        this.state.workspaces.push(newWorkspace);
        this.state.currentWorkspaceId = newId;
        
        await this.saveState();
        
        this.initTheme();
        this.renderWorkspaceSelector();
        this.updateFeatureLocks();
        this.renderAll();
        
        this.toggleWorkspaceModal(false);
        this.showToast(`New workspace "${name}" created!`);
        this.logActivity(`Created new workspace: "${name}" (${newId})`);
    }

    async handleDeleteCurrentWorkspace() {
        const activeWs = this.getActiveWorkspace();
        if (this.state.workspaces.length <= 1) {
            alert("Cannot delete the default workspace. You must have at least one workspace remaining.");
            return;
        }

        this.checkAdminAuthorization(async () => {
            if (confirm(`Are you sure you want to delete the workspace "${activeWs.name}"? This will permanently erase all its data, focus sessions, and trackers!`)) {
                this.state.workspaces = this.state.workspaces.filter(ws => ws.id !== activeWs.id);
                this.state.currentWorkspaceId = this.state.workspaces[0].id;
                
                await this.saveState();
                
                this.initTheme();
                this.renderWorkspaceSelector();
                this.updateFeatureLocks();
                this.renderAll();
                
                this.toggleSettingsModal(false);
                this.showToast(`Workspace "${activeWs.name}" has been deleted.`);
                this.logActivity(`Deleted workspace: "${activeWs.name}" (${activeWs.id})`);
            }
        });
    }

    updateFeatureLocks() {
        const ws = this.getActiveWorkspace();
        
        const isHealthUnlocked = ws.level >= 5;
        const isHobbyUnlocked = ws.level >= 6;
        const isLofiUnlocked = ws.level >= 7;

        this.setOverlayLock('dailytracker', 'Level 5 Unlocks: Daily Health tracker (Sleep, water, exercise, screentime)', isHealthUnlocked);
        this.setOverlayLock('hobbies', 'Level 6 Unlocks: Hobbies tracker (Mental rejuvenation & activities)', isHobbyUnlocked);
        
        const lofiBtn = document.querySelector('.sound-btn[data-sound="lofi"]');
        if (lofiBtn) {
            if (isLofiUnlocked) {
                lofiBtn.classList.remove('locked-lofi-btn');
                lofiBtn.removeAttribute('disabled');
                lofiBtn.title = "Lofi Study Radio Synth";
            } else {
                lofiBtn.classList.add('locked-lofi-btn');
                lofiBtn.setAttribute('disabled', 'true');
                lofiBtn.title = "Locked: Reach Level 7 to unlock procedural Lofi Synth Radio";
            }
        }
    }

    setOverlayLock(sectionId, message, isUnlocked) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        let overlay = section.querySelector('.locked-feature-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'locked-feature-overlay';
            section.appendChild(overlay);
        }
        
        if (isUnlocked) {
            overlay.style.display = 'none';
        } else {
            overlay.style.display = 'flex';
            overlay.innerHTML = `
                <div class="lock-card glass-panel" style="text-align: center; max-width: 450px; padding: 2.5rem; border: 1px solid var(--panel-border); border-radius: 12px; background: var(--panel-bg); box-shadow: var(--shadow-main); display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                    <i class="fa-solid fa-lock" style="font-size: 3.5rem; color: var(--accent-color); margin-bottom: 0.5rem; text-shadow: 0 0 15px var(--accent-glow);"></i>
                    <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--text-primary); margin: 0;">Feature Locked</h3>
                    <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${message}</p>
                    <span style="font-size: 0.8rem; font-weight: 600; color: var(--accent-color); text-transform: uppercase; letter-spacing: 1px; margin-top: 0.5rem;">Study to earn XP and level up!</span>
                </div>
            `;
            overlay.setAttribute('style', 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(11, 15, 25, 0.92); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 100; border-radius: 12px;');
            section.style.position = 'relative';
        }
    }

    // --- Theme Management ---
    initTheme() {
        const ws = this.getActiveWorkspace();
        const activeTheme = (ws && ws.settings && ws.settings.theme) ? ws.settings.theme : 'midnight';
        document.documentElement.setAttribute('data-theme', activeTheme);
    }

    // --- Streak Counter ---
    updateStreak() {
        const todayStr = new Date().toDateString();
        
        if (this.state.lastActiveDate) {
            const lastActive = new Date(this.state.lastActiveDate);
            const today = new Date(todayStr);
            const diffTime = Math.abs(today - lastActive);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                // Active on consecutive day
                this.state.streak += 1;
                this.state.lastActiveDate = todayStr;
            } else if (diffDays > 1) {
                // Streak broken
                this.state.streak = 1;
                this.state.lastActiveDate = todayStr;
            }
        } else {
            // First time opening app
            this.state.streak = 1;
            this.state.lastActiveDate = todayStr;
        }
        
        this.saveState();
    }

    // --- Navigation ---
    switchTab(tabId) {
        // Toggle Active tab button
        document.querySelectorAll('.app-nav .nav-btn').forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Toggle Active section panel
        document.querySelectorAll('main .tab-content').forEach(section => {
            if (section.id === tabId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        this.activeTab = tabId;

        // Perform specific tab actions
        if (tabId === 'analytics') {
            this.renderCharts();
            this.renderLogsTable();
        } else if (tabId === 'notebooklm') {
            this.renderNotebookLMHub();
        } else if (tabId === 'planner') {
            this.renderPlannerList();
        } else if (tabId === 'dashboard') {
            this.renderDashboard();
        } else if (tabId === 'revision') {
            this.renderRevisionMatrix();
        } else if (tabId === 'dailytracker') {
            this.renderDailyHealthLogs();
            const dateInput = document.getElementById('log-date');
            if (dateInput && !dateInput.value) {
                dateInput.value = new Date().toISOString().split('T')[0];
            }
        } else if (tabId === 'hobbies') {
            this.renderHobbyLogs();
            const dateInput = document.getElementById('hobby-date');
            if (dateInput && !dateInput.value) {
                dateInput.value = new Date().toISOString().split('T')[0];
            }
        }
    }

    // --- Event Listeners ---
    initEventListeners() {
        // Header tabs
        document.querySelectorAll('.app-nav .nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = btn.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Settings Modal
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.toggleSettingsModal(true);
        });

        // Daily Health log form submit
        const dailyLogForm = document.getElementById('daily-log-form');
        if (dailyLogForm) {
            dailyLogForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddDailyLog();
            });
        }

        // Hobby log form submit
        const hobbyLogForm = document.getElementById('hobby-log-form');
        if (hobbyLogForm) {
            hobbyLogForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddHobbyLog();
            });
        }

        // Task Form Submit
        document.getElementById('task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddTask();
        });

        // Filters in Planner
        document.getElementById('filter-subject').addEventListener('change', () => this.renderPlannerList());
        document.getElementById('filter-status').addEventListener('change', () => this.renderPlannerList());

        // Timer actions
        document.getElementById('timer-btn-play-pause').addEventListener('click', () => this.toggleTimer());
        document.getElementById('timer-btn-reset').addEventListener('click', () => this.resetTimer());
        document.getElementById('timer-btn-skip').addEventListener('click', () => this.skipTimer());

        document.getElementById('widget-btn-play').addEventListener('click', () => this.toggleTimer());
        document.getElementById('widget-btn-pause').addEventListener('click', () => this.toggleTimer());
        document.getElementById('widget-btn-reset').addEventListener('click', () => this.resetTimer());

        // Ambient Sound Controls
        document.querySelectorAll('.sound-options .sound-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = btn.getAttribute('data-sound');
                this.setAmbientSound(type);
            });
        });

        // Timer duration triggers
        document.getElementById('setting-engross-duration').addEventListener('change', (e) => {
            if (this.activeTimer.mode === 'engross' && !this.activeTimer.isRunning) {
                this.setTimerDurations();
            }
        });
        document.getElementById('setting-regain-duration').addEventListener('change', (e) => {
            if (this.activeTimer.mode === 'regain' && !this.activeTimer.isRunning) {
                this.setTimerDurations();
            }
        });

        // Cloud sync triggers
        const authBtn = document.getElementById('cloud-auth-btn');
        if (authBtn) authBtn.addEventListener('click', () => this.toggleGoogleDriveConnection());

        const uploadBtn = document.getElementById('cloud-upload-btn');
        if (uploadBtn) uploadBtn.addEventListener('click', () => this.triggerCloudUpload());

        const downloadBtn = document.getElementById('cloud-download-btn');
        if (downloadBtn) downloadBtn.addEventListener('click', () => this.triggerCloudDownload());

        // Global Keyboard Shortcuts
        window.addEventListener('keydown', (e) => {
            const activeEl = document.activeElement;
            const isInput = activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable;
            
            if (e.key === 'Escape') {
                this.toggleSettingsModal(false);
                this.togglePasscodeModal(false);
                this.toggleWorkspaceModal(false);
                return;
            }
            
            if (isInput) return; // ignore shortcuts while typing
            
            if (e.code === 'Space') {
                e.preventDefault();
                this.toggleTimer();
            } else if (e.key === 'r' || e.key === 'R') {
                this.resetTimer();
            } else if (e.key === 's' || e.key === 'S') {
                this.skipTimer();
            } else if (e.ctrlKey && e.shiftKey && (e.key === 'W' || e.key === 'w')) {
                e.preventDefault();
                this.cycleWorkspaceShortcut();
            } else if (e.ctrlKey && e.shiftKey && (e.key === 'H' || e.key === 'h')) {
                e.preventDefault();
                this.switchTab('userguide');
            }
        });
    }

    // --- Settings Modal Actions ---
    toggleSettingsModal(show) {
        const modal = document.getElementById('settings-modal');
        if (show) {
            const ws = this.getActiveWorkspace();
            // Load settings into inputs
            document.getElementById('settings-attempt').value = ws.settings.attempt;
            document.getElementById('settings-exam-date').value = ws.settings.examDate || this.attemptExamDates[ws.settings.attempt] || '';
            document.getElementById('settings-daily-goal').value = ws.settings.dailyGoal;
            document.getElementById('settings-theme').value = ws.settings.theme || 'midnight';
            document.getElementById('settings-auto-switch').checked = ws.settings.autoSwitch;
            
            // Custom username
            document.getElementById('settings-username-input').value = ws.username || '';
            // Auto cleanup backups
            document.getElementById('settings-auto-cleanup-backups').checked = this.state.globalSettings.autoCleanupBackups || false;

            // Admin lock settings
            const lockEnableEl = document.getElementById('settings-admin-lock-enable');
            const passwordEl = document.getElementById('settings-admin-password');
            if (lockEnableEl && passwordEl) {
                lockEnableEl.checked = this.state.globalSettings.adminLockEnabled || false;
                passwordEl.value = ''; // Always clear passcode field for security
            }

            // Google Drive settings
            const clientIdEl = document.getElementById('settings-google-client-id');
            const clientSecretEl = document.getElementById('settings-google-client-secret');
            if (clientIdEl && clientSecretEl) {
                clientIdEl.value = this.state.globalSettings.googleClientId || '';
                clientSecretEl.value = this.state.globalSettings.googleClientSecret || '';
            }

            // Switch to general settings tab
            this.switchSettingsTab('general');

            modal.classList.add('active');
        } else {
            modal.classList.remove('active');
        }
    }

    switchSettingsTab(tabId) {
        document.querySelectorAll('.settings-tab-btn').forEach(btn => {
            if (btn.getAttribute('data-settings-tab') === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        document.querySelectorAll('.settings-tab-panel').forEach(panel => {
            if (panel.id === `settings-panel-${tabId}`) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
        
        if (tabId === 'avatar') {
            this.renderSettingsAvatarEvolution();
        } else if (tabId === 'support') {
            this.refreshDiagnosticsLogs();
        }
    }

    renderSettingsAvatarEvolution() {
        const ws = this.getActiveWorkspace();
        const char = this.charactersDb.find(c => c.id === ws.characterId) || this.charactersDb[0];
        
        const previewImg = document.getElementById('settings-avatar-preview');
        const nameEl = document.getElementById('settings-avatar-name');
        const gameEl = document.getElementById('settings-avatar-game');
        const rankEl = document.getElementById('settings-avatar-rank');
        const evolutionProgressDiv = document.getElementById('settings-avatar-evolution-progress');
        
        if (previewImg) previewImg.src = char.avatar;
        if (nameEl) nameEl.textContent = char.name;
        if (gameEl) gameEl.textContent = char.game;
        if (rankEl) rankEl.textContent = `${char.rank} (Level ${ws.level})`;
        
        if (!evolutionProgressDiv) return;
        
        if (ws.level < 10) {
            const nextChar = this.charactersDb[ws.level];
            const curLevelChar = this.charactersDb[ws.level - 1];
            const currentLevelMinXp = curLevelChar.xpReq;
            const nextLevelXpReq = nextChar.xpReq;
            
            const xpEarnedInLevel = ws.xp - currentLevelMinXp;
            const levelXpSpan = nextLevelXpReq - currentLevelMinXp;
            const percent = Math.min(100, Math.max(0, (xpEarnedInLevel / levelXpSpan) * 100));
            const xpRemaining = nextLevelXpReq - ws.xp;
            
            evolutionProgressDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.4rem;">
                    <span>Next Evolution: <strong>${nextChar.name}</strong></span>
                    <span><strong>${xpRemaining} XP</strong> left</span>
                </div>
                <div class="progress-bar-container" style="background: rgba(255,255,255,0.05); height: 10px; border-radius: 5px; overflow: hidden; border: 1px solid var(--panel-border);">
                    <div style="background: var(--accent-color); width: ${percent}%; height: 100%; border-radius: 5px; box-shadow: 0 0 8px var(--accent-glow); transition: width 0.4s ease;"></div>
                </div>
                <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.4rem; text-align: right;">
                    ${ws.xp} / ${nextLevelXpReq} Total XP
                </div>
            `;
        } else {
            evolutionProgressDiv.innerHTML = `
                <div style="text-align: center; padding: 0.5rem; background: rgba(0,229,255,0.05); border: 1px solid rgba(0,229,255,0.15); border-radius: 8px;">
                    <span style="font-size: 0.82rem; font-weight: 700; color: var(--accent-color);"><i class="fa-solid fa-trophy"></i> Ultimate Evolution Achieved!</span>
                    <p style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.25rem; line-height: 1.3;">You have reached the maximum rank of Grandmaster CA. Your dedication is unparalleled!</p>
                </div>
            `;
        }
    }

    async saveSettings() {
        this.checkAdminAuthorization(async () => {
            const attempt = document.getElementById('settings-attempt').value;
            const examDate = document.getElementById('settings-exam-date').value;
            const dailyGoal = parseInt(document.getElementById('settings-daily-goal').value) || 8;
            const theme = document.getElementById('settings-theme').value;
            const autoSwitch = document.getElementById('settings-auto-switch').checked;
            
            // Custom username and auto-cleanup backups
            const usernameInput = document.getElementById('settings-username-input').value.trim();
            const autoCleanupBackups = document.getElementById('settings-auto-cleanup-backups').checked;

            // Admin Lock settings
            const lockEnable = document.getElementById('settings-admin-lock-enable').checked;
            const passwordInput = document.getElementById('settings-admin-password').value.trim();

            if (lockEnable && !this.state.globalSettings.adminPasswordHash && !passwordInput) {
                alert("To enable Admin Lock, you must set an Admin Passcode.");
                return;
            }

            const ws = this.getActiveWorkspace();
            ws.settings.attempt = attempt;
            ws.settings.examDate = examDate;
            ws.settings.dailyGoal = dailyGoal;
            ws.settings.theme = theme;
            ws.settings.autoSwitch = autoSwitch;
            
            if (usernameInput) {
                ws.username = usernameInput;
            }
            
            this.state.globalSettings.autoCleanupBackups = autoCleanupBackups;
            
            document.documentElement.setAttribute('data-theme', theme);
            this.renderCharts();

            if (passwordInput) {
                if (window.electronAPI) {
                    this.state.globalSettings.adminPasswordHash = await window.electronAPI.hashPassword(passwordInput);
                } else {
                    this.state.globalSettings.adminPasswordHash = passwordInput;
                }
            }
            
            this.state.globalSettings.adminLockEnabled = lockEnable;
            if (!lockEnable) {
                this.isAdminSessionUnlocked = false;
            }

            // Google Drive settings
            const clientIdEl = document.getElementById('settings-google-client-id');
            const clientSecretEl = document.getElementById('settings-google-client-secret');
            if (clientIdEl && clientSecretEl) {
                this.state.globalSettings.googleClientId = clientIdEl.value.trim();
                this.state.globalSettings.googleClientSecret = clientSecretEl.value.trim();
            }

            await this.saveState();
            this.toggleSettingsModal(false);
            this.updateCountdownBadge();
            this.updateLockIcon();
            this.renderDashboard();
            this.showToast('Configuration settings updated.');
        });
    }

    // Custom Export / Import Save File Actions
    async handleExportProgress() {
        if (window.electronAPI) {
            const res = await window.electronAPI.exportState(this.state);
            if (res.success) {
                this.showToast(`Progress exported successfully to ${res.filePath}`);
            } else if (!res.cancelled) {
                this.showToast(`Export failed: ${res.error}`);
            }
        } else {
            this.exportNotebookLMSource();
        }
    }

    async handleImportProgress() {
        this.checkAdminAuthorization(async () => {
            if (window.electronAPI) {
                const res = await window.electronAPI.importState();
                if (res.success && res.data) {
                    this.state = res.data;
                    this.bindStateGetters();
                    await this.saveState();
                    this.initTheme();
                    this.renderWorkspaceSelector();
                    this.updateFeatureLocks();
                    this.renderAll();
                    this.showToast('Progress imported successfully!');
                } else if (!res.cancelled) {
                    this.showToast(`Import failed: ${res.error}`);
                }
            } else {
                alert("Import only supported in desktop app.");
            }
        });
    }

    async handleOpenBackupsFolder() {
        if (window.electronAPI) {
            await window.electronAPI.openBackupsFolder();
        } else {
            alert("Only available in desktop app.");
        }
    }

    // --- Google Drive Desktop Sync Handlers ---
    initElectronSync() {
        if (!window.electronAPI) return;

        // Listen for connection changes
        window.electronAPI.onCloudStateChanged((state) => {
            this.updateCloudUI(state);
        });

        // Listen for sync messages
        window.electronAPI.onSyncLog((msg) => {
            this.addSyncLog(msg);
        });

        // Query initial connection status
        window.electronAPI.getCloudState().then(state => {
            this.updateCloudUI(state);
        });
    }

    updateCloudUI(state) {
        const statusText = document.getElementById('cloud-status-text');
        const authBtn = document.getElementById('cloud-auth-btn');
        const syncButtons = document.getElementById('cloud-sync-buttons');
        const logBox = document.getElementById('cloud-sync-log-box');

        if (!statusText || !authBtn) return;

        if (state.signedIn) {
            statusText.textContent = 'Connected';
            statusText.className = 'text-success';
            authBtn.textContent = 'Disconnect';
            if (syncButtons) syncButtons.style.display = 'flex';
            if (logBox) logBox.style.display = 'block';
            this.isConnectedToCloud = true;
        } else {
            statusText.textContent = 'Disconnected';
            statusText.className = 'text-warn';
            authBtn.textContent = 'Connect Drive';
            if (syncButtons) syncButtons.style.display = 'none';
            if (logBox) logBox.style.display = 'none';
            this.isConnectedToCloud = false;
        }
    }

    addSyncLog(msg) {
        const logBox = document.getElementById('cloud-sync-log-box');
        if (logBox) {
            const time = new Date().toLocaleTimeString();
            logBox.innerHTML += `<div>[${time}] ${msg}</div>`;
            logBox.scrollTop = logBox.scrollHeight;
        }
    }

    async toggleGoogleDriveConnection() {
        if (!window.electronAPI) {
            alert("Cloud sync is only available in the Desktop App.");
            return;
        }

        if (this.isConnectedToCloud) {
            if (confirm("Disconnect Google Drive? Local app storage will remain, but cloud backups will stop.")) {
                await window.electronAPI.googleSignOut();
                this.showToast("Disconnected from Google Drive.");
            }
        } else {
            const clientId = document.getElementById('settings-google-client-id').value.trim();
            const clientSecret = document.getElementById('settings-google-client-secret').value.trim();

            if (!clientId || !clientSecret) {
                alert("Please paste both Google Client ID and Client Secret in settings fields before connecting.");
                return;
            }

            // Save credentials to local profile first
            this.state.settings.googleClientId = clientId;
            this.state.settings.googleClientSecret = clientSecret;
            await this.saveState();

            this.addSyncLog("Opening browser authorization page...");
            this.showToast("Opening authorization screen in your web browser...");
            
            try {
                const success = await window.electronAPI.googleSignIn();
                if (success) {
                    this.showToast("Successfully authorized with Google Drive!");
                    this.triggerCloudUpload();
                }
            } catch (err) {
                this.showToast("Authentication failed: " + err.message);
                this.addSyncLog("Auth failed: " + err.message);
            }
        }
    }

    async triggerCloudUpload() {
        if (!window.electronAPI) return;
        this.checkAdminAuthorization(async () => {
            this.addSyncLog("Initializing sync up...");
            const res = await window.electronAPI.syncWithGoogleDrive(this.state);
            if (res.success) {
                this.showToast("Backups synced up to Google Drive!");
            } else {
                this.showToast("Sync upload failed: " + res.error);
                this.addSyncLog("Upload failed: " + res.error);
            }
        });
    }

    async triggerCloudDownload() {
        if (!window.electronAPI) return;
        this.checkAdminAuthorization(async () => {
            if (confirm("Overwrite local configuration database and restore targets from Google Drive cloud?")) {
                this.addSyncLog("Initializing sync down...");
                const res = await window.electronAPI.restoreFromGoogleDrive();
                if (res.success && res.data) {
                    this.state = res.data;
                    this.bindStateGetters();
                    await this.saveState();
                    this.renderAll();
                    this.showToast("Data successfully restored from Google Drive!");
                } else if (res.success) {
                    this.showToast("No backup file found on Google Drive.");
                } else {
                    this.showToast("Sync download failed: " + res.error);
                    this.addSyncLog("Restore failed: " + res.error);
                }
            }
        });
    }

    // --- Exam Countdown Ticker ---
    updateCountdownBadge() {
        const badgeText = document.getElementById('countdown-text');
        if (!badgeText) return;

        const attempt = this.state.settings.attempt;
        let examDateStr = this.state.settings.examDate;
        
        if (!examDateStr) {
            examDateStr = this.attemptExamDates[attempt];
        }

        const sidebar = document.querySelector('.app-header');
        const isCollapsed = sidebar && sidebar.classList.contains('collapsed');

        if (!examDateStr) {
            badgeText.textContent = isCollapsed ? 'CA' : `${attempt} Attempt`;
            if (isCollapsed) {
                badgeText.parentElement.title = `${attempt} Attempt`;
            }
            return;
        }

        const targetDate = new Date(examDateStr);
        const today = new Date();
        
        // Zero-out times for exact day calculations
        targetDate.setHours(0,0,0,0);
        today.setHours(0,0,0,0);
        
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let fullHtml = '';
        let collapsedHtml = '';
        let tooltipText = '';

        if (diffDays > 0) {
            fullHtml = `<i class="fa-solid fa-hourglass-half"></i> ${attempt}: <strong>${diffDays} days</strong> left`;
            collapsedHtml = `<i class="fa-solid fa-hourglass-half"></i> <strong>${diffDays}d</strong>`;
            tooltipText = `${attempt} Attempt: ${diffDays} days remaining`;
        } else if (diffDays === 0) {
            fullHtml = `<i class="fa-solid fa-flag-checkered text-success"></i> <strong>Exams begin today!</strong>`;
            collapsedHtml = `<i class="fa-solid fa-flag-checkered text-success"></i> <strong>D-Day</strong>`;
            tooltipText = `Exams begin today!`;
        } else {
            fullHtml = `<i class="fa-solid fa-circle-check text-success"></i> ${attempt} Attempt Complete`;
            collapsedHtml = `<i class="fa-solid fa-circle-check text-success"></i> <strong>Done</strong>`;
            tooltipText = `${attempt} Attempt Complete`;
        }

        if (isCollapsed) {
            badgeText.innerHTML = collapsedHtml;
            badgeText.parentElement.title = tooltipText;
        } else {
            badgeText.innerHTML = fullHtml;
            badgeText.parentElement.removeAttribute('title');
        }
    }

    // --- Task Manager logic ---
    handleAddTask() {
        this.checkAdminAuthorization(() => this.executeAddTask());
    }

    executeAddTask() {
        const titleInput = document.getElementById('task-title');
        const subjectInput = document.getElementById('task-subject');
        const tagInput = document.getElementById('task-tag');
        const roundInput = document.getElementById('task-round');
        const pomodorosInput = document.getElementById('task-est-pomodoros');
        const notesInput = document.getElementById('task-notes');

        const newTask = {
            id: 'task_' + Date.now(),
            title: titleInput.value.trim(),
            subject: subjectInput.value,
            tag: tagInput.value, // engross / regain
            round: parseInt(roundInput.value), // 0, 1, 2, 3
            estPomodoros: parseInt(pomodorosInput.value) || 1,
            completedPomodoros: 0,
            notes: notesInput.value.trim(),
            status: 'todo', // todo, doing, completed
            dateCreated: new Date().toISOString(),
            dateCompleted: null
        };

        this.state.tasks.push(newTask);
        this.saveState();
        this.showToast('Study target added successfully!');

        // Reset fields
        titleInput.value = '';
        notesInput.value = '';
        pomodorosInput.value = '2';

        // Refresh rendering
        this.renderPlannerList();
        this.renderDashboard();
    }

    toggleTaskStatus(taskId) {
        this.checkAdminAuthorization(() => this.executeToggleTaskStatus(taskId));
    }

    executeToggleTaskStatus(taskId) {
        const task = this.state.tasks.find(t => t.id === taskId);
        if (task) {
            if (task.status === 'completed') {
                task.status = 'todo';
                task.dateCompleted = null;
                this.showToast('Target moved back to active list.');
                this.logActivity(`Marked target "${task.title}" as active (todo).`);
            } else {
                task.status = 'completed';
                task.dateCompleted = new Date().toISOString();
                // Complete all remaining estimated pomodoros just as shorthand if not already tracked
                if (task.completedPomodoros < task.estPomodoros) {
                    task.completedPomodoros = task.estPomodoros;
                }
                this.showToast('Target marked as completed! Keep it up!');
                this.addXP(200);
                this.damageActiveBoss(200, `Checked off planner target: "${task.title}"`);
                this.logActivity(`Marked target "${task.title}" as completed (+200 XP).`);
            }
            this.saveState();
            
            // Recalculate UI displays
            this.renderPlannerList();
            this.renderDashboard();
            this.renderRevisionMatrix();
            if (this.activeTab === 'notebooklm') this.renderNotebookLMHub();
        }
    }

    incrementTaskPomodoro(taskId) {
        const task = this.state.tasks.find(t => t.id === taskId);
        if (task) {
            task.completedPomodoros += 1;
            if (task.completedPomodoros >= task.estPomodoros) {
                task.status = 'completed';
                task.dateCompleted = new Date().toISOString();
            } else {
                task.status = 'doing';
            }
            
            this.saveState();
            this.renderPlannerList();
            this.renderDashboard();
            this.showToast(`Logged Focus Session for: ${task.title}`);
        }
    }

    deleteTask(taskId) {
        this.checkAdminAuthorization(() => this.executeDeleteTask(taskId));
    }

    executeDeleteTask(taskId) {
        if (confirm("Are you sure you want to delete this target?")) {
            this.state.tasks = this.state.tasks.filter(t => t.id !== taskId);
            
            // If the deleted task was active on timer, clear it
            if (this.activeTimer.linkedTaskId === taskId) {
                this.activeTimer.linkedTaskId = null;
                this.updateActiveTaskDetails();
            }
            
            this.saveState();
            this.renderPlannerList();
            this.renderDashboard();
            this.showToast('Study target deleted.');
        }
    }

    linkTaskToTimer(taskId) {
        const task = this.state.tasks.find(t => t.id === taskId);
        if (task) {
            this.activeTimer.linkedTaskId = taskId;
            
            // Set timer mode automatically to match task tag
            this.setTimerMode(task.tag);
            task.status = 'doing';
            this.saveState();
            
            this.switchTab('timer');
            this.updateActiveTaskDetails();
            this.showToast(`Linked target: "${task.title}" to Focus Clock.`);
        }
    }

    // --- Focus Timer Engine ---
    setTimerMode(mode) {
        if (this.activeTimer.isRunning) return; // Prevent changing mode while timer is running

        this.activeTimer.mode = mode;
        
        // Update UI styles
        const container = document.querySelector('.timer-container');
        if (container) {
            container.className = `timer-container glass-panel mode-${mode}`;
        }
        
        const engrossBtn = document.getElementById('timer-tab-engross');
        const regainBtn = document.getElementById('timer-tab-regain');
        if (engrossBtn && regainBtn) {
            if (mode === 'engross') {
                engrossBtn.classList.add('active');
                regainBtn.classList.remove('active');
            } else {
                regainBtn.classList.add('active');
                engrossBtn.classList.remove('active');
            }
        }

        // Set durations
        this.setTimerDurations();
    }

    setTimerDurations() {
        const engrossSelect = document.getElementById('setting-engross-duration');
        const regainSelect = document.getElementById('setting-regain-duration');
        
        let minutes = 25;
        if (this.activeTimer.mode === 'engross') {
            minutes = parseInt(engrossSelect.value) || 25;
        } else {
            minutes = parseInt(regainSelect.value) || 5;
        }

        this.activeTimer.totalDuration = minutes * 60;
        this.activeTimer.remainingSeconds = minutes * 60;
        
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.activeTimer.remainingSeconds / 60);
        const seconds = this.activeTimer.remainingSeconds % 60;
        const displayStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update timer display elements
        document.getElementById('timer-display').textContent = displayStr;
        document.getElementById('widget-timer-display').textContent = displayStr;

        // Update browser tab title
        const modeLabel = this.activeTimer.mode === 'engross' ? '⚡ Engross' : '🔄 Regain';
        document.title = this.activeTimer.isRunning ? `(${displayStr}) ${modeLabel} | Param Focus` : 'Param - CA Final Focus Tracker';

        // Update progress ring
        const circle = document.getElementById('timer-progress-ring');
        if (circle) {
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const percent = this.activeTimer.remainingSeconds / this.activeTimer.totalDuration;
            const offset = circumference - (percent * circumference);
            circle.style.strokeDashoffset = offset;
        }
    }

    toggleTimer() {
        if (this.activeTimer.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        if (this.activeTimer.isRunning) return;

        // Initialize Audio Context on user gesture if needed
        this.initAudioContext();

        this.activeTimer.isRunning = true;
        this.activeTimer.endTime = Date.now() + (this.activeTimer.remainingSeconds * 1000);
        
        // Toggle play icon
        document.getElementById('timer-btn-play-pause').innerHTML = '<i class="fa-solid fa-pause"></i>';
        document.getElementById('widget-btn-play').style.display = 'none';
        document.getElementById('widget-btn-pause').style.display = 'flex';

        document.getElementById('timer-status-label').textContent = this.activeTimer.mode === 'engross' ? 'Engrossed in Study...' : 'Regaining energy...';

        // Start ambient sound if selected
        this.playAmbientNoise();

        this.activeTimer.timerInterval = setInterval(() => {
            const now = Date.now();
            this.activeTimer.remainingSeconds = Math.max(0, Math.round((this.activeTimer.endTime - now) / 1000));
            
            this.updateTimerDisplay();

            if (this.activeTimer.remainingSeconds <= 0) {
                this.timerCompleted();
            }
        }, 200);

        this.logActivity(`Timer started. Mode: ${this.activeTimer.mode}. Duration: ${Math.round(this.activeTimer.totalDuration / 60)}m.`);
    }

    pauseTimer() {
        if (!this.activeTimer.isRunning) return;

        this.activeTimer.isRunning = false;
        clearInterval(this.activeTimer.timerInterval);
        this.activeTimer.timerInterval = null;

        // Toggle pause icon
        document.getElementById('timer-btn-play-pause').innerHTML = '<i class="fa-solid fa-play"></i>';
        document.getElementById('widget-btn-play').style.display = 'flex';
        document.getElementById('widget-btn-pause').style.display = 'none';

        document.getElementById('timer-status-label').textContent = 'Session Paused';

        // Pause ambient sounds
        this.stopAmbientNoise();

        this.logActivity(`Timer paused. Mode: ${this.activeTimer.mode}. Remaining time: ${Math.round(this.activeTimer.remainingSeconds)}s.`);
    }

    resetTimer() {
        this.pauseTimer();
        this.setTimerDurations();
        document.getElementById('timer-status-label').textContent = 'Ready to Focus';
        this.showToast('Timer reset to start.');
        this.logActivity(`Timer reset to initial duration.`);
    }

    skipTimer() {
        if (confirm("Skip this timer session? No study hours will be logged.")) {
            this.pauseTimer();
            this.setTimerDurations();
            document.getElementById('timer-status-label').textContent = 'Ready to Focus';
            this.showToast('Session skipped.');
            this.logActivity(`Timer session skipped by user.`);
        }
    }

    timerCompleted() {
        this.pauseTimer();
        this.playExpiryAlarm();
        
        const durationMinutes = Math.round(this.activeTimer.totalDuration / 60);
        const studyDate = new Date().toISOString();
        
        let subjectCode = 'FR'; // Default fallback
        let targetTitle = 'General Study';
        let linkedId = this.activeTimer.linkedTaskId;
        
        if (linkedId) {
            const task = this.state.tasks.find(t => t.id === linkedId);
            if (task) {
                subjectCode = task.subject;
                targetTitle = task.title;
                
                // Increment target pomodoro
                this.incrementTaskPomodoro(linkedId);
            }
        } else {
            // If timer was run standalone without a task, try to use first active task or prompt subject
            // Standard standalone logging
            const lastTaskSubject = this.state.tasks.length > 0 ? this.state.tasks[this.state.tasks.length - 1].subject : 'FR';
            subjectCode = lastTaskSubject;
        }

        // Log session in analytics logs
        const newLog = {
            id: 'log_' + Date.now(),
            date: studyDate,
            duration: durationMinutes,
            mode: this.activeTimer.mode,
            subject: subjectCode,
            taskTitle: targetTitle,
            linkedTaskId: linkedId
        };
        
        this.state.studyLogs.push(newLog);
        this.saveState();
        
        const xpReward = this.activeTimer.mode === 'engross' ? 100 : 30;
        this.addXP(xpReward);
        this.damageActiveBoss(xpReward, `${this.activeTimer.mode === 'engross' ? 'Engrossed' : 'Regained'} focus session completed (+${xpReward} XP)`);

        // Fire UI toast
        const sessionMsg = this.activeTimer.mode === 'engross' ? 
            `Awesome! You completed a ${durationMinutes}-min Engross focus session.` : 
            `Regain break completed! Ready to study?`;
        
        this.showToast(sessionMsg);
        this.logActivity(`Timer session completed. Mode: ${this.activeTimer.mode}. Duration: ${durationMinutes} mins. Linked Task: "${targetTitle}".`);

        // Auto Switch logic
        if (this.state.settings.autoSwitch) {
            const nextMode = this.activeTimer.mode === 'engross' ? 'regain' : 'engross';
            setTimeout(() => {
                this.setTimerMode(nextMode);
                this.showToast(`Switched automatically to ${nextMode} mode.`);
            }, 1000);
        } else {
            this.setTimerDurations();
        }

        // Refresh views
        this.renderDashboard();
        this.renderPlannerList();
        this.renderLogsTable();
        this.renderCharts();
    }

    updateActiveTaskDetails() {
        const widgetTag = document.getElementById('widget-timer-tag');
        const widgetTask = document.getElementById('widget-timer-task');
        const timerActiveTitle = document.getElementById('timer-active-task-title');
        const timerActiveDesc = document.getElementById('timer-active-task-desc');
        
        const linkedId = this.activeTimer.linkedTaskId;

        if (linkedId) {
            const task = this.state.tasks.find(t => t.id === linkedId);
            if (task) {
                const tagLabel = task.tag === 'engross' ? 'Engross' : 'Regain';
                
                widgetTag.className = `tag-badge ${task.tag}`;
                widgetTag.textContent = tagLabel;
                widgetTask.textContent = task.title;

                timerActiveTitle.textContent = task.title;
                timerActiveDesc.innerHTML = `<span class="subject-badge subject-${task.subject}">${task.subject}</span> | Estimated Pomodoros: ${task.completedPomodoros}/${task.estPomodoros} | Round: ${task.round === 0 ? 'Initial' : 'Round ' + task.round}`;
                return;
            }
        }

        // Default display
        widgetTag.className = `tag-badge engross`;
        widgetTag.textContent = 'Engross';
        widgetTask.textContent = 'General Session (No Task)';

        timerActiveTitle.textContent = 'Standalone Study Session';
        timerActiveDesc.textContent = 'No target linked. Select a target from the Planner tab to map study hours directly to your revision checklist.';
    }

    // --- Web Audio Synthesizer (Ambient Sounds & Alarm) ---
    initAudioContext() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    setAmbientSound(type) {
        this.initAudioContext();
        
        // Remove active class from buttons
        document.querySelectorAll('.sound-options .sound-btn').forEach(btn => {
            if (btn.getAttribute('data-sound') === type) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        this.activeSoundType = type;
        
        if (this.activeTimer.isRunning) {
            this.playAmbientNoise();
        }
    }

    playAmbientNoise() {
        this.stopAmbientNoise();

        if (this.activeSoundType === 'none' || !this.audioCtx) return;

        if (this.activeSoundType === 'lofi') {
            this.playLofiMusic();
            return;
        }

        const bufferSize = 4096;
        
        // Generate procedural audio buffer based on selected type
        if (this.activeSoundType === 'white' || this.activeSoundType === 'brown') {
            const node = this.audioCtx.createScriptProcessor(bufferSize, 1, 1);
            let lastOut = 0.0;
            
            node.onaudioprocess = (e) => {
                const output = e.outputBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    const white = Math.random() * 2 - 1;
                    if (this.activeSoundType === 'brown') {
                        // Apply lowpass integrating filter for Brown noise
                        output[i] = (lastOut + (0.02 * white)) / 1.02;
                        lastOut = output[i];
                        output[i] *= 3.5; // boost volume compensation
                    } else {
                        output[i] = white * 0.15; // White noise
                    }
                }
            };
            
            // Connect to gain controls
            const gainNode = this.audioCtx.createGain();
            gainNode.gain.setValueAtTime(0.08, this.audioCtx.currentTime); // keep noise soft
            node.connect(gainNode);
            gainNode.connect(this.audioCtx.destination);
            
            this.ambientSource = { scriptNode: node, gainNode: gainNode };
        } else if (this.activeSoundType === 'binaural') {
            // Binaural beats require two oscillators sent to left and right channels
            // Focus Binaural: Beta Waves (~14Hz differential, e.g. 200Hz left, 214Hz right)
            const oscL = this.audioCtx.createOscillator();
            const oscR = this.audioCtx.createOscillator();
            
            const pannerL = this.audioCtx.createStereoPanner();
            const pannerR = this.audioCtx.createStereoPanner();
            
            oscL.type = 'sine';
            oscL.frequency.setValueAtTime(200, this.audioCtx.currentTime);
            pannerL.pan.setValueAtTime(-1, this.audioCtx.currentTime); // fully left
            
            oscR.type = 'sine';
            oscR.frequency.setValueAtTime(214, this.audioCtx.currentTime);
            pannerR.pan.setValueAtTime(1, this.audioCtx.currentTime); // fully right
            
            const gainNode = this.audioCtx.createGain();
            gainNode.gain.setValueAtTime(0.05, this.audioCtx.currentTime); // very low volume sine waves
            
            oscL.connect(pannerL);
            pannerL.connect(gainNode);
            oscR.connect(pannerR);
            pannerR.connect(gainNode);
            gainNode.connect(this.audioCtx.destination);
            
            oscL.start();
            oscR.start();
            
            this.ambientSource = { oscL, oscR, gainNode };
        }
    }

    playLofiMusic() {
        this.initAudioContext();
        if (!this.audioCtx) return;
        
        this.lofiState = {
            isPlaying: true,
            bpm: 75,
            step: 0,
            nextNoteTime: this.audioCtx.currentTime,
            intervalId: null,
            nodes: []
        };
        
        // Create warm lowpass filter bus
        const busFilter = this.audioCtx.createBiquadFilter();
        busFilter.type = 'lowpass';
        busFilter.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
        
        const busGain = this.audioCtx.createGain();
        busGain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
        
        busFilter.connect(busGain);
        busGain.connect(this.audioCtx.destination);
        
        this.lofiState.busFilter = busFilter;
        this.lofiState.busGain = busGain;
        
        this.startLofiVinylCrackle(busFilter);
        
        const lookahead = 25.0;
        const scheduleAheadTime = 0.1;
        
        const scheduler = () => {
            if (!this.lofiState || !this.lofiState.isPlaying) return;
            while (this.lofiState.nextNoteTime < this.audioCtx.currentTime + scheduleAheadTime) {
                this.scheduleLofiStep(this.lofiState.step, this.lofiState.nextNoteTime, busFilter);
                const secondsPerBeat = 60.0 / this.lofiState.bpm;
                this.lofiState.nextNoteTime += 0.5 * secondsPerBeat; // 8th note steps
                this.lofiState.step = (this.lofiState.step + 1) % 32;
            }
        };
        
        this.lofiState.intervalId = setInterval(scheduler, lookahead);
        this.ambientSource = { stop: () => this.stopLofiMusic() };
    }

    startLofiVinylCrackle(destination) {
        if (!this.audioCtx) return;
        const bufferSize = 2 * this.audioCtx.sampleRate;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const noiseNode = this.audioCtx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;
        
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        filter.Q.value = 0.6;
        
        const crackleGain = this.audioCtx.createGain();
        crackleGain.gain.value = 0.01;
        
        noiseNode.connect(filter);
        filter.connect(crackleGain);
        crackleGain.connect(destination);
        
        noiseNode.start();
        this.lofiState.nodes.push(noiseNode, filter, crackleGain);
        
        const crackleInterval = setInterval(() => {
            if (!this.lofiState || !this.lofiState.isPlaying) {
                clearInterval(crackleInterval);
                return;
            }
            if (Math.random() < 0.25) {
                this.playVinylClick(destination);
            }
        }, 250);
    }

    playVinylClick(destination) {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900 + Math.random() * 2200, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.004 + Math.random() * 0.007, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.015);
        osc.connect(gain);
        gain.connect(destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.02);
    }

    scheduleLofiStep(step, time, destination) {
        // Simple boom-bap rhythm (bpm 75, 8th note steps)
        if (step === 0 || step === 10 || step === 16 || step === 26) {
            this.synthesizeLofiKick(time, destination);
        }
        if (step === 4 || step === 12 || step === 20 || step === 28) {
            this.synthesizeLofiSnare(time, destination);
        }
        if (step % 2 === 0) {
            this.synthesizeLofiHat(time, destination);
        }
        
        // Rhodes chords progression trigger
        if (step === 0) {
            this.synthesizeLofiChord([50, 57, 60, 64, 67], time, 3.2, destination); // Dm9
        } else if (step === 8) {
            this.synthesizeLofiChord([43, 55, 59, 62, 65], time, 3.2, destination); // G13
        } else if (step === 16) {
            this.synthesizeLofiChord([48, 55, 59, 64, 67], time, 3.2, destination); // Cmaj9
        } else if (step === 24) {
            this.synthesizeLofiChord([45, 57, 61, 64, 68], time, 3.2, destination); // A7alt
        }
    }

    synthesizeLofiKick(time, destination) {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, time);
        osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.15);
        gain.gain.setValueAtTime(0.7, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
        osc.connect(gain);
        gain.connect(destination);
        osc.start(time);
        osc.stop(time + 0.2);
    }

    synthesizeLofiSnare(time, destination) {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const oscGain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(170, time);
        oscGain.gain.setValueAtTime(0.1, time);
        oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.07);
        osc.connect(oscGain);
        oscGain.connect(destination);
        osc.start(time);
        osc.stop(time + 0.08);

        const bufferSize = 0.12 * this.audioCtx.sampleRate;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const noiseNode = this.audioCtx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1100, time);
        const noiseGain = this.audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.2, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
        noiseNode.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(destination);
        noiseNode.start(time);
        noiseNode.stop(time + 0.13);
    }

    synthesizeLofiHat(time, destination) {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(7500, time);
        gain.gain.setValueAtTime(0.03, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
        osc.connect(gain);
        gain.connect(destination);
        osc.start(time);
        osc.stop(time + 0.03);
    }

    synthesizeLofiChord(midiNotes, time, duration, destination) {
        if (!this.audioCtx) return;
        const mToF = (m) => Math.pow(2, (m - 69) / 12) * 440;
        midiNotes.forEach(note => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            const filter = this.audioCtx.createBiquadFilter();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(mToF(note), time);
            osc.detune.setValueAtTime((Math.random() - 0.5) * 6, time);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(180, time);
            filter.frequency.exponentialRampToValueAtTime(700, time + 0.4);
            filter.frequency.exponentialRampToValueAtTime(280, time + duration);
            
            gain.gain.setValueAtTime(0.0, time);
            gain.gain.linearRampToValueAtTime(0.15, time + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(destination);
            
            osc.start(time);
            osc.stop(time + duration + 0.1);
        });
    }

    stopLofiMusic() {
        if (this.lofiState) {
            this.lofiState.isPlaying = false;
            clearInterval(this.lofiState.intervalId);
            if (this.lofiState.nodes) {
                this.lofiState.nodes.forEach(node => {
                    try { node.stop(); } catch(e){}
                    try { node.disconnect(); } catch(e){}
                });
            }
            this.lofiState = null;
        }
    }

    stopAmbientNoise() {
        this.stopLofiMusic();
        if (!this.ambientSource) return;

        if (this.ambientSource.scriptNode) {
            this.ambientSource.scriptNode.disconnect();
        }
        if (this.ambientSource.oscL) {
            this.ambientSource.oscL.stop();
            this.ambientSource.oscL.disconnect();
        }
        if (this.ambientSource.oscR) {
            this.ambientSource.oscR.stop();
            this.ambientSource.oscR.disconnect();
        }
        if (this.ambientSource.gainNode) {
            this.ambientSource.gainNode.disconnect();
        }
        
        this.ambientSource = null;
    }

    playExpiryAlarm() {
        this.initAudioContext();
        if (!this.audioCtx) return;

        const now = this.audioCtx.currentTime;
        
        // Double Chime sound
        const playBeep = (time, pitch) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(pitch, time);
            
            gain.gain.setValueAtTime(0.3, time);
            // Exponential envelope decline
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
            
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            
            osc.start(time);
            osc.stop(time + 0.35);
        };
        
        playBeep(now, 523.25); // C5
        playBeep(now + 0.15, 659.25); // E5
        playBeep(now + 0.3, 783.99); // G5
    }

    // --- Revision Matrix logic ---
    toggleRevisionCell(subjectCode, cellKey) {
        this.checkAdminAuthorization(() => this.executeToggleRevisionCell(subjectCode, cellKey));
    }

    executeToggleRevisionCell(subjectCode, cellKey) {
        if (this.state.revisionMatrix[subjectCode]) {
            this.state.revisionMatrix[subjectCode][cellKey] = !this.state.revisionMatrix[subjectCode][cellKey];
            this.saveState();
            
            this.renderRevisionMatrix();
            this.renderDashboard();
            
            if (this.activeTab === 'notebooklm') {
                this.renderNotebookLMHub();
            }
        }
    }

    calculateSubjectProgress(subjectCode) {
        const matrix = this.state.revisionMatrix[subjectCode];
        if (!matrix) return 0;
        
        // Weights: Initial Reading = 25%, Rev 1 = 25%, Rev 2 = 25%, Rev 3 = 25%
        let count = 0;
        if (matrix.initial) count++;
        if (matrix.rev1) count++;
        if (matrix.rev2) count++;
        if (matrix.rev3) count++;
        
        return Math.round((count / 4) * 100);
    }

    calculateAverageSyllabusProgress() {
        let total = 0;
        this.subjectsList.forEach(sub => {
            total += this.calculateSubjectProgress(sub.code);
        });
        return Math.round(total / this.subjectsList.length);
    }

    // --- Dashboard Renderer ---
    renderDashboard() {
        // Compute stats today
        const todayStr = new Date().toDateString();
        
        let engrossMinutes = 0;
        let regainMinutes = 0;
        
        this.state.studyLogs.forEach(log => {
            const logDate = new Date(log.date).toDateString();
            if (logDate === todayStr) {
                if (log.mode === 'engross') {
                    engrossMinutes += log.duration;
                } else {
                    regainMinutes += log.duration;
                }
            }
        });

        // Format times
        const formatHrsMins = (totalMinutes) => {
            const hrs = Math.floor(totalMinutes / 60);
            const mins = totalMinutes % 60;
            return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
        };

        document.getElementById('dash-engross-time').textContent = formatHrsMins(engrossMinutes);
        document.getElementById('dash-regain-time').textContent = formatHrsMins(regainMinutes);

        // Targets completed count
        const completedTargets = this.state.tasks.filter(t => t.status === 'completed').length;
        const totalTargets = this.state.tasks.length;
        
        document.getElementById('dash-targets-done').textContent = `${completedTargets}/${totalTargets}`;
        const targetPercent = totalTargets > 0 ? Math.round((completedTargets / totalTargets) * 100) : 0;
        document.getElementById('dash-targets-ratio').textContent = `${targetPercent}% Completed`;

        // Syllabus coverage avg
        const avgSyllabusCoverage = this.calculateAverageSyllabusProgress();
        document.getElementById('dash-revision-pct').textContent = `${avgSyllabusCoverage}%`;

        // Welcome banner title adjustments based on study hours
        const totalFocusedToday = engrossMinutes + regainMinutes;
        const welcomeTitle = document.getElementById('welcome-title');
        if (totalFocusedToday >= (this.state.settings.dailyGoal * 60)) {
            welcomeTitle.innerHTML = `CA Prefix is calling! 🎓`;
        } else if (totalFocusedToday > 0) {
            welcomeTitle.innerHTML = `Great effort today, future CA!`;
        } else {
            welcomeTitle.innerHTML = `Let's make progress today!`;
        }

        // Streak Count
        document.getElementById('streak-count').textContent = this.state.streak;

        // Render Active Widget Info
        this.updateActiveTaskDetails();

        // Render Dashboard Urgent Checklist
        const urgentContainer = document.getElementById('dash-urgent-targets');
        urgentContainer.innerHTML = '';
        
        // Show pending tasks
        const pendingTasks = this.state.tasks.filter(t => t.status !== 'completed').slice(0, 5);
        
        if (pendingTasks.length === 0) {
            urgentContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-circle-check text-success"></i>
                    <p>No active targets remaining! Add more tasks in the Planner.</p>
                </div>
            `;
        } else {
            pendingTasks.forEach(task => {
                const checkedClass = task.status === 'completed' ? 'checked' : '';
                const iconClass = task.status === 'completed' ? 'fa-solid fa-circle-check checked' : 'fa-regular fa-circle';
                
                const item = document.createElement('div');
                item.className = 'dash-target-item';
                item.innerHTML = `
                    <div class="dash-target-left">
                        <i class="${iconClass} dash-target-check" onclick="app.toggleTaskStatus('${task.id}')"></i>
                        <span class="dash-target-text ${checkedClass}">${task.title}</span>
                    </div>
                    <div class="dash-target-right">
                        <span class="subject-badge subject-${task.subject}">${task.subject}</span>
                        <button class="task-btn btn-play-task" onclick="app.linkTaskToTimer('${task.id}')" title="Link to Focus Clock">
                            <i class="fa-solid fa-stopwatch"></i>
                        </button>
                    </div>
                `;
                urgentContainer.appendChild(item);
            });
        }

        // Render Dashboard Subject Progress Overview
        const dashRevContainer = document.getElementById('dash-rev-list');
        dashRevContainer.innerHTML = '';
        
        this.subjectsList.slice(0, 4).forEach(sub => {
            const pct = this.calculateSubjectProgress(sub.code);
            const item = document.createElement('div');
            item.className = 'rev-progress-item';
            item.innerHTML = `
                <div class="rev-item-meta">
                    <span class="subject-code">${sub.code}</span>
                    <span class="subject-name text-muted" style="font-size:0.75rem; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:60%;">${sub.name.split(':')[1].trim()}</span>
                    <span class="subject-percent">${pct}%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${pct}%"></div>
                </div>
            `;
            dashRevContainer.appendChild(item);
        });
    }

    // --- Planner Renderer ---
    renderPlannerList() {
        const container = document.getElementById('planner-tasks-list');
        if (!container) return;

        const subjFilter = document.getElementById('filter-subject').value;
        const statusFilter = document.getElementById('filter-status').value;

        // Filter rules
        let filtered = this.state.tasks;
        if (subjFilter !== 'all') {
            filtered = filtered.filter(t => t.subject === subjFilter);
        }
        if (statusFilter === 'active') {
            filtered = filtered.filter(t => t.status !== 'completed');
        } else if (statusFilter === 'completed') {
            filtered = filtered.filter(t => t.status === 'completed');
        }

        container.innerHTML = '';

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-box-open"></i>
                    <p>No targets match the filters selected.</p>
                </div>
            `;
            return;
        }

        // Sort: Active tasks first, then order by created date descending
        filtered.sort((a,b) => {
            if (a.status === 'completed' && b.status !== 'completed') return 1;
            if (a.status !== 'completed' && b.status === 'completed') return -1;
            return new Date(b.dateCreated) - new Date(a.dateCreated);
        });

        filtered.forEach(task => {
            const isCompleted = task.status === 'completed';
            const cardClass = isCompleted ? 'task-card completed' : 'task-card';
            const checkIcon = isCompleted ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle';
            
            const card = document.createElement('div');
            card.className = cardClass;
            card.innerHTML = `
                <div class="task-card-left">
                    <i class="${checkIcon} task-card-check-box" onclick="app.toggleTaskStatus('${task.id}')"></i>
                    <div class="task-card-details">
                        <span class="task-card-title">${task.title}</span>
                        ${task.notes ? `<p class="task-card-notes">${task.notes}</p>` : ''}
                        <div class="task-card-tags">
                            <span class="subject-badge subject-${task.subject}">${task.subject}</span>
                            <span class="round-badge">${task.round === 0 ? 'Initial study' : 'Revision ' + task.round}</span>
                            <span class="tag-badge ${task.tag}">${task.tag}</span>
                            <span class="pomodoros-counter">
                                <i class="fa-solid fa-stopwatch text-accent"></i> ${task.completedPomodoros}/${task.estPomodoros} Pomos
                            </span>
                        </div>
                    </div>
                </div>
                <div class="task-card-right">
                    <div class="task-actions">
                        ${!isCompleted ? `
                            <button class="task-btn btn-play-task" onclick="app.linkTaskToTimer('${task.id}')" title="Study with Focus Clock">
                                <i class="fa-solid fa-play-circle" style="font-size:1.2rem;"></i>
                            </button>
                        ` : ''}
                        <button class="task-btn btn-delete-task" onclick="app.deleteTask('${task.id}')" title="Delete Target">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // --- Revision Matrix Renderer ---
    renderRevisionMatrix() {
        const matrixBody = document.getElementById('revision-matrix-body');
        if (!matrixBody) return;

        matrixBody.innerHTML = '';

        this.subjectsList.forEach(sub => {
            const data = this.state.revisionMatrix[sub.code];
            const progress = this.calculateSubjectProgress(sub.code);
            
            const row = document.createElement('div');
            row.className = 'revision-matrix-row';
            row.innerHTML = `
                <div class="matrix-cell subject-col">
                    <span class="subject-code">${sub.code}</span>
                    <span class="subject-full-title">${sub.name.split(':')[1].trim()}</span>
                </div>
                <div class="matrix-cell">
                    <input type="checkbox" class="matrix-checkbox" ${data.initial ? 'checked' : ''} onclick="app.toggleRevisionCell('${sub.code}', 'initial')">
                </div>
                <div class="matrix-cell">
                    <input type="checkbox" class="matrix-checkbox" ${data.rev1 ? 'checked' : ''} onclick="app.toggleRevisionCell('${sub.code}', 'rev1')">
                </div>
                <div class="matrix-cell">
                    <input type="checkbox" class="matrix-checkbox" ${data.rev2 ? 'checked' : ''} onclick="app.toggleRevisionCell('${sub.code}', 'rev2')">
                </div>
                <div class="matrix-cell">
                    <input type="checkbox" class="matrix-checkbox" ${data.rev3 ? 'checked' : ''} onclick="app.toggleRevisionCell('${sub.code}', 'rev3')">
                </div>
                <div class="matrix-cell matrix-progress-cell">
                    <span class="subject-percent">${progress}%</span>
                </div>
            `;
            matrixBody.appendChild(row);
        });
    }

    // --- NotebookLM Hub Manager ---
    generateNotebookLMMarkdown() {
        const attempt = this.state.settings.attempt;
        let examDateStr = this.state.settings.examDate || this.attemptExamDates[attempt] || '';
        let daysLeftStr = 'N/A';
        
        if (examDateStr) {
            const targetDate = new Date(examDateStr);
            const today = new Date();
            targetDate.setHours(0,0,0,0);
            today.setHours(0,0,0,0);
            const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
            daysLeftStr = diffDays > 0 ? `${diffDays} days` : 'Exam Period active';
        }

        const avgCoverage = this.calculateAverageSyllabusProgress();

        // 1. Core Header
        let md = `# CA Final Exam Study & Syllabus Source File\n`;
        md += `Generated: ${new Date().toLocaleDateString()} | Focus Target: ${attempt} (${daysLeftStr} remaining)\n`;
        md += `Overall Syllabus Revision Completion Status: ${avgCoverage}%\n\n`;

        md += `## SECTION 1: Revision Matrix (Coverage details)\n`;
        md += `This section breaks down syllabus coverage across Initial reading and 3 successive revision rounds:\n\n`;
        md += `| Subject Code | Subject Name | Initial Read | Detailed Rev 1 | Summary Rev 2 | Mock/LDR Rev 3 | Total Progress |\n`;
        md += `|---|---|---|---|---|---|---|\n`;
        
        this.subjectsList.forEach(sub => {
            const data = this.state.revisionMatrix[sub.code];
            const prog = this.calculateSubjectProgress(sub.code);
            md += `| ${sub.code} | ${sub.name.split(':')[1].trim()} | ${data.initial ? 'Completed' : 'Pending'} | ${data.rev1 ? 'Completed' : 'Pending'} | ${data.rev2 ? 'Completed' : 'Pending'} | ${data.rev3 ? 'Completed' : 'Pending'} | ${prog}% |\n`;
        });
        md += `\n`;

        // 2. Study logs summary
        md += `## SECTION 2: Study Focus Hours Logs\n`;
        md += `Shows cumulative study time allocations by focus styles:\n`;
        
        let totalEngross = 0;
        let totalRegain = 0;
        const subjectHours = {};
        
        this.subjectsList.forEach(s => subjectHours[s.code] = 0);

        this.state.studyLogs.forEach(log => {
            if (log.mode === 'engross') {
                totalEngross += log.duration;
            } else {
                totalRegain += log.duration;
            }
            if (subjectHours[log.subject] !== undefined) {
                subjectHours[log.subject] += log.duration;
            } else {
                subjectHours[log.subject] = log.duration;
            }
        });

        md += `- **Deep Study (Engross) Hours:** ${(totalEngross / 60).toFixed(2)} hours\n`;
        md += `- **Active Recall / Notes Revision (Regain) Hours:** ${(totalRegain / 60).toFixed(2)} hours\n`;
        md += `- **Ratio (Engross to Regain):** ${totalRegain > 0 ? (totalEngross / totalRegain).toFixed(1) : totalEngross > 0 ? 'Pure Engross' : '0'}:1\n\n`;

        md += `### Hour Breakdowns by Paper:\n`;
        this.subjectsList.forEach(sub => {
            md += `- **${sub.code} (${sub.name.split(':')[1].trim()}):** ${(subjectHours[sub.code] / 60).toFixed(2)} hours logged\n`;
        });
        md += `\n`;

        // 3. Targets list
        md += `## SECTION 3: Active and Completed Target Checklist\n`;
        md += `List of specific chapters, topics, or question targets logged by student:\n\n`;
        
        const activeTasks = this.state.tasks.filter(t => t.status !== 'completed');
        const finishedTasks = this.state.tasks.filter(t => t.status === 'completed');

        md += `### Active Targets (${activeTasks.length} pending):\n`;
        if (activeTasks.length === 0) {
            md += `* No current pending items.\n`;
        } else {
            activeTasks.forEach(t => {
                md += `- [ ] **${t.subject}**: ${t.title} (Style: ${t.tag} | Est Pomos: ${t.completedPomodoros}/${t.estPomodoros} | Round: ${t.round})\n`;
                if (t.notes) md += `  * Notes: ${t.notes}\n`;
            });
        }
        md += `\n`;

        md += `### Completed Targets (${finishedTasks.length} items):\n`;
        if (finishedTasks.length === 0) {
            md += `* No targets completed yet.\n`;
        } else {
            finishedTasks.forEach(t => {
                const dateDone = t.dateCompleted ? new Date(t.dateCompleted).toLocaleDateString() : 'N/A';
                md += `- [x] **${t.subject}**: ${t.title} (Completed on ${dateDone})\n`;
                if (t.notes) md += `  * Notes: ${t.notes}\n`;
            });
        }
        md += `\n`;

        // 3.5. Daily Health Trackers
        md += `## SECTION 3.5: Daily Health Logs\n`;
        if (!this.state.dailyHealthLogs || this.state.dailyHealthLogs.length === 0) {
            md += `* No daily health logs recorded.\n\n`;
        } else {
            md += `| Date | Sleep (hrs) | Water (gls) | Exercise (mins) | Screen-Time (mins) |\n`;
            md += `|---|---|---|---|---|\n`;
            this.state.dailyHealthLogs.forEach(l => {
                md += `| ${l.date} | ${l.sleep} | ${l.water} | ${l.exercise} | ${l.screentime} |\n`;
            });
            md += `\n`;
        }

        // 3.6. Hobby & Extracurriculars
        md += `## SECTION 3.6: Hobby & Mental Rejuvenation Activities\n`;
        if (!this.state.hobbyLogs || this.state.hobbyLogs.length === 0) {
            md += `* No extracurricular activities logged.\n\n`;
        } else {
            md += `| Date | Activity | Duration (mins) | Post-Activity Mood |\n`;
            md += `|---|---|---|---|\n`;
            this.state.hobbyLogs.forEach(l => {
                md += `| ${l.date} | ${l.name} | ${l.duration} | ${l.mood} |\n`;
            });
            md += `\n`;
        }

        // 4. Recommendation analysis prompt helper for NotebookLM
        md += `## SECTION 4: Study Diagnosis for NotebookLM\n`;
        md += `Based on the logs, diagnose study habits:\n`;
        
        // Find paper with least progress
        let minProgressSub = 'FR';
        let minVal = 1000;
        this.subjectsList.forEach(s => {
            const p = this.calculateSubjectProgress(s.code);
            if (p < minVal) {
                minVal = p;
                minProgressSub = s.code;
            }
        });
        
        const minSubName = this.subjectsList.find(s => s.code === minProgressSub).name;
        
        md += `- **Weak / Least Revised Subject:** ${minProgressSub} (${minVal}% syllabus coverage)\n`;
        md += `- **Focus Balance Advice:** ${totalEngross < totalRegain ? 'Student has spent more time revising notes. Advise solving core questions.' : 'Student is highly engrossed in deep study. Advise testing recall using past exam papers.'}\n\n`;

        md += `*Instructions to NotebookLM: Use this file to understand the student's preparation progress. When prompted, create revision study cards for their weak concepts, draft a mock schedule targeting the least prepared topics, or generate audio outlines structured to clarify direct exam concepts.*`;

        return md;
    }

    renderNotebookLMHub() {
        const previewEl = document.getElementById('notebooklm-preview-text');
        if (previewEl) {
            previewEl.textContent = this.generateNotebookLMMarkdown();
        }
    }

    exportNotebookLMSource() {
        const content = this.generateNotebookLMMarkdown();
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.setAttribute('href', url);
        link.setAttribute('download', `CA_Final_Study_Source_for_NotebookLM.md`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('NotebookLM study source exported successfully!');
    }

    copyNotebookLMClipboard() {
        const content = this.generateNotebookLMMarkdown();
        navigator.clipboard.writeText(content).then(() => {
            this.showToast('Copied Study Source code to clipboard!');
        }).catch(err => {
            console.error('Could not copy text: ', err);
            this.showToast('Failed to copy. Please select and copy manually.');
        });
    }

    // --- Analytics Charts Renderers ---
    renderLogsTable() {
        const tbody = document.getElementById('study-logs-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        if (this.state.studyLogs.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-table-row">No sessions logged yet. Complete a Pomodoro session to log time!</td>
                </tr>
            `;
            return;
        }

        // Show logs in reverse chronological order (newest first)
        const sortedLogs = [...this.state.studyLogs].sort((a,b) => new Date(b.date) - new Date(a.date));

        sortedLogs.forEach(log => {
            const tr = document.createElement('tr');
            const logTime = new Date(log.date).toLocaleString();
            const tagLabel = log.mode === 'engross' ? 'Engross' : 'Regain';
            
            tr.innerHTML = `
                <td>${logTime}</td>
                <td><span class="subject-badge subject-${log.subject}">${log.subject}</span></td>
                <td><span class="tag-badge ${log.mode}">${tagLabel}</span></td>
                <td><strong>${log.duration} mins</strong></td>
                <td>${log.taskTitle}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    clearStudyLogsConfirm() {
        this.checkAdminAuthorization(() => this.executeClearStudyLogs());
    }

    executeClearStudyLogs() {
        if (confirm("Are you sure you want to clear all focus study logs? This cannot be undone.")) {
            this.state.studyLogs = [];
            this.saveState();
            
            this.renderLogsTable();
            this.renderCharts();
            this.renderDashboard();
            this.showToast('Focus study logs cleared.');
        }
    }

    renderCharts() {
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        const labelColor = theme === 'dark' ? '#9ca3af' : '#64748b';
        const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

        // 1. Daily Trend Chart (Last 7 Days)
        this.renderDailyTrendChart(labelColor, gridColor);

        // 2. Focus Styles Doughnut Chart
        this.renderFocusRatioChart(labelColor);

        // 3. Subject-wise Distribution Bar Chart
        this.renderSubjectDistributionChart(labelColor, gridColor);
    }

    renderDailyTrendChart(labelColor, gridColor) {
        const ctx = document.getElementById('chart-daily-trend');
        if (!ctx) return;

        // Generate list of past 7 dates
        const dates = [];
        const dateLabels = [];
        const engrossHrs = [];
        const regainHrs = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d.toDateString());
            dateLabels.push(d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }));
            engrossHrs.push(0);
            regainHrs.push(0);
        }

        // Aggregate logs
        this.state.studyLogs.forEach(log => {
            const logDateStr = new Date(log.date).toDateString();
            const dateIdx = dates.indexOf(logDateStr);
            if (dateIdx !== -1) {
                if (log.mode === 'engross') {
                    engrossHrs[dateIdx] += (log.duration / 60);
                } else {
                    regainHrs[dateIdx] += (log.duration / 60);
                }
            }
        });

        // Destroy previous chart instance if exists
        if (this.charts.dailyTrend) {
            this.charts.dailyTrend.destroy();
        }

        const engrossColor = '#00e5ff';
        const regainColor = '#ff9e00';

        this.charts.dailyTrend = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dateLabels,
                datasets: [
                    {
                        label: 'Engross Hours (Deep Study)',
                        data: engrossHrs.map(val => parseFloat(val.toFixed(2))),
                        backgroundColor: engrossColor,
                        borderRadius: 5,
                        stack: 'Stack 0'
                    },
                    {
                        label: 'Regain Hours (Revision)',
                        data: regainHrs.map(val => parseFloat(val.toFixed(2))),
                        backgroundColor: regainColor,
                        borderRadius: 5,
                        stack: 'Stack 0'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: labelColor, font: { family: 'Outfit' } }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.raw} hrs`
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        grid: { display: false },
                        ticks: { color: labelColor, font: { family: 'Outfit' } }
                    },
                    y: {
                        stacked: true,
                        grid: { color: gridColor },
                        ticks: { color: labelColor, font: { family: 'Outfit' } },
                        title: { display: true, text: 'Hours Focused', color: labelColor }
                    }
                }
            }
        });
    }

    renderFocusRatioChart(labelColor) {
        const ctx = document.getElementById('chart-focus-ratio');
        if (!ctx) return;

        let totalEngross = 0;
        let totalRegain = 0;

        this.state.studyLogs.forEach(log => {
            if (log.mode === 'engross') {
                totalEngross += log.duration;
            } else {
                totalRegain += log.duration;
            }
        });

        // Destroy previous
        if (this.charts.focusRatio) {
            this.charts.focusRatio.destroy();
        }

        if (totalEngross === 0 && totalRegain === 0) {
            // Empty State helper
            const ctx2D = ctx.getContext('2d');
            ctx2D.clearRect(0,0,ctx.width,ctx.height);
            return;
        }

        this.charts.focusRatio = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Engross Mode', 'Regain Mode'],
                datasets: [{
                    data: [Math.round(totalEngross / 60 * 10) / 10, Math.round(totalRegain / 60 * 10) / 10],
                    backgroundColor: ['#00e5ff', '#ff9e00'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: labelColor, font: { family: 'Outfit' } }
                    }
                },
                cutout: '70%'
            }
        });
    }

    renderSubjectDistributionChart(labelColor, gridColor) {
        const ctx = document.getElementById('chart-subject-distribution');
        if (!ctx) return;

        const subjectMins = {};
        this.subjectsList.forEach(s => subjectMins[s.code] = 0);

        this.state.studyLogs.forEach(log => {
            if (subjectMins[log.subject] !== undefined) {
                subjectMins[log.subject] += log.duration;
            }
        });

        const dataVals = this.subjectsList.map(s => parseFloat((subjectMins[s.code] / 60).toFixed(2)));
        const labels = this.subjectsList.map(s => s.code);
        
        // Subject colors corresponding to CSS
        const colors = [
            '#7c4dff', // FR
            '#00b8d4', // AFM
            '#00e676', // Audit
            '#ff6e40', // DT
            '#ffd700', // IDT
            '#d500f9'  // IBS
        ];

        // Destroy previous
        if (this.charts.subjectDistribution) {
            this.charts.subjectDistribution.destroy();
        }

        this.charts.subjectDistribution = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Focus Time (Hours)',
                    data: dataVals,
                    backgroundColor: colors,
                    borderRadius: 8
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { color: gridColor },
                        ticks: { color: labelColor, font: { family: 'Outfit' } },
                        title: { display: true, text: 'Hours Study', color: labelColor }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: labelColor, font: { family: 'Outfit' } }
                    }
                }
            }
        });
    }

    // --- Toast Alerts ---
    showToast(message) {
        const toast = document.getElementById('toast-notification');
        const toastMsg = document.getElementById('toast-msg');
        
        if (!toast || !toastMsg) return;

        toastMsg.textContent = message;
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }

    // --- Main Renders Dispatcher ---
    renderAll() {
        this.renderProfileCard();
        this.renderBossPanel();
        this.renderDashboard();
        this.renderPlannerList();
        this.renderRevisionMatrix();
        this.renderDailyHealthLogs();
        this.renderHobbyLogs();
        this.setTimerDurations();
    }

    // --- RPG Gamification Progression & Quest Campaigns ---
    calculateLevel(xp) {
        let lvl = 1;
        for (let i = 0; i < this.charactersDb.length; i++) {
            if (xp >= this.charactersDb[i].xpReq) {
                lvl = i + 1;
            } else {
                break;
            }
        }
        return lvl;
    }

    addXP(amount) {
        const ws = this.getActiveWorkspace();
        const oldXp = ws.xp || 0;
        const newXp = oldXp + amount;
        ws.xp = newXp;

        const oldLvl = ws.level || 1;
        const newLvl = this.calculateLevel(newXp);
        
        if (newLvl > oldLvl) {
            ws.level = newLvl;
            // Unlocked a new avatar automatically
            const charObj = this.charactersDb[newLvl - 1];
            ws.characterId = charObj.id;
            this.showLevelUpBanner(newLvl, charObj.name, charObj.rank);
            this.updateFeatureLocks();
        }
        
        this.saveState();
        this.renderDashboard();
    }

    showLevelUpBanner(level, charName, rankName) {
        const banner = document.getElementById('level-up-banner');
        const rankText = document.getElementById('level-up-rank-text');
        const descText = document.getElementById('level-up-desc-text');
        
        if (!banner || !rankText || !descText) return;
        
        rankText.textContent = `New Rank: ${rankName} (${charName})`;
        
        let unlockDesc = "";
        switch (level) {
            case 2: unlockDesc = "Unlocked Gordon Freeman. Active Recall Guide is ready!"; break;
            case 3: unlockDesc = "Unlocked Lara Croft & Sunset Theme Preset!"; break;
            case 4: unlockDesc = "Unlocked Agent 47 & Feynman Technique Editor!"; break;
            case 5: unlockDesc = "Unlocked Commander Shepard & Daily Health Tracker!"; break;
            case 6: unlockDesc = "Unlocked Ezio Auditore & Hobby Tracker!"; break;
            case 7: unlockDesc = "Unlocked Arthas Menethil & Procedural Lofi Study Radio!"; break;
            case 8: unlockDesc = "Unlocked Geralt of Rivia & NotebookLM Export!"; break;
            case 9: unlockDesc = "Unlocked Doom Slayer & Extreme Focus Audio!"; break;
            case 10: unlockDesc = "Unlocked Master Chief! You are now a Grandmaster CA. All features and themes are fully unlocked!"; break;
            default: unlockDesc = "Unlocked new avatar profile.";
        }
        
        descText.textContent = unlockDesc;
        banner.classList.add('active');
        this.playExpiryAlarm();
    }

    damageActiveBoss(amount, message) {
        const ws = this.getActiveWorkspace();
        if (ws.campaignChapter > 6) {
            this.renderBossPanel();
            return;
        }

        const quest = this.campaignQuests[ws.campaignChapter - 1];
        if (!quest) return;

        ws.campaignBossHp = Math.max(0, ws.campaignBossHp - amount);
        
        const logEl = document.getElementById('quest-log-text');
        
        if (ws.campaignBossHp <= 0) {
            // Defeated!
            const xpReward = quest.rewardXp;
            ws.campaignChapter += 1;
            
            let winMsg = `🏆 You defeated ${quest.bossName}! Chapter cleared. Earned +${xpReward} XP!`;
            
            if (ws.campaignChapter <= 6) {
                const nextQuest = this.campaignQuests[ws.campaignChapter - 1];
                ws.campaignBossHp = nextQuest.maxHp;
                winMsg += ` Chapter ${ws.campaignChapter} started: Fight ${nextQuest.bossName}!`;
            } else {
                winMsg += ` Congratulations! You have cleared all CA Final obstacle bosses and earned the "CA" Prefix!`;
            }
            
            if (logEl) logEl.textContent = winMsg;
            this.addXP(xpReward);
        } else {
            if (logEl) {
                logEl.textContent = `${message} (${quest.bossName} took ${amount} damage!)`;
            }
        }
        
        this.saveState();
        this.renderBossPanel();
    }

    renderBossPanel() {
        const ws = this.getActiveWorkspace();
        const bossImg = document.getElementById('boss-image');
        const bossName = document.getElementById('boss-name');
        const bossDesc = document.getElementById('boss-description');
        const hpCurrent = document.getElementById('boss-hp-current');
        const hpMax = document.getElementById('boss-hp-max');
        const hpFill = document.getElementById('boss-hp-fill');
        
        if (ws.campaignChapter > 6) {
            if (bossImg) bossImg.src = 'assets/images/characters/chief.png';
            if (bossName) bossName.textContent = 'Grandmaster CA (Cleared)';
            if (bossDesc) bossDesc.textContent = 'All obstacle bosses defeated! The Prefix "CA" signature stamp is unlocked. Your final exams are fully prepared!';
            if (hpCurrent) hpCurrent.textContent = '0';
            if (hpMax) hpMax.textContent = '0';
            if (hpFill) hpFill.style.width = '100%';
            return;
        }
        
        const quest = this.campaignQuests[ws.campaignChapter - 1];
        if (!quest) return;
        
        if (bossImg) bossImg.src = quest.image || 'assets/images/characters/dragon.png';
        if (bossName) bossName.textContent = `${quest.bossName} (Chapter ${ws.campaignChapter})`;
        if (bossDesc) bossDesc.textContent = quest.description;
        if (hpCurrent) hpCurrent.textContent = ws.campaignBossHp;
        if (hpMax) hpMax.textContent = quest.maxHp;
        
        const hpPercent = Math.round((ws.campaignBossHp / quest.maxHp) * 100);
        if (hpFill) hpFill.style.width = `${hpPercent}%`;
    }

    renderProfileCard() {
        const ws = this.getActiveWorkspace();
        const avatarEl = document.getElementById('profile-avatar');
        const usernameEl = document.getElementById('profile-username');
        const rankEl = document.getElementById('profile-rank');
        const charTemplateEl = document.getElementById('profile-char-template');
        const levelEl = document.getElementById('profile-level');
        const xpCurrentEl = document.getElementById('profile-xp-current');
        const xpNextEl = document.getElementById('profile-xp-next');
        const xpFillEl = document.getElementById('profile-xp-fill');
        
        const char = this.charactersDb.find(c => c.id === ws.characterId) || this.charactersDb[0];
        const nextChar = this.charactersDb[ws.level] || this.charactersDb[this.charactersDb.length - 1];
        
        if (avatarEl) avatarEl.src = char.avatar || 'assets/images/characters/steve.png';
        if (usernameEl) {
            const prefix = ws.level >= 10 ? "CA " : "";
            usernameEl.textContent = `${prefix}${ws.username || 'SteveCraft'}`;
        }
        if (rankEl) rankEl.textContent = char.rank;
        if (charTemplateEl) charTemplateEl.textContent = `${char.game} ${char.name}`;
        if (levelEl) levelEl.textContent = ws.level;
        if (xpCurrentEl) xpCurrentEl.textContent = ws.xp;
        
        const xpRequiredForCurrent = char.xpReq;
        const xpRequiredForNext = nextChar.xpReq;
        const diffTotal = xpRequiredForNext - xpRequiredForCurrent;
        
        if (xpNextEl) xpNextEl.textContent = ws.level >= 10 ? 'Max' : xpRequiredForNext;
        
        if (xpFillEl) {
            if (ws.level >= 10) {
                xpFillEl.style.width = '100%';
            } else {
                const relativeXp = ws.xp - xpRequiredForCurrent;
                const percent = Math.min(100, Math.max(0, Math.round((relativeXp / diffTotal) * 100)));
                xpFillEl.style.width = `${percent}%`;
            }
        }
    }

    // --- Admin Security Modal & Authorization Logic ---
    updateLockIcon() {
        const lockBtn = document.getElementById('lock-toggle-btn');
        if (!lockBtn) return;
        
        if (this.state.settings.adminLockEnabled) {
            lockBtn.style.display = 'flex';
            if (this.isAdminSessionUnlocked) {
                lockBtn.innerHTML = '<i class="fa-solid fa-lock-open text-success" style="color:#00e676;"></i>';
                lockBtn.title = "Admin actions unlocked. Click to re-lock.";
            } else {
                lockBtn.innerHTML = '<i class="fa-solid fa-lock text-warn" style="color:#ff9e00;"></i>';
                lockBtn.title = "Admin actions locked. Click to authorize.";
            }
        } else {
            lockBtn.style.display = 'none';
        }
    }

    async toggleAdminLockState() {
        if (this.isAdminSessionUnlocked) {
            this.isAdminSessionUnlocked = false;
            this.showToast("Admin access locked.");
            this.updateLockIcon();
        } else {
            this.checkAdminAuthorization(() => {
                this.showToast("Admin session authorized.");
            });
        }
    }

    checkAdminAuthorization(callback) {
        if (!this.state.settings.adminLockEnabled || this.isAdminSessionUnlocked) {
            callback();
            return;
        }
        this.pendingAdminAction = callback;
        this.togglePasscodeModal(true);
    }

    togglePasscodeModal(show) {
        const modal = document.getElementById('passcode-modal');
        const input = document.getElementById('admin-passcode-input');
        const errorMsg = document.getElementById('passcode-error-msg');
        
        if (!modal) return;
        
        if (show) {
            if (input) input.value = '';
            if (errorMsg) errorMsg.textContent = '';
            modal.classList.add('active');
            if (input) setTimeout(() => input.focus(), 200);
        } else {
            modal.classList.remove('active');
            this.pendingAdminAction = null;
        }
    }

    async verifyAdminPasscode() {
        const input = document.getElementById('admin-passcode-input');
        const errorMsg = document.getElementById('passcode-error-msg');
        
        if (!input) return;
        
        const passcode = input.value;
        if (!passcode) {
            if (errorMsg) errorMsg.textContent = "Please enter passcode.";
            return;
        }

        let enteredHash = "";
        if (window.electronAPI) {
            enteredHash = await window.electronAPI.hashPassword(passcode);
        } else {
            // Plaintext fallback for browser testing
            enteredHash = passcode; 
        }

        if (enteredHash === this.state.settings.adminPasswordHash) {
            this.isAdminSessionUnlocked = true;
            this.updateLockIcon();
            this.togglePasscodeModal(false);
            
            if (this.pendingAdminAction) {
                const action = this.pendingAdminAction;
                this.pendingAdminAction = null;
                action();
            }
        } else {
            if (errorMsg) errorMsg.textContent = "Access Denied: Incorrect passcode.";
            input.value = '';
            input.focus();
        }
    }

    // --- Quote Ticker Engine ---
    initQuoteTicker() {
        const tickerEl = document.getElementById('quote-ticker-text');
        if (!tickerEl) return;
        
        const rotateQuote = () => {
            const idx = Math.floor(Math.random() * this.quotesPool.length);
            tickerEl.textContent = this.quotesPool[idx];
        };
        
        rotateQuote();
        // Rotate quote every 60 seconds (1 minute)
        setInterval(rotateQuote, 60000);
    }

    // --- Study Hub Accordions ---
    toggleAccordion(element) {
        element.classList.toggle('active');
    }

    // --- Daily Health Tracker Methods ---
    handleAddDailyLog() {
        this.checkAdminAuthorization(() => {
            const date = document.getElementById('log-date').value;
            const sleep = parseFloat(document.getElementById('log-sleep').value) || 0;
            const water = parseInt(document.getElementById('log-water').value) || 0;
            const exercise = parseInt(document.getElementById('log-exercise').value) || 0;
            const screentime = parseInt(document.getElementById('log-screentime').value) || 0;
            
            if (!date) {
                alert("Please select a date.");
                return;
            }
            
            const existingIdx = this.state.dailyHealthLogs.findIndex(l => l.date === date);
            const newLog = { date, sleep, water, exercise, screentime };
            
            if (existingIdx !== -1) {
                this.state.dailyHealthLogs[existingIdx] = newLog;
            } else {
                this.state.dailyHealthLogs.push(newLog);
            }
            
            this.saveState();
            this.renderDailyHealthLogs();
            this.showToast('Daily health metrics saved.');
            this.addXP(50);
            this.damageActiveBoss(50, `Logged daily health metrics: ${sleep}h sleep, ${water} glasses water`);
            
            // Reset form inputs except date
            document.getElementById('log-sleep').value = '';
            document.getElementById('log-water').value = '';
            document.getElementById('log-exercise').value = '';
            document.getElementById('log-screentime').value = '';
        });
    }

    renderDailyHealthLogs() {
        const container = document.getElementById('daily-logs-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (!this.state.dailyHealthLogs || this.state.dailyHealthLogs.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-calendar-days"></i>
                    <p>No health logs saved yet. Start tracking today!</p>
                </div>
            `;
            return;
        }
        
        const sorted = [...this.state.dailyHealthLogs].sort((a,b) => new Date(b.date) - new Date(a.date));
        
        sorted.forEach(log => {
            const card = document.createElement('div');
            card.className = 'daily-log-card';
            
            const dateObj = new Date(log.date + 'T00:00:00');
            const dateFormatted = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            
            card.innerHTML = `
                <div class="daily-log-meta">
                    <div class="daily-log-date">${dateFormatted}</div>
                    <div class="daily-log-metrics">
                        <span class="metric-item"><i class="fa-solid fa-bed"></i> ${log.sleep}h Sleep</span>
                        <span class="metric-item"><i class="fa-solid fa-glass-water"></i> ${log.water} Glasses</span>
                        <span class="metric-item"><i class="fa-solid fa-person-running"></i> ${log.exercise}m Exercise</span>
                        <span class="metric-item"><i class="fa-solid fa-laptop"></i> ${log.screentime}m Screen</span>
                    </div>
                </div>
                <button class="btn-delete-log" onclick="app.deleteDailyHealthLog('${log.date}')" title="Delete Log">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            container.appendChild(card);
        });
    }

    deleteDailyHealthLog(date) {
        this.checkAdminAuthorization(() => {
            if (confirm("Are you sure you want to delete this health log?")) {
                this.state.dailyHealthLogs = this.state.dailyHealthLogs.filter(l => l.date !== date);
                this.saveState();
                this.renderDailyHealthLogs();
                this.showToast('Daily health log deleted.');
            }
        });
    }

    // --- Hobby Tracker Methods ---
    handleAddHobbyLog() {
        this.checkAdminAuthorization(() => {
            const name = document.getElementById('hobby-name').value.trim();
            const date = document.getElementById('hobby-date').value;
            const duration = parseInt(document.getElementById('hobby-duration').value) || 0;
            const mood = document.getElementById('hobby-mood').value;
            
            if (!name || !date || duration <= 0) {
                alert("Please fill in all fields correctly.");
                return;
            }
            
            const newLog = {
                id: 'hobby_' + Date.now(),
                name,
                date,
                duration,
                mood
            };
            
            this.state.hobbyLogs.push(newLog);
            this.saveState();
            this.renderHobbyLogs();
            this.showToast('Hobby activity logged.');
            this.addXP(50);
            this.damageActiveBoss(50, `Logged mental health break: ${name} (${duration} mins)`);
            
            // Reset form inputs except date
            document.getElementById('hobby-name').value = '';
            document.getElementById('hobby-duration').value = '';
        });
    }

    renderHobbyLogs() {
        const container = document.getElementById('hobbies-logs-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (!this.state.hobbyLogs || this.state.hobbyLogs.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-gamepad"></i>
                    <p>No activities logged yet. Take a break and write down a hobby!</p>
                </div>
            `;
            return;
        }
        
        const sorted = [...this.state.hobbyLogs].sort((a,b) => new Date(b.date) - new Date(a.date));
        
        sorted.forEach(log => {
            const card = document.createElement('div');
            card.className = 'hobby-card-item';
            
            const dateObj = new Date(log.date + 'T00:00:00');
            const dateFormatted = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            
            card.innerHTML = `
                <div class="hobby-meta">
                    <div class="hobby-meta-title"><i class="fa-solid fa-icons"></i> ${log.name}</div>
                    <div class="hobby-meta-sub">
                        <span><i class="fa-solid fa-calendar-day"></i> ${dateFormatted}</span>
                        <span><i class="fa-solid fa-clock"></i> ${log.duration} mins</span>
                        <span><i class="fa-solid fa-face-smile"></i> ${log.mood}</span>
                    </div>
                </div>
                <button class="btn-delete-log" onclick="app.deleteHobbyLog('${log.id}')" title="Delete Log">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            container.appendChild(card);
        });
    }

    deleteHobbyLog(id) {
        this.checkAdminAuthorization(() => {
            if (confirm("Are you sure you want to delete this activity log?")) {
                this.state.hobbyLogs = this.state.hobbyLogs.filter(l => l.id !== id);
                this.saveState();
                this.renderHobbyLogs();
                this.showToast('Activity log deleted.');
            }
        });
    }

    logActivity(message) {
        if (window.electronAPI && window.electronAPI.writeLog) {
            window.electronAPI.writeLog(message).catch(err => console.error("Error writing activity log:", err));
        }
    }

    async refreshDiagnosticsLogs() {
        const logBox = document.getElementById('diagnostics-log-box');
        if (logBox) {
            try {
                const logs = await window.electronAPI.readLogs();
                logBox.value = logs;
                logBox.scrollTop = logBox.scrollHeight;
            } catch (e) {
                logBox.value = "Failed to load logs: " + e.message;
            }
        }
    }

    async handleBugSubmit() {
        const descInput = document.getElementById('bug-description-input');
        if (!descInput) return;
        const description = descInput.value.trim();
        if (!description) {
            alert("Please enter a description of the bug or error.");
            return;
        }

        try {
            this.showToast("Submitting bug report...");
            const result = await window.electronAPI.submitBugReport(description);
            if (result && result.success) {
                this.showToast("Bug report submitted successfully!");
                descInput.value = '';
                this.logActivity(`Submitted bug report: "${description.substring(0, 50)}..."`);
                this.refreshDiagnosticsLogs();
            } else {
                alert("Failed to submit bug report: " + (result ? result.error : 'Unknown error'));
            }
        } catch (e) {
            alert("Error submitting bug report: " + e.message);
        }
    }

    async handleClearLogs() {
        if (confirm("Are you sure you want to clear the activity logs? This cannot be undone.")) {
            try {
                const success = await window.electronAPI.clearLogs();
                if (success) {
                    this.showToast("Activity logs cleared.");
                    this.refreshDiagnosticsLogs();
                } else {
                    alert("Failed to clear logs.");
                }
            } catch (e) {
                alert("Error clearing logs: " + e.message);
            }
        }
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.app-header');
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
            
            if (!this.state.settings) {
                this.state.settings = {};
            }
            this.state.settings.sidebarCollapsed = sidebar.classList.contains('collapsed');
            this.saveState();
            
            this.updateSidebarLayout();
            this.updateCountdownBadge();
        }
    }

    updateSidebarLayout() {
        const sidebar = document.querySelector('.app-header');
        const container = document.querySelector('.app-container');
        const quoteBar = document.querySelector('.quote-bar');
        const toggleIcon = document.querySelector('.sidebar-toggle-btn i');
        
        if (!sidebar) return;
        
        const isCollapsed = sidebar.classList.contains('collapsed');
        
        if (isCollapsed) {
            if (container) container.style.marginLeft = '70px';
            if (quoteBar) quoteBar.style.left = '70px';
            if (toggleIcon) {
                toggleIcon.className = 'fa-solid fa-angles-right';
            }
        } else {
            if (container) container.style.marginLeft = '260px';
            if (quoteBar) quoteBar.style.left = '260px';
            if (toggleIcon) {
                toggleIcon.className = 'fa-solid fa-angles-left';
            }
        }
    }
}

// Instantiate and initialize global scope reference
const app = new CAFinalTrackerApp();
window.addEventListener('DOMContentLoaded', () => {
    app.init();
});
window.app = app; // Bind helper functions to DOM action scopes
