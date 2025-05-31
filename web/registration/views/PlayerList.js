import Controller from '../../Controller.js';
import View from '../../views/View.js';
import { PlayerCollection } from '../models/Player.js';

class PlayerRow extends View {
    get tagName() { return 'tr'; }
    get events() {
        return {
            'click .edit': 'edit',
            'click .confirm': 'toggleConfirm'
        };
    }
    edit(e) {
        e.preventDefault();
        new Controller().editPlayer(this.model).then(() => this.render());
    }
    toggleConfirm(e) {
        e.preventDefault();
        this.model.save({ current_stage_id: this.model.get('current_stage_id') ^ 1 }).then(() => this.render());
    }
    get template() {
        return /* html */ `
            <td>${this.model.get('firstname')}</td>
            <td>${this.model.get('lastname')}</td>
            <td>${this.model.get('club_name')}</td>
            <td>
                <div class="d-flex justify-content-end">
                <div class="text-muted me-1 pe-1 lbl"></div>
                    <button class="btn me-1 btn${this.model.get('stage_id') === 0 ? '-outline' : ''}-success btn-sm confirm ${this.model.get('stage_id') === 1 ? 'active' : ''}"></button>
                    <button class="btn btn-outline-primary btn-sm edit">Rediger</button>
                </div>
            </td>
        `;
    }
    render() {
        super.render();
        this.$('.confirm')
            .toggleClass('d-none', this.model.get('current_stage_id') !== 0)
            .text(this.model.get('current_stage_id') === 0 ? 'Bekreft oppmøte' : 'Oppmøte bekreftet');
        this.$('.lbl')
            .toggleClass('d-none', this.model.get('current_stage_id') === 0)
            .text(this.model.statusTxt())
        return this;
    }
}

export default class PlayerList extends View {
    initialize(options) {
        super.initialize(options);
        this.sortDir = 1;
    }
    get events() {
        return {
            'click th': 'sort'
        };
    }
    sort(e) {
        e.preventDefault();
        const colnum = $(e.currentTarget).index() + 1;
        if (this.sortIdx === colnum) this.sortDir *= -1;
        this.sortIdx = colnum; 
        const compareValues = (a, b) => (a < b) ? -1 * this.sortDir : (a > b) ? 1 * this.sortDir : 0;
        let rows = Array.from(this.$('tbody')[0].querySelectorAll('tr'));
        let qs = `td:nth-child(${this.sortIdx})`;
        rows.sort((r1, r2) => {
            let t1 = r1.querySelector(qs);
            let t2 = r2.querySelector(qs);
            return compareValues(t1.textContent,t2.textContent);
        });
        rows.forEach(row => this.$('tbody')[0].appendChild(row));
    }
    get template() {
        return /* html */ `
            <div class="tools"></div>
            <table class="table table-hover table-striped">
                <thead>
                    <tr>
                        <th class="cursor-pointer">Fornavn</th>
                        <th class="cursor-pointer">Etternavn</th>
                        <th class="cursor-pointer">Klubb</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;
    }
    addOne(model) {
        const row = new PlayerRow({ model });
        row.render().$el.appendTo(this.$('tbody'));
    }
    render() {
        super.render();
        this.collection.fetch().then(() => {
            this.collection.each(this.addOne, this);
        });
        // this.listenToOnce(this.collection, 'sort', this.render);
        return this;
    }
}
