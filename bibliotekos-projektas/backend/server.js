const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = 8080;
const JWT_SECRET = 'super-secret-key-123';

// Middleware autentifikacijai patikrinti
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.use(cors()); // Leidžia užklausas iš visų šaltinių
app.use(express.json());

// --- PAGALBINĖS FUNKCIJOS ---

const validateBook = (book) => {
    const errors = [];
    if (!book.title || book.title.trim().length < 2) errors.push('Pavadinimas turi būti bent 2 simbolių ilgio.');
    if (!book.author || book.author.trim().length < 2) errors.push('Autorius privalomas.');
    if (!book.category_id) errors.push('Kategorija privaloma.');
    return errors;
};

// --- API MARŠRUTAI ---

// Gauti visas kategorijas
app.get('/api/categories', (req, res) => {
    db.all("SELECT * FROM categories", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Gauti visas knygas (su kategorijos pavadinimu)
app.get('/api/books', (req, res) => {
    const query = `
        SELECT books.*, categories.name as category_name 
        FROM books 
        LEFT JOIN categories ON books.category_id = categories.id
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Vieša paieška pagal kategoriją
app.get('/api/books/search', (req, res) => {
    const { categoryId } = req.query;
    if (!categoryId) {
        return res.status(400).json({ error: 'Reikalingas kategorijos ID' });
    }
    const query = `
        SELECT books.*, categories.name as category_name 
        FROM books 
        LEFT JOIN categories ON books.category_id = categories.id
        WHERE books.category_id = ?
    `;
    db.all(query, [categoryId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Pridėti naują knygą (Administratorius)
app.post('/api/books', (req, res) => {
    const book = req.body;
    const errors = validateBook(book);

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const query = `INSERT INTO books (title, author, category_id, description, image_url, isbn, pages) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [book.title, book.author, book.category_id, book.description, book.image_url, book.isbn, book.pages];

    db.run(query, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, ...book });
    });
});

// Atnaujinti knygą (Administratorius)
app.put('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const book = req.body;
    const errors = validateBook(book);

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const query = `UPDATE books SET title = ?, author = ?, category_id = ?, description = ?, image_url = ?, isbn = ?, pages = ? WHERE id = ?`;
    const params = [book.title, book.author, book.category_id, book.description, book.image_url, book.isbn, book.pages, id];

    db.run(query, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Knyga sėkmingai atnaujinta' });
    });
});

// Ištrinti knygą (Administratorius)
app.delete('/api/books/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM books WHERE id = ?`, id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Knyga sėkmingai ištrinta' });
    });
});

// --- REZERVACIJOS ---

// Rezervuoti knygą
app.post('/api/reservations', authenticateToken, (req, res) => {
    const { bookId } = req.body;
    const userId = req.user.id;

    db.run(`INSERT INTO reservations (user_id, book_id) VALUES (?, ?)`, [userId, bookId], function (err) {
        if (err) {
            // Gaudome bet kokią klaidą, susijusią su dublikatais (UNIQUE)
            if (err.message.toLowerCase().includes('unique') || err.message.includes('CONSTRAINT')) {
                return res.status(400).json({ error: 'Šią knygą jūs jau esate rezervavę!' });
            }
            console.error('Rezervacijos klaida:', err.message);
            return res.status(500).json({ error: 'Sistemos klaida: Nepavyko atlikti rezervacijos.' });
        }
        res.status(201).json({ message: 'Knyga sėkmingai rezervuota' });
    });
});

// Gauti vartotojo rezervacijas
app.get('/api/my-reservations', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const query = `
        SELECT reservations.*, books.title, books.author 
        FROM reservations 
        JOIN books ON reservations.book_id = books.id 
        WHERE reservations.user_id = ?
    `;
    db.all(query, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- AUTENTIFIKACIJA ---

// Registracija
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Visi laukai privalomi' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;

    // Pirmas vartotojas tampa administratoriumi (supaprastinimui)
    db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
        const role = row.count === 0 ? 'admin' : 'user';

        db.run(query, [username, hashedPassword, role], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'Vartotojo vardas užimtas' });
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Vartotojas sukurtas', role });
        });
    });
});

// Prisijungimas
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Neteisingas vartotojo vardas arba slaptažodis' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Neteisingas vartotojo vardas arba slaptažodis' });

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, username: user.username, role: user.role });
    });
});

app.listen(PORT, () => {
    console.log(`Serveris veikia portu ${PORT}`);
});
