export default class Player extends Backbone.Model {
    get urlRool() { return '/api/players'; }
    statusTxt() {
        const id =  this.get('status_id');
        if (id === 0) return 'Registrert';
        if (id === 1) return 'Bekreftet';
        if (id === 2) return 'I gang';
        if (id === 3) return 'Ferdig';
        if (id === 4) return 'Kansellert';
        return `Ukjent status (${id})`;
    }
}

export class PlayerCollection extends Backbone.Collection {
    get model() { return Player; }
}