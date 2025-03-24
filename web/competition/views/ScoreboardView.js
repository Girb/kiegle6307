import View from "../../views/View.js";

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
    render() {
        super.render();
        
        return this;
    }
}
