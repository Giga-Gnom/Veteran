// src/scripts/migrateStatistics.js
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

export async function migrateStatistics(dbService) {
    console.log("🚀 start migrate statistics");
    
    try {
        if (!dbService) {
            console.error('❌ dbService не передан');
            return false;
        }

        // Проверяем, есть ли уже данные
        const existingCharts = await dbService.getAll('statistic_charts');
        
        if (existingCharts && existingCharts.length > 0) {
            console.log('✅ Данные статистики уже есть в БД, миграция не нужна');
            return false;
        }

        // Импортируем данные из JSX файла
        // ВАЖНО: нужно либо перенести данные в отдельный .js файл,
        // либо скопировать массив сюда
        const { datas } = await import('../components/Windows/StatisticWindow/statisticsData.js');

        
        console.log(`📊 Найдено графиков: ${datas.length}`);
        
        let chartsMigrated = 0;
        
        for (const chartData of datas) {
            console.log(`\n📈 Обработка графика: ${chartData.chartName}`);
            
            // 1. Создаем запись в statistic_charts
            const chartId = await dbService.insert('statistic_charts', {
                chart_name: chartData.chartName,
                sort_order: chartsMigrated,
                chart_type: 'bar',
                created_at: new Date().toISOString()
            });
            
            console.log(`   ✅ Создан график с ID: ${chartId}`);
            
            // 2. Создаем категории (labels)
            const categoryIds = {};
            for (let i = 0; i < chartData.labels.length; i++) {
                const categoryId = await dbService.insert('chart_categories', {
                    chart_id: chartId,
                    category_name: chartData.labels[i],
                    sort_order: i
                });
                categoryIds[chartData.labels[i]] = categoryId;
            }
            console.log(`   ✅ Создано категорий: ${chartData.labels.length}`);
            
            // 3. Создаем datasets и data points
            for (const dataset of chartData.datasets) {
                const datasetId = await dbService.insert('chart_datasets', {
                    chart_id: chartId,
                    dataset_label: dataset.label,
                    dataset_color: dataset.backgroundColor,
                    border_color: dataset.borderColor,
                    sort_order: 0
                });
                
                console.log(`      📊 Dataset: ${dataset.label}`);
                
                // 4. Добавляем точки данных
                for (let i = 0; i < chartData.labels.length; i++) {
                    const categoryName = chartData.labels[i];
                    const value = dataset.data[i];
                    
                    if (value !== undefined) {
                        await dbService.insert('chart_data_points', {
                            dataset_id: datasetId,
                            category_id: categoryIds[categoryName],
                            data_value: value
                        });
                    }
                }
                
                console.log(`         ✅ Добавлено точек: ${dataset.data.length}`);
            }
            
            chartsMigrated++;
        }
        
        console.log(`\n✅ Миграция статистики завершена! Перенесено графиков: ${chartsMigrated}`);
        return true;
        
    } catch (error) {
        console.error('❌ Ошибка миграции статистики:', error);
        return false;
    }
}