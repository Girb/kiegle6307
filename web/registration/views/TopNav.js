import View from "../../views/View.js";

export default class TopNav extends View {
    get tagName() { return 'nav'; }
    get clsasName() { return 'navbar fixed-top bg-body-tertiary'; }
    get template() {
        return /* html */ `
            <div class="container-fluid">
                <ul class="nav">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#">Active</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link disabled" aria-disabled="true">Disabled</a>
                </li>
</ul>
            </div>
        `;
    }
}
