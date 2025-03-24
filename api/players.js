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
        const stmt = db.prepare(sql);
        const rows = stmt.all();
        res.status(200).json(rows);
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
        const stmt = db.prepare(sql);
        const rows = buildPlayerList(stmt.all());
        res.status(200).json(rows);
    });

    api.post('/', (req, res) => {
        const stmt = db.prepare('INSERT INTO player (firstname, lastname, club_id) VALUES (?, ?, ?)');
        const result = stmt.run([req.body.firstname, req.body.lastname, req.body.club_id]);
        res.status(200).json(result);
    });

    api.put('/:id?', (req, res) => {
        const stmt = db.prepare('UPDATE player SET firstname = ?, lastname = ?, club_id = ?, status_id = ? WHERE id = ?');
        const result = stmt.run([req.body.firstname, req.body.lastname, req.body.club_id, req.body.status_id, req.body.id]);
        res.status(200).json(result);
    });


    return api;
};
