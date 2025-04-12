import { Router } from "express";

export default db => {
    const api = Router();
    api.get('/:stageid', (req, res) => {
        let sql = `SELECT p.id, p.firstname, p.lastname, c.name as club_name 
            from player p
            inner join club c on c.id = p.club_id
            where p.current_stage_id = ?
            order by p.sort_order`;
        let stmt = db.prepare(sql);
        const players = stmt.all(req.params.stageid);
        sql = 'SELECT * from rounds';
        stmt = db.prepare(sql);
        const rounds = stmt.all();
        for (const player of players) {
            player.rounds = rounds.filter(t => t.player_id === player.id);
        }
        res.status(200).json(players);
    });
    return api;
};
