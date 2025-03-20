export default class Player extends Backbone.Model {

}

export class PlayerCollection extends Backbone.Collection {
    get model() { return Player; }
}