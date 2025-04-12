import View from "../../views/View.js";

export default class TopNav extends View {
    get tagName() { return 'nav'; }
    get clsasName() { return 'navbar fixed-top bg-body-tertiary'; }
    get template() {
        return /* html */ `
            <div class="container-fluid justify-content-center">
                <ul class="nav nav-pills">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#registrering">Registrering</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#konkurranse">Konkurranse</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#resultater">Resultater</a>
                    </li>
                </ul>
            </div>
        `;
    }
    render() {
        super.render();
        this.$('a').removeClass('active').eq(this.index).addClass('active');
        return this;
    }
}
