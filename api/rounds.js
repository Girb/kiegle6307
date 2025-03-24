import { Router } from "express"

export default db => {

    const getRound = id => {
        let sql = 'SELECT * from round where id = ?';
        let stmt = db.prepare(sql);
        const row = stmt.get(id);
        sql = 'SELECT * from throw where round_id = ?';
        stmt = db.prepare(sql);
        const throws = stmt.all(id);
        return Object.assign({}, row, { throws });
    };

    const api = Router();
    api.get('/:id', (req, res) => {
        res.status(200).json(getRound(id));
    });

    api.post('/player/:playerid/type/:typeid', (req, res) => {
        let sql = 'INSERT INTO round (player_id, stage_type_id, status_id) VALUES (?, ?, ?) RETURNING id;';
        let stmt = db.prepare(sql);
        const result = stmt.get(req.params.playerid, req.params.typeid, 0);
        sql = 'INSERT INTO throw (round_id) VALUES (?);'
        stmt = db.prepare(sql);
        for (let i = 0; i < 10; i++) {
            stmt.run(result.id);
        }
        res.status(200).json(getRound(result.id));
    });

    api.get('/player/:playerid/type/:typeid', (req, res) => {
        let sql = 'SELECT id from round where player_id = ? AND stage_type_id = ?';
        let stmt = db.prepare(sql);
        const result = stmt.get(req.params.playerid, req.params.typeid);
        res.status(200).json(getRound(result.id));
    });

    return api;
}