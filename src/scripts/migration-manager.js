// src/scripts/migration-manager.js
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

class MigrationManager {
    constructor() {
        this.migrationFile = path.join(app.getPath('userData'), '.migration_completed');
        console.log('📁 Migration file path:', this.migrationFile);
    }
    
    isMigrationNeeded() {
        const needed = !fs.existsSync(this.migrationFile);
        console.log(`🔍 Миграция нужна: ${needed}`);
        return needed;
    }
    
    markMigrationCompleted() {
        const timestamp = new Date().toISOString();
        fs.writeFileSync(this.migrationFile, timestamp);
        console.log(`✅ Миграция отмечена как выполненная: ${timestamp}`);
    }
    
    async runAllMigrations() {
        console.log('🔍 Проверка необходимости миграций...');
        
        if (!this.isMigrationNeeded()) {
            console.log('📌 Миграции уже были выполнены ранее');
            return;
        }
        
        console.log('🔄 Первый запуск приложения - выполняем миграции...');
        
        try {
            await this.migrateStandarts();
            
            this.markMigrationCompleted();
            console.log('🎉 Все миграции успешно завершены!');
        } catch (error) {
            console.error('❌ Ошибка при выполнении миграций:', error);
            throw error;
        }
    }
    
    async migrateStandarts() {
        console.log('📄 Миграция стандартов...');
        try {
            const { migrateStandarts } = await import('./migrate-standarts.js');
            await migrateStandarts(); // Не передаем параметр
        } catch (error) {
            console.error('❌ Ошибка в migrateStandarts:', error);
            throw error;
        }
    }
}

export default MigrationManager;