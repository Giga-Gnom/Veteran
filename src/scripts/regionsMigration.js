// src/scripts/migrateRegions.js
import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { getResourcePath } from '../utils/paths.js';

// Прямое логирование в файл (для отладки)
function debugLog(msg) {
    const filePath = path.join(process.cwd(), 'debug-migration.log');
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    try { fs.appendFileSync(filePath, line); } catch(e) {}
    console.log(msg);
}

export async function migrateRegions(dbService, log) {
    if (!log) log = console.log;
    log('🚀 start migrate regions');
    debugLog('🚀 migrateRegions: START');

    try {
        if (!dbService) {
            log('❌ dbService не передан в migrateRegions');
            debugLog('❌ dbService не передан');
            return false;
        }

        const existingRegions = await dbService.getAll('regions');
        debugLog(`existingRegions count: ${existingRegions?.length || 0}`);
        if (existingRegions && existingRegions.length > 0) {
            log('✅ Данные регионов уже есть в БД, миграция не нужна');
            debugLog('✅ Данные регионов уже есть в БД, миграция не нужна');
            return false;
        }

        // Импортируем данные из отдельного файла
        const dataPath = path.join(
            process.resourcesPath,
            'src',
            'components',
            'Windows',
            'RegionalConnectionWindow',
            'regionsArray.js'
        );
        log(`📂 Загружаем данные из: ${dataPath}`);
        debugLog(`📂 Загружаем данные из: ${dataPath}`);

        // Проверяем существование файла данных
        if (!fs.existsSync(dataPath)) {
            log(`❌ Файл данных не найден: ${dataPath}`);
            debugLog(`❌ Файл данных не найден: ${dataPath}`);
            return false;
        }

        const { regionsArray } = await import('file://' + dataPath.replace(/\\/g, '/'));
        log(`📊 Найдено регионов: ${regionsArray.length}`);
        debugLog(`📊 Найдено регионов: ${regionsArray.length}`);

        // Пути к исходным файлам через getResourcePath
        const sourceDocsDir = getResourcePath('components/Windows/RegionalConnectionWindow/srcRegions');
        const sourceImagesDir = getResourcePath('components/Windows/RegionalConnectionWindow/imgRegion');

        log(`📁 Папка с документами: ${sourceDocsDir}`);
        log(`📁 Папка с изображениями: ${sourceImagesDir}`);
        debugLog(`📁 Папка с документами: ${sourceDocsDir}`);
        debugLog(`📁 Папка с изображениями: ${sourceImagesDir}`);

        // Проверяем существование папок
        if (!fs.existsSync(sourceDocsDir)) {
            log(`❌ Папка с документами не найдена: ${sourceDocsDir}`);
            debugLog(`❌ Папка с документами не найдена: ${sourceDocsDir}`);
            // Не возвращаем false, чтобы посмотреть, может быть хотя бы изображения есть
        }
        if (!fs.existsSync(sourceImagesDir)) {
            log(`❌ Папка с изображениями не найдена: ${sourceImagesDir}`);
            debugLog(`❌ Папка с изображениями не найдена: ${sourceImagesDir}`);
        }

        const userDataPath = app.getPath('userData');
        const documentsDir = path.join(userDataPath, 'documents');
        if (!fs.existsSync(documentsDir)) {
            fs.mkdirSync(documentsDir, { recursive: true });
            log(`📁 Создана папка документов: ${documentsDir}`);
            debugLog(`📁 Создана папка документов: ${documentsDir}`);
        }

        let migratedCount = 0;
        let docsCopied = 0;
        let logosCopied = 0;
        let noDocCount = 0;

        for (const region of regionsArray) {
            log(`\n📄 Обработка: ${region.name}`);
            debugLog(`📄 Обработка: ${region.name}`);

            let documentPath = null;
            let documentName = null;
            let logoPath = null;

            if (region.document && region.document !== '#') {
                const sourceFile = path.join(sourceDocsDir, region.document);
                const uniqueDocName = `${Date.now()}_${region.document}`;
                const targetFile = path.join(documentsDir, uniqueDocName);

                debugLog(`   Ищем документ: ${sourceFile}, exists: ${fs.existsSync(sourceFile)}`);
                if (fs.existsSync(sourceFile)) {
                    fs.copyFileSync(sourceFile, targetFile);
                    documentPath = `file://${targetFile.replace(/\\/g, '/')}`;
                    documentName = uniqueDocName;
                    docsCopied++;
                    log(`   ✅ Документ скопирован: ${region.document}`);
                    debugLog(`   ✅ Документ скопирован: ${region.document} -> ${targetFile}`);
                } else {
                    log(`   ⚠️ Документ не найден: ${region.document}, будет заглушка`);
                    debugLog(`   ⚠️ Документ не найден: ${region.document}`);
                }
            } else {
                noDocCount++;
                log(`   ⚠️ Нет документа для этого региона (заглушка)`);
                debugLog(`   ⚠️ Нет документа для этого региона (заглушка)`);
            }

            if (region.logo) {
                const sourceImage = path.join(sourceImagesDir, region.logo);
                const uniqueImageName = `${Date.now()}_${region.logo}`;
                const targetImage = path.join(documentsDir, uniqueImageName);

                debugLog(`   Ищем логотип: ${sourceImage}, exists: ${fs.existsSync(sourceImage)}`);
                if (fs.existsSync(sourceImage)) {
                    fs.copyFileSync(sourceImage, targetImage);
                    logoPath = `file://${targetImage.replace(/\\/g, '/')}`;
                    logosCopied++;
                    log(`   ✅ Логотип скопирован: ${region.logo}`);
                    debugLog(`   ✅ Логотип скопирован: ${region.logo} -> ${targetImage}`);
                } else {
                    log(`   ⚠️ Логотип не найден: ${region.logo}`);
                    debugLog(`   ⚠️ Логотип не найден: ${region.logo}`);
                }
            }

            await dbService.insert('regions', {
                region_name: region.name,
                document_name: documentName || '',
                document_path: documentPath || '',
                logo_path: logoPath || '',
                upload_date: new Date().toISOString()
            });

            migratedCount++;
            log(`   ✅ Добавлен в БД`);
            debugLog(`   ✅ Добавлен в БД`);

            await new Promise(resolve => setTimeout(resolve, 10));
        }

        log(`\n✅ Миграция регионов завершена!`);
        log(`   📍 Регионов перенесено: ${migratedCount}`);
        log(`   📄 Документов скопировано: ${docsCopied}`);
        log(`   🖼️ Логотипов скопировано: ${logosCopied}`);
        log(`   ⚠️ Регионов без документов (заглушка): ${noDocCount}`);

        debugLog(`\n✅ Миграция регионов завершена!`);
        debugLog(`   📍 Регионов перенесено: ${migratedCount}`);
        debugLog(`   📄 Документов скопировано: ${docsCopied}`);
        debugLog(`   🖼️ Логотипов скопировано: ${logosCopied}`);
        debugLog(`   ⚠️ Регионов без документов (заглушка): ${noDocCount}`);

        return true;

    } catch (error) {
        log(`❌ Ошибка миграции регионов: ${error.message}`);
        debugLog(`❌ Ошибка миграции регионов: ${error.message}`);
        return false;
    }
}