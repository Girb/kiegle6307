import View from "../../views/View.js";
import Round from "../models/Round.js";
import ScoreboardDialog from "./ScoreboardDialog.js";

export default class ScoreButtonView extends View {
    get tagName() { return 'button'; }
    get className() { return 'btn score position-relative'; }
    get events() {
        return {
            click: 'edit'
        };
    }
    edit(e) {
        e.preventDefault();
        const model = new Round();
        model.url = `/api/rounds/${this.model.get('round_id')}`;
        model.fetch().then(() => this.showStage(model));
    }
    showStage(model) {
        const d = new ScoreboardDialog({ model, player: this.model });
        this.listenToOnce(d, 'close', () => this.trigger('changed'));
        d.render().show();
    }
    get template() {
        return /* html */ `
            <span class="score"></span>
        `;
    }
    getCls() {
        if (this.model.get('count') === 0) return 'btn-primary';
        if (this.model.get('count') === 10) return 'btn-outline-success';
        return 'btn-outline-warning';
    }
    render() {
        super.render();
        this.$('.score').text(this.model.get('score') || '+');
        this.$el.addClass(this.getCls());
        const count = this.model.get('count');
        if (count > 0 && count < 10) {
            this.$el.append(`<span class="badge text-bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">${count}/10</span>`);
        }
        return this;
    }
}
