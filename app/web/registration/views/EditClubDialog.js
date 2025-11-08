import ModalView from "../../views/ModalView.js";

export default class EditClubDialog extends ModalView {
    get title() { return 'Klubb'; }
    get events() {
        return {
            'click .ok': 'confirm',
            'click .cancel': 'close'
        }
    }
    confirm(e) {
        e.preventDefault();
        this.model.set('name', this.$('#name').val().trim());
        this.model.url = '/api/clubs';
        this.model.save().then(() => {
            this.trigger('confirm');
            this.close();
        });
    }
    get content() {
        return /* html */ `
            <form>
                <div class="mb-3">
                    <label for="name" class="form-label">Navn</label>
                    <input type="text" class="form-control" id="name" maxlength="128" value="${this.model.get('name') || ''}">
                </div>
            </form>
        `;
    }
}