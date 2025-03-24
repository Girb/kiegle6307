import { Router } from "express";
import players from "./players.js";
import rounds from "./rounds.js";

export default db => {
    const api = Router();
    api.use('/players', players(db));
    api.use('/rounds', rounds(db));
    return api;
};
