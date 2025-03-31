import View from "../../views/View.js";
import PlayerRow from "./PlayerRow.js";
export default class PlayerList extends View {
    get template() {
        return /* html */ `
            <div class="tools"></div>
            <table class="table table-hover table-striped align-middle">
                <thead>
                    <tr>
                        <th style="width: 100px;"></th>
                        <th class="cursor-pointer">Navn</th>
                        <th class="cursor-pointer">Klubb</th>
                        <th class="score text-center">Poeng</th>
                        <th class="score text-center d-none"></th>
                        <th style="width: 100px;"></th>
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
        const row = new PlayerRow({ model, stage: this.stage });
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