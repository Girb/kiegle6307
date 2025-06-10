import fs from 'fs';
import { Router } from "express";

export default db => {
    const api = Router();

    // Endpoint to get all players
    api.get('/meta', (req, res) => {
        const stats = fs.statSync(db._path);
        res.status(200).json({
            path: db._path,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
        });
    });

    api.post('/backup', (req, res) => {
        const backupPath = `${db._path}.${new Date().valueOf()}.backup`;
        db.backup(backupPath).then(() => {
            res.status(200).json({ message: 'Backup ble opprettet: ' + backupPath })
        }).catch(err => {
            console.error('Backup failed:', err);
            res.status(500).json({ message: 'Failed to create backup' });
        });
        // fs.copyFile(db._path, backupPath, (err) => {
        //     if (err) {
        //         return res.status(500).json({ error: 'Failed to create backup' });
        //     }
        //     res.status(200).json({ message: 'Backup created successfully', path: backupPath });
        // });
    });

    api.post('/truncate', (req, res) => {
        // backs up the current database, then trucates THROW, ROUND, PLAYER
        const backupPath = `${db._path}.${new Date().valueOf()}.backup`;
        db.backup(backupPath).then(() => {
            const statements = [
                'DELETE FROM throw;',
                'DELETE FROM round;',
                'DELETE FROM player;'
            ].map(sql => db.prepare(sql));
            const transaction = db.transaction(() => {
                for (const stmt of statements) {
                    stmt.run();
                }
            });
            transaction();
            // fs.unlinkSync(db._path); // remove the old database file
            res.status(200).json({ message: 'Databasen er tømt (applikasjonen må startes på nytt)', backupPath });
        }).catch(err => {
            console.error('Failed to close database:', err);
            res.status(500).json({ message: 'Failed to truncate database' });
        });
    });

    return api;
}