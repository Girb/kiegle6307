CREATE TABLE IF NOT EXISTS club (
	id INTEGER PRIMARY KEY,
	name VARCHAR
);


CREATE TABLE IF NOT EXISTS stage (
	id INTEGER PRIMARY KEY,
	title VARCHAR
);

INSERT OR REPLACE INTO stage (id, title) VALUES (0, 'Registrert');
INSERT OR REPLACE INTO stage (id, title) VALUES (1, 'Innledende');
INSERT OR REPLACE INTO stage (id, title) VALUES (2, 'Semi');
INSERT OR REPLACE INTO stage (id, title) VALUES (3, 'Finale');
INSERT OR REPLACE INTO stage (id, title) VALUES (4, 'Ferdig');
INSERT OR REPLACE INTO stage (id, title) VALUES (5, 'Kansellert');

CREATE TABLE IF NOT EXISTS player (
	id INTEGER PRIMARY KEY,
	firstname VARCHAR,
	lastname VARCHAR,
	nickname VARCHAR,
	email VARCHAR,
	club_id INTEGER NOT NULL REFERENCES club(id),
	current_stage_id INTEGER NOT NULL DEFAULT 0 REFERENCES stage(id),
	sort_order INTEGER DEFAULT 0 NOT NULL,
	score1 INTEGER,
	score2 INTEGER,
	score3 INTEGER,
	score4 INTEGER
);

CREATE TABLE IF NOT EXISTS round_status (
	id INTEGER PRIMARY KEY,
	title VARCHAR
);

INSERT OR REPLACE INTO round_status (id, title) VALUES (0, 'Draft');
INSERT OR REPLACE INTO round_status (id, title) VALUES (1, 'Submitted');
INSERT OR REPLACE INTO round_status (id, title) VALUES (2, 'Deleted');

CREATE TABLE IF NOT EXISTS round (
	id INTEGER PRIMARY KEY,
	player_id INTEGER NOT NULL REFERENCES player(id),
	stage_id INTEGER NOT NULL REFERENCES stage(id),
	status_id INTEGER NOT NULL DEFAULT 0 REFERENCES round_status(id)
);

CREATE TABLE IF NOT EXISTS throw (
	id INTEGER PRIMARY KEY,
	round_id INTEGER NOT NULL REFERENCES round(id) ON DELETE CASCADE,
	score INTEGER
);

--- VIEWS

-- CREATE VIEW IF NOT EXISTS rounds as 
-- 	select r.id as round_id, r.player_id, r.stage_id, count (*) as count, sum(score) as score
-- 	from throw t
-- 	inner join round r on r.id = t.round_id
-- 	where t.score IS NOT NULL
-- 	group by r.player_id
-- ;

CREATE VIEW IF NOT EXISTS rounds as
    select r.player_id,
        t.round_id,
        r.stage_id,
        sum(case when t.score IS NOT NULL then 1 else 0 end) count,
        sum(t.score) as score,
        sum(case when t.score = 9 then 1 else 0 end) as c9,
        sum(case when t.score = 8 then 1 else 0 end) as c8,
        sum(case when t.score = 7 then 1 else 0 end) as c7,
        sum(case when t.score = 6 then 1 else 0 end) as c6,
        sum(case when t.score = 5 then 1 else 0 end) as c5,
        sum(case when t.score = 4 then 1 else 0 end) as c4
        from throw t
        INNER JOIN round r on r.id = t.round_id
        GROUP BY t.round_id, r.player_id
        ORDER BY score DESC, c9 DESC, c8 DESC, c7 DESC, c6 DESC, c5 DESC, c4 DESC
;


INSERT OR REPLACE INTO club (id, name) VALUES (1, 'Kniksen');
INSERT OR REPLACE INTO club (id, name) VALUES (2, 'Rambla');
INSERT OR REPLACE INTO club (id, name) VALUES (3, 'Skaftet');
INSERT OR REPLACE INTO club (id, name) VALUES (4, 'De Håpefulle');
INSERT OR REPLACE INTO club (id, name) VALUES (5, 'Baltus');
INSERT OR REPLACE INTO club (id, name) VALUES (6, 'KGB');
INSERT OR REPLACE INTO club (id, name) VALUES (7, 'Neptun');
INSERT OR REPLACE INTO club (id, name) VALUES (8, 'Gjallarhorn');
INSERT OR REPLACE INTO club (id, name) VALUES (9, 'Viking');
INSERT OR REPLACE INTO club (id, name) VALUES (10, 'Hussardene');
