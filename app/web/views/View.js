export default class View extends Backbone.View {
    initialize(options) {
        _.extend(this, options);
    }
    hide(selector) {
        this.$(selector).addClass('d-none');
        return this;
    }
    show(selector) {
        this.$(selector).removeClass('d-none');
        return this;
    }
    focus(selector) {
        this.$(selector).focus();
        return this;
    }
    transition(callback) {
        if (!document.startViewTransition) {
            callback();
        } else {
            document.startViewTransition(callback);
        }
    }
    render() {
        this.$el.empty().append(this.template || '');
        return this;
    }
}