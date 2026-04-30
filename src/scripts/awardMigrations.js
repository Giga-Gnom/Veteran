import fs from 'fs';
import path from 'path';
import { app } from 'electron';

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

export async function migrateAwards(dbService) {
    console.log("🚀 start migrate awards");
    
    try {
        if (!dbService) {
            console.error('❌ dbService не передан в migrateAwards');
            return false;
        }

        // Проверяем, есть ли уже данные
        const existingAwards = await dbService.getAll('awards');

        if (existingAwards && existingAwards.length > 0) {
            console.log('✅ Данные уже есть в БД, миграция не нужна');
            return false;
        }

        // Путь к исходным файлам
        const sourceDir = path.join(
            process.cwd(),
            'src',
            'components',
            'Windows',
            'AwardsWindow',
            'srcAwards'
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

        // Показываем файлы в папке
        const filesInDir = fs.readdirSync(sourceDir);
        console.log('📄 Файлы в srcAwards:', filesInDir);

        let migratedCount = 0;

        // Копируем файлы и добавляем в БД
        for (const item of awardsArray) {
            // Копируем PDF файл
            const sourceFile = path.join(sourceDir, item.file);
            const uniqueFileName = `${Date.now()}_${item.file}`;
            const targetFile = path.join(documentsDir, uniqueFileName);
            
            // Копируем изображение
            const sourceImage = path.join(sourceDir, item.image);
            const uniqueImageName = `${Date.now()}_${item.image}`;
            const targetImage = path.join(documentsDir, uniqueImageName);

            console.log(`📄 Обработка: ${item.name}`);
            console.log(`   PDF: ${item.file}`);
            console.log(`   Image: ${item.image}`);

            // Проверяем и копируем PDF
            if (fs.existsSync(sourceFile)) {
                fs.copyFileSync(sourceFile, targetFile);
                console.log(`   ✅ PDF скопирован`);
                
                // Проверяем и копируем изображение
                let imagePath = null;
                if (fs.existsSync(sourceImage)) {
                    fs.copyFileSync(sourceImage, targetImage);
                    imagePath = `file://${targetImage.replace(/\\/g, '/')}`;
                    console.log(`   ✅ Изображение скопировано`);
                } else {
                    console.warn(`   ⚠️ Изображение не найдено: ${item.image}`);
                }

                // Сохраняем в БД
                await dbService.insert('awards', {
                    title: item.name,
                    description: item.text,
                    file_path: `file://${targetFile.replace(/\\/g, '/')}`,
                    file_name: uniqueFileName,
                    image_path: imagePath,
                    upload_date: new Date().toISOString()
                });

                migratedCount++;
                console.log(`   ✅ Добавлен в БД: ${item.name}`);
                
                await new Promise(resolve => setTimeout(resolve, 10));
            } else {
                console.warn(`   ⚠️ PDF не найден: ${item.file}`);
            }
        }

        console.log(`✅ Миграция наград завершена! Перенесено: ${migratedCount} документов`);
        return true;

    } catch (error) {
        console.error('❌ Ошибка миграции наград:', error);
        return false;
    }
}