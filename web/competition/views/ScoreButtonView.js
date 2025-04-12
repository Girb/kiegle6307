import View from "../../views/View.js";

export default class ScoreButtonView extends View {
    get tagName() { return 'button'; }
    get className() { return 'btn btn-primary score'; }
    get events() {
        return {
            click: 'onClick'
        };
    }
    get template() {
        return /* html */ `
            <span class="score"></span>
        `;
    }
    render() {
        super.render();
        this.$('.score').text(this.model.get('score') || '+');
        return this;
    }
}
