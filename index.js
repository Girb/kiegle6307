import express from 'express';
import sqlite3 from 'sqlite3';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import api from './api/index.js';

const __dirname = path.resolve();

const app = express();

app.use(express.json());

// Serve static files from the "web" folder
app.use(express.static(path.join(__dirname, 'web')));

// const db = new Database(':memory:', { verbose: console.log });
const db = new Database(':memory:');
db.pragma('journal_mode = WAL');
// const db = new sqlite3.Database(':memory:');
// const db = new sqlite3.Database('test.db');
// db.serialize(() => {
//     db.run('CREATE TABLE user (id INT, name TEXT)');

//     const stmt = db.prepare('INSERT INTO user VALUES (?, ?)');
//     stmt.run(1, 'Eivind Sommersten');
//     stmt.run(2, 'Håkon Marås');
//     stmt.finalize();
// });

const sql = fs.readFileSync('./db.sql', 'utf-8').toString();
db.exec(sql, err => {
    if (err) {
        console.error("Error executing SQL script:", err);
      } else {
        console.log("SQL script executed successfully.");
      }
});

app.use('/api', api(db));

app.get('/clubs', (req, res) => {
    const stmt = db.prepare('SELECT * from club');
    const rows = stmt.all();
    res.status(200).json(rows);
});

const PORT = 6307;
app.listen(PORT, () => {
    console.log(`Kiegle kjører på http://localhost:${PORT} - lå det gå sport i det!`);
});
