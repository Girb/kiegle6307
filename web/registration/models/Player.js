export default class Player extends Backbone.Model {
    get urlRool() { return '/api/players'; }
    setStatus(statusid) {
        return fetch(`/api/players/${this.id}/status/${statusid}`,
            {
                method: 'POST',
                body: JSON.stringify({}),
            }
        );
    }
    statusTxt() {
        const id =  this.get('current_status_id');
        if (id === 0) return 'Registrert';
        if (id === 1) return 'Bekreftet';
        if (id === 2) return 'I gang';
        if (id === 3) return 'Ferdig';
        if (id === 4) return 'Kansellert';
        return `Ukjent status (${id})`;
    }
    stageStr(typeid) {
        if (this.get('score') !== null) {
            return this.get('score');
        }
        return '+';
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