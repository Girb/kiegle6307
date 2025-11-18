import View from "../../views/View.js";
import SingleScoreView from "./SingleScoreView.js";

export default class ScoreboardView extends View {
    initialize(options) {
        super.initialize(options);
        this.listenTo(app, 'window:focus', this.windowFocused);
    }
    windowFocused(e) {
        setTimeout(() => {
            this.current && this.current.focus();
            //console.log('window focus arrived');
        });
    }
    focus(el) {
        el && el.focus();
        this.current = el;
    }
    focusNext(from) {
        const next = from.el.nextSibling;
        this.focus(next);
    }
    focusPrev(from) {
        const prev = from.el.previousElementSibling;
        this.focus(prev);
    }
    updateMeta() {
        const throws = this.model.get('throws');
        let count = 0;
        let sum = 0;
        for (let i = 0; i < throws.length; i += 1) {
            const sc = throws[i].score;
            if (typeof sc === 'number') {
                count += 1;
                sum += sc;
            }
        }
        const avg = count === 0 ? 0 : (sum / count);
        this.$('.scoremeta .count').text(count);
        this.$('.scoremeta .sum').text(sum);
        this.$('.scoremeta .avg').text(avg.toFixed(1));
    }   
    get template() {
        return /* html */ `
            <div class="scoreboard"></div>
            <div class="d-flex flex-column align-items-center my-2">
                <div class="scoremeta d-flex align-items-center justify-content-between mt-3">
                    <div class="d-flex flex-column text-start">
                    <div class="badge text-start ps-0">Ant</div>
                        <span class="count text-start">0</span>
                    </div>
                    <div class="d-flex flex-column">
                        <div class="badge">Avg</div>
                        <span class="avg">-</span>
                    </div>
                    <div class="d-flex flex-column">
                        <div class="badge text-end pe-0">Sum</div>
                        <span class="sum text-end">0</span>
                    </div>
                </div>
            </div>
        `;
    }
    render() {
        super.render();
        const throws = this.model.get('throws');

        this.items = [];
        for (let i = 0; i < throws.length; i += 1) {
            const psid = this.model.get('stage_id');
            const sep = (i === 4 && (psid === 1 || psid === 2)); // innledende/semi er 5 + 5
            const ss = new SingleScoreView({ throw: throws[i], round: this.model, separator: sep });
            this.listenTo(ss, 'focus:next', this.focusNext);
            this.listenTo(ss, 'focus:prev', this.focusPrev);
            this.items.push(ss);
            this.listenTo(ss, 'change:value', (sx) => {
                this.focusNext(sx);
                this.model.trigger('change');
                this.updateMeta();
                // this.sum();
            });
            this.$('.scoreboard').append(ss.render().$el);
            this.updateMeta();
        }
        setTimeout(() => {
            this.focus(this.items[0].$el);
            this.$el.on('destroyed', () => {
                this.stopListening();
            })
        });
        return this;
    }
}
