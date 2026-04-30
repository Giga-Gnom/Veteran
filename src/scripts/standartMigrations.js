import fs from 'fs';
import path from 'path';
import { app } from 'electron';
// import standartDocumentService from '../services/standartDocumentService.js';
// import {standartsArray} from "../components/Windows/StandartDocumentsWindow/stabdartsArray.jsx";

const standartsArray = [
    {
        title: "Федеральный закон от 12.01.1995 г. «О ветеранах».",
        file: "FZ_5.pdf"
    },
    {
        title: "Устав Московской городской общественной организации пенсионеров, ветеранов войны, труда, Вооруженных Сил и правоохранительных органов.",
        file: "Устав2.pdf"
    },
    {
        title: "Соглашение о взаимодействии Правительства Москвы и московских городских общественных организаций ветеранов по защите прав и интересов, улучшению благосостояния ветеранов, активизации работы по патриотическому воспитанию молодежи.",
        file: "обложка.pdf"
    }
];


export async function migrateStandarts(dbService) {
    console.log("🚀 start migrate standarts");

    try{
        if (!dbService) {
            console.error('❌ dbService не передан в migrateStandarts');
            return false;
        }

        const existingDocs = await dbService.getAll('standart_documents')

        if (existingDocs && existingDocs.length > 0) {
            console.log('✅ Данные уже есть в БД, миграция не нужна');
            return false;
        }

        const sourceDir = path.join(
            process.cwd(),
            'src', 
            'components', 
            'Windows', 
            'StandartDocumentsWindow', 
            'srcStandarts'
        );

        const userDataPath = app.getPath('userData')
        const documentsDir = path.join(userDataPath, 'documents')

        if (!fs.existsSync(sourceDir)) {
            console.error(`❌ Папка с исходниками не найдена: ${sourceDir}`);
            console.log('📂 Содержимое текущей папки:', fs.readdirSync(process.cwd()));
            return false;
        }

        const filesInDir = fs.readdirSync(sourceDir);

        let migratedCount = 0;
        
        // Копируем файлы и добавляем в БД
        for (const item of standartsArray) {
            const sourceFile = path.join(sourceDir, item.file);
            const uniqueName = `${Date.now()}_${item.file}`;
            const targetFile = path.join(documentsDir, uniqueName);
            
            console.log(`📄 Обработка: ${item.title}`);
            console.log(`   Ищем файл: ${sourceFile}`);
            
            if (fs.existsSync(sourceFile)) {
                // Копируем файл
                fs.copyFileSync(sourceFile, targetFile);
                console.log(`   ✅ Файл скопирован`);
                
                // Сохраняем в БД
                await dbService.insert('standart_documents', {
                    title: item.title,
                    file_path: `file://${targetFile.replace(/\\/g, '/')}`,
                    file_name: uniqueName,
                    upload_date: new Date().toISOString()
                });
                
                migratedCount++;
                
                // Небольшая задержка для уникальности имен
                await new Promise(resolve => setTimeout(resolve, 10));
            } else {
                console.warn(`   ⚠️ Файл не найден: ${item.file}`);
            }
        }
        
        console.log(`✅ Миграция завершена! Перенесено: ${migratedCount} документов`);
        return true;
    } catch (error) {
        console.error('❌ Ошибка миграции:', error);
        return false;
    }
}