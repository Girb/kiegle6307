import TestUtil from "../../TestUtil.js";
import View from "../../views/View.js";

export default class TestView extends View {
    initialize(options) {
        super.initialize(options);
        this.util = new TestUtil();
    }
    get events() {
        return {
            'click .insertplayer': 'insertPlayer'
        };
    }
    insertPlayer(e) {
        e.preventDefault();
        this.util.createRandomPlayer().then(() => this.trigger('inserted'));
    }
    get template() {
        return /* html */ `
        <div><h5>TESTVERKTØY</h5></div>
            <button class="btn btn-primary insertplayer">Opprett testslager</button>
        `;
    }
}
