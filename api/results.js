import { Router } from 'express';

const sumRounds = rounds => {
    return rounds.reduce((sum, round) => {
        return sum + (round.score !== undefined ? round.score : 0);
    }, 0);
}

export default db => {
    const api = Router();
    api.get('/:stageid', (req, res) => {
        let sql = `SELECT p.id, p.firstname, p.lastname, c.name as club_name 
            from player p
            inner join club c on c.id = p.club_id
            where p.current_stage_id = ?`;
        let stmt = db.prepare(sql);
        const players = stmt.all(req.params.stageid);
        sql = 'SELECT * from rounds';
        stmt = db.prepare(sql);
        const rounds = stmt.all();
        for (const player of players) {
            player.rounds = rounds.filter(t => t.player_id === player.id);
            player.total = sumRounds(player.rounds);
            console.log(sumRounds(player.rounds));
        }
        const idx = parseInt(req.params.stageid) - 1;
        players.sort((p1, p2) => {
            return p2.total - p1.total;
        });
        res.status(200).json(players);
    });

    return api;
}