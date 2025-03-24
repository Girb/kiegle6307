import View from "../../views/View.js";

export default class RegView extends View {
    get template() {
        return /* html */ `
            <div id="info">
                <h1 class="sname"></h1>
                <h2 class="sclub"></h2>
            </div>
            <div id="scores"></div>
            <div id="totals"></div>
            <div id="prognosis"></div>
            <div id="options"></div>
        `;
    }
    render() {
        super.render();
        return this;
    }
}
