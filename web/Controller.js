import Player from "./registration/models/Player.js";
import EditPlayerDialog from "./registration/views/EditPlayerDialog.js";


class Events {
}
Object.assign(Events.prototype, Backbone.Events);

export default class Controller extends Events {
    createPlayer(str = '') {
        return new Promise((resolve, reject) => {
            const model = new Player({ firstname: str });
            const d = new EditPlayerDialog({ model });
            this.listenToOnce(d, 'confirm', () => resolve(model));
            d.render().show();
        });
    }
    editPlayer(model) {
        return new Promise((resolve, reject) => {
            const d = new EditPlayerDialog({ model });
            this.listenToOnce(d, 'confirm', () => resolve(model));
            d.render().show();
        });
    }
}
