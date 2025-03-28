import View from "../../views/View.js";
import Round from "../models/Round.js";
import ScoreboardDialog from "./ScoreboardDialog.js";

class PlayerRow extends View {
    get tagName() { return 'tr'; }
    get attributes() {
        return {
            draggable: true
        };
    }
    get events() {
        return {
            'click .stage': 'stage',
            'click .dn': 'dn',
            'click .up': 'up'
        };
    }
    stage(e) {
        e.preventDefault();
        const stage = $(e.currentTarget).attr('data-stage');
        const model = new Round();
        model.url = `/api/rounds/player/${this.model.get('id')}/type/${stage}`;
        if (this.model.get('stage' + stage)) {
            model.fetch().then(() => this.showStage(model));
        } else {
            model.save().then(() => this.showStage(model));
        }
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
    showStage(model) {
        const d = new ScoreboardDialog({ model, player: this.model });
        this.listenToOnce(d, 'close', () => this.trigger('changed'));
        d.render().show();
    }
    get template() {
        return /* html */ `
            <td>
                <button class="btn btn-sm btn-secondary up">▲</button>
                <button class="btn btn-sm btn-secondary dn">▼</button>
            </td>
            <td>${this.model.get('firstname')} ${this.model.get('lastname')}</td>
            <td>${this.model.get('club_name')}</td>
            <td class="text-center"><button class="btn ${this.model.stageCls(0)} btn-sm score stage" data-stage="0">${this.model.stageStr(0)}</button></td>
            <td class="text-center"><button class="btn ${this.model.stageCls(1)} btn-sm score stage" data-stage="1">${this.model.stageStr(1)}</button></td>
            <td class="text-center"><button class="btn ${this.model.stageCls(2)} btn-sm score stage" data-stage="2">${this.model.stageStr(2)}</button></td>
            <td class="text-center"><button class="btn ${this.model.stageCls(3)} btn-sm score stage" data-stage="3">${this.model.stageStr(3)}</button></td>
        `;
    }
    render() {
        super.render();
        return this;
    }
}

export default class PlayerList extends View {
    get template() {
        return /* html */ `
            <div class="tools"></div>
            <table class="table table-hover table-striped">
                <thead>
                    <tr>
                        <th style="width: 100px;"></th>
                        <th class="cursor-pointer">Navn</th>
                        <th class="cursor-pointer">Klubb</th>
                        <th class="score text-center">Innledende</th>
                        <th class="score text-center">Semi</th>
                        <th class="score text-center">Finale 1</th>
                        <th class="score text-center">Finale 2</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;
    }
    saveSorting() {
        this.rows.forEach(row => {
            row.model.set('sort_order', row.$el.index());
        });
        this.collection.saveSortOrders();
    }
    addOne(model) {
        const row = new PlayerRow({ model });
        this.listenToOnce(row, 'changed', this.render);
        this.listenTo(row, 'change:order', this.saveSorting);
        row.render().$el.appendTo(this.$('tbody'));
        this.rows.push(row);
    }
    render() {
        super.render();
        this.collection.fetch().then(() => {
            this.rows = [];
            this.collection.each(this.addOne, this);
        });
        return this;
    }
}