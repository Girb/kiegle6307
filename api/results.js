import { Router } from 'express';

const sumRounds = rounds => {
    return rounds.reduce((sum, round) => {
        return sum + (round.score !== undefined ? round.score : 0);
    }, 0);
}

export default db => {
    const api = Router();
    api.get('/:stageid', (req, res) => {
        let sql = `WITH stages(stage_id) AS (
    VALUES (1),(2),(3),(4)  -- preliminary, semifinal, final1, final2
),
player_stage_grid AS (
    SELECT p.id AS player_id, s.stage_id
    FROM player p
    CROSS JOIN stages s
),
stage_aggregates AS (
    SELECT
        r.player_id,
        r.stage_id,
        SUM(CASE WHEN t.score IS NOT NULL THEN t.score ELSE 0 END) AS total_score,
        COUNT(CASE WHEN t.score IS NOT NULL THEN 1 END) AS throw_count,
        SUM(CASE WHEN t.score = 9 THEN 1 ELSE 0 END) AS n9,
        SUM(CASE WHEN t.score = 8 THEN 1 ELSE 0 END) AS n8,
        SUM(CASE WHEN t.score = 7 THEN 1 ELSE 0 END) AS n7,
        SUM(CASE WHEN t.score = 6 THEN 1 ELSE 0 END) AS n6,
        SUM(CASE WHEN t.score = 5 THEN 1 ELSE 0 END) AS n5,
        SUM(CASE WHEN t.score = 4 THEN 1 ELSE 0 END) AS n4,
        SUM(CASE WHEN t.score = 3 THEN 1 ELSE 0 END) AS n3,
        SUM(CASE WHEN t.score = 2 THEN 1 ELSE 0 END) AS n2,
        SUM(CASE WHEN t.score = 1 THEN 1 ELSE 0 END) AS n1,
        SUM(CASE WHEN t.score = 0 THEN 1 ELSE 0 END) AS n0
    FROM round r
    LEFT JOIN throw t ON t.round_id = r.id
    GROUP BY r.player_id, r.stage_id
)
SELECT
    p.firstname, p.lastname, c.name AS club_name,

    -- Pivot: scores and throw counts per stage
    COALESCE(MAX(CASE WHEN g.stage_id=1 THEN a.total_score END),0) AS prelim_score,
    COALESCE(MAX(CASE WHEN g.stage_id=1 THEN a.throw_count END),0) AS prelim_throws,

    COALESCE(MAX(CASE WHEN g.stage_id=2 THEN a.total_score END),0) AS semi_score,
    COALESCE(MAX(CASE WHEN g.stage_id=2 THEN a.throw_count END),0) AS semi_throws,

    COALESCE(MAX(CASE WHEN g.stage_id=3 THEN a.total_score END),0) AS final1_score,
    COALESCE(MAX(CASE WHEN g.stage_id=3 THEN a.throw_count END),0) AS final1_throws,

    COALESCE(MAX(CASE WHEN g.stage_id=4 THEN a.total_score END),0) AS final2_score,
    COALESCE(MAX(CASE WHEN g.stage_id=4 THEN a.throw_count END),0) AS final2_throws,

    -- Totals across all stages
    COALESCE(SUM(a.total_score),0) AS total_score,
    COALESCE(SUM(a.throw_count),0) AS total_throws,

    -- Tie-breakers summed across all stages
    COALESCE(SUM(a.n9),0) AS n9,
    COALESCE(SUM(a.n8),0) AS n8,
    COALESCE(SUM(a.n7),0) AS n7,
    COALESCE(SUM(a.n6),0) AS n6,
    COALESCE(SUM(a.n5),0) AS n5,
    COALESCE(SUM(a.n4),0) AS n4,
    COALESCE(SUM(a.n3),0) AS n3,
    COALESCE(SUM(a.n2),0) AS n2,
    COALESCE(SUM(a.n1),0) AS n1,
    COALESCE(SUM(a.n0),0) AS n0,

    -- Rank using total + tie-breakers
    ROW_NUMBER() OVER (
        ORDER BY
            COALESCE(SUM(a.total_score),0) DESC,
            COALESCE(SUM(a.n9),0) DESC,
            COALESCE(SUM(a.n8),0) DESC,
            COALESCE(SUM(a.n7),0) DESC,
            COALESCE(SUM(a.n6),0) DESC,
            COALESCE(SUM(a.n5),0) DESC,
            COALESCE(SUM(a.n4),0) DESC,
            COALESCE(SUM(a.n3),0) DESC,
            COALESCE(SUM(a.n2),0) DESC,
            COALESCE(SUM(a.n1),0) DESC,
            COALESCE(SUM(a.n0),0) DESC
    ) AS rank

FROM player_stage_grid g
LEFT JOIN stage_aggregates a
    ON a.player_id = g.player_id AND a.stage_id = g.stage_id
JOIN player p ON p.id = g.player_id
JOIN club c ON c.id = p.club_id
GROUP BY p.id, p.firstname, p.lastname, c.name
ORDER BY rank;`;
        let stmt = db.prepare(sql);
        const players = stmt.all();
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