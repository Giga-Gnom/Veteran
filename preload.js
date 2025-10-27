// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openPartnerSite: (url, partnerName) => ipcRenderer.invoke('open-partner-site', url, partnerName),
  navigateToRoute: (route) => ipcRenderer.invoke('navigate-to-route', route)
});