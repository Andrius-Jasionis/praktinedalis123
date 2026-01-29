const db = require('./db');
const bcrypt = require('bcryptjs');

const args = process.argv.slice(2);
const username = args[0];
const password = args[1];
const role = args[2] || 'user';

if (!username || !password) {
    console.log('Naudojimas: node sukurti_vartotoja.js <vardas> <slaptazodis> <role>');
    process.exit(1);
}

const run = async () => {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
        [username, hashedPassword, role],
        function (err) {
            if (err) {
                console.error('Klaida:', err.message);
            } else {
                console.log(`Vartotojas ${username} sėkmingai sukurtas! Rolė: ${role}`);
            }
            process.exit();
        }
    );
};

run();
