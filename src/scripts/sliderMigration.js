// src/scripts/migrateSlider.js
import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { getResourcePath } from '../utils/paths.js';

export async function migrateSlider(dbService, log) {
    if (!log) log = console.log;
    log('🚀 start migrate slider');

    try {
        if (!dbService) {
            log('❌ dbService не передан в migrateSlider');
            return false;
        }

        const existingSlides = await dbService.getAll('slider_images');
        if (existingSlides && existingSlides.length > 0) {
            log('✅ Данные слайдера уже есть в БД, миграция не нужна');
            return false;
        }

        // ✅ Правильный путь к исходным изображениям
        const sourceDir = getResourcePath('components/Windows/EventsWindow/srcEvents');
        log(`📁 Source dir: ${sourceDir}`);

        const userDataPath = app.getPath('userData');
        const documentsDir = path.join(userDataPath, 'documents');
        if (!fs.existsSync(documentsDir)) {
            fs.mkdirSync(documentsDir, { recursive: true });
        }
        log(`📁 Documents dir: ${documentsDir}`);

        if (!fs.existsSync(sourceDir)) {
            log(`❌ Папка с исходниками не найдена: ${sourceDir}`);
            return false;
        }

        const filesInDir = fs.readdirSync(sourceDir);
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.JPG'];
        const imageFiles = filesInDir.filter(file =>
            imageExtensions.includes(path.extname(file).toLowerCase())
        );
        log(`📸 Найдено изображений для слайдера: ${imageFiles.length}`);

        if (imageFiles.length === 0) {
            log('⚠️ Нет изображений для миграции');
            return false;
        }

        let migratedCount = 0;

        for (const imageFile of imageFiles) {
            const sourceFile = path.join(sourceDir, imageFile);
            const title = path.basename(imageFile, path.extname(imageFile));
            const uniqueName = `${Date.now()}_${imageFile}`;
            const targetFile = path.join(documentsDir, uniqueName);

            log(`📸 Обработка: ${imageFile}`);

            if (fs.existsSync(sourceFile)) {
                fs.copyFileSync(sourceFile, targetFile);
                log(`   ✅ Файл скопирован`);

                await dbService.insert('slider_images', {
                    title: title,
                    image_path: `file://${targetFile.replace(/\\/g, '/')}`,
                    image_name: uniqueName
                });

                migratedCount++;
                await new Promise(resolve => setTimeout(resolve, 10));
            } else {
                log(`   ⚠️ Файл не найден: ${imageFile}`);
            }
        }

        log(`✅ Миграция слайдера завершена! Перенесено изображений: ${migratedCount}`);
        return true;

    } catch (error) {
        log(`❌ Ошибка миграции слайдера: ${error.message}`);
        return false;
    }
}