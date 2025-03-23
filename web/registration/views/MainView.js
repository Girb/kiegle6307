import Controller from '../../Controller.js';
import View from '../../views/View.js';
import { PlayerCollection } from '../models/Player.js';
import PlayerList from './PlayerList.js';

export default class MainView extends View {
    get events() {
        return {
            'input .q': 'filter',
            'click .create': 'createNew'
        };
    }
    filter(e) {
        e.preventDefault();
        const q = this.$('.q').val().toLowerCase().trim();
        this.$('table tr').removeClass('d-none');
        if (q) {
            this.$('table tr').filter((idx, el) => $(el).text().toLowerCase().indexOf(q) === -1).addClass('d-none');
        }
    }
    createNew(e) {
        e.preventDefault();
        new Controller().createPlayer(this.$('.q').val().trim()).then(() => this.render());
    }
    get template() {
        return /* html */ `
            <div class="container">
                <div class="tools d-flex align-items-center mb-3">
                    <div class="flex-grow-1 me-3">
                        <input autofocus type="search" name="q" class="q w-100" placeholder="Finn slager...">
                    </div>
                    <div>
                        <button class="btn btn-primary create">Legg til ny</button>
                    </div>
                </div>
                <div class="list"></div>
            </div>
        `;
    }
    renderList() {
        const collection = new PlayerCollection();
        //collection.url = '/api/players?q=' + this.$('.q').val().trim();
        collection.url = '/api/players';
        const list = new PlayerList({ collection });
        list.render().$el.appendTo(this.$('.list').empty());
    }
    render() {
        super.render();
        this.renderList();
        return this;
    }
}
