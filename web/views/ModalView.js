import View from './View.js';

export default class ModalView extends View {
    get className() { return 'modal'; }
    get attributes() {
        return {
            'tabindex': '-1',
            'role': 'dialog'
        }
    }
    get template() {
        return `
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${this.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">${this.content}</div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary ok">Lagre</button>
                        <button type="button" class="btn btn-secondary cancel">Avbryt</button>
                    </div>
                </div>
            </div>     
        `;
    }
    get content() {
        return `override with content`;
    }
    get events() {
        return {
        };
    }
    show(force) {
        this.$returnFocusTo = $(':focus');
        this._modal = new bootstrap.Modal(this.el, { keyboard: !force, backdrop: force ? 'static' : true });
        this.el.addEventListener('hidden.bs.modal', () => {
            this.$returnFocusTo && this.$returnFocusTo.focus();
            this.remove();
        });
        this.el.addEventListener('shown.bs.modal', () => {
            _.defer(() => {
                this.$('input, select, textarea, button, a[href], area[href], *[tabindex], *[contenteditable]').not('.btn-close, [tabindex=-1], [disabled], :hidden').first().focus();
                this.onShown();
            });
        });
        this._modal.show();
        return this;
    }
    onShown() {}
    close() {
        this._modal.hide();
    }
}