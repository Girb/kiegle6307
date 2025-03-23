import View from "../../views/View.js";

class PlayerRow extends View {
    get tagName() { return 'tr'; }
    get events() {
        return {
            'click .edit': 'edit'
        };
    }
    get template() {
        return /* html */ `
            <td>${this.model.get('firstname')} ${this.model.get('lastname')}</td>
            <td>${this.model.get('club_name')}</td>
            <td class="text-center"><button class="btn btn-primary btn-sm score">+</button></td>
            <td class="text-center"><button class="btn btn-primary btn-sm score">+</button></td>
            <td class="text-center"><button class="btn btn-primary btn-sm score">+</button></td>
            <td class="text-center"><button class="btn btn-primary btn-sm score">+</button></td>
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
    addOne(model) {
        const row = new PlayerRow({ model });
        row.render().$el.appendTo(this.$('tbody'));
    }
    render() {
        super.render();
        this.collection.fetch().then(() => {
            this.collection.each(this.addOne, this);
        });
        return this;
    }
}