import { Router } from "express";

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

    api.post('/', (req, res) => {
        db.run('INSERT INTO player (firstname, lastname, club_id) VALUES (?, ?, ?)', [req.body.firstname, req.body.lastname, req.body.club_id], function(err) {
            if (err) {
                console.log(err.message);
            } else {
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
