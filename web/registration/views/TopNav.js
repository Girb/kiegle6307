import View from "../../views/View.js";

export default class TopNav extends View {
    get tagName() { return 'nav'; }
    get className() { return 'navbar fixed-top navbar-expand-lg bg-body-tertiary'; }
    get template() {
        return /* html */ `
        <div class="container-fluid">
            <button class="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#topbarcontent" aria-controls="topbarcontent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="navbar-collapse collapse d-lg-flex" id="topbarcontent">
                <a class="navbar-brand col-lg-3 me-0" href="#">Kiegle 6307</a>
                <ul class="nav nav-pills col-lg-6 justify-content-lg-center">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#registrering">Registrering</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">Konkurranse</a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#konkurranse/1">Innledende</a></li>
                            <li><a class="dropdown-item" href="#konkurranse/2">Semi</a></li>
                            <li><a class="dropdown-item" href="#konkurranse/3">Finale</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">Resultater</a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#resultater/queue">Kø</a></li>
                            <li><a class="dropdown-item" href="#resultater/1">Innledende</a></li>
                            <li><a class="dropdown-item" href="#resultater/2">Semifinale</a></li>
                            <li><a class="dropdown-item" href="#resultater/3">Finale</a></li>
                        </ul>
                    </li>
                </ul>
                <div class="col-lg-3 d-flex justify-content-lg-end text-decoration-none"><a href="#admin">ADMIN</a></div>
            </div>
        `;
    }
    render() {
        super.render();
        this.$('.nav-item>a').removeClass('active').eq(this.index).addClass('active');
        return this;
    }
}
