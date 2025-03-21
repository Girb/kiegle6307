import Controller from '../../Controller.js';
import View from '../../views/View.js';
import PlayerList from './PlayerList.js';

export default class MainView extends View {
    get events() {
        return {
            'click .create': 'createNew'
        };
    }    
    createNew(e) {
        e.preventDefault();
        new Controller().createPlayer(this.$('input[type=search]').val().trim());
    }
    get template() {
        return /* html */ `
            <div class="tools d-flex align-items-center">
                <div class="flex-grow-1 me-3">
                    <input autofocus type="search" name="q" class="w-100" placeholder="Finn slager...">
                </div>
                <div>
                    <button class="btn btn-primary create">Legg til ny</button>
                </div>
            </div>
            <div class="list"></div>
        `;
    }
    render() {
        super.render();
        const list = new PlayerList();
        list.render().$el.appendTo(this.$('.list'));
        return this;
    }
}
