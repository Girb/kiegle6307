import Player from "./registration/models/Player.js";

const firstnames = ['Per', 'Lars', 'Åge', 'Anders', 'Fredrik', 'Arne', 'Laurits', 'Thomas', 'Kristian', 'Rune', 'Anton', 'Birger', 'Jens', 'Knut', 'Morten', 'Ole', 'Sven', 'Tore', 'Torstein', 'Vegard', 'Vidar', 'Øyvind'];
const lastnames = ['Hansen', 'Olsen', 'Jensen', 'Pettersen', 'Tveit', 'Tveiten', 'Andersen', 'Bye', 'Mathiesen', 'Larsen', 'Jansen', 'Knudsen', 'Johansen', 'Berg', 'Nilsen', 'Solberg', 'Sørensen', 'Svendsen', 'Eriksen', 'Kristiansen', 'Karlsen', 'Lund'];

export default class TestUtil {
    constructor() {}

    createRandomPlayer() {
        const model = new Player({
            firstname: firstnames[Math.floor(Math.random() * 22)],
            lastname: lastnames[Math.floor(Math.random() * 22)],
            club_id: Math.floor(Math.random() * 10) + 1
        });
        model.url = '/api/players';
        return model.save();
    }
}