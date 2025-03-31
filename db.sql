CREATE TABLE IF NOT EXISTS club (
	id INTEGER PRIMARY KEY,
	name VARCHAR
);


CREATE TABLE IF NOT EXISTS player_status (
	id INTEGER PRIMARY KEY,
	title VARCHAR
);

INSERT OR REPLACE INTO player_status (id, title) VALUES (0, 'Registrert');
INSERT OR REPLACE INTO player_status (id, title) VALUES (1, 'Innledende');
INSERT OR REPLACE INTO player_status (id, title) VALUES (2, 'Semi');
INSERT OR REPLACE INTO player_status (id, title) VALUES (3, 'Finale 1');
INSERT OR REPLACE INTO player_status (id, title) VALUES (4, 'Finale 2');
INSERT OR REPLACE INTO player_status (id, title) VALUES (5, 'Ferdig');
INSERT OR REPLACE INTO player_status (id, title) VALUES (6, 'Kansellert');

CREATE TABLE IF NOT EXISTS player (
	id INTEGER PRIMARY KEY,
	firstname VARCHAR,
	lastname VARCHAR,
	nickname VARCHAR,
	email VARCHAR,
	club_id INTEGER NOT NULL REFERENCES club(id),
	current_status_id INTEGER NOT NULL DEFAULT 0 REFERENCES player_status(id),
	sort_order INTEGER DEFAULT 0 NOT NULL
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
	player_status_id INTEGER NOT NULL REFERENCES player_status(id),
	status_id INTEGER NOT NULL DEFAULT 0 REFERENCES round_status(id)
);

CREATE TABLE IF NOT EXISTS throw (
	id INTEGER PRIMARY KEY,
	round_id INTEGER NOT NULL REFERENCES round(id) ON DELETE CASCADE,
	score INTEGER
);

--- VIEWS

INSERT OR REPLACE INTO club (id, name) VALUES (1, 'Kniksen');
INSERT OR REPLACE INTO club (id, name) VALUES (2, 'Rambla');
