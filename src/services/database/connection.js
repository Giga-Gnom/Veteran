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

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS newspapers_years(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER UNIQUE NOT NULL,
        title TEXT NOT NULL
        )`
      );
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS newspapers_quarters(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quarter INTEGER CHECK (quarter >= 1 AND quarter <= 4),
        year_id INTEGER,
        title TEXT,
        UNIQUE (year_id, quarter),
        FOREIGN KEY (year_id) REFERENCES newspapers_years(id) ON DELETE CASCADE
        )`
      );
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS newspapers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quarter_id INTEGER,
        title TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_name TEXT NOT NULL,
        issue_date TEXT,
        issue_number TEXT,
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (quarter_id) REFERENCES newspapers_quarters(id) ON DELETE SET NULL
        )`
      );

      this.db.exec(`
        CREATE TABLE IF NOT EXISTS awards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          file_path TEXT NOT NULL,
          file_name TEXT NOT NULL,
          description TEXT,
          upload_date DATETIME DEFAULT CURRENT_TIME,
          image_path TEXT
          )`
        );




        this.db.exec(`
          CREATE TABLE IF NOT EXISTS gallery_folders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL
          )`
        );
        this.db.exec(`
          CREATE TABLE IF NOT EXISTS gallery_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_path TEXT NOT NULL,
            image_name TEXT NOT NULL,
            folder_id INTEGER,
            FOREIGN KEY (folder_id) REFERENCES gallery_folders(id) ON DELETE CASCADE
          )`
        );
        this.db.exec(`
          CREATE TABLE IF NOT EXISTS slider_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          image_path TEXT NOT NULL,
          image_name TEXT NOT NULL
          )`
        );

        this.db.exec(`
          CREATE TABLE IF NOT EXISTS regions(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            region_name TEXT NOT NULL,
            document_name TEXT NOT NULL,
            document_path TEXT NOT NULL,
            logo_path TEXT NOT NULL,
            upload_date DATETIME DEFAULT CURRENT_TIME
          )`
        );



        this.db.exec(`
          CREATE TABLE IF NOT EXISTS statistic_charts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chart_name TEXT NOT NULL,
            sort_order INTEGER DEFAULT 0,
            chart_type TEXT DEFAULT 'bar',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )`
        );
        this.db.exec(`
          CREATE TABLE IF NOT EXISTS chart_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chart_id INTEGER NOT NULL,
            category_name TEXT NOT NULL,
            sort_order INTEGER DEFAULT 0,
            FOREIGN KEY (chart_id) REFERENCES statistic_charts(id) ON DELETE CASCADE
          )`
        );
        this.db.exec(`
          CREATE TABLE IF NOT EXISTS chart_datasets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chart_id INTEGER NOT NULL,
            dataset_label TEXT NOT NULL,
            dataset_color TEXT NOT NULL,
            border_color TEXT NOT NULL,
            sort_order INTEGER DEFAULT 0,
            FOREIGN KEY (chart_id) REFERENCES statistic_charts(id) ON DELETE CASCADE
          )`
        );
        this.db.exec(`
          CREATE TABLE IF NOT EXISTS chart_data_points (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            dataset_id INTEGER NOT NULL,
            category_id INTEGER NOT NULL,
            data_value DECIMAL(10, 2) NOT NULL,
            FOREIGN KEY (dataset_id) REFERENCES chart_datasets(id) ON DELETE CASCADE,
            FOREIGN KEY (category_id) REFERENCES chart_categories(id) ON DELETE CASCADE
          )`
        );

        this.db.exec(`
          DROP TABLE IF EXISTS area_organizations;
          
          CREATE TABLE IF NOT EXISTS area_organizations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            head_text TEXT NOT NULL,
            is_head boolean NOT NULL DEFAULT FALSE,
            director TEXT,
            phone TEXT,
            address TEXT NOT NULL,
            district_num INTEGER
          )`
        )

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