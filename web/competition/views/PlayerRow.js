import View from "../../views/View.js";
import Round from "../models/Round.js";
import ScoreboardDialog from "./ScoreboardDialog.js";
import ScoreButtonView from "./ScoreButtonView.js";

export default class PlayerRow extends View {
    get tagName() { return 'tr'; }
    get attributes() {
        return {
            draggable: true
        };
    }
    get events() {
        return {
            'click .dn': 'dn',
            'click .up': 'up',
            'click .done': 'done'
        };
    }
    dn(e) {
        e.preventDefault();
        this.$el.insertAfter(this.$el.next());
        this.trigger('change:order');
    }
    up(e) {
        e.preventDefault();
        this.$el.insertBefore(this.$el.prev());
        this.trigger('change:order');
    }
    
    done(e) {
        e.preventDefault();
        this.model.setStatus(2).then(() => this.remove());
    }
    get template() {
        return /* html */ `
            <td>
                <button class="btn btn-sm btn-secondary up">▲</button>
                <button class="btn btn-sm btn-secondary dn">▼</button>
            </td>
            <td>${this.model.get('firstname')} ${this.model.get('lastname')}</td>
            <td>${this.model.get('club_name')}</td>
            <td class="text-center stage1"></td>
            <td class="text-center stage2"></td>
            <td class="text-center stage3"></td>
            <td class="text-center stage4"></td>
            <td class="text-center d-none"></td>
            <td><button class="btn btn-success done">Ferdig</button></td>
        `;
    }
    render() {
        super.render();
        for (let i = 0; i <= 3; i++) {
            const btn = new ScoreButtonView({ model: this.model.rounds.at(i) });
            this.listenTo(btn, 'changed', () => this.trigger('changed'));
            btn.render().$el.appendTo(this.$('.stage' + (i+1))); // this.$(`.stage{i}`));
        }
        return this;
    }
}
