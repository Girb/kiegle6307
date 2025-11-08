import { PlayerCollection } from "../../registration/models/Player.js";
import View from "../../views/View.js";
import * as Stages from '../../Stages.js';

class Stage1Row extends View {
    get tagName() { return 'tr'; }
    get headerTemplate() {
        return /* html */ `
            <th>Navn</th>
            <th>Klubb</th>
            <th>Score</th>
        `;
    }
    get template() {
        return /* html */ `
            <td class="name">${this.model.name()}</td>
            <td class="club">${this.model.club()}</td>
            <td class="qual">${this.model.qualScore()}</td>
        `;
    }
}
class Stage2Row extends View {
    get tagName() { return 'tr'; }
    get headerTemplate() {
        return /* html */ `
            <th>Navn</th>
            <th>Klubb</th>
            <th>Innledende</th>
            <th>Semi</th>
            <th>Total</th>
        `;
    }
    get template() {
        return /* html */ `
            <td class="name">${this.model.name()}</td>
            <td class="club">${this.model.club()}</td>
            <td class="qual">${this.model.qualScore()}</td>
            <td class="semi">${this.model.semiScore()}</td>
            <td class="totalScore">${this.model.qualScore() + this.model.semiScore()}</td>
        `;
    }
}
class Stage3Row extends View {
    get tagName() { return 'tr'; }
    get headerTemplate() {
        return /* html */ `
            <th>Navn</th>
            <th>Klubb</th>
            <th>Innledende</th>
            <th>Semi</th>
            <th>Finale 1</th>
            <th>Finale 2</th>
            <th>Total</th>
        `;
    }
    get template() {
        return /* html */ `
            <td class="name">${this.model.name()}</td>
            <td class="club">${this.model.club()}</td>
            <td class="qual">${this.model.qualScore()}</td>
            <td class="semi">${this.model.semiScore()}</td>
            <td class="score">${this.model.final1Score()}</td>
            <td class="score">${this.model.final2Score()}</td>
            <td class="score">${this.model.totalScore()}</td>
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
    rowView(model) {
        if (this.stage === 1) {
            return new Stage1Row({ model, stage: this.stage });
        } else if (this.stage === 2) {
            return new Stage2Row({ model, stage: this.stage });
        } else if (this.stage === 3) {
            return new Stage3Row({ model, stage: this.stage });
        } else {
            throw new Error(`Invalid stage: ${this.stage}`);
        }
    }
    addOne(model) {
        const row = this.rowView(model);
        row.render().$el.appendTo(this.$('table tbody'));
    }
    render() {
        this.$el.empty();
        const tmprow = this.rowView(this.collection.first());
        this.$el.html(this.template);
        this.$('table thead tr').html(tmprow.headerTemplate);
        this.collection.each(this.addOne, this);
        return this;
    }
}

export default class ResultsOverview extends View {
    get className() { return 'resultsoverview'; }
    showStage(stage = 1, el) {
        const collection = new PlayerCollection();
        collection.comparator = Stages.resultComparator(stage);
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