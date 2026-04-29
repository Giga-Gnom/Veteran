// src/scripts/migrate-standarts.js
import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import standartDocumentService from '../services/standartDocumentService.js';
import standartsArray from "../../components/Windows/StandartDocumentsWindow/standartsArray.js";

export async function migrateStandarts() {
    console.log("🚀 start migrate standarts");
    
    try {
        // Проверяем, есть ли уже данные через готовый сервис
        const existingDocs = await standartDocumentService.getAllDocuments();
        
        if (existingDocs && existingDocs.length > 0) {
            console.log('✅ Данные уже есть в БД, миграция не нужна');
            return false;
        }
        
        // Пути для файлов
        const sourceDir = path.join(
            process.cwd(),
            'src', 
            'components', 
            'Windows', 
            'StandartDocumentsWindow', 
            'srcStandarts'
        );
        
        const userDataPath = app.getPath('userData');
        const documentsDir = path.join(userDataPath, 'documents');
        
        console.log(`📁 Source dir: ${sourceDir}`);
        console.log(`📁 Documents dir: ${documentsDir}`);
        
        let migratedCount = 0;
        
        // Проходим по массиву и добавляем через готовый сервис
        for (const item of standartsArray) {
            const fileName = path.basename(item.path);
            const sourceFile = path.join(sourceDir, fileName);
            const uniqueName = `${Date.now()}_${fileName}`;
            const targetFile = path.join(documentsDir, uniqueName);
            
            console.log(`📄 Обработка: ${item.title}`);
            
            if (fs.existsSync(sourceFile)) {
                // Копируем файл
                fs.copyFileSync(sourceFile, targetFile);
                
                // ВСТАВЛЯЕМ В БД ЧЕРЕЗ ГОТОВЫЙ СЕРВИС!!!
                await standartDocumentService.addDocument({
                    title: item.title,
                    file_path: `file://${targetFile.replace(/\\/g, '/')}`,
                    file_name: uniqueName
                });
                
                migratedCount++;
                console.log(`   ✅ Мигрирован: ${item.title}`);
            } else {
                console.warn(`   ⚠️ Файл не найден: ${sourceFile}`);
            }
        }
        
        console.log(`✅ Миграция завершена! Перенесено: ${migratedCount} документов`);
        return true;
        
    } catch (error) {
        console.error('❌ Ошибка миграции:', error);
        throw error;
    }
}