/**
 * CA Final Focus Tracker - Electron Main Process
 * Project Name: Param
 * Author: Adarsh R (CA Finalist)
 * Version: Beta 1.0
 */

const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const url = require('url');
const crypto = require('crypto');

// --- Global App States & Paths ---
let mainWindow = null;
let oauthServer = null;

const USER_DATA_PATH = app.getPath('userData');
const STATE_FILE = path.join(USER_DATA_PATH, 'ca_tracker_state.json');
const AUTH_FILE = path.join(USER_DATA_PATH, 'drive_auth_tokens.json');

// Encryption keys to secure tokens locally
const ENCRYPTION_KEY = crypto.createHash('sha256').update(app.getPath('home')).digest(); // unique machine-dependent key
const IV_LENGTH = 16;

// Google OAuth Constants
// To run out-of-the-box, the user can supply their own credentials in the UI, 
// but we provide standard parameters so the code is fully implemented.
let GOOGLE_CLIENT_ID = '';
let GOOGLE_CLIENT_SECRET = '';
const REDIRECT_PORT = 8599;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}`;

// --- Helper Functions: Encryption ---
function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (e) {
        console.error("Decryption failed", e);
        return null;
    }
}

const LOG_FILE = path.join(USER_DATA_PATH, 'app_activity.log');
function writeToActivityLog(message) {
    try {
        const timestamp = new Date().toISOString();
        const logLine = `[${timestamp}] ${message}\n`;
        fs.appendFileSync(LOG_FILE, logLine, 'utf8');
    } catch (e) {
        console.error("Failed to write to app_activity.log", e);
    }
}

// --- Helper Functions: Safe File Storage ---
function loadLocalState() {
    if (fs.existsSync(STATE_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        } catch (e) {
            console.error("Error reading local state file", e);
        }
    }
    return null;
}

function performDailyBackupAndCleanup(state) {
    try {
        const backupsDir = path.join(USER_DATA_PATH, 'backups');
        if (!fs.existsSync(backupsDir)) {
            fs.mkdirSync(backupsDir, { recursive: true });
        }

        // 1. Create daily backup
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;
        const backupFile = path.join(backupsDir, `ca_tracker_backup_${todayStr}.json`);

        if (!fs.existsSync(backupFile)) {
            fs.writeFileSync(backupFile, JSON.stringify(state, null, 2), 'utf8');
            writeToActivityLog(`Daily backup created: ca_tracker_backup_${todayStr}.json`);
        }

        // 2. Perform optional 30-day cleanup if enabled in globalSettings
        if (state && state.globalSettings && state.globalSettings.autoCleanupBackups) {
            const files = fs.readdirSync(backupsDir);
            const cutoffTime = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days in ms
            files.forEach(file => {
                if (file.startsWith('ca_tracker_backup_') && file.endsWith('.json')) {
                    const filePath = path.join(backupsDir, file);
                    try {
                        const stats = fs.statSync(filePath);
                        if (stats.mtimeMs < cutoffTime) {
                            fs.unlinkSync(filePath);
                            writeToActivityLog(`Auto-cleanup deleted outdated backup: ${file}`);
                        }
                    } catch (err) {
                        console.error(`Error checking stats for ${file}:`, err);
                    }
                }
            });
        }
    } catch (e) {
        console.error("Failed to perform daily backup or cleanup:", e);
        writeToActivityLog("Error: Failed to perform daily backup or cleanup: " + e.message);
    }
}

function saveLocalState(state) {
    try {
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
        performDailyBackupAndCleanup(state);
        writeToActivityLog("State saved successfully.");
        return true;
    } catch (e) {
        console.error("Error writing state file", e);
        writeToActivityLog("Error: Failed to save state database: " + e.message);
        return false;
    }
}


function loadAuthTokens() {
    if (fs.existsSync(AUTH_FILE)) {
        try {
            const raw = fs.readFileSync(AUTH_FILE, 'utf8');
            const decrypted = decrypt(raw);
            if (decrypted) {
                return JSON.parse(decrypted);
            }
        } catch (e) {
            console.error("Error loading auth tokens", e);
        }
    }
    return null;
}

function saveAuthTokens(tokens) {
    try {
        const encrypted = encrypt(JSON.stringify(tokens));
        fs.writeFileSync(AUTH_FILE, encrypted, 'utf8');
        return true;
    } catch (e) {
        console.error("Error saving auth tokens", e);
        return false;
    }
}

// --- Electron Window Lifecycle ---
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1250,
        height: 850,
        minWidth: 900,
        minHeight: 650,
        title: "Param - CA Final Focus & Revision Tracker (Beta ver. 1.0) Prepared by Adarsh R",
        icon: path.join(__dirname, 'icon.png'), // will fallback silently if missing
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        }
    });

    // Load main HTML
    mainWindow.loadFile('index.html');
    
    // Remove default menu bar for clean app look
    mainWindow.setMenuBarVisibility(false);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// --- HTTPS Request Helper Utility (Promises) ---
function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                let parsed = body;
                try {
                    parsed = JSON.parse(body);
                } catch (e) {}
                resolve({ statusCode: res.statusCode, headers: res.headers, data: parsed });
            });
        });

        req.on('error', (err) => reject(err));

        if (postData) {
            req.write(typeof postData === 'object' ? JSON.stringify(postData) : postData);
        }
        req.end();
    });
}

// --- Google Drive API Client (Native Implementation) ---
class GoogleDriveClient {
    constructor() {
        this.tokens = loadAuthTokens();
        // Load Client Credentials if saved in state or prompt user
        this.loadClientCredentials();
    }

    loadClientCredentials() {
        const localState = loadLocalState();
        if (localState && localState.settings && localState.settings.googleClientId) {
            GOOGLE_CLIENT_ID = localState.settings.googleClientId;
            GOOGLE_CLIENT_SECRET = localState.settings.googleClientSecret;
        }
    }

    async refreshAccessToken() {
        if (!this.tokens || !this.tokens.refresh_token) {
            throw new Error("No refresh token available. Re-authentication required.");
        }

        this.logToRenderer("Refreshing Google authorization token...");

        const postData = new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            refresh_token: this.tokens.refresh_token,
            grant_type: 'refresh_token'
        }).toString();

        const options = {
            hostname: 'oauth2.googleapis.com',
            port: 443,
            path: '/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const res = await makeRequest(options, postData);
        
        if (res.statusCode !== 200) {
            throw new Error(`Refresh failed: ${JSON.stringify(res.data)}`);
        }

        // Keep existing refresh token, append new expiry details
        this.tokens = {
            ...this.tokens,
            access_token: res.data.access_token,
            expiry_date: Date.now() + (res.data.expires_in * 1000)
        };
        
        saveAuthTokens(this.tokens);
        this.logToRenderer("Tokens updated successfully.");
        this.emitStateChange();
    }

    async getValidAccessToken() {
        if (!this.tokens || !this.tokens.access_token) {
            throw new Error("User not signed in to Google Drive.");
        }

        // Refresh if within 5 minutes of expiration
        if (!this.tokens.expiry_date || Date.now() > (this.tokens.expiry_date - 300000)) {
            await this.refreshAccessToken();
        }

        return this.tokens.access_token;
    }

    async getFileId(accessToken) {
        // Search in appDataFolder for the backup file name
        const query = encodeURIComponent("name = 'ca_focus_tracker_backup.json' and 'appDataFolder' in parents and trashed = false");
        const options = {
            hostname: 'www.googleapis.com',
            port: 443,
            path: `/drive/v3/files?q=${query}&spaces=appDataFolder&fields=files(id,name)`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };

        const res = await makeRequest(options);
        if (res.statusCode !== 200) {
            throw new Error(`Search failed: ${JSON.stringify(res.data)}`);
        }

        const files = res.data.files;
        return files && files.length > 0 ? files[0].id : null;
    }

    async uploadBackup(stateData) {
        this.loadClientCredentials();
        if (!GOOGLE_CLIENT_ID) {
            throw new Error("Google Client ID not configured. Please supply developer credentials in settings.");
        }

        const accessToken = await this.getValidAccessToken();
        const fileId = await this.getFileId(accessToken);
        const fileContent = JSON.stringify(stateData);

        this.logToRenderer("Uploading study log configurations to Google Drive...");

        if (fileId) {
            // Update existing file
            const options = {
                hostname: 'www.googleapis.com',
                port: 443,
                path: `/upload/drive/v3/files/${fileId}?uploadType=media`,
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(fileContent)
                }
            };
            const res = await makeRequest(options, fileContent);
            if (res.statusCode !== 200) {
                throw new Error(`Upload update failed: ${JSON.stringify(res.data)}`);
            }
        } else {
            // Create new file metadata first
            const metadata = {
                name: 'ca_focus_tracker_backup.json',
                parents: ['appDataFolder']
            };
            
            const boundary = '-------314159265358979323846';
            const delimiter = `\r\n--${boundary}\r\n`;
            const closeDelimiter = `\r\n--${boundary}--\r\n`;
            
            const multipartBody = 
                delimiter + 
                'Content-Type: application/json; charset=UTF-8\r\n\r\n' + 
                JSON.stringify(metadata) + 
                delimiter + 
                'Content-Type: application/json\r\n\r\n' + 
                fileContent + 
                closeDelimiter;

            const options = {
                hostname: 'www.googleapis.com',
                port: 443,
                path: '/upload/drive/v3/files?uploadType=multipart',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': `multipart/related; boundary=${boundary}`,
                    'Content-Length': Buffer.byteLength(multipartBody)
                }
            };

            const res = await makeRequest(options, multipartBody);
            if (res.statusCode !== 200) {
                throw new Error(`Upload creation failed: ${JSON.stringify(res.data)}`);
            }
        }

        this.logToRenderer("Upload backup sync completed.");
        return true;
    }

    async downloadBackup() {
        this.loadClientCredentials();
        if (!GOOGLE_CLIENT_ID) {
            throw new Error("Google Client ID not configured.");
        }

        const accessToken = await this.getValidAccessToken();
        const fileId = await this.getFileId(accessToken);

        this.logToRenderer("Checking for backups on Google Drive...");

        if (!fileId) {
            this.logToRenderer("No cloud backup file found in Drive AppData folder.");
            return null;
        }

        const options = {
            hostname: 'www.googleapis.com',
            port: 443,
            path: `/drive/v3/files/${fileId}?alt=media`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };

        const res = await makeRequest(options);
        if (res.statusCode !== 200) {
            throw new Error(`Backup download failed: ${JSON.stringify(res.data)}`);
        }

        this.logToRenderer("Backup download completed.");
        return res.data;
    }

    logToRenderer(msg) {
        if (mainWindow) {
            mainWindow.webContents.send('cloud:sync-log', msg);
        }
    }

    emitStateChange() {
        if (mainWindow) {
            const signedIn = !!(this.tokens && this.tokens.access_token);
            mainWindow.webContents.send('cloud:state-change', { signedIn });
        }
    }
}

const driveClient = new GoogleDriveClient();

// --- Local Port Listener for Google OAuth ---
function startOAuthServer(resolve, reject) {
    if (oauthServer) {
        oauthServer.close();
    }

    oauthServer = http.createServer(async (req, res) => {
        const reqUrl = url.parse(req.url, true);
        
        if (reqUrl.pathname === '/') {
            const authCode = reqUrl.query.code;
            
            if (authCode) {
                // Send success response web page
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <body style="font-family:'Outfit',sans-serif; text-align:center; padding-top:4rem; background:#0b0f19; color:#f3f4f6;">
                            <h2 style="color:#00e5ff;">Authorization Successful!</h2>
                            <p>CA Final Focus Tracker has been authorized. You can close this tab now and return to the application.</p>
                        </body>
                    </html>
                `);

                // Close server immediately after this request
                oauthServer.close(() => {
                    oauthServer = null;
                });

                try {
                    // Exchange code for tokens
                    const postData = new URLSearchParams({
                        code: authCode,
                        client_id: GOOGLE_CLIENT_ID,
                        client_secret: GOOGLE_CLIENT_SECRET,
                        redirect_uri: REDIRECT_URI,
                        grant_type: 'authorization_code'
                    }).toString();

                    const options = {
                        hostname: 'oauth2.googleapis.com',
                        port: 443,
                        path: '/token',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Content-Length': Buffer.byteLength(postData)
                        }
                    };

                    const tokenRes = await makeRequest(options, postData);
                    if (tokenRes.statusCode === 200) {
                        const tokens = {
                            access_token: tokenRes.data.access_token,
                            refresh_token: tokenRes.data.refresh_token,
                            expiry_date: Date.now() + (tokenRes.data.expires_in * 1000)
                        };
                        driveClient.tokens = tokens;
                        saveAuthTokens(tokens);
                        driveClient.emitStateChange();
                        resolve(true);
                    } else {
                        reject(new Error(`Token exchange error: ${JSON.stringify(tokenRes.data)}`));
                    }
                } catch (e) {
                    reject(e);
                }
            } else {
                res.writeHead(400, { 'Content-Type': 'text/html' });
                res.end("<h3>Authorization code not found in request redirect.</h3>");
                reject(new Error("Callback received without auth code."));
            }
        }
    });

    oauthServer.listen(REDIRECT_PORT, '127.0.0.1', (err) => {
        if (err) {
            reject(err);
        }
    });
}

