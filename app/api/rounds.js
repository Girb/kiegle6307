import { Router } from "express"

export default db => {

    const getRound = id => {
        let sql = `SELECT *, st.title as status_name
                from round
                inner join player p on p.id = round.player_id
                inner join stage st on st.id = p.current_stage_id
                where round.id = ?`;
        let stmt = db.prepare(sql);
        const row = stmt.get(id);
        sql = 'SELECT * from throw where round_id = ?';
        stmt = db.prepare(sql);
        const throws = stmt.all(id);
        return Object.assign({}, row, { throws });
    };

    const api = Router();
    
    // api.post('/player/:playerid/type/:statusid', (req, res) => {
    //     let sql = 'INSERT INTO round (player_id, stage_id, status_id) VALUES (?, ?, ?) RETURNING id;';
    //     let stmt = db.prepare(sql);
    //     const result = stmt.get(req.params.playerid, req.params.statusid, 0);
    //     sql = 'INSERT INTO throw (round_id) VALUES (?);'
    //     stmt = db.prepare(sql);
    //     for (let i = 0; i < 10; i++) {
    //         stmt.run(result.id);
    //     }
    //     res.status(200).json(getRound(result.id));
    // });

    api.get('/:id', (req, res) => {
        res.status(200).json(getRound(req.params.id));
    });

    return api;
}