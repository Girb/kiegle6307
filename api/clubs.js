import { Router } from "express";


export default db => {
    const api = Router();
    api.post('/', (req, res) => {
        const insertClub = db.prepare('INSERT INTO club (name) VALUES (?)');
        const result = insertClub.run([req.body.name]);
        res.status(200).json(result);
    });

    api.put('/:id?', (req, res) => {
        let stmt = db.prepare('UPDATE club SET name = ? WHERE id = ?');
        const result = stmt.run([req.body.name, req.body.id]);
        res.status(200).json(result);
    });

    return api;
};