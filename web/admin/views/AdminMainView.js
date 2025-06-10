import View from "../../views/View.js";
import Metadata from "../models/Metadata.js";
import MetadataView from "./MetadataView.js";

export default class AdminMainView extends View {
    get template() {
        return /* html */ `
            <div class="container">
                <div class="dbinfo col col-xl-6"></div>
            </div>
        `;
    }
    render() {
        super.render();
        const mv = new MetadataView();
        mv.render().$el.appendTo(this.$('.dbinfo').empty());
        return this;
    }
}
