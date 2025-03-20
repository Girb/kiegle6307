import View from '../../views/View.js';
import PlayerList from './PlayerList.js';

export default class MainView extends View {
    get template() {
        return /* html */ `
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
