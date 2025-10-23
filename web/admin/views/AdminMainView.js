import View from "../../views/View.js";
import Metadata from "../models/Metadata.js";
import ClubList from "./ClubList.js";
import MetadataView from "./MetadataView.js";

export default class AdminMainView extends View {
    get template() {
        return /* html */ `
            <div class="container">
                <div class="row mb-4">
                    <div class="dbinfo col-6 col-xl-6"></div>
                    <div class="clubs col-6 col-xl-6"></div>
                </div>
            </div>
        `;
    }
    render() {
        super.render();
        const mv = new MetadataView();
        mv.render().$el.appendTo(this.$('.dbinfo').empty());
        const cl = new ClubList();
        cl.render().$el.appendTo(this.$('.clubs').empty());
        return this;
    }
}
