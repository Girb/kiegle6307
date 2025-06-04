export default class Round extends Backbone.Model {
    isOngoing() {
        return this.get('count') > 0 && this.get('count') !== 10;
    }    
}

export class RoundCollection extends Backbone.Collection {
    get model() { return Round; }
}