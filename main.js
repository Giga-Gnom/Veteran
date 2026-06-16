import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ========== 1. Константы ==========
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === 'development';
const resourcesPath = isDev ? process.cwd() : process.resourcesPath;

// ========== 2. Логирование ==========
const logFilePath = path.join(process.cwd(), 'app-startup.log');
function logToFile(msg) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${msg}\n`;
    try { fs.appendFileSync(logFilePath, line); } catch(e) {}
    console.log(msg);
}

logToFile('=== App start ===');
logToFile(`isDev: ${isDev}, __dirname: ${__dirname}, resourcesPath: ${resourcesPath}`);

// ========== 3. Глобальные переменные ==========
let mainWindow;
let adminWindow;
let dbService = null;

// ========== 4. Универсальный импорт (исправлен) ==========
async function safeImport(modulePath) {
    if (isDev) {
        return import(modulePath);
    } else {
        // Убираем './src/' из начала, если есть
        let relative = modulePath;
        if (relative.startsWith('./src/')) {
            relative = relative.substring(6);
        }
        
        // Добавляем src обратно в путь
        const asarPath = path.join(__dirname, 'src', relative);
        return await import('file://' + asarPath.replace(/\\/g, '/'));
    }
}

// ========== 5. Инициализация БД ==========
async function initDatabase() {
    logToFile('initDatabase() called');
    if (dbService) return dbService;
    try {
        logToFile('Before safeImport');
        const module = await safeImport('./src/services/database/connection.js');
        logToFile('After safeImport, module loaded');
        dbService = module.default || module;
        logToFile('Database module loaded');
        return dbService;
    } catch (error) {
        logToFile(`initDatabase error: ${error.message}\n${error.stack}`);
        throw error;
    }
}

// ========== 6. Миграции ==========
async function runAllMigrations(dbService) {
    try {
        let migrationsPath;
        if (isDev) {
            migrationsPath = path.join(__dirname, 'src', 'scripts', 'runAllMigrations.js');
        } else {
            migrationsPath = path.join(resourcesPath, 'src', 'scripts', 'runAllMigrations.js');
        }
        const fileUrl = 'file://' + migrationsPath.replace(/\\/g, '/');
        logToFile(`Loading migrations from: ${fileUrl}`);
        const { runAllMigrations: runMigrations } = await import(fileUrl);
        await runMigrations(dbService);
    } catch (error) {
        console.error('❌ Failed to load migrations:', error);
        logToFile(`Migration error: ${error.message}`);
    }
}

// ========== 7. Окна ==========
function createMainWindow() {
    logToFile('createMainWindow started');
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            webSecurity: false,
            webviewTag: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        fullscreen: true,
        autoHideMenuBar: true,
        show: false
    });

    if (isDev) {
        console.log('DEV: Loading from localhost');
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        try {
            const indexPath = path.join(__dirname, 'dist/index.html');
            const asarIndexPath = path.join(resourcesPath, 'app.asar', 'dist/index.html');
            if (fs.existsSync(indexPath)) {
                console.log('Loading from:', indexPath);
                mainWindow.loadFile(indexPath);
            } else if (fs.existsSync(asarIndexPath)) {
                console.log('Loading from asar:', asarIndexPath);
                mainWindow.loadFile(asarIndexPath);
            } else {
                console.error('Index.html not found');
                mainWindow.loadURL(`data:text/html,<h1>App loaded</h1><p>Database initialized</p>`);
            }
        } catch (error) {
            console.error('Load error:', error);
            mainWindow.loadURL(`data:text/html,<h1>Error</h1><p>${error.message}</p>`);
        }
    }

    mainWindow.once('ready-to-show', () => {
        logToFile('mainWindow ready-to-show');
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createAdminWindow() {
    adminWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: false,
            preload: path.join(__dirname, 'preload.js')
        },
        title: 'Админ-панель киоска',
        autoHideMenuBar: true,
        resizable: true,
        minimizable: true,
        maximizable: true,
        fullscreen: false,
        show: false
    });

    if (isDev) {
        adminWindow.loadURL('http://localhost:5173/#admin');
    } else {
        const adminIndexPath = path.join(__dirname, 'dist/index.html');
        adminWindow.loadURL(`file://${adminIndexPath}#admin`);
    }

    adminWindow.once('ready-to-show', () => {
        adminWindow.show();
    });

    adminWindow.on('closed', () => {
        adminWindow = null;
    });
}

// ========== 8. IPC обработчики ==========
ipcMain.handle('database:getAll', async (event, table) => {
    const db = await initDatabase();
    return await db.getAll(table);
});
ipcMain.handle('database:insert', async (event, table, data) => {
    const db = await initDatabase();
    return await db.insert(table, data);
});
ipcMain.handle('database:delete', async (event, table, id) => {
    const db = await initDatabase();
    return await db.delete(table, id);
});
ipcMain.handle('file:save', async (event, { file_name, buffer }) => {
    const userDataPath = app.getPath('userData');
    const documentsPath = path.join(userDataPath, 'documents');
    const timestamp = Date.now();
    const fileExt = path.extname(file_name);
    const uniqueFileName = `document_${timestamp}${fileExt}`;
    const filePath = path.join(documentsPath, uniqueFileName);
    fs.writeFileSync(filePath, Buffer.from(buffer));
    return { file_name: uniqueFileName, file_path: `file://${filePath}` };
});
ipcMain.handle('file:delete', async (event, fileUrl) => {
    const url = new URL(fileUrl);
    let filePath = url.pathname;
    if (process.platform === 'win32') filePath = filePath.substring(1);
    await fs.promises.unlink(filePath);
    return true;
});
ipcMain.handle('database:execute', async (event, query, params = []) => {
    const dbService = await initDatabase();
    await dbService.init?.();
    if (!dbService.db) throw new Error('Database not initialized!');
    const db = dbService.db;
    if (query.trim().toUpperCase().startsWith('SELECT')) {
        return db.prepare(query).all(...params);
    } else {
        return db.prepare(query).run(...params);
    }
});

// ========== 9. Горячие клавиши ==========
function registerGlobalShortcuts() {
    globalShortcut.register('Ctrl+Alt+Shift+F12', () => {
        console.log('Admin shortcut pressed');
        createAdminWindow();
    });
}

// ========== 10. Запуск приложения ==========
app.whenReady().then(async () => {
    console.log('App ready, initializing...');
    try {
        const userDataPath = app.getPath('userData');
        const documentsPath = path.join(userDataPath, 'documents');
        if (!fs.existsSync(documentsPath)) {
            fs.mkdirSync(documentsPath, { recursive: true });
        }
        console.log('documents path: ', documentsPath);

        logToFile('Calling initDatabase...');
        await initDatabase();
        logToFile('initDatabase completed');
        console.log('✅ Database ready');

        // Раскомментируйте после проверки работы окна
        await runAllMigrations(dbService);

        logToFile('Calling createMainWindow...');
        createMainWindow();

        registerGlobalShortcuts();

        console.log('✅ App started successfully');
    } catch (error) {
        console.error('❌ App failed to start:', error);
        app.quit();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});