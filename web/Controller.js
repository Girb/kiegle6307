import Player from "./registration/models/Player.js";
import EditPlayerDialog from "./registration/views/EditPlayerDialog.js";

export default class Controller {
    createPlayer(str = '') {
        const model = new Player({ firstname: str });
        const d = new EditPlayerDialog({ model });
        d.render().show();
    }
}
