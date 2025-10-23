import { ClubCollection } from "../../registration/models/Club.js";
import View from "../../views/View.js";

class ClubListItem extends View {
    get className() { return 'py-2 d-flex align-items-center'; }
    get template() {
        return /* html */ `
            <div class="name flex-grow-1">${this.model.get('name')}</div>
            <div><button class="btn btn-outline-primary edit">Rediger</button></div>
        `;
    }
}

export default class ClubList extends View {
    get className() { return 'card'; }
    initialize(options) {
        super.initialize(options);
        this.collection = new ClubCollection();
    }
    get template() {
        return /* html */ `
            <div class="card-body body"></div>
        `;
    }
    render() {
        super.render();
        this.collection.fetch().then(() => {    
            this.collection.each(model => {
                const item = new ClubListItem({ model });
                item.render().$el.appendTo(this.$('.body'));
            });
        });
        return this;
    }
}