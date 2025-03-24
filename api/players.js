import { Router } from "express";

const logError = err => err && console.log(err.message);

const buildPlayerList = rows => {
    const m = new Map();
    rows.forEach(row => {
        if (!m.has(row.player_id)) {
            m.set(row.player_id, { id: row.player_id });
        }
        m.get(row.player_id).firstname = row.firstname;
        m.get(row.player_id).lastname = row.lastname;
        m.get(row.player_id).club_name = row.club_name;
        m.get(row.player_id)['stage' + row.stage_type_id] = row.score;
    });
    return [...m.values()];
};

export default db => {
    const api = Router();
    api.get('/', (req, res) => {
        let sql = 'SELECT p.*, c.name as club_name from player p INNER JOIN club c ON c.id = p.club_id';
        const q = req.query.q;
        if (q) {
            sql += ` where firstname LIKE '%${q}%' OR lastname LIKE '%${q}%' OR nickname LIKE '%${q}%'`
        }
        db.all(sql, [], (err, rows) => {
            if (!err) {
                res.status(200).json(rows);
            } else {
                res.status(500).json({ error: err.message });
            }
        });
    });

    api.get('/competition', (req, res) => {
        let sql = `
            WITH rounds AS (
                select id, player_id from round
            )
            select p.firstname, p.lastname, p.sort_order, c.name as club_name, r.id, r.player_id, r.stage_type_id, r.status_id, sum(score) as score
            from throw t
            inner join round r on r.id = t.round_id
            inner join player p on p.id = r.player_id
            inner join club c on c.id = p.club_id
            where round_id IN (SELECT id from rounds)
            GROUP BY round_id
            UNION
            select p.firstname, p.lastname, p.sort_order, c.name as club_name, NULL, p.id as player_id, NULL, NULL, NULL
            from player p
            inner join club c on c.id = p.club_id
            where p.status_id IN (1,2)
            order by p.sort_order;
        `;
        db.all(sql, [], (err, rows) => {
            if (!err) {
                res.status(200).json(buildPlayerList(rows));
            } else {
                res.status(500).json({ error: err.message });
            }
        });
    });

    api.post('/', (req, res) => {
        db.run('INSERT INTO player (firstname, lastname, club_id) VALUES (?, ?, ?)', [req.body.firstname, req.body.lastname, req.body.club_id], function(err) {
            if (err) {
                console.log(err.message);
            } else {
                db.run('INSERT INTO round (player_id, stage_type_id, status_id) VALUES (?, ?, ?)', [this.lastID, 0, 0]);
                db.run('INSERT INTO round (player_id, stage_type_id, status_id) VALUES (?, ?, ?)', [this.lastID, 1, 0]);
                db.run('INSERT INTO round (player_id, stage_type_id, status_id) VALUES (?, ?, ?)', [this.lastID, 2, 0]);
                db.run('INSERT INTO round (player_id, stage_type_id, status_id) VALUES (?, ?, ?)', [this.lastID, 3, 0]);
                res.json({
                    id: this.lastID,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    club_id: req.body.club_id
                });
            }
        });
    });

    api.put('/:id?', (req, res) => {
        db.run('UPDATE player SET firstname = ?, lastname = ?, club_id = ?, status_id = ? WHERE id = ?', [req.body.firstname, req.body.lastname, req.body.club_id, req.body.status_id, req.body.id], function(err) {
            if (err) {
                console.log(err.message);
            } else {
                res.json({
                    id: req.body.id,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    club_id: req.body.club_id
                });
            }
        });
    });


    return api;
};
