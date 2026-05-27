// src/scripts/migrateOrganizations.js
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

export async function migrateOrganizations(dbService) {
    console.log("🚀 start migrate organizations");
    
    try {
        if (!dbService) {
            console.error('❌ dbService не передан');
            return false;
        }

        // Проверяем, есть ли уже данные
        const existingOrgs = await dbService.getAll('area_organizations');
        if (existingOrgs && existingOrgs.length > 0) {
            console.log(`✅ Данные организаций уже есть в БД (${existingOrgs.length} записей), миграция не нужна`);
            return false;
        }

        // Импортируем массив организаций из сгенерированного файла
        const { organizationsArray } = await import('../components/AdminWindows/AdminMapWindow/organizationsData.js');
        
        console.log(`📊 Найдено организаций для импорта: ${organizationsArray.length}`);

        let insertedCount = 0;
        let errorCount = 0;

        for (const org of organizationsArray) {
            try {
                await dbService.insert('area_organizations', {
                    head_text: org.head_text,
                    is_head: org.is_head,
                    director: org.director || '',
                    phone: org.phone || '',
                    address: org.address || '',
                    district_name: org.district_name,
                    area_num: org.area_num
                });
                insertedCount++;
                
                // Лог каждые 100 записей
                if (insertedCount % 100 === 0) {
                    console.log(`   ✅ Добавлено ${insertedCount} из ${organizationsArray.length}`);
                }
            } catch (err) {
                errorCount++;
                console.error(`   ❌ Ошибка при добавлении: ${org.district_name} - ${org.head_text}`, err.message);
            }
        }

        console.log(`\n✅ Миграция организаций завершена!`);
        console.log(`   ✅ Добавлено: ${insertedCount}`);
        console.log(`   ❌ Ошибок: ${errorCount}`);
        
        return true;

    } catch (error) {
        console.error('❌ Ошибка миграции организаций:', error);
        throw error;
    }
}