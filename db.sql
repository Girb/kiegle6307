CREATE TABLE IF NOT EXISTS club (
	id INTEGER PRIMARY KEY,
	name VARCHAR
);


CREATE TABLE IF NOT EXISTS player_status (
	id INTEGER PRIMARY KEY,
	title VARCHAR
);

INSERT OR REPLACE INTO player_status (id, title) VALUES (0, 'Registrert');
INSERT OR REPLACE INTO player_status (id, title) VALUES (1, 'Bekreftet');
INSERT OR REPLACE INTO player_status (id, title) VALUES (2, 'I gang');
INSERT OR REPLACE INTO player_status (id, title) VALUES (3, 'Ferdig');
INSERT OR REPLACE INTO player_status (id, title) VALUES (4, 'Kansellert');

CREATE TABLE IF NOT EXISTS player (
	id INTEGER PRIMARY KEY,
	firstname VARCHAR,
	lastname VARCHAR,
	nickname VARCHAR,
	email VARCHAR,
	club_id INTEGER NOT NULL REFERENCES club(id),
	status_id INTEGER NOT NULL DEFAULT 0 REFERENCES player_status(id),
	sort_order INTEGER DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS participant_status (
	id INTEGER PRIMARY KEY,
	title VARCHAR
);

INSERT OR REPLACE INTO participant_status (id, title) VALUES (0, 'Registrert');
INSERT OR REPLACE INTO participant_status (id, title) VALUES (1, 'Bekreftet');
INSERT OR REPLACE INTO participant_status (id, title) VALUES (2, 'Ferdig');
INSERT OR REPLACE INTO participant_status (id, title) VALUES (3, 'Kansellert');

CREATE table IF NOT EXISTS participant (
	id INTEGER PRIMARY KEY,
	player_id INTEGER NOT NULL REFERENCES player(id),
	sort_order INTEGER,
	status_id INTEGER NOT NULL DEFAULT 0 REFERENCES participant_status(id)
);

CREATE table IF NOT EXISTS tbl_stage_type (
    id INTEGER PRIMARY KEY,
    title VARCHAR
);

INSERT OR REPLACE INTO tbl_stage_type (id, title) VALUES (0, 'Innledende');
INSERT OR REPLACE INTO tbl_stage_type (id, title) VALUES (1, 'Semifinale');
INSERT OR REPLACE INTO tbl_stage_type (id, title) VALUES (2, 'Finale');
INSERT OR REPLACE INTO tbl_stage_type (id, title) VALUES (3, 'Finale 2');

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
	stage_type_id INTEGER NOT NULL REFERENCES tbl_stage_type(id),
	status_id INTEGER NOT NULL DEFAULT 0 REFERENCES round_status(id)
);

CREATE TABLE IF NOT EXISTS throw (
	id INTEGER PRIMARY KEY,
	round_id INTEGER NOT NULL REFERENCES round(id) ON DELETE CASCADE,
	score INTEGER
);

--- VIEWS

CREATE VIEW IF NOT EXISTS participants AS
select pa.id, player.id as player_id, player.firstname, player.lastname, player.nickname, player.email, club.name as club, pa.sort_order, pa.status_id, pa.competition_id as competition_id
from participant pa
inner join player on pa.player_id = player.id
inner join club on player.club_id = club.id;

CREATE VIEW IF NOT EXISTS rounds AS
select r.id, r.participant_id, r.status_id, p.player_id, p.sort_order, p.status_id as participant_status_id, pl.firstname, pl.lastname, pl.nickname, cl.name as club
from round r
INNER JOIN participant p ON r.participant_id = p.id
INNER JOIN player pl ON p.player_id = pl.id
INNER JOIN club cl ON pl.club_id = cl.id;


