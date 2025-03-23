PRAGMA case_sensitive_like = false;

CREATE TABLE club (
	id INTEGER PRIMARY KEY,
	name VARCHAR
);


CREATE TABLE player_status (
	id INTEGER PRIMARY KEY,
	title VARCHAR
);

INSERT INTO player_status (id, title) VALUES (0, 'Registrert');
INSERT INTO player_status (id, title) VALUES (1, 'Bekreftet');
INSERT INTO player_status (id, title) VALUES (2, 'I gang');
INSERT INTO player_status (id, title) VALUES (3, 'Ferdig');
INSERT INTO player_status (id, title) VALUES (4, 'Kansellert');

CREATE TABLE player (
	id INTEGER PRIMARY KEY,
	firstname VARCHAR,
	lastname VARCHAR,
	nickname VARCHAR,
	email VARCHAR,
	club_id INTEGER NOT NULL REFERENCES club(id),
	status_id INTEGER NOT NULL DEFAULT 0 REFERENCES player_status(id),
	sort_order INTEGER
);

CREATE TABLE participant_status (
	id INTEGER PRIMARY KEY,
	title VARCHAR
);

INSERT INTO participant_status (id, title) VALUES (0, 'Registrert');
INSERT INTO participant_status (id, title) VALUES (1, 'Bekreftet');
INSERT INTO participant_status (id, title) VALUES (2, 'Ferdig');
INSERT INTO participant_status (id, title) VALUES (3, 'Kansellert');

CREATE table participant (
	id INTEGER PRIMARY KEY,
	player_id INTEGER NOT NULL REFERENCES player(id),
	sort_order INTEGER,
	status_id INTEGER NOT NULL DEFAULT 0 REFERENCES participant_status(id)
);

CREATE table tbl_stage_type (
    id INTEGER PRIMARY KEY,
    title VARCHAR
);

INSERT INTO tbl_stage_type (id, title) VALUES (0, 'Innledende');
INSERT INTO tbl_stage_type (id, title) VALUES (1, 'Semifinale');
INSERT INTO tbl_stage_type (id, title) VALUES (2, 'Finale');

CREATE TABLE round_status (
	id INTEGER PRIMARY KEY,
	title VARCHAR
);

INSERT INTO round_status (id, title) VALUES (0, 'Draft');
INSERT INTO round_status (id, title) VALUES (1, 'Submitted');
INSERT INTO round_status (id, title) VALUES (2, 'Deleted');

CREATE TABLE round (
	id INTEGER PRIMARY KEY,
	player_id INTEGER NOT NULL REFERENCES player(id),
	stage_type_id INTEGER NOT NULL REFERENCES tbl_stage_type(id),
	status_id INTEGER NOT NULL DEFAULT 0 REFERENCES round_status(id)
);

CREATE TABLE throw (
	id INTEGER PRIMARY KEY,
	round_id INTEGER NOT NULL REFERENCES round(id) ON DELETE CASCADE,
	score INTEGER
);

--- VIEWS

CREATE VIEW participants AS
select pa.id, player.id as player_id, player.firstname, player.lastname, player.nickname, player.email, club.name as club, pa.sort_order, pa.status_id, pa.competition_id as competition_id
from participant pa
inner join player on pa.player_id = player.id
inner join club on player.club_id = club.id;

CREATE VIEW rounds AS
select r.id, r.participant_id, r.status_id, p.player_id, p.sort_order, p.status_id as participant_status_id, pl.firstname, pl.lastname, pl.nickname, cl.name as club
from round r
INNER JOIN participant p ON r.participant_id = p.id
INNER JOIN player pl ON p.player_id = pl.id
INNER JOIN club cl ON pl.club_id = cl.id;


INSERT INTO club (id, name) VALUES (1, 'Kniksen');
INSERT INTO club (id, name) VALUES (2, 'Rambla');
INSERT INTO player (id, firstname, lastname, club_id) VALUES (1, 'Eivind', 'Sommersten', 1);
INSERT INTO player (id, firstname, lastname, club_id) VALUES (2, 'Håkon', 'Marås', 1);
INSERT INTO player (id, firstname, lastname, club_id) VALUES (3, 'Kjetil', 'Lilletvedt', 1);
INSERT INTO player (id, firstname, lastname, club_id) VALUES (4, 'Cato', 'Ervik', 1);
INSERT INTO player (id, firstname, lastname, club_id) VALUES (5, 'Fredrik', 'Larsen', 2);
