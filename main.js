import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import {migrateStandarts} from "./src/scripts/standartMigrations.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔧 ВАЖНО: Определяем пути для разных режимов
const isDev = process.env.NODE_ENV === 'development';
const resourcesPath = isDev ? process.cwd() : process.resourcesPath;

console.log('App started:', {
  isDev,
  __dirname,
  resourcesPath,
  cwd: process.cwd()
});

let mainWindow;
let adminWindow;

// 🔧 Универсальная функция для импорта модулей
async function safeImport(modulePath) {
  if (isDev) {
    // В режиме разработки - обычный импорт
    return import(modulePath);
  } else {
    // В production пробуем разные пути
    const possiblePaths = [
      path.join(resourcesPath, 'app.asar', modulePath),
      path.join(resourcesPath, 'app.asar.unpacked', modulePath),
      path.join(__dirname, modulePath)
    ];
    
    for (const tryPath of possiblePaths) {
      try {
        console.log('Trying to import from:', tryPath);
        // Используем file:// протокол для импорта
        return await import('file://' + tryPath.replace(/\\/g, '/'));
      } catch (e) {
        console.log('Failed:', tryPath);
      }
    }
    throw new Error(`Module not found: ${modulePath}`);
  }
}

// 🔧 Инициализация БД
let dbService = null;

async function initDatabase() {
  if (dbService) return dbService;
  
  try {
    const module = await safeImport('./src/services/database/connection.js');
    dbService = module.default || module;
    console.log('✅ Database module loaded');
    return dbService;
  } catch (error) {
    console.error('❌ Database init error:', error);
    throw error;
  }
}

const userDataPath = app.getPath('userData');
console.log('📁 UserData path:', userDataPath);
console.log('📁 DB file exists?', fs.existsSync(path.join(userDataPath, 'kiosk.db')));
console.log('📁 Migration flag exists?', fs.existsSync(path.join(userDataPath, '.migration_completed')));


function createMainWindow() {
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
      // Пробуем загрузить из разных мест
      const indexPath = path.join(__dirname, 'dist/index.html');
      const asarIndexPath = path.join(resourcesPath, 'app.asar', 'dist/index.html');
      
      if (fs.existsSync(indexPath)) {
        console.log('Loading from:', indexPath);
        mainWindow.loadFile(indexPath);
      } else if (fs.existsSync(asarIndexPath)) {
        console.log('Loading from asar:', asarIndexPath);
        mainWindow.loadFile(asarIndexPath);
      } else {
        console.error('Index.html not found in any location');
        mainWindow.loadURL(`data:text/html,<h1>App loaded</h1><p>Database initialized</p>`);
      }
    } catch (error) {
      console.error('Load error:', error);
      mainWindow.loadURL(`data:text/html,<h1>Error</h1><p>${error.message}</p>`);
    }
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createAdminWindow() {
  adminWindow = new BrowserWindow({
    width: 1400, // Шире чем киоск
    height: 900, // Выше чем киоск
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: 'Админ-панель киоска', // Заголовок окна
    autoHideMenuBar: true,
    resizable: true, // Можно менять размер
    minimizable: true, // Можно сворачивать
    maximizable: true, // Можно разворачивать
    fullscreen: false, // НЕ полноэкранный режим
    show: false, // Показываем когда готово
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

  // if (isDev) {
  //   adminWindow.webContents.openDevTools()
  // }

  adminWindow.on('closed', () => {
    adminWindow = null
  })

}



// 🔧 Простые IPC обработчики
ipcMain.handle('database:getAll', async (event, table) => {
  try {
    const db = await initDatabase();
    return await db.getAll(table);
  } catch (error) {
    console.error('IPC Error (getAll):', error);
    throw error;
  }
});

ipcMain.handle('database:insert', async (event, table, data) => {
  try {
    const db = await initDatabase();
    return await db.insert(table, data);
  } catch (error) {
    console.error('IPC Error (insert):', error);
    throw error;
  }
});

ipcMain.handle('database:delete', async (event, table, id) => {
  try {
    const db = await initDatabase();
    return await db.delete(table, id);
  } catch (error) {
    console.error('IPC Error (delete):', error);
    throw error;
  }
});

ipcMain.handle('file:save', async (event, {file_name, buffer}) => {
  try {
    const userDataPath = app.getPath('userData')
    const documentsPath = path.join(userDataPath, 'documents')
    
    const timestamp = Date.now()
    const fileExt = path.extname(file_name)
    const baseName = path.basename(file_name, fileExt) || 'document'
    const uniqueFileName = `document_${timestamp}${fileExt}`
    const filePath = path.join(documentsPath, uniqueFileName)

    fs.writeFileSync(filePath, Buffer.from(buffer))

    return {
      file_name: uniqueFileName,
      file_path: `file://${filePath}`
    }
  } catch (error) {
    console.log("file save error: ", error)
    throw error
  }
})

ipcMain.handle('file:delete', async (event, fileUrl) => {
  try {
    const url = new URL(fileUrl)
    const filePath = url.pathname;

    const normolizedPath = process.platform === 'win32' ? filePath.substring(1) : filePath;

    await fs.promises.unlink(normolizedPath)

    return true
  } catch (error) {
    console.log("ошибка удаления файла: ", error)
    throw(error)
  }
})

//РАЗОБРАТЬСЯ С ЭТИМ!!!!!!!!!
ipcMain.handle('database:execute', async (event, query, params = []) => {
    try {
        const dbService = await initDatabase();
        await dbService.init?.();
        console.log('dbService:', dbService); // ← что здесь?
        console.log('dbService.db:', dbService.db); // ← что здесь?
        
        if (!dbService.db) {
            throw new Error('Database not initialized!');
        }
        const db = dbService.db;
        console.log('Executing query:', query, 'Params:', params);
        
        if (query.trim().toUpperCase().startsWith('SELECT')) {
            const result = db.prepare(query).all(...params);
            console.log('Query result:', result.length, 'rows');
            return result;
        } else {
            const result = db.prepare(query).run(...params);
            console.log('Query affected:', result.changes, 'rows');
            return result;
        }
    } catch (error) {
        console.error('IPC Error (execute):', error);
        throw error;
    }
});

// Горячие клавиши
function registerGlobalShortcuts() {
  globalShortcut.register('Ctrl+Alt+Shift+F12', () => {
    console.log('Admin shortcut pressed');
    createAdminWindow();
  });
}

async function runMigrationsIfNeeded() {
    console.log('🔍 runMigrationsIfNeeded called');
    console.log('🔍 MigrationManager:', MigrationManager); // 👈 Проверяем, импортирован ли класс
    
    try {
        const migrationManager = new MigrationManager();
        console.log('🔍 MigrationManager instance:', migrationManager); // 👈 Проверяем создание
        await migrationManager.runAllMigrations();
    } catch (error) {
        console.error('❌ Migration error:', error);
        console.error('❌ Error stack:', error.stack); // 👈 Показываем полную ошибку
    }
}


// 🔧 Запуск приложения
app.whenReady().then(async () => {
  console.log('App ready, initializing...');
  
  try {

    const userDataPath = app.getPath('userData')
    const documentsPath = path.join(userDataPath, 'documents')
    if (!fs.existsSync(documentsPath)) {
      fs.mkdirSync(documentsPath, {recursive: true})
    }
    console.log("documents path: ", documentsPath )

    // Инициализируем БД
    await initDatabase();
    console.log('✅ Database ready');

    console.log("some text---------------------------------------------------------------")
    await migrateStandarts(dbService);
    
    // Создаем окно
    createMainWindow();
    
    // Регистрируем горячие клавиши
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