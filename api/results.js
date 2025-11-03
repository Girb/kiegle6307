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
            inner join club c on c.id = p.club_id`;
        let stmt = db.prepare(sql);
        const players = stmt.all(); // stmt.all(req.params.stageid);
        sql = 'SELECT * from rounds order by score DESC, c9 DESC, c8 DESC, c7 DESC, c6 DESC, c5 DESC, c4 DESC;';
        stmt = db.prepare(sql);
        const rounds = stmt.all();
        for (const player of players) {
            player.rounds = rounds.filter(t => t.player_id === player.id);
            const rounds = player.rounds.filter(r => r.stage_id === parseInt(req.params.stageid));
            player.roundTotal = sumRounds(rounds);
        }
        players.sort((p1, p2) => {
            return p2.roundTotal - p1.roundTotal;
        });
        res.status(200).json(players);
    });

    api.get('/ex/:stageid', (req, res) => {
        let sql = `SELECT p.id, p.firstname, p.lastname, c.name as club_name 
            from round r
            inner join player p on r.player_ud = p.id
            where r.stage_id = ?`;
        let stmt = db.prepare(sql);
        const player = stmt.get(req.params.playerid);
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }
        sql = 'SELECT * from rounds where player_id = ?';
        stmt = db.prepare(sql);
        const rounds = stmt.all(req.params.playerid);
        player.rounds = rounds;
        player.total = sumRounds(rounds);
        res.status(200).json(player);
    });

    return api;
}