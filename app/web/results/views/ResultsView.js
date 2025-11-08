import { PlayerCollection } from "../../registration/models/Player.js";
import View from "../../views/View.js";


class ResultRow extends View {
    get tagName() { return 'tr'; }
    get template() {
        return /* html */ `
            <td>${this.index + 1}</td>
            <td class="name">${this.model.name()}</td>
            <td class="club">${this.model.club()}</td>
            <td class="prev stage1">${this.model.get('prelim_score')}</td>
            <td class="prev stage2">${this.model.get('semi_score')}</td>
            <td class="cur"></td>
            <td class="cur2 d-none"></td>
            <td class="total">${this.model.totalAt(this.stage)}</td>

        `;
    }
    ongoing() {
        return this.model.isOngoing(this.stage);
    }
    render() {
        super.render();
        this.$('.name,.club').toggleClass('blinking yellow', this.ongoing());
        const score = this.model.scoreAt(this.stage);
        this.$('.cur')
            .toggleClass('live', this.ongoing())
            //.append(this.ongoing() ? `<span class="score sum">${score || '--'}</span>` : score || '');
            .append(`<span class="score sum">${score || '--'}</span>`);
        this.$('.cur2')
            .toggleClass('d-none', this.stage < 3)
            .append(`<span class="score sum">${this.model.scoreAt(4)}</span>`)
        this.$('.stage1').toggleClass('d-none', this.stage < 2);
        this.$('.stage2').toggleClass('d-none', this.stage < 3);
        this.$('.total')
            .toggleClass('d-none', this.stage < 2)
            .toggleClass('blinking yellow', this.ongoing());
        
        return this;
    }
}   

const REFRESH_INTERVAL = 15000;
export default class ResultsView extends View {
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
        const withScore = this.collection.filter(p => !!p.scoreAt(this.stage));
        let cnt = 0,
            start = (this.page) === 1 ? 0 : 16,
            length = Math.min(withScore.length, start + 16);
        if (this.stage !== 1) start = 0; // only one page for stages > 1
        for (let i = start; i < length; i += 1) {
            const row = new ResultRow({ model: withScore[i], index: i, stage: this.stage });
            row.render().$el.appendTo(tbl);
            cnt += 1;
            if (cnt === 16) break;
        }
        tbl.fadeTo(500, 1);
        this.interval = setTimeout(this.refresh.bind(this), REFRESH_INTERVAL);
        this.page = (withScore.length > 16 && this.page === 1) ? 2 : 1;
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