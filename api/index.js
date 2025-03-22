import { Router } from "express";
import players from "./players.js";

export default db => {
    const api = Router();
    api.use('/players', players(db));
    return api;
};