// --- IPC Communication Handlers ---

// Storage API
ipcMain.handle('storage:save', async (event, data) => {
    return saveLocalState(data);
});

ipcMain.handle('storage:load', async () => {
    return loadLocalState();
});

// OAuth API
ipcMain.handle('cloud:sign-in', async () => {
    driveClient.loadClientCredentials();
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
        throw new Error("Google Client ID or Client Secret is missing. Please configure them in Settings first.");
    }

    return new Promise((resolve, reject) => {
        startOAuthServer(resolve, reject);

        // Open user browser
        const scopes = encodeURIComponent('https://www.googleapis.com/auth/drive.appdata');
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${scopes}&access_type=offline&prompt=consent`;
        
        shell.openExternal(authUrl);
    });
});

ipcMain.handle('cloud:sign-out', async () => {
    driveClient.tokens = null;
    if (fs.existsSync(AUTH_FILE)) {
        fs.unlinkSync(AUTH_FILE);
    }
    driveClient.emitStateChange();
    return true;
});

// Sync operations
ipcMain.handle('cloud:sync-upload', async (event, data) => {
    try {
        await driveClient.uploadBackup(data);
        return { success: true };
    } catch (e) {
        return { success: false, error: e.message };
    }
});

ipcMain.handle('cloud:sync-download', async () => {
    try {
        const cloudState = await driveClient.downloadBackup();
        return { success: true, data: cloudState };
    } catch (e) {
        return { success: false, error: e.message };
    }
});

ipcMain.handle('cloud:get-state', async () => {
    const tokens = loadAuthTokens();
    const signedIn = !!(tokens && tokens.access_token);
    return { signedIn };
});

// Cryptography API
ipcMain.handle('crypto:hash', async (event, password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
});

// Native Export / Import Saves
ipcMain.handle('storage:export', async (event, data) => {
    if (!mainWindow) return { success: false, error: 'No active window' };
    try {
        const { filePath } = await dialog.showSaveDialog(mainWindow, {
            title: 'Export Study Progress',
            defaultPath: path.join(app.getPath('downloads'), 'param_study_progress.json'),
            filters: [{ name: 'JSON Files', extensions: ['json'] }]
        });
        if (filePath) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            writeToActivityLog(`Progress exported to local file: ${filePath}`);
            return { success: true, filePath };
        }
        return { success: false, cancelled: true };
    } catch (e) {
        writeToActivityLog(`Error exporting progress: ${e.message}`);
        return { success: false, error: e.message };
    }
});

ipcMain.handle('storage:import', async () => {
    if (!mainWindow) return { success: false, error: 'No active window' };
    try {
        const { filePaths } = await dialog.showOpenDialog(mainWindow, {
            title: 'Import Study Progress',
            filters: [{ name: 'JSON Files', extensions: ['json'] }],
            properties: ['openFile']
        });
        if (filePaths && filePaths.length > 0) {
            const content = fs.readFileSync(filePaths[0], 'utf8');
            const parsed = JSON.parse(content);
            // Quick schema check
            if (parsed && (parsed.workspaces || parsed.tasks || parsed.studyLogs)) {
                writeToActivityLog(`Progress successfully imported from: ${filePaths[0]}`);
                return { success: true, data: parsed };
            } else {
                writeToActivityLog(`Failed import: Invalid save file format in ${filePaths[0]}`);
                return { success: false, error: 'Invalid save file format.' };
            }
        }
        return { success: false, cancelled: true };
    } catch (e) {
        writeToActivityLog(`Error importing progress: ${e.message}`);
        return { success: false, error: e.message };
    }
});

ipcMain.handle('storage:open-backups-folder', async () => {
    try {
        const backupsDir = path.join(USER_DATA_PATH, 'backups');
        if (!fs.existsSync(backupsDir)) {
            fs.mkdirSync(backupsDir, { recursive: true });
        }
        await shell.openPath(backupsDir);
        return { success: true };
    } catch (e) {
        return { success: false, error: e.message };
    }
});

// Activity Logging & Bug Reporting API
const BUG_FILE = path.join(USER_DATA_PATH, 'bug_reports.json');

ipcMain.handle('log:add', async (event, msg) => {
    writeToActivityLog(msg);
    return true;
});

ipcMain.handle('log:read', async () => {
    try {
        if (fs.existsSync(LOG_FILE)) {
            return fs.readFileSync(LOG_FILE, 'utf8');
        }
        return 'No logs available.';
    } catch (e) {
        return 'Failed to read logs: ' + e.message;
    }
});

ipcMain.handle('log:clear', async () => {
    try {
        if (fs.existsSync(LOG_FILE)) {
            fs.writeFileSync(LOG_FILE, '', 'utf8');
        }
        writeToActivityLog("Activity logs cleared by user.");
        return true;
    } catch (e) {
        return false;
    }
});

ipcMain.handle('bug:submit', async (event, description) => {
    try {
        let reports = [];
        if (fs.existsSync(BUG_FILE)) {
            try {
                reports = JSON.parse(fs.readFileSync(BUG_FILE, 'utf8'));
            } catch (e) {}
        }
        reports.push({
            id: 'bug_' + Date.now(),
            date: new Date().toISOString(),
            description: description,
            stateSnapshot: loadLocalState()
        });
        fs.writeFileSync(BUG_FILE, JSON.stringify(reports, null, 2), 'utf8');
        writeToActivityLog(`User submitted a bug report: ${description.slice(0, 60)}`);
        return { success: true };
    } catch (e) {
        return { success: false, error: e.message };
    }
});


