import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { getResourcePath } from '../utils/paths.js';

const standartsArray = [
    { title: "Федеральный закон от 12.01.1995 г. «О ветеранах».", file: "FZ_5.pdf" },
    { title: "Устав Московской городской общественной организации пенсионеров...", file: "Устав2.pdf" },
    { title: "Соглашение о взаимодействии Правительства Москвы...", file: "обложка.pdf" }
];

export async function migrateStandarts(dbService, log) {
    if (!log) log = console.log;
    log('🚀 start migrate standarts');

    try {
        if (!dbService) {
            log('❌ dbService не передан');
            return false;
        }

        const existingDocs = await dbService.getAll('standart_documents');
        if (existingDocs && existingDocs.length > 0) {
            log('✅ Данные уже есть в БД, миграция не нужна');
            return false;
        }

        const sourceDir = getResourcePath('components/Windows/StandartDocumentsWindow/srcStandarts');
        log(`📂 sourceDir = ${sourceDir}`);

        if (!fs.existsSync(sourceDir)) {
            log(`❌ Папка не найдена: ${sourceDir}`);
            // дополнительная диагностика
            const componentsPath = path.join(process.resourcesPath, 'src', 'components');
            log(`🔍 Проверяем componentsPath: ${componentsPath}, exists: ${fs.existsSync(componentsPath)}`);
            if (fs.existsSync(componentsPath)) {
                log(`📂 Содержимое componentsPath: ${fs.readdirSync(componentsPath).join(', ')}`);
            }
            return false;
        }

        const userDataPath = app.getPath('userData');
        const documentsDir = path.join(userDataPath, 'documents');
        if (!fs.existsSync(documentsDir)) fs.mkdirSync(documentsDir, { recursive: true });

        let migratedCount = 0;
        for (const item of standartsArray) {
            const sourceFile = path.join(sourceDir, item.file);
            log(`🔍 Проверяем файл: ${sourceFile}, exists: ${fs.existsSync(sourceFile)}`);
            if (fs.existsSync(sourceFile)) {
                const uniqueName = `${Date.now()}_${item.file}`;
                const targetFile = path.join(documentsDir, uniqueName);
                fs.copyFileSync(sourceFile, targetFile);
                log(`   ✅ Файл скопирован в ${targetFile}`);

                await dbService.insert('standart_documents', {
                    title: item.title,
                    file_path: `file://${targetFile.replace(/\\/g, '/')}`,
                    file_name: uniqueName,
                    upload_date: new Date().toISOString()
                });
                migratedCount++;
                await new Promise(resolve => setTimeout(resolve, 10));
            } else {
                log(`   ⚠️ Файл не найден: ${item.file}`);
            }
        }

        log(`✅ Миграция завершена! Перенесено: ${migratedCount} документов`);
        return true;
    } catch (error) {
        log(`❌ Ошибка: ${error.message}`);
        return false;
    }
}