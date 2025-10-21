import View from "../../views/View.js";

export default class ResultsOverview extends View {
    get className() { return 'resultsoverview'; }
    get template() {
        return /* html */ `
            <div class="container">
                <h1 class="mb-3">Alle resultater</h1>
                <ul class="nav nav-tabs">
                    <li class="nav-item"></li>
                        <a class="nav-link active s1" aria-current="page" href="#">Innledende</a>
                    </li>                
                    <li class="nav-item"></li>
                        <a class="nav-link s2" aria-current="page" href="#">Semi</a>
                    </li>                
                    <li class="nav-item"></li>
                        <a class="nav-link s3" aria-current="page" href="#">Finale</a>
                    </li>                
                </ul>
            </div>
        `;
    }
    render() {
        super.render();
        return this;
    }
}