import View from "../../views/View.js";
import Round from "../models/Round.js";
import ScoreboardDialog from "./ScoreboardDialog.js";
import ScoreButtonView from "./ScoreButtonView.js";

class PlayerRow extends View {
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
        this.model.setStatus(this.stage + 1).then(() => this.remove());
    }
    // render() {
    //     super.render();
    //     for (let i = 0; i <= 3; i++) {
    //         const btn = new ScoreButtonView({ model: this.model.rounds.at(i) });
    //         this.listenTo(btn, 'changed', () => this.trigger('changed'));
    //         btn.render().$el.appendTo(this.$('.stage' + (i+1))); // this.$(`.stage{i}`));
    //     }
    //     return this;
    // }
}
export class Stage1PlayerRow extends PlayerRow {
    static get headerTemplate() {
        return /* html */ `
            <th style="width: 100px;"></th>
            <th class="cursor-pointer">Navn</th>
            <th class="cursor-pointer">Klubb</th>
            <th style="width: 100px;" class="score text-center px-5">Score</th>
            <th class="score text-center d-none"></th>
            <th style="width: 100px;"></th>
        `;
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
            <td class="text-center d-none"></td>
            <td><button class="btn btn-success done">Ferdig</button></td>
        `;
    }
    render() {
        super.render();
        const btn = new ScoreButtonView({ model: this.model.rounds.at(0) });
        this.listenTo(btn, 'changed', () => this.trigger('changed'));
        btn.render().$el.appendTo(this.$('.stage1'));
        this.$('.done').prop('disabled', !(this.model.rounds.at(0).get('count') === 10));
        return this;
    }
}

export class Stage2PlayerRow extends PlayerRow {
    static get headerTemplate() {
        return /* html */ `
            <th style="width: 100px;"></th>
            <th class="cursor-pointer">Navn</th>
            <th class="cursor-pointer">Klubb</th>
            <th style="width: 100px;" class="score text-center px-5">(Innledende)</th>
            <th style="width: 100px;" class="score text-center px-5">Score</th>
            <th class="score text-center">Total</th>
            <th style="width: 100px;"></th>
        `;
    }
    get template() {
        return /* html */ `
            <td>
                <button class="btn btn-sm btn-secondary up">▲</button>
                <button class="btn btn-sm btn-secondary dn">▼</button>
            </td>
            <td>${this.model.get('firstname')} ${this.model.get('lastname')}</td>
            <td>${this.model.get('club_name')}</td>
            <td class="text-center stage1">${this.model.rounds.at(0).get('score')}</td>
            <td class="text-center stage2"></td>
            <td class="text-center">${this.model.semiScore()}</td>
            <td><button class="btn btn-success done">Ferdig</button></td>
        `;
    }
    render() {
        super.render();
        const btn = new ScoreButtonView({ model: this.model.rounds.at(1) });
        this.listenTo(btn, 'changed', () => this.trigger('changed'));
        btn.render().$el.appendTo(this.$('.stage2'));
        return this;

    }
}

export class StageXPlayerRow extends View {
    
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
}
