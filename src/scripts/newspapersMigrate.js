// src/scripts/migrateNewspapers.js
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

// Функция для определения года и квартала из ссылки или даты
function extractYearAndQuarter(item) {
    let year = null;
    let quarter = null;
    
    // Пытаемся извлечь из ссылки
    const urlMatch = item.ref.match(/\/(\d{4})\//);
    if (urlMatch) {
        year = parseInt(urlMatch[1]);
    }
    
    // Определяем квартал по месяцу из ссылки или названия
    if (item.ref.includes('01_kvartal') || item.title.includes('января') || 
        item.title.includes('февраля') || item.title.includes('марта')) {
        quarter = 1;
    } else if (item.ref.includes('02_kvartal') || item.title.includes('апреля') || 
               item.title.includes('мая') || item.title.includes('июня')) {
        quarter = 2;
    } else if (item.ref.includes('03_kvartal') || item.title.includes('июля') || 
               item.title.includes('августа') || item.title.includes('сентября')) {
        quarter = 3;
    } else if (item.ref.includes('04_kvartal') || item.title.includes('октября') || 
               item.title.includes('ноября') || item.title.includes('декабря')) {
        quarter = 4;
    }
    
    // Если не нашли по ссылке, пробуем по дате в названии
    if (!quarter) {
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                       'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        for (let i = 0; i < months.length; i++) {
            if (item.title.includes(months[i])) {
                quarter = Math.floor(i / 3) + 1;
                break;
            }
        }
    }
    
    return { year, quarter };
}

export async function migrateNewspapers(dbService) {
    console.log("🚀 start migrate newspapers");
    
    try {
        if (!dbService) {
            console.error('❌ dbService не передан в migrateNewspapers');
            return false;
        }

        // Проверяем, есть ли уже данные
        const existingYears = await dbService.getAll('newspapers_years');
        
        if (existingYears && existingYears.length > 0) {
            console.log('✅ Данные газет уже есть в БД, миграция не нужна');
            return false;
        }

        // Импортируем данные
        const { newspapersArray } = await import('../components/Windows/NewspaperWindow/newspapersArray.js');
        
        console.log(`📰 Найдено газет: ${newspapersArray.length}`);

        // Структура для хранения: год -> квартал -> массив газет
        const yearsMap = new Map();
        
        // Группируем газеты по годам и кварталам
        for (const newspaper of newspapersArray) {
            const { year, quarter } = extractYearAndQuarter(newspaper);
            
            if (!year || !quarter) {
                console.warn(`⚠️ Не удалось определить год/квартал для: ${newspaper.title}`);
                continue;
            }
            
            if (!yearsMap.has(year)) {
                yearsMap.set(year, new Map());
            }
            
            const quartersMap = yearsMap.get(year);
            if (!quartersMap.has(quarter)) {
                quartersMap.set(quarter, []);
            }
            
            quartersMap.get(quarter).push(newspaper);
        }
        
        let yearsCount = 0;
        let quartersCount = 0;
        let newspapersCount = 0;
        
        // Сохраняем в БД
        for (const [year, quartersMap] of yearsMap) {
            console.log(`\n📅 Год: ${year}`);
            
            // Создаем год
            const yearId = await dbService.insert('newspapers_years', {
                year: year,
                title: `${year} год`
            });
            yearsCount++;
            console.log(`   ✅ Создан год с ID: ${yearId}`);
            
            // Сортируем кварталы
            const sortedQuarters = [...quartersMap.keys()].sort();
            
            for (const quarter of sortedQuarters) {
                const newspapers = quartersMap.get(quarter);
                console.log(`   📁 Квартал ${quarter}: ${newspapers.length} газет`);
                
                // Создаем квартал
                const quarterId = await dbService.insert('newspapers_quarters', {
                    quarter: quarter,
                    year_id: yearId,
                    title: `${quarter}-й квартал ${year} года`
                });
                quartersCount++;
                
                // Добавляем газеты
                for (const newspaper of newspapers) {
                    await dbService.insert('newspapers', {
                        quarter_id: quarterId,
                        title: newspaper.title,
                        file_path: newspaper.ref,  // URL или локальный путь
                        file_name: newspaper.title.replace(/[^а-яА-Яa-zA-Z0-9]/g, '_') + '.pdf',
                        issue_date: extractDate(newspaper.title),
                        issue_number: extractNumber(newspaper.title),
                        upload_date: new Date().toISOString()
                    });
                    newspapersCount++;
                }
                
                console.log(`      ✅ Добавлено газет: ${newspapers.length}`);
            }
        }
        
        console.log(`\n✅ Миграция газет завершена!`);
        console.log(`   📅 Лет: ${yearsCount}`);
        console.log(`   📁 Кварталов: ${quartersCount}`);
        console.log(`   📰 Газет: ${newspapersCount}`);
        
        return true;

    } catch (error) {
        console.error('❌ Ошибка миграции газет:', error);
        throw error;
    }
}

// Вспомогательная функция для извлечения даты из названия
function extractDate(title) {
    const dateMatch = title.match(/(\d{1,2})\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s+(\d{4})/);
    if (dateMatch) {
        const months = {
            'января': '01', 'февраля': '02', 'марта': '03', 'апреля': '04',
            'мая': '05', 'июня': '06', 'июля': '07', 'августа': '08',
            'сентября': '09', 'октября': '10', 'ноября': '11', 'декабря': '12'
        };
        const day = dateMatch[1].padStart(2, '0');
        const month = months[dateMatch[2]];
        const year = dateMatch[3];
        return `${year}-${month}-${day}`;
    }
    return null;
}

// Вспомогательная функция для извлечения номера
function extractNumber(title) {
    const numberMatch = title.match(/\d+\s+\((\d+)\)/);
    return numberMatch ? numberMatch[1] : null;
}