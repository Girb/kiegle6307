import { Router } from "express";
import players from "./players.js";
import rounds from "./rounds.js";
import throws from "./throws.js";

export default db => {
    const api = Router();
    api.use('/players', players(db));
    api.use('/rounds', rounds(db));
    api.use('/throws', throws(db));
    return api;
};
