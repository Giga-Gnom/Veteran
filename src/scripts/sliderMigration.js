// src/scripts/migrateSlider.js - исправленная версия
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

export async function migrateSlider(dbService) {
    console.log("🚀 start migrate slider");
    
    try {
        if (!dbService) {
            console.error('❌ dbService не передан в migrateSlider');
            return false;
        }

        // Проверяем, есть ли уже данные
        const existingSlides = await dbService.getAll('slider_images');
        
        if (existingSlides && existingSlides.length > 0) {
            console.log('✅ Данные слайдера уже есть в БД, миграция не нужна');
            return false;
        }

        // Путь к папке с изображениями для слайдера
        const sourceDir = path.join(
            process.cwd(),
            'src',
            'components',
            'Windows',
            'EventsWindow',
            'srcEvents'
        );

        const userDataPath = app.getPath('userData');
        const documentsDir = path.join(userDataPath, 'documents');

        console.log(`📁 Source dir: ${sourceDir}`);
        console.log(`📁 Documents dir: ${documentsDir}`);

        // Проверяем существование папки
        if (!fs.existsSync(sourceDir)) {
            console.error(`❌ Папка с исходниками не найдена: ${sourceDir}`);
            return false;
        }

        // Получаем список всех изображений в папке
        const filesInDir = fs.readdirSync(sourceDir);
        
        // Фильтруем только изображения
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.JPG'];
        const imageFiles = filesInDir.filter(file => 
            imageExtensions.includes(path.extname(file).toLowerCase())
        );

        console.log(`📸 Найдено изображений для слайдера: ${imageFiles.length}`);

        if (imageFiles.length === 0) {
            console.warn('⚠️ Нет изображений для миграции');
            return false;
        }

        let migratedCount = 0;

        // Копируем каждое изображение и добавляем в БД
        for (const imageFile of imageFiles) {
            const sourceFile = path.join(sourceDir, imageFile);
            // Получаем имя без расширения для заголовка
            const title = path.basename(imageFile, path.extname(imageFile));
            const uniqueName = `${Date.now()}_${imageFile}`;
            const targetFile = path.join(documentsDir, uniqueName);

            console.log(`📸 Обработка: ${imageFile}`);

            if (fs.existsSync(sourceFile)) {
                // Копируем файл
                fs.copyFileSync(sourceFile, targetFile);
                console.log(`   ✅ Файл скопирован`);

                // Сохраняем в БД - БЕЗ upload_date!
                await dbService.insert('slider_images', {
                    title: title,
                    image_path: `file://${targetFile.replace(/\\/g, '/')}`,
                    image_name: uniqueName
                });

                migratedCount++;
                console.log(`   ✅ Добавлен в БД`);

                // Небольшая задержка для уникальности имен
                await new Promise(resolve => setTimeout(resolve, 10));
            } else {
                console.warn(`   ⚠️ Файл не найден: ${imageFile}`);
            }
        }

        console.log(`✅ Миграция слайдера завершена! Перенесено изображений: ${migratedCount}`);
        return true;

    } catch (error) {
        console.error('❌ Ошибка миграции слайдера:', error);
        return false;
    }
}