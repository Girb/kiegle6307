import { Router } from "express"


export default db => {
    const api = Router();
    api.get('/:id', (req, res) => {
        let sql = 'SELECT * from round where id = ?';
        const stmt = db.prepare(sql);
        const row = stmt.get(req.params.id);
        res.status(200).json(row);
    });
    return api;
}