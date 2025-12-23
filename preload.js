// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openPartnerSite: (url, partnerName) => ipcRenderer.invoke('open-partner-site', url, partnerName),
  navigateToRoute: (route) => ipcRenderer.invoke('navigate-to-route', route),
  database: {
    getAll: (table) => ipcRenderer.invoke('database:getAll', table),
    insert: (table, data) => ipcRenderer.invoke('database:insert', table, data),
    delete: (table, id) => ipcRenderer.invoke('database:delete', table, id)
  },

  file: {
    save: (file_name, buffer) => {console.log("preload: вызов file.save с file_name:", file_name)
      return ipcRenderer.invoke('file:save', {file_name, buffer})},
      delete: (fileUrl) => ipcRenderer.invoke('file:delete', fileUrl)
  }
});