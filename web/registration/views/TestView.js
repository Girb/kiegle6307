import TestUtil from "../../TestUtil.js";
import View from "../../views/View.js";

export default class TestView extends View {
    initialize(options) {
        super.initialize(options);
        this.util = new TestUtil();
    }
    get events() {
        return {
            'click .insertplayer': 'insertPlayer',
            'click .rest': 'rest'
        };
    }
    insertPlayer(e) {
        e.preventDefault();
        this.util.createRandomPlayer().then(() => this.trigger('inserted'));
    }
    rest(e) {
        e.preventDefault();
        fetch('/api/competition', {

        }).then(response => {

        });
    }
    get template() {
        return /* html */ `
            <button class="btn btn-primary insertplayer">Opprett slager</button>
            <button class="btn btn-secondary rest">Kjør</button>
        `;
    }
}
