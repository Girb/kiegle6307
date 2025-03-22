import View from '../../views/View.js';
import { PlayerCollection } from '../models/Player.js';

class PlayerRow extends View {
    get tagName() { return 'tr'; }
    get template() {
        return /* html */ `
            <td>${this.model.get('firstname')}</td>
            <td>${this.model.get('lastname')}</td>
        `;
    }
}

export default class PlayerList extends View {
    initialize(options) {
        super.initialize(options);
        this.collection = new PlayerCollection();
        this.collection.url = '/api/players';
    }
    get template() {
        return /* html */ `
            <div class="tools"></div>
            <table></table>
        `;
    }
    addOne(model) {
        const row = new PlayerRow({ model });
        row.render().$el.appendTo(this.$('table'));
    }
    render() {
        super.render();
        this.collection.fetch().then(() => {
            this.collection.each(this.addOne, this);
        });
        return this;
    }
}
