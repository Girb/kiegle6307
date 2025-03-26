import Player from "./registration/models/Player.js";

const firstnames = ['Per', 'Lars', 'Åge', 'Anders', 'Fredrik', 'Arne', 'Laurits', 'Thomas', 'Kristian', 'Rune', 'Anton', 'Birger'];
const lastnames = ['Hansen', 'Olsen', 'Jensen', 'Pettersen', 'Tveit', 'Tveiten', 'Andersen', 'Bye', 'Mathiesen', 'Larsen', 'Jansen', 'Knudsen'];

export default class TestUtil {
    constructor() {}

    createRandomPlayer() {
        const model = new Player({
            firstname: firstnames[Math.floor(Math.random() * 10)],
            lastname: lastnames[Math.floor(Math.random() * 10)],
            club_id: 2
        });
        model.url = '/api/players';
        return model.save();
    }
}