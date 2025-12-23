import Database from "better-sqlite3";
import { app } from "electron";
import path from 'path';

class DatabaseService {
  constructor() {
    this.db = null;
    
    // ⚠️ Не инициализируем БД сразу в конструкторе
    // this.init() - УДАЛИТЕ эту строку
  }

  async init() {
    if (this.db) return;
  
    if (!app.isReady()) {
      await new Promise(resolve => {
        if (app.isReady()) {
          resolve();
        } else {
          app.once('ready', resolve);
        }
      });
    }
    
    const dbPath = path.join(app.getPath('userData'), 'kiosk.db');
    this.db = new Database(dbPath);
    this.createTables();
  }

  createTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS standart_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_name TEXT NOT NULL,
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);/*title - название для пользователя
    file_name - название сохранения файла*/
    console.log('✅ Таблицы созданы успешно');
  }

  async getAll(table) {
    await this.init(); // Гарантируем инициализацию
    console.log(`📋 Getting all from ${table}`);
    const stmt = this.db.prepare(`SELECT * FROM ${table}`);
    const result = stmt.all();
    console.log(`✅ Found ${result.length} records`);
    return result;
  }

  async insert(table, data) {
    await this.init(); // Гарантируем инициализацию
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const stmt = this.db.prepare(query);
    const result = stmt.run(...values);

    return result.lastInsertRowid;
  }

  async delete(table, id) {
    await this.init(); // Гарантируем инициализацию
    const stmt = this.db.prepare(`DELETE FROM ${table} WHERE id = ?`);
    return stmt.run(id);
  }
}

// Экспортируем класс, а не экземпляр
export default new DatabaseService();