INSERT OR REPLACE INTO club (id, name) VALUES (1, 'Kniksen');
INSERT OR REPLACE INTO club (id, name) VALUES (2, 'Rambla');
-- INSERT INTO player (id, firstname, lastname, club_id) VALUES (1, 'Eivind', 'Sommersten', 1);
-- INSERT INTO round (player_id, stage_type_id, status_id) VALUES (1, 0, 0);
-- INSERT INTO round (player_id, stage_type_id, status_id) VALUES (1, 1, 0);
-- INSERT INTO round (player_id, stage_type_id, status_id) VALUES (1, 2, 0);
-- INSERT INTO round (player_id, stage_type_id, status_id) VALUES (1, 3, 0);

-- INSERT INTO player (id, firstname, lastname, club_id, status_id) VALUES (2, 'Håkon', 'Marås', 1, 2);
-- INSERT INTO round (player_id, stage_type_id, status_id) VALUES (2, 0, 1);
-- INSERT INTO throw (round_id, score) VALUES (5, 5);
-- INSERT INTO throw (round_id, score) VALUES (5, 7);
-- INSERT INTO throw (round_id, score) VALUES (5, 8);
-- INSERT INTO throw (round_id, score) VALUES (5, 3);
-- INSERT INTO throw (round_id, score) VALUES (5, 7);
-- INSERT INTO throw (round_id, score) VALUES (5, 7);
-- INSERT INTO throw (round_id, score) VALUES (5, 8);
-- INSERT INTO throw (round_id, score) VALUES (5, 7);
-- INSERT INTO throw (round_id, score) VALUES (5, 6);
-- INSERT INTO throw (round_id, score) VALUES (5, 4);
-- INSERT INTO round (player_id, stage_type_id, status_id) VALUES (2, 1, 1);
-- INSERT INTO throw (round_id, score) VALUES (6, 9);
-- INSERT INTO throw (round_id, score) VALUES (6, 0);
-- INSERT INTO throw (round_id, score) VALUES (6, 8);
-- INSERT INTO throw (round_id, score) VALUES (6, 8);
-- INSERT INTO throw (round_id, score) VALUES (6, 6);
-- INSERT INTO throw (round_id, score) VALUES (6, 9);
-- INSERT INTO throw (round_id, score) VALUES (6, 8);
-- INSERT INTO throw (round_id, score) VALUES (6, 5);
-- INSERT INTO throw (round_id, score) VALUES (6, 0);
-- INSERT INTO throw (round_id, score) VALUES (6, 7);

-- INSERT INTO player (id, firstname, lastname, club_id) VALUES (3, 'Kjetil', 'Lilletvedt', 1);
-- INSERT INTO round (player_id, stage_type_id, status_id) VALUES (3, 0, 0);
-- INSERT INTO round (player_id, stage_type_id, status_id) VALUES (3, 1, 0);
-- INSERT INTO round (player_id, stage_type_id, status_id) VALUES (3, 2, 0);
-- INSERT INTO round (player_id, stage_type_id, status_id) VALUES (3, 2, 0);

-- INSERT INTO player (id, firstname, lastname, club_id) VALUES (4, 'Cato', 'Ervik', 1);
-- INSERT INTO round (player_id, stage_type_id, status_id) VALUES (4, 0, 0);
-- INSERT INTO round (player_id, stage_type_id, status_id) VALUES (4, 1, 0);
-- INSERT INTO round (player_id, stage_type_id, status_id) VALUES (4, 2, 0);
-- INSERT INTO round (player_id, stage_type_id, status_id) VALUES (4, 2, 0);

-- INSERT INTO player (id, firstname, lastname, club_id) VALUES (5, 'Fredrik', 'Larsen', 2);
-- INSERT INTO round (player_id, stage_type_id, status_id) VALUES (5, 0, 0);
-- INSERT INTO round (player_id, stage_type_id, status_id) VALUES (5, 1, 0);
-- INSERT INTO round (player_id, stage_type_id, status_id) VALUES (5, 2, 0);
-- INSERT INTO round (player_id, stage_type_id, status_id) VALUES (5, 2, 0);
