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
// const db = new Database(':memory:');
const dbpath = path.join(__dirname, 'kongematch.db');
const db = new Database(dbpath);
db._path = dbpath;
// db.pragma('journal_mode = WAL');
// const db = new sqlite3.Database(':memory:');
// const db = new sqlite3.Database('test.db');

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
    const stmt = db.prepare('SELECT * from club order by name asc');
    const rows = stmt.all();
    res.status(200).json(rows);
});

const PORT = 6307;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kiegle kjører på http://localhost:${PORT} - lå det gå sport i det!`);
});
