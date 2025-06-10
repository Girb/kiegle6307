export default class Metadata extends Backbone.Model {
    constructor(attributes, options) {
        super(attributes, options);
        this.url = '/api/admin/meta';
    }
}
