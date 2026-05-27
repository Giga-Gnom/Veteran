// scripts/parseOrganizations.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Поднимаемся из src/scripts в корень проекта
const PROJECT_ROOT = path.join(__dirname, '..', '..'); // C:\Veteran

console.log('📁 PROJECT_ROOT:', PROJECT_ROOT);

// ===== НАСТРОЙКИ - ИСПРАВЛЕНО =====
// Папка, где лежат файлы с массивами организаций (от корня проекта)
const SOURCE_DIR = path.join(PROJECT_ROOT, 'src', 'components', 'Windows', 'MapWindow', 'organizations');

// Папка для выходного файла
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'src', 'components', 'AdminWindows', 'AdminMapWindow', 'organizationsData.js');

console.log('📁 SOURCE_DIR:', SOURCE_DIR);
console.log('📁 OUTPUT_FILE:', OUTPUT_FILE);

// Соответствие имени файла -> название округа
const districtMapping = {
    CAOArray: 'Центральный',
    SAOArray: 'Северный',
    SVAOArray: 'Северо-восточный',
    VAOorgArray: 'Восточный',
    UVAOorgArray: 'Юго-восточный',
    UAOorgArray: 'Южный',
    UZAOorgArray: 'Юго-западный',
    ZAOorgArray: 'Западный',
    SZAOorgArray: 'Северо-западный',
    ZelAOorgArray: 'Зеленоград',
    TrAOorgArray: 'Троицкий',
    NovAOorgArray: 'Новомосковский',
};

function processOrganization(org, areaName, districtName) {
    const isHead = org.name && (org.name.includes('Совет ветеранов района') || org.name.includes('Ветеранская организация района'));
    let headText = '';
    if (isHead) {
        headText = areaName;
    } else {
        const match = org.name.match(/\d+/);
        headText = match ? match[0] : org.name;
    }

    const chairman = org.chairman || {};
    const director = chairman.name || '';
    const phone = chairman.phone || chairman.mobile || org.phone || '';
    const address = org.address || '';

    return {
        head_text: headText,
        is_head: isHead ? 1 : 0,
        director: director,
        phone: phone,
        address: address,
    };
}

async function parseOrganizations() {
    console.log('🔄 Начинаем парсинг организаций...');

    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`❌ Папка не найдена: ${SOURCE_DIR}`);
        console.log('💡 Создайте папку:');
        console.log(`   mkdir "${SOURCE_DIR}"`);
        console.log('💡 И положите туда файлы с данными (CAOArray.js, NovAOorgArray.js и т.д.)');
        process.exit(1);
    }

    const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.js') && !f.includes('organizationsData'));
    console.log(`📁 Найдено файлов: ${files.length}`);
    console.log(`📄 Файлы: ${files.join(', ')}`);

    const allOrganizations = [];

    for (const file of files) {
        const filePath = path.join(SOURCE_DIR, file);
        const fileName = path.basename(file, '.js');
        const districtName = districtMapping[fileName];

        if (!districtName) {
            console.warn(`⚠️ Нет маппинга для файла ${file}, пропускаем.`);
            continue;
        }

        console.log(`📖 Обработка файла: ${file} -> ${districtName}`);

        try {
            const module = await import(`file://${filePath}`);
            let districtsArray = module.default;
            if (!districtsArray || !Array.isArray(districtsArray)) {
                districtsArray = module[fileName];
            }
            if (!districtsArray || !Array.isArray(districtsArray)) {
                districtsArray = module.districtsArray;
            }

            if (!districtsArray || !Array.isArray(districtsArray)) {
                console.warn(`   ⚠️ В файле нет массива данных, пропускаем.`);
                continue;
            }

            console.log(`   📊 Найдено районов: ${districtsArray.length}`);

            for (const area of districtsArray) {
                const areaId = area.id;
                const areaName = area.name;
                const organizations = area.organizations || [];

                for (const org of organizations) {
                    const { head_text, is_head, director, phone, address } = processOrganization(org, areaName, districtName);
                    allOrganizations.push({
                        district_name: districtName,
                        area_num: areaId,
                        head_text: head_text,
                        is_head: is_head,
                        director: director,
                        phone: phone,
                        address: address,
                    });
                }
            }
        } catch (err) {
            console.error(`   ❌ Ошибка при импорте ${file}:`, err.message);
        }
    }

    console.log(`\n✅ Всего обработано организаций: ${allOrganizations.length}`);

    const outputContent = `// Автоматически сгенерированный файл. Не редактировать вручную.
// Всего организаций: ${allOrganizations.length}
export const organizationsArray = ${JSON.stringify(allOrganizations, null, 2)};\n`;

    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, outputContent, 'utf8');
    console.log(`✅ Результат сохранён в ${OUTPUT_FILE}`);
}

parseOrganizations().catch(console.error);