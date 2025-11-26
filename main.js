import { app, BrowserWindow, globalShortcut } from 'electron';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_IS_DEV === '1';

let mainWindow;
let adminWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
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
    autoHideMenuBar: true,
    show: false
  });

  if (isDev) {
    mainWindow.laodURL('http://localhost:5173')
  } else {
    const indexPath = path.join(__dirname, 'dist/index.html')
    mainWindow.loadURL(`file://${indexPath}`)  }

    mainWindow.once('ready-to-show', ()=> {
      mainWindow.show()
    })

    mainWindow.on('closed', () => {
      mainWindow = null
    })
}

function createAdminWindow() {
  adminWindow = new BrowserWindow({
    width: 1400, // Шире чем киоск
    height: 900, // Выше чем киоск
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: 'Админ-панель киоска', // Заголовок окна
    autoHideMenuBar: true,
    resizable: true, // Можно менять размер
    minimizable: true, // Можно сворачивать
    maximizable: true, // Можно разворачивать
    fullscreen: false, // НЕ полноэкранный режим
    show: false // Показываем когда готово
  })

  if (isDev) {
    adminWindow.loadURL('http://localhost:5173/#admin')
  } else {
    const adminIndexPath = path.join(__dirname, "dist/index.html")
    adminWindow.loadURL(`file://${adminIndexPath}#admin`)
  }

  adminWindow.once('ready-to-show', () => {
    adminWindow.show()
  })

  if (isDev) {
    adminWindow.webContents.openDevTools()
  }

  adminWindow.on('closed', () => {
    adminWindow = null
  })
}

function registerGlobalShortcuts() {
  const ret = globalShortcut.register('Ctrl+Alt+Shift+F12', () => {
    createAdminWindow()
  })
  
  if (!ret) {
    console.log('Ошибка регистрации горячих клавиш');
  } else {
    console.log('Горячие клавиши зарегистрированы: Ctrl+Alt+Shift+F12');
  }
}

app.whenReady().then(() => {
  createMainWindow();
  registerGlobalShortcuts();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})