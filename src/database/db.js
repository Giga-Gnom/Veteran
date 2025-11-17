const Database = require('better-sqlite3')
const path = require('path')
const {app} = require('electron')

class DatabaseManager {
    constructor () {
        this.db = null
        this.dbPath = path.join(app.getPath('userData', 'kiosk-app.sqlite'))
        this.init()
    }

    init() {
        this.db = new Database(this.dbPath)
        this.createTables()
        this.initializeDefaultContent()
    }

    createTables(){
        this.db.exec(`
            CREATE TABLE IF NOT EXIST page_content(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                page_slug TEXT UNIQUE NOT NULL,
                content_json
            )
            `)
    }
}