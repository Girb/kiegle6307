import View from "../../views/View.js";
import { Stage1PlayerRow, Stage2PlayerRow, Stage34PlayerRow } from "./PlayerRow.js";
export default class PlayerList extends View {
    get events() {
        return {
            'click .sort': 'sortStage'
        };
    }
    sortStage(e) {
        e.preventDefault();
        fetch(`/api/players/sorting/${this.stage}`, { method: 'POST' }).then(this.render.bind(this));
            // .then(res => res.json())
            // .then(data => console.log(data));
    }
    get template() {
        return /* html */ `
            <div class="tools"></div>
            <table class="table table-hover table-striped align-middle">
                <thead>
                    <tr></tr>
                </thead>
                <tbody></tbody>
            </table>
        `;
    }
    get rowCls() {
        if (this.stage === 2) {
            return Stage2PlayerRow
        } else if (this.stage === 3 || this.stage === 4) {
            return Stage34PlayerRow; // Assuming Stage34PlayerRow is similar to Stage2PlayerRow
        }
        return Stage1PlayerRow;
    }
    saveSorting() {
        this.rows.forEach(row => {
            row.model.set('sort_order', row.$el.index());
        });
        this.collection.saveSortOrders();
    }
    addOne(model) {
        const row = new this.rowCls({ model, stage: this.stage });
        this.listenToOnce(row, 'changed', this.render);
        this.listenTo(row, 'change:order', this.saveSorting);
        row.render().$el.appendTo(this.$('tbody'));
        this.rows.push(row);
    }
    render() {
        super.render();
        this.$('thead tr').empty().append(this.rowCls.headerTemplate);
        this.collection.fetch({ parse: true }).then(() => {
            this.rows = [];
            this.collection.each(this.addOne, this);
        });
        return this;
    }
}