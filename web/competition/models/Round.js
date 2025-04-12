export default class Round extends Backbone.Model {
    
}

export class RoundCollection extends Backbone.Collection {
    get model() { return Round; }
}