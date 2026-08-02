// src/scripts/migrateGallery.js
import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { getResourcePath } from '../utils/paths.js';

// Данные о папках с фотографиями
const galleryFolders = [
    { title: "2003-2004", path: "2003-2004" },
    { title: "2005-2007", path: "2005-2007" },
    { title: "2008-2010", path: "2008-2010" },
    { title: "2011-2013", path: "2011-2013" },
    { title: "2014-2015", path: "2014-2015" },
    { title: "2016-2017", path: "2016-2017" },
    { title: "2018", path: "2018" },
    { title: "2019-2020", path: "2019-2020" },
    { title: "2021-2022", path: "2021-2022" },
    { title: "2023", path: "2023" },
    { title: "2024", path: "2024" },
    { title: "2025", path: "2025" },
    { title: "2026", path: "2026" },
    { title: "Выездное совещание в Совете ветеранов ЗАО", path: "Выездное совещание в Совете ветеранов ЗАО" },
    { title: "Заседание медицинской комиссии МГСВ", path: "Заседание медицинской комиссии МГСВ" },
    { title: "Инструктивно-методическое занятие", path: "Инструктивно-методическое занятие" },
    { title: "Конкурс на лучшую районную медкомиссию", path: "Конкурс на лучшую районную медкомиссию" },
    { title: "Конкурс-выставка цветов", path: "Конкурс-выставка цветов" },
    { title: "Круглый стол Никто, кроме нас", path: "Круглый стол Никто, кроме нас" }
];

export async function migrateGallery(dbService, log) {
    if (!log) log = console.log;
    log('🚀 start migrate gallery');

    try {
        if (!dbService) {
            log('❌ dbService не передан в migrateGallery');
            return false;
        }

        const existingFolders = await dbService.getAll('gallery_folders');
        if (existingFolders && existingFolders.length > 0) {
            log('✅ Данные галереи уже есть в БД, миграция не нужна');
            return false;
        }

        // ✅ Используем getResourcePath для правильного пути в production
        const baseSourceDir = getResourcePath('components/Windows/EventsWindow/photo_folders');
        log(`📁 Base source dir: ${baseSourceDir}`);

        const userDataPath = app.getPath('userData');
        const documentsDir = path.join(userDataPath, 'documents');
        if (!fs.existsSync(documentsDir)) {
            fs.mkdirSync(documentsDir, { recursive: true });
        }
        log(`📁 Documents dir: ${documentsDir}`);

        if (!fs.existsSync(baseSourceDir)) {
            log(`❌ Базовая папка не найдена: ${baseSourceDir}`);
            return false;
        }

        let totalFolders = 0;
        let totalImages = 0;

        for (const folder of galleryFolders) {
            const folderPath = path.join(baseSourceDir, folder.path);
            log(`\n📁 Обработка папки: ${folder.title}`);
            log(`   Путь: ${folderPath}`);

            if (!fs.existsSync(folderPath)) {
                log(`   ⚠️ Папка не найдена: ${folder.path}`);
                continue;
            }

            const filesInDir = fs.readdirSync(folderPath);
            const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.JPG', '.PNG', '.JPEG'];
            const imageFiles = filesInDir.filter(file =>
                imageExtensions.includes(path.extname(file).toLowerCase())
            );

            if (imageFiles.length === 0) {
                log(`   ⚠️ Нет изображений в папке: ${folder.title}`);
                continue;
            }

            log(`   📸 Найдено изображений: ${imageFiles.length}`);

            const folderId = await dbService.insert('gallery_folders', {
                title: folder.title
            });
            log(`   ✅ Создана папка в БД с ID: ${folderId}`);

            let folderImageCount = 0;

            for (const imageFile of imageFiles) {
                const sourceFile = path.join(folderPath, imageFile);
                const uniqueName = `${Date.now()}_${folder.path}_${imageFile}`;
                const targetFile = path.join(documentsDir, uniqueName);

                if (fs.existsSync(sourceFile)) {
                    fs.copyFileSync(sourceFile, targetFile);
                    await dbService.insert('gallery_images', {
                        image_path: `file://${targetFile.replace(/\\/g, '/')}`,
                        image_name: uniqueName,
                        folder_id: folderId
                    });
                    folderImageCount++;
                    if (folderImageCount % 10 === 0) {
                        log(`      ✅ Скопировано изображений: ${folderImageCount}`);
                    }
                    await new Promise(resolve => setTimeout(resolve, 5));
                } else {
                    log(`      ⚠️ Файл не найден: ${imageFile}`);
                }
            }

            log(`   ✅ Добавлено изображений в папку: ${folderImageCount}`);
            totalFolders++;
            totalImages += folderImageCount;
        }

        log(`\n✅ Миграция галереи завершена!`);
        log(`   📁 Папок перенесено: ${totalFolders}`);
        log(`   📸 Изображений перенесено: ${totalImages}`);
        return true;

    } catch (error) {
        log(`❌ Ошибка миграции галереи: ${error.message}`);
        return false;
    }
}