import View from "../../views/View.js";
import SingleScoreView from "./SingleScoreView.js";

export default class ScoreboardView extends View {
    get className() { return 'scoreboard'; }
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
    render() {
        super.render();
        const throws = this.model.get('throws');

        this.items = [];
        for (let i = 0; i < throws.length; i += 1) {
            const psid = this.model.get('player_status_id');
            const sep = (i === 4 && (psid === 1 || psid === 2)); // innledende/semi er 5 + 5
            const ss = new SingleScoreView({ throw: throws[i], round: this.model, separator: sep });
            this.listenTo(ss, 'focus:next', this.focusNext);
            this.listenTo(ss, 'focus:prev', this.focusPrev);
            this.items.push(ss);
            this.listenTo(ss, 'change:value', (sx) => {
                this.focusNext(sx);
                this.model.trigger('change');
                // this.sum();
            });
            this.$el.append(ss.render().$el);
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
