import { Router } from "express";

const logError = err => err && console.log(err.message);


export default db => {
    const api = Router();
    api.get('/', (req, res) => {
        let sql = 'SELECT p.*, c.name as club_name from player p INNER JOIN club c ON c.id = p.club_id order by current_stage_id asc, id asc';
        const stmt = db.prepare(sql);
        const rows = stmt.all();
        res.status(200).json(rows);
    });

    api.post('/', (req, res) => {
        const insertPlayer = db.prepare('INSERT INTO player (firstname, lastname, club_id) VALUES (?, ?, ?)');
        const result = insertPlayer.run([req.body.firstname, req.body.lastname, req.body.club_id]);

        const insertRound = db.prepare('INSERT INTO round (player_id, stage_id, status_id) VALUES (?, ?, ?) RETURNING id;'); 
        const insertThrow = db.prepare('INSERT INTO throw (round_id) VALUES (?);')
        const insertThrowMany = db.transaction(id => {
            for (let i = 0; i < 10; i++) {
                insertThrow.run(id);
            }
        });
        for (let i = 1; i <= 4; i++) {
            const roundResult = insertRound.run([result.lastInsertRowid, i, 0]);
            insertThrowMany(roundResult.lastInsertRowid);
        }
        
        res.status(200).json(result);
    });

    api.put('/:id?', (req, res) => {
        let stmt = db.prepare('UPDATE player SET firstname = ?, lastname = ?, club_id = ?, current_stage_id = ? WHERE id = ?');
        const result = stmt.run([req.body.firstname, req.body.lastname, req.body.club_id, req.body.current_stage_id, req.body.id]);
        if (req.body.stage_id === 1) {
            stmt = db.prepare('UPDATE player set sort_order = (select max(sort_order) + 1 from player where current_stage_id IN (1,2)) where id = ?');
            stmt.run(req.body.id);
        }
        res.status(200).json(result);
    });

    api.post('/:id/stage/:stageid', (req, res) => {
        // let stmt = db.prepare('UPDATE throw set score = NULL where stage_id = ? and player_id = ?');
        // stmt.run([req.params.stageid, req.params.id]);

        let stmt = db.prepare('UPDATE player SET current_stage_id = ? WHERE id = ?');
        const result = stmt.run([req.params.stageid, req.params.id]);

        res.status(200).json(result);
    });

    api.post('/sorting', (req, res) => {
        const update = db.prepare('UPDATE player set sort_order = @sort_order where id = @id');
        const updateMany = db.transaction((ps) => {
            for (const p of ps) update.run(p);
        });
        updateMany(req.body);
        res.status(200).json('{}');
    });

    return api;
};
