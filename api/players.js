import { Router } from "express";

export default db => {
    const api = Router();
    api.get('/', (req, res) => {
        db.all('SELECT * from player', [], (err, rows) => {
            if (!err) {
                res.status(200).json(rows);
            } else {
                res.status(500).json({ error: err.message });
            }
        });
    });
    return api;
};
