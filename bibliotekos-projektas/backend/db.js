const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'library.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Klaida jungiantis prie SQLite:', err.message);
    } else {
        console.log('Prisijungta prie SQLite duomenų bazės.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Kategorijų lentelė
        db.run(`CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )`);

        // Knygų lentelė
        db.run(`CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            category_id INTEGER,
            description TEXT,
            image_url TEXT,
            isbn TEXT,
            pages INTEGER,
            FOREIGN KEY (category_id) REFERENCES categories (id)
        )`);

        // Vartotojų lentelė
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user'
        )`);

        // Rezervacijų lentelė
        db.run(`CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            book_id INTEGER,
            reservation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (book_id) REFERENCES books (id)
        )`);

        // Įdedame pradines kategorijas, jei jų nėra
        const defaultCategories = ['Grožinė literatūra', 'Mokslinė literatūra', 'Biografijos', 'Vaikams', 'Istorija'];
        const stmt = db.prepare("INSERT OR IGNORE INTO categories (name) VALUES (?)");
        defaultCategories.forEach(cat => stmt.run(cat));
        stmt.finalize();

        console.log('Duomenų bazės struktūra paruošta.');
    });
}

module.exports = db;
