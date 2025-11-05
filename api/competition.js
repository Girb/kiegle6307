import { Router } from "express";

export default db => {
    const api = Router();
    api.get('/:stageid', (req, res) => {
        let sql = `SELECT
    p.id,
    p.firstname, p.lastname, c.name AS club_name,
    p.sort_order,

    -- Current stage stats
    COALESCE(SUM(CASE WHEN r.stage_id = ? THEN t.score END), 0) AS stage_score,
    SUM(CASE WHEN r.stage_id = ? AND t.score IS NOT NULL THEN 1 ELSE 0 END) AS stage_throws,

    -- Individual stage totals (previous or all, as available)
    COALESCE(SUM(CASE WHEN r.stage_id = 1 THEN t.score END), 0) AS prelim_score,
    SUM(CASE WHEN r.stage_id = 1 AND t.score IS NOT NULL THEN 1 ELSE 0 END) AS prelim_throws,

    COALESCE(SUM(CASE WHEN r.stage_id = 2 THEN t.score END), 0) AS semi_score,
    SUM(CASE WHEN r.stage_id = 2 AND t.score IS NOT NULL THEN 1 ELSE 0 END) AS semi_throws,

    COALESCE(SUM(CASE WHEN r.stage_id = 3 THEN t.score END), 0) AS final1_score,
    SUM(CASE WHEN r.stage_id = 3 AND t.score IS NOT NULL THEN 1 ELSE 0 END) AS final1_throws,

    COALESCE(SUM(CASE WHEN r.stage_id = 4 THEN t.score END), 0) AS final2_score,
    SUM(CASE WHEN r.stage_id = 4 AND t.score IS NOT NULL THEN 1 ELSE 0 END) AS final2_throws


FROM player p
LEFT JOIN round r
    ON r.player_id = p.id
LEFT JOIN throw t
    ON t.round_id = r.id
JOIN club c
    ON c.id = p.club_id
WHERE p.current_stage_id = ?
GROUP BY p.id, p.firstname, p.sort_order
ORDER BY p.sort_order ASC;`;
        let stmt = db.prepare(sql);
        const stageId = req.params.stageid;
        const players = stmt.all(stageId, stageId, stageId);
        sql = 'SELECT * from rounds order by stage_id asc';
        stmt = db.prepare(sql);
        const rounds = stmt.all();
        for (const player of players) {
            player.rounds = rounds.filter(t => t.player_id === player.id);
        }
        res.status(200).json(players);
    });
    return api;
};
