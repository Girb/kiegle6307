import { PlayerCollection } from "../../registration/models/Player.js";
import View from "../../views/View.js";

class ResultRow extends View {
    get tagName() { return 'tr'; }
    get template() {
        return /* html */ `
            <td class="name">${this.model.name()}</td>
            <td class="club">${this.model.club()}</td>
            <td class="score">${this.model.totalAt(this.stage)}</td>
        `;
    }
}

class ResultTable extends View {
    get template() {
        return /* html */ `
            <table class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Navn</th>
                        <th>Klubb</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;
    }
    addOne(model) {
        const row = new ResultRow({ model, stage: this.stage });
        row.render().$el.appendTo(this.$('table tbody'));
    }
    render() {
        super.render();
        this.collection.each(this.addOne, this);
        return this;
    }
}

export default class ResultsOverview extends View {
    get className() { return 'resultsoverview'; }
    showStage(stage = 1, el) {
        const collection = new PlayerCollection();
        collection.url = `/api/results/${stage}`;
        collection.fetch({ reset: true }).then(() => {
            const table = new ResultTable({ collection, stage });
            table.render().$el.appendTo(el.empty());            
        });
    }
    get template() {
        return /* html */ `
            <div class="container">
                <h1 class="mb-3">Alle resultater</h1>
                <ul class="nav nav-tabs" id="tabb" role="tablist">
                    <li class="nav-item"></li>
                        <a class="nav-link active s1" data-bs-toggle="tab" data-bs-target="#stage1" aria-current="page" href="#">Innledende</a>
                    </li>                
                    <li class="nav-item"></li>
                        <a class="nav-link s2" data-bs-toggle="tab" data-bs-target="#stage2" aria-current="page" href="#">Semi</a>
                    </li>                
                    <li class="nav-item"></li>
                        <a class="nav-link s3" data-bs-toggle="tab" data-bs-target="#stage3" aria-current="page" href="#">Finale</a>
                    </li>                
                </ul>
                <div class="tab-content" id="tabc">
                    <div id="stage1" class="tab-pane fade show active stage1" role="tabpanel" tabindex="0">asdf</div>
                    <div id="stage2" class="tab-pane fade stage2" role="tabpanel" tabindex="0">qwer</div>
                    <div id="stage3" class="tab-pane fade stage3" role="tabpanel" tabindex="0">zxcv</div>
                </div>
            </div>
        `;
    }
    render() {
        super.render();
        this.showStage(1, this.$('.stage1'));
        this.showStage(2, this.$('.stage2'));
        this.showStage(3, this.$('.stage3'));
        return this;
    }
}