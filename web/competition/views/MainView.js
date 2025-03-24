import { PlayerCollection } from "../../registration/models/Player.js";
import View from "../../views/View.js";
import PlayerList from "./PlayerList.js";

export default class MainView extends View {
    get template() {
        return /* html */ `
            <div class="container">
                <div class="list"></div>
            </div>
        `;
    }
    renderList() {
        const collection = new PlayerCollection();
        collection.url = '/api/players/competition';
        const list = new PlayerList({ collection });
        list.render().$el.appendTo(this.$('.list').empty());
    }
    render() {
        super.render();
        this.renderList();
        return this;
    }
}
