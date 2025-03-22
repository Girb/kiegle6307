import ModalView from "../../views/ModalView.js";
import { ClubCollection } from "../models/Club.js";
import Player from "../models/Player.js";

export default class EditPlayerDialog extends ModalView {
    get title() { return 'Slager'; }
    initialize(options) {
        super.initialize(options);
        this.clubs = new ClubCollection();
    }
    get events() {
        return {
            'click .ok': 'confirm',
            'click .cancel': 'close'
        }
    }
    confirm(e) {
        e.preventDefault();
        this.model.set('firstname', this.$('#firstname').val().trim());
        this.model.set('lastname', this.$('#lastname').val().trim());
        this.model.set('club_id', this.$('#club_id').val());
        this.model.url = '/api/players';
        this.model.save().then(() => {
            this.trigger('confirm');
            this.close();
        });
    }
    get content() {
        return /* html */ `
            <form>
                <div class="mb-3">
                    <label for="firstname" class="form-label">Fornavn</label>
                    <input type="text" class="form-control" id="firstname" maxlength="128" value="${this.model.get('firstname') || ''}">
                </div>
                <div class="mb-3">
                    <label for="lastname" class="form-label">Etternavn</label>
                    <input type="text" class="form-control" id="lastname" maxlength="128" value="${this.model.get('lastname') || ''}">
                </div>
                <div class="mb-3">
                    <label for="klubb" class="form-label">Klubb</label>
                    <select class="form-control" id="club_id"></select>
                </div>
            </form>
        `;
    }
    render() {
        super.render();
        this.clubs.fetch().then(() => {
            this.clubs.each(model => {
                this.$('#club_id').append(new Option(model.get('name'), model.get('id')));
            });
            this.$('#club_id').val(this.model.get('club_id'));
        });
        return this;
    }
}