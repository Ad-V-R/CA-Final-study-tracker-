/**
 * CA Final Focus Tracker - Electron Preload Script
 * Exposes secure system APIs to the frontend window context.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Local File Storage
    saveLocalData: (data) => ipcRenderer.invoke('storage:save', data),
    loadLocalData: () => ipcRenderer.invoke('storage:load'),

    // Google OAuth Operations
    googleSignIn: () => ipcRenderer.invoke('cloud:sign-in'),
    googleSignOut: () => ipcRenderer.invoke('cloud:sign-out'),
    
    // Cloud Sync Operations
    syncWithGoogleDrive: (data) => ipcRenderer.invoke('cloud:sync-upload', data),
    restoreFromGoogleDrive: () => ipcRenderer.invoke('cloud:sync-download'),
    getCloudState: () => ipcRenderer.invoke('cloud:get-state'),

    // Cryptography Services
    hashPassword: (password) => ipcRenderer.invoke('crypto:hash', password),
    
    // Custom Saves & Backups Dialogs
    exportState: (data) => ipcRenderer.invoke('storage:export', data),
    importState: () => ipcRenderer.invoke('storage:import'),
    openBackupsFolder: () => ipcRenderer.invoke('storage:open-backups-folder'),
    writeLog: (message) => ipcRenderer.invoke('log:add', message),
    readLogs: () => ipcRenderer.invoke('log:read'),
    clearLogs: () => ipcRenderer.invoke('log:clear'),
    submitBugReport: (description) => ipcRenderer.invoke('bug:submit', description),
    
    // Callbacks from Main Process to Renderer
    onCloudStateChanged: (callback) => {
        const listener = (event, state) => callback(state);
        ipcRenderer.on('cloud:state-change', listener);
        return () => ipcRenderer.removeListener('cloud:state-change', listener);
    },
    
    onSyncLog: (callback) => {
        const listener = (event, message) => callback(message);
        ipcRenderer.on('cloud:sync-log', listener);
        return () => ipcRenderer.removeListener('cloud:sync-log', listener);
    }
});
