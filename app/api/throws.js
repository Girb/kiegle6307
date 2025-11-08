import { Router } from "express";

export default db => {
    const api = Router();
    api.put('/', (req, res) => {
        let sql = 'UPDATE throw set score = ? where id = ?';
        let stmt = db.prepare(sql);
        stmt.run(req.body.score, req.body.id);
        res.status(200).json(req.body);
    });
    return api;
};
