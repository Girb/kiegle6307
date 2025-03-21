import ModalView from "../../views/ModalView.js";
import { ClubCollection } from "../models/Club.js";

export default class EditPlayerDialog extends ModalView {
    get title() { return 'Slager'; }
    initialize(options) {
        super.initialize(options);
        this.clubs = new ClubCollection();
    }
    get content() {
        return /* html */ `
            <form>
                <div class="mb-3">
                    <label for="fornavn" class="form-label">Fornavn</label>
                    <input type="text" class="form-control" id="fornavn" maxlength="128">
                </div>
                <div class="mb-3">
                    <label for="etternavn" class="form-label">Etternavn</label>
                    <input type="text" class="form-control" id="etternavn" maxlength="128">
                </div>
                <div class="mb-3">
                    <label for="klubb" class="form-label">Klubb</label>
                    <select class="form-control" id="klubb"></select>
                </div>
            </form>
        `;
    }
    render() {
        super.render();
        this.clubs.fetch().then(() => {
            this.clubs.each(model => {
                this.$('#klubb').append(new Option(model.get('name'), model.get('id')));
            });
        });
        return this;
    }
}