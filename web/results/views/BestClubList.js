import { PlayerCollection } from "../../registration/models/Player.js";
import View from "../../views/View.js";


class ClubRow extends View {
    get tagName() { return 'tr'; }
    get template() {
        return /* html */ `
            <td>${this.index + 1}</td>
            <td class="name">${this.model.get('club_name')}</td>
            <td class="club">${this.model.get('club_score')}</td>
        `;
    }
}   

const REFRESH_INTERVAL = 15000;
export default class BestClubList extends View {
    get className() { return 'publicresults'; }
    initialize(options) {
        super.initialize(options);
        this.page = 1;
        this.listenTo(this.collection, 'sync', this.redraw);
        this.collection.fetch({ reset: true });
    }
    get events() {
        return {
            'click #logo': 'toggleFullscreen',
        };
    }
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    refresh() {
        this.$('table').fadeTo(500, 0, () => {
            this.collection.fetch({ reset: true });
        });
    }
    redraw() {
        const tbl = this.$('table').empty();
        let cnt = 0,
            start = (this.page) === 1 ? 0 : 16,
            length = Math.min(this.collection.length, start + 16);
        for (let i = start; i < length; i += 1) {
            const row = new ClubRow({ model: this.collection.at(i), index: i });
            row.render().$el.appendTo(tbl);
            cnt += 1;
            if (cnt === 16) break;
        }
        tbl.fadeTo(500, 1);
        this.interval = setTimeout(this.refresh.bind(this), REFRESH_INTERVAL);
        this.page = (this.collection.length > 16 && this.page === 1) ? 2 : 1;
    }
    get template() {
        return /* html */ `
            <div class="bgcontainer"></div>
            <table></table>
            <div id="bottom"><img id="logo" src='../../../img/machina_white.png' /></div>
        `;
    }
    render() {
        super.render();
        for (let i = 1; i < 400; i += 1) {
            $('<div/>').addClass('circle').appendTo(this.$('.bgcontainer'));
        }
        this.$el.on('destroyed', () => {
            clearInterval(this.interval);
        });
        return this;
    }
}