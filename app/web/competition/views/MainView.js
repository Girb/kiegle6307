import { PlayerCollection } from "../../registration/models/Player.js";
import View from "../../views/View.js";
import StageNames from "../StageNames.js";
import PlayerList from "./PlayerList.js";

export default class MainView extends View {
    get template() {
        return /* html */ `
            <div class="container">
                <h1>${StageNames[this.stage]}</h1>    
                <div class="list"></div>
            </div>
        `;
    }
    renderList() {
        const collection = new PlayerCollection();
        collection.url = `/api/competition/${this.stage}`;
        const list = new PlayerList({ collection, stage: this.stage });
        list.render().$el.appendTo(this.$('.list').empty());
    }
    render() {
        super.render();
        this.renderList();
        return this;
    }
}
