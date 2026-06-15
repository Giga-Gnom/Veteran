// src/scripts/runAllMigrations.js
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Динамический импорт с учётом dev/prod
async function dynamicImport(relativePath) {
    const isDev = process.env.NODE_ENV === 'development';
    let fullPath;
    if (isDev) {
        fullPath = path.join(__dirname, relativePath);
    } else {
        // В собранном приложении файлы лежат в resources/app/src/scripts/
        fullPath = path.join(process.resourcesPath, 'app', 'src', 'scripts', relativePath);
    }
    const fileUrl = 'file://' + fullPath.replace(/\\/g, '/');
    return import(fileUrl);
}

export async function runAllMigrations(dbService) {
    console.log('🚀 Starting all migrations...');

    const migrations = [
        ['standartMigrations.js', 'migrateStandarts'],
        ['awardMigrations.js', 'migrateAwards'],
        ['statisticMigration.js', 'migrateStatistics'],
        ['sliderMigration.js', 'migrateSlider'],
        ['galleryMigrate.js', 'migrateGallery'],
        ['regionsMigration.js', 'migrateRegions'],
        ['newspapersMigrate.js', 'migrateNewspapers'],
        ['migrateOrganizations.js', 'migrateOrganizations']
    ];

    for (const [fileName, functionName] of migrations) {
        try {
            console.log(`📦 Running ${fileName} -> ${functionName}`);
            const module = await dynamicImport(fileName);
            const migrationFn = module[functionName];
            if (typeof migrationFn === 'function') {
                await migrationFn(dbService);
            } else {
                console.error(`❌ Function ${functionName} not found in ${fileName}`);
            }
        } catch (error) {
            console.error(`❌ Failed migration ${fileName}:`, error);
        }
    }

    console.log('✅ All migrations processed');
}