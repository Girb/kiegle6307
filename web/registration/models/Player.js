import { RoundCollection } from '../../competition/models/Round.js';

export default class Player extends Backbone.Model {
    get urlRool() { return '/api/players'; }
    parse(response) {
        this.rounds = new RoundCollection(response.rounds, { parse: true });
        return super.parse(response);
    }
    setStatus(stageid) {
        return fetch(`/api/players/${this.id}/stage/${stageid}`,
            {
                method: 'POST',
                body: JSON.stringify({}),
            }
        );
    }
    statusTxt() {
        const id =  this.get('current_stage_id');
        if (id === 0) return 'Registrert';
        if (id === 1) return 'Bekreftet';
        if (id === 2) return 'I gang';
        if (id === 3) return 'Ferdig';
        if (id === 4) return 'Kansellert';
        return `Ukjent status (${id})`;
    }
    stageStr(stageid) {
        return this.get('rounds').find(r => r.stage_id === stageid)?.score ?? this.get('score') ?? '+';
    }
    stageCls(typeid) {
        if (this.get('score') !== undefined) {
            return 'btn-outline-success';
        }
        return 'btn-primary';
    }
}

export class PlayerCollection extends Backbone.Collection {
    get model() { return Player; }
    saveSortOrders() {
        fetch('/api/players/sorting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.map(p => ({ id: p.id, sort_order: p.get('sort_order') })))
        });
    }
}