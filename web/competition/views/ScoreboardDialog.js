import ModalView from '../../views/ModalView.js';
import ScoreboardView from './ScoreboardView.js'

export default class ScoreboardDialog extends ModalView {
    get title() {
        return this.player.get('firstname') + ' ' + this.player.get('lastname');
    }
    get cancelText() { return 'Lukk'; }
    get events() {
        return {
            'click .cancel': 'close'
        };
    }
    renderBody(el) {
        const d = $('<div />').appendTo(el);
        const sbv = new ScoreboardView({ model: this.model });
        sbv.render().$el.appendTo(d);
        return d;
    }
    render() {
        super.render();
        this.$('.ok').addClass('d-none');
        return this;
    }
}
