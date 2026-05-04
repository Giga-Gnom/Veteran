// src/scripts/migrateGallery.js
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

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
    { title: "Выездное совещание в Совете ветеранов ЗАО", path: "Выездное совещание в Совете ветеранов ЗАО" },
    { title: "Заседание медицинской комиссии МГСВ", path: "Заседание медицинской комиссии МГСВ" },
    { title: "Инструктивно-методическое занятие", path: "Инструктивно-методическое занятие" },
    { title: "Конкурс на лучшую районную медкомиссию", path: "Конкурс на лучшую районную медкомиссию" },
    { title: "Конкурс-выставка цветов", path: "Конкурс-выставка цветов" },
    { title: "Круглый стол Никто, кроме нас", path: "Круглый стол Никто, кроме нас" }
];

export async function migrateGallery(dbService) {
    console.log("🚀 start migrate gallery");
    
    try {
        if (!dbService) {
            console.error('❌ dbService не передан в migrateGallery');
            return false;
        }

        // Проверяем, есть ли уже данные
        const existingFolders = await dbService.getAll('gallery_folders');
        
        if (existingFolders && existingFolders.length > 0) {
            console.log('✅ Данные галереи уже есть в БД, миграция не нужна');
            return false;
        }

        // Базовая папка с фотографиями
        const baseSourceDir = path.join(
            process.cwd(),
            'src',
            'components',
            'Windows',
            'EventsWindow',
            'photo_folders'
        );

        const userDataPath = app.getPath('userData');
        const documentsDir = path.join(userDataPath, 'documents');

        console.log(`📁 Base source dir: ${baseSourceDir}`);
        console.log(`📁 Documents dir: ${documentsDir}`);

        // Проверяем существование базовой папки
        if (!fs.existsSync(baseSourceDir)) {
            console.error(`❌ Базовая папка не найдена: ${baseSourceDir}`);
            return false;
        }

        let totalFolders = 0;
        let totalImages = 0;

        // Проходим по всем папкам галереи
        for (const folder of galleryFolders) {
            const folderPath = path.join(baseSourceDir, folder.path);
            
            console.log(`\n📁 Обработка папки: ${folder.title}`);
            console.log(`   Путь: ${folderPath}`);

            if (!fs.existsSync(folderPath)) {
                console.warn(`   ⚠️ Папка не найдена: ${folder.path}`);
                continue;
            }

            // Получаем список изображений в папке
            const filesInDir = fs.readdirSync(folderPath);
            
            // Фильтруем только изображения
            const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.JPG', '.PNG', '.JPEG'];
            const imageFiles = filesInDir.filter(file => 
                imageExtensions.includes(path.extname(file).toLowerCase())
            );

            if (imageFiles.length === 0) {
                console.warn(`   ⚠️ Нет изображений в папке: ${folder.title}`);
                continue;
            }

            console.log(`   📸 Найдено изображений: ${imageFiles.length}`);

            // 1. Создаем папку в БД
            const folderId = await dbService.insert('gallery_folders', {
                title: folder.title
            });

            console.log(`   ✅ Создана папка в БД с ID: ${folderId}`);

            let folderImageCount = 0;

            // 2. Копируем каждое изображение и добавляем в БД
            for (const imageFile of imageFiles) {
                const sourceFile = path.join(folderPath, imageFile);
                const uniqueName = `${Date.now()}_${folder.path}_${imageFile}`;
                const targetFile = path.join(documentsDir, uniqueName);

                if (fs.existsSync(sourceFile)) {
                    // Копируем файл
                    fs.copyFileSync(sourceFile, targetFile);
                    
                    // Сохраняем в БД
                    await dbService.insert('gallery_images', {
                        image_path: `file://${targetFile.replace(/\\/g, '/')}`,
                        image_name: uniqueName,
                        folder_id: folderId
                    });

                    folderImageCount++;
                    
                    // Лог каждые 10 изображений
                    if (folderImageCount % 10 === 0) {
                        console.log(`      ✅ Скопировано изображений: ${folderImageCount}`);
                    }
                    
                    // Небольшая задержка для уникальности имен
                    await new Promise(resolve => setTimeout(resolve, 5));
                } else {
                    console.warn(`      ⚠️ Файл не найден: ${imageFile}`);
                }
            }

            console.log(`   ✅ Добавлено изображений в папку: ${folderImageCount}`);
            totalFolders++;
            totalImages += folderImageCount;
        }

        console.log(`\n✅ Миграция галереи завершена!`);
        console.log(`   📁 Папок перенесено: ${totalFolders}`);
        console.log(`   📸 Изображений перенесено: ${totalImages}`);
        return true;

    } catch (error) {
        console.error('❌ Ошибка миграции галереи:', error);
        return false;
    }
}