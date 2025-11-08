import { Router } from "express";


export default db => {
    const api = Router();
    api.get('/', (req, res) => {
        const stmt = db.prepare('SELECT * from club order by name COLLATE NOCASE ASC');
        const rows = stmt.all();
        res.status(200).json(rows);
    });
    api.post('/', (req, res) => {
        const insertClub = db.prepare('INSERT INTO club (name) VALUES (?)');
        const result = insertClub.run([req.body.name]);
        res.status(200).json(result);
    });

    api.put('/:id?', (req, res) => {
        let stmt = db.prepare('UPDATE club SET name = ? WHERE id = ?');
        const result = stmt.run([req.body.name, req.body.id]);
        res.status(200).json(result);
    });

    api.get('/best', (req, res) => {
        const sql = `
        WITH prelim_player_stats AS (
    SELECT
        p.id AS player_id,
        p.firstname AS player_name,
        p.club_id,
        -- Total score for the preliminary round
        SUM(t.score) AS prelim_score,

        -- Tie-break details
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

    FROM player p
    JOIN round r ON r.player_id = p.id AND r.stage_id = 1
    JOIN throw t ON t.round_id = r.id
    GROUP BY p.id
),

ranked_by_club AS (
    SELECT
        p.*,
        ROW_NUMBER() OVER (
            PARTITION BY club_id
            ORDER BY
                prelim_score DESC,
                n9 DESC,
                n8 DESC,
                n7 DESC,
                n6 DESC,
                n5 DESC,
                n4 DESC,
                n3 DESC,
                n2 DESC,
                n1 DESC,
                n0 DESC
        ) AS rn
    FROM prelim_player_stats p
),

club_aggregates AS (
    SELECT
        c.id AS club_id,
        c.name AS club_name,

        -- Sum of top 5 players, including tie-breaker summary
        SUM(r.prelim_score) AS club_score,
        SUM(r.n9) AS club_n9,
        SUM(r.n8) AS club_n8,
        SUM(r.n7) AS club_n7,
        SUM(r.n6) AS club_n6,
        SUM(r.n5) AS club_n5,
        SUM(r.n4) AS club_n4,
        SUM(r.n3) AS club_n3,
        SUM(r.n2) AS club_n2,
        SUM(r.n1) AS club_n1,
        SUM(r.n0) AS club_n0

    FROM club c
    JOIN ranked_by_club r ON r.club_id = c.id
    WHERE r.rn <= 5                -- only top 5 players per club
    GROUP BY c.id
)

SELECT club_name, club_score
FROM club_aggregates
ORDER BY
    club_score DESC,
    club_n9 DESC,
    club_n8 DESC,
    club_n7 DESC,
    club_n6 DESC,
    club_n5 DESC,
    club_n4 DESC,
    club_n3 DESC,
    club_n2 DESC,
    club_n1 DESC,
    club_n0 DESC;
        `;
        const stmt = db.prepare(sql);
        const rows = stmt.all();
        res.status(200).json(rows);
    });
    return api;
};