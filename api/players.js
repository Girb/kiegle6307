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
        if (row.player_status_id !== null) {
            m.get(row.player_id)['stage' + row.player_status_id] = row.score;
        }
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

    api.get('/competition/:statusid', (req, res) => {
        // let sql = `
        //     select p.id, p.firstname, p.lastname, c.name as club_name, p.sort_order, r.player_id, r.status_id, sum(score) as score
        //     from throw t
        //     inner join round r on r.id = t.round_id
        //     inner join player p on p.id = r.player_id
        //     inner join club c on c.id = p.club_id
        //     where p.current_status_id = ?
        //     GROUP BY p.id
        //     UNION
        //     select p.id, p.firstname, p.lastname, c.name as club_name, p.sort_order, NULL, NULL, NULL
        //     from player p
        //     INNER JOIN club c on c.id = p.club_id
        //     order by p.sort_order;
        // `;
        let sql = `
            select p.id, p.firstname, p.lastname, c.name as club_name, count, score from rounds rs
            inner join player p on p.id = rs.player_id
            inner join club c on c.id = p.club_id
            inner join round r on r.id = rs.round_id
            where r.player_status_id = ?
            and p.current_status_id = ?
            group by p.id
            UNION
            select p.id, p.firstname, p.lastname, c.name as club_name, 0, null
            from player p
            inner join club c on c.id = p.club_id
            where p.current_status_id = ?;
        `;
        const stmt = db.prepare(sql);
        const rows = stmt.all(req.params.statusid, req.params.statusid, req.params.statusid);
        res.status(200).json(rows);
    });

    api.post('/', (req, res) => {
        const stmt = db.prepare('INSERT INTO player (firstname, lastname, club_id) VALUES (?, ?, ?)');
        const result = stmt.run([req.body.firstname, req.body.lastname, req.body.club_id]);
        res.status(200).json(result);
    });

    api.put('/:id?', (req, res) => {
        let stmt = db.prepare('UPDATE player SET firstname = ?, lastname = ?, club_id = ?, current_status_id = ? WHERE id = ?');
        const result = stmt.run([req.body.firstname, req.body.lastname, req.body.club_id, req.body.current_status_id, req.body.id]);
        if (req.body.status_id === 1) {
            stmt = db.prepare('UPDATE player set sort_order = (select max(sort_order) + 1 from player where status_id IN (1,2)) where id = ?');
            stmt.run(req.body.id);
        }
        res.status(200).json(result);
    });

    api.post('/:id/status/:statusid', (req, res) => {
        let stmt = db.prepare('UPDATE player SET current_status_id = ? WHERE id = ?');
        const result = stmt.run([req.params.statusid, req.params.id]);
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
