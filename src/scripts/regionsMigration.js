// src/scripts/migrateRegions.js
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

export async function migrateRegions(dbService) {
    console.log("🚀 start migrate regions");
    
    try {
        if (!dbService) {
            console.error('❌ dbService не передан в migrateRegions');
            return false;
        }

        // Проверяем, есть ли уже данные
        const existingRegions = await dbService.getAll('regions');
        
        if (existingRegions && existingRegions.length > 0) {
            console.log('✅ Данные регионов уже есть в БД, миграция не нужна');
            return false;
        }

        // Импортируем данные из отдельного файла
        const { regionsArray } = await import('../components/Windows/RegionalConnectionWindow/regionsArray.js');
        
        console.log(`📊 Найдено регионов: ${regionsArray.length}`);

        // Пути к исходным файлам
        const sourceDocsDir = path.join(
            process.cwd(),
            'src',
            'components',
            'Windows',
            'RegionalConnectionWindow',
            'srcRegions'
        );
        
        const sourceImagesDir = path.join(
            process.cwd(),
            'src',
            'components',
            'Windows',
            'RegionalConnectionWindow',
            'imgRegion'
        );

        const userDataPath = app.getPath('userData');
        const documentsDir = path.join(userDataPath, 'documents');

        console.log(`📁 Папка с документами: ${sourceDocsDir}`);
        console.log(`📁 Папка с изображениями: ${sourceImagesDir}`);
        console.log(`📁 Целевая папка: ${documentsDir}`);

        let migratedCount = 0;
        let docsCopied = 0;
        let logosCopied = 0;
        let noDocCount = 0;

        for (const region of regionsArray) {
            console.log(`\n📄 Обработка: ${region.name}`);
            
            let documentPath = null;
            let documentName = null;
            let logoPath = null;

            // 1. Копируем документ (если есть)
            if (region.document && region.document !== '#') {
                const sourceFile = path.join(sourceDocsDir, region.document);
                const uniqueDocName = `${Date.now()}_${region.document}`;
                const targetFile = path.join(documentsDir, uniqueDocName);

                if (fs.existsSync(sourceFile)) {
                    fs.copyFileSync(sourceFile, targetFile);
                    documentPath = `file://${targetFile.replace(/\\/g, '/')}`;
                    documentName = uniqueDocName;
                    docsCopied++;
                    console.log(`   ✅ Документ скопирован: ${region.document}`);
                } else {
                    console.warn(`   ⚠️ Документ не найден: ${region.document}, будет заглушка`);
                    // Оставляем null - будет заглушка на фронте
                }
            } else {
                noDocCount++;
                console.log(`   ⚠️ Нет документа для этого региона (заглушка)`);
            }

            // 2. Копируем логотип
            if (region.logo) {
                const sourceImage = path.join(sourceImagesDir, region.logo);
                const uniqueImageName = `${Date.now()}_${region.logo}`;
                const targetImage = path.join(documentsDir, uniqueImageName);

                if (fs.existsSync(sourceImage)) {
                    fs.copyFileSync(sourceImage, targetImage);
                    logoPath = `file://${targetImage.replace(/\\/g, '/')}`;
                    logosCopied++;
                    console.log(`   ✅ Логотип скопирован: ${region.logo}`);
                } else {
                    console.warn(`   ⚠️ Логотип не найден: ${region.logo}`);
                }
            }

            // 3. Сохраняем в БД
            await dbService.insert('regions', {
                region_name: region.name,
                document_name: documentName || '',
                document_path: documentPath || '',
                logo_path: logoPath || '',
                upload_date: new Date().toISOString()
            });

            migratedCount++;
            console.log(`   ✅ Добавлен в БД`);
            
            // Небольшая задержка
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        console.log(`\n✅ Миграция регионов завершена!`);
        console.log(`   📍 Регионов перенесено: ${migratedCount}`);
        console.log(`   📄 Документов скопировано: ${docsCopied}`);
        console.log(`   🖼️ Логотипов скопировано: ${logosCopied}`);
        console.log(`   ⚠️ Регионов без документов (заглушка): ${noDocCount}`);
        
        return true;

    } catch (error) {
        console.error('❌ Ошибка миграции регионов:', error);
        throw error;
    }
}