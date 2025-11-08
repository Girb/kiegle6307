export default class Club extends Backbone.Model {

}

export class ClubCollection extends Backbone.Collection {
    get url() { return '/api/clubs'; }
    get model() { return Club; }
}