// src/scripts/awardMigrations.js
import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { getResourcePath } from '../utils/paths.js';

const awardsArray = [
    {
        name: "Почетный ветеран",
        text: "положение о памятном знаке «Почетный ветеран» Московской городской общественной организации пенсионеров, ветеранов войны, труда, Вооруженных Сил и правоохранительных органов",
        image: "pochetVet.png",
        file: "PochetVeteran.pdf"
    },
    {
        name: "Патриот Москвы",
        text: "положение о памятном знаке «Патриот Москвы» Московской городской общественной организации пенсионеров, ветеранов войны, труда, Вооруженных Сил и правоохранительных органов",
        image: "patriot.png",
        file: "Patriot.pdf"
    },
    {
        name: "Книга Почёта",
        text: "положение о Книге Почёта Московской городской общественной организации пенсионеров, ветеранов войны, труда, Вооруженных Сил и правоохранительных органов",
        image: "book.png",
        file: "Book.pdf"
    }
];

export async function migrateAwards(dbService, log) {
    if (!log) log = console.log;
    log('🚀 start migrate awards');

    try {
        if (!dbService) {
            log('❌ dbService не передан в migrateAwards');
            return false;
        }

        const existingAwards = await dbService.getAll('awards');
        if (existingAwards && existingAwards.length > 0) {
            log('✅ Данные уже есть в БД, миграция не нужна');
            return false;
        }

        // ✅ Используем getResourcePath
        const sourceDir = getResourcePath('components/Windows/AwardsWindow/srcAwards');
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
        log(`📄 Файлы в srcAwards: ${filesInDir.join(', ')}`);

        let migratedCount = 0;

        for (const item of awardsArray) {
            const sourceFile = path.join(sourceDir, item.file);
            const uniqueFileName = `${Date.now()}_${item.file}`;
            const targetFile = path.join(documentsDir, uniqueFileName);

            const sourceImage = path.join(sourceDir, item.image);
            const uniqueImageName = `${Date.now()}_${item.image}`;
            const targetImage = path.join(documentsDir, uniqueImageName);

            log(`📄 Обработка: ${item.name}`);
            log(`   PDF: ${item.file}`);
            log(`   Image: ${item.image}`);

            if (fs.existsSync(sourceFile)) {
                fs.copyFileSync(sourceFile, targetFile);
                log(`   ✅ PDF скопирован`);

                let imagePath = null;
                if (fs.existsSync(sourceImage)) {
                    fs.copyFileSync(sourceImage, targetImage);
                    imagePath = `file://${targetImage.replace(/\\/g, '/')}`;
                    log(`   ✅ Изображение скопировано`);
                } else {
                    log(`   ⚠️ Изображение не найдено: ${item.image}`);
                }

                await dbService.insert('awards', {
                    title: item.name,
                    description: item.text,
                    file_path: `file://${targetFile.replace(/\\/g, '/')}`,
                    file_name: uniqueFileName,
                    image_path: imagePath,
                    upload_date: new Date().toISOString()
                });

                migratedCount++;
                log(`   ✅ Добавлен в БД: ${item.name}`);
                await new Promise(resolve => setTimeout(resolve, 10));
            } else {
                log(`   ⚠️ PDF не найден: ${item.file}`);
            }
        }

        log(`✅ Миграция наград завершена! Перенесено: ${migratedCount} документов`);
        return true;

    } catch (error) {
        log(`❌ Ошибка миграции наград: ${error.message}`);
        return false;
    }
}