const db = require('./db');
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        book_id INTEGER,
        status TEXT DEFAULT 'active',
        reservation_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error("Klaida kuriant lentelę:", err.message);
        else console.log("Reservations lentelė paruošta.");
    });

    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
        console.log("Esamos lentelės:", rows);
        process.exit();
    });
});
