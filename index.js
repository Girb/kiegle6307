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

const dbpath = path.join(__dirname, 'kongematch.db');
const db = new Database(dbpath);
db._path = dbpath;

const sql = fs.readFileSync('./db.sql', 'utf-8').toString();
db.exec(sql, err => {
    if (err) {
        console.error("Error executing SQL script:", err);
      } else {
        console.log("SQL script executed successfully.");
      }
});

app.use('/api', api(db));

const PORT = 6307;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kiegle kjører på http://localhost:${PORT} - lå det gå sport i det!`);
});
