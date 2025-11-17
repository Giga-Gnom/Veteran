import { error } from 'console';
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_IS_DEV === '1';

const DatabaseManager = require('./src/database/db')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false,
      webviewTag: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false // Добавьте это для разработки
    },
    fullscreen: true,
    autoHideMenuBar: true
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
    
    // Добавьте обработчик ошибок для dev-режима
    win.webContents.on('did-fail-load', () => {
      setTimeout(() => {
        win.loadURL('http://localhost:5173');
      }, 1000);
    });
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));  }
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

//-----------------------------

app.whenReady().then(() => {
  const dbManager = new DatabaseManager();
  global.dbManager = dbManager;

  createWindow()
})

ipcMain.handle('get-page-content', async (event, pageSlug) => {
  try {
    return await global.dbManager.getPageContent(pageSlug)
  }
  catch (error) {
    console.error('Error getting page content: ', error)
    return {success: false, error: error.massage}
  }
})

ipcMain.handle('update-page-content', async (event, pageSlug, content) => {
  try {
    await global.dbManager.updatePageContent(pageSlug, content)
    return {success: true}
  }
  catch (error) {
    console.error('Error updating page content: ', error)
    return {success: false, error: error.massage}
  }
})