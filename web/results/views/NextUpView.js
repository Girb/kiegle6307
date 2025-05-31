import { PlayerCollection } from "../../registration/models/Player.js";
import View from "../../views/View.js";

const REFRESH_INTERVAL = 15000;
export default class NextUpView extends View {
 get className() { return 'publicqueue'; }
    initialize(options) {
        super.initialize(options);
        this.page = 1;
        this.collection = new PlayerCollection();
        this.collection.url = `/api/competition/1`;
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
            document.exitFullscreen()?.();
        }
    }
    refresh() {
        const tbl = this.$('table');
        tbl.fadeTo(500, 0, () => {
            this.collection.fetch({ reset: true });
        });
    }
    redraw() {
        const tbl = this.$('table').empty();
        const queued = this.collection.filter(p => !p.isFinished()); // different from participant-status, this one is derived
        let cnt = 0, 
            minCounter = 0,
            start = this.page === 1 ? 0 : 16,
            length = Math.min(queued.length, start + 16);
            
        for (let i = start; i < length; i += 1) {
            const p = queued[i];
            const tr = $('<tr/>').appendTo(tbl);
            let qstatus = '';
            if (p.isStarted()) {
                qstatus = '<span style="color: yellow;">PÅGÅR</span>';
            } else if (p.isNextUp()) {
                qstatus = 'NESTE';
            }
            
            if (!qstatus) {
                let txt = `<span style="color: #eee;">${p.minsUntil()} min</span>`;
                $('<td />').html(txt).appendTo(tr);
            } else {
                $('<td />').html(qstatus).appendTo(tr);
            }
            $('<td style="text-transform: uppercase;" />').html(p.name()).appendTo(tr);
            $('<td />').html(p.club()).appendTo(tr);
            // cnt += 1;
            // if (cnt === 16) break;
        }

        tbl.fadeTo(500, 1);
        this.interval = setTimeout(this.refresh.bind(this), REFRESH_INTERVAL);
        this.page = (queued.length > 16 && this.page === 1) ? 2 : 1;
    }
    get bottom() {
        return `<div id="bottom"><img id="logo" src='../../../img/machina_white.png' /></div>`;
    }
    render() {
        this.$el.empty();
        const c = $('<div/>').addClass('bgcontainer').appendTo(this.$el);
        for (let i = 1; i < 400; i++) {
            $('<div/>').addClass('circle').appendTo(c);
        }
        const tbl = $('<table />').appendTo(this.$el);
        this.$el.append(this.bottom);

        this.$el.on('destroyed', () => {
            clearInterval(this.interval);
        });
        return this;
    }   
}