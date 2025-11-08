import { Router } from "express";
import players from "./players.js";
import rounds from "./rounds.js";
import throws from "./throws.js";
import competition from "./competition.js";
import results from "./results.js";
import admin from "./admin.js";
import clubs from "./clubs.js";

export default db => {
    const api = Router();
    api.use('/players', players(db));
    api.use('/clubs', clubs(db));
    api.use('/rounds', rounds(db));
    api.use('/throws', throws(db));
    api.use('/competition', competition(db));
    api.use('/results', results(db));
    api.use('/admin', admin(db));
    return api;
};
