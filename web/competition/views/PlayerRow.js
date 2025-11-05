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
    get stageId() { return -1; }
    get events() {
        return {
            'click .dn': 'dn',
            'click .up': 'up',
            'click .done': 'done',
            'click .sort': 'sortStage'
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
    sortStage(e) {
        e.preventDefault();
        fetch(`/api/players/sorting/${this.stageId}`, { method: 'POST' })
            .then(res => res.json())
            .then(data => console.log(data));
    }
    roundFinished() {
        return this.model.rounds.at(this.stageId - 1).get('count') === 10
    }
    render() {
        super.render();
        const btn = new ScoreButtonView({ model: this.model.rounds.at(this.stageId - 1) });
        this.listenTo(btn, 'changed', () => this.trigger('changed'));
        btn.render().$el.appendTo(this.$(`.stage${this.stageId}`));
        this.$('.done').prop('disabled', !this.roundFinished());
        // this.$el.toggleClass('table-success', this.roundFinished());
        return this;
    }
}
export class Stage1PlayerRow extends PlayerRow {
    get stageId() { return 1; }
    static get headerTemplate() {
        return /* html */ `
            <th></th>
            <th></th>
            <th>Navn</th>
            <th>Klubb</th>
            <th class="score text-center px-5">Score</th>
            <th class="score text-center d-none"></th>
            <th></th>
        `;
    }
    get template() {
        return /* html */ `
            <td class="idx"></td>
            <td>
                <button class="btn btn-sm btn-secondary up">▲</button>
                <button class="btn btn-sm btn-secondary dn">▼</button>
            </td>
            <td>${this.model.get('firstname')} ${this.model.get('lastname')}</td>
            <td>${this.model.get('club_name')}</td>
            <td class="text-center stage${this.stage}"></td>
            <td class="text-center d-none"></td>
            <td class="text-end"><button class="btn btn-success done ${this.roundFinished() ? '' : 'd-none'}">Ferdig</button></td>
        `;
    }
}

export class Stage2PlayerRow extends PlayerRow {
    get stageId() { return 2; }
    static get headerTemplate() {
        return /* html */ `
            <th></th>
            <th></th>
            <th>Navn</th>
            <th>Klubb</th>
            <th class="score text-center px-5"><button class="btn btn-link sort">Innledende</button></th>
            <th class="score text-center px-5">Score</th>
            <th class="score text-center">Total</th>
            <th></th>
        `;
    }
    get template() {
        return /* html */ `
            <td class="idx"></td>
            <td>
                <button class="btn btn-sm btn-secondary up">▲</button>
                <button class="btn btn-sm btn-secondary dn">▼</button>
            </td>
            <td>${this.model.get('firstname')} ${this.model.get('lastname')}</td>
            <td>${this.model.get('club_name')}</td>
            <td class="text-center stage1">${this.model.get('prelim_score')}</td>
            <td class="text-center stage2"></td>
            <td class="text-center">${this.model.get('prelim_score') + this.model.get('stage_score')}</td>
            <td class="text-end"><button class="btn btn-success done ${this.roundFinished() ? '' : 'd-none'}">Ferdig</button></td>
        `;
    }
}

export class Stage34PlayerRow extends PlayerRow {
    get stageId() { return 3; }
    static get headerTemplate() {
        return /* html */ `
            <th></th>
            <th></th>
            <th class="cursor-pointer">Navn</th>
            <th class="cursor-pointer">Klubb</th>
            <th class="score text-center px-3">Innledende</th>
            <th class="score text-center px-3">Semi</th>
            <th class="score text-center px-3">Score (1)</th>
            <th class="score text-center px-3">Score (2)</th>
            <th class="score text-center"><button class="btn btn-link sort">Total</button></th>
            <th></th>
        `;
    }
    get template() {
        return /* html */ `
            <td class="idx"></td>
            <td>
                <button class="btn btn-sm btn-secondary up">▲</button>
                <button class="btn btn-sm btn-secondary dn">▼</button>
            </td>
            <td>${this.model.get('firstname')} ${this.model.get('lastname')}</td>
            <td>${this.model.get('club_name')}</td>
            <td class="text-center stage1">${this.model.get('prelim_score')}</td>
            <td class="text-center stage1">${this.model.get('semi_score')}</td>
            <td class="text-center stage3"></td>
            <td class="text-center stage4"></td>
            <td class="text-center total">${this.model.get('prelim_score') + this.model.get('semi_score') + this.model.get('final1_score') + this.model.get('final2_score')}</td>
            <td class="text-end"><button class="btn btn-success done ${this.roundFinished() ? '' : 'd-none'}">Ferdig</button></td>
        `;
    }
    roundFinished() {
        return this.model.rounds.at(2).get('count') === 10
            && this.model.rounds.at(3).get('count') === 10;
    }
    render() {
        this.$el.empty().append(this.template);
        const btn3 = new ScoreButtonView({ model: this.model.rounds.at(2) });
        this.listenTo(btn3, 'changed', () => this.trigger('changed'));
        btn3.render().$el.appendTo(this.$(`.stage3`));

        const btn4 = new ScoreButtonView({ model: this.model.rounds.at(3) });
        this.listenTo(btn4, 'changed', () => this.trigger('changed'));
        btn4.render().$el.appendTo(this.$(`.stage4`));

        this.$('.done').prop('disabled', (!this.model.isFinished(3) || !this.model.isFinished(4)));
        return this;
    }
}
