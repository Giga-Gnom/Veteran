import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Прямое логирование в файл (для отладки)
function debugLog(msg) {
    const filePath = path.join(process.cwd(), 'debug-migration.log');
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    try { fs.appendFileSync(filePath, line); } catch(e) {}
    console.log(msg);
}

async function dynamicImport(relativePath) {
    const isDev = process.env.NODE_ENV === 'development';
    let fullPath;
    if (isDev) {
        fullPath = path.join(__dirname, relativePath);
    } else {
        fullPath = path.join(process.resourcesPath, 'src', 'scripts', relativePath);
    }
    const fileUrl = 'file://' + fullPath.replace(/\\/g, '/');
    return import(fileUrl);
}

export async function runAllMigrations(dbService, log) {
    debugLog('🚀 runAllMigrations: START (debug)');
    if (!log) log = console.log;
    log('🚀 runAllMigrations: START (log)');

    const migrations = [
        ['standartMigrations.js', 'migrateStandarts'],
        ['awardMigrations.js', 'migrateAwards'],
        ['statisticMigration.js', 'migrateStatistics'],
        ['sliderMigration.js', 'migrateSlider'],
        // ['galleryMigrate.js', 'migrateGallery'],
        ['regionsMigration.js', 'migrateRegions'],
        ['newspapersMigrate.js', 'migrateNewspapers'],
        ['migrateOrganizations.js', 'migrateOrganizations']
    ];

    for (const [fileName, functionName] of migrations) {
        try {
            debugLog(`📦 Running ${fileName} -> ${functionName}`);
            log(`📦 Running ${fileName} -> ${functionName}`);
            const module = await dynamicImport(fileName);
            const migrationFn = module[functionName];
            if (typeof migrationFn === 'function') {
                await migrationFn(dbService, log);
            } else {
                debugLog(`❌ Function ${functionName} not found in ${fileName}`);
                log(`❌ Function ${functionName} not found in ${fileName}`);
            }
        } catch (error) {
            debugLog(`❌ Failed migration ${fileName}: ${error.message}`);
            log(`❌ Failed migration ${fileName}: ${error.message}`);
        }
    }

    debugLog('✅ runAllMigrations: FINISH (debug)');
    log('✅ runAllMigrations: FINISH');
}