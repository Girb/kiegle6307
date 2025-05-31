import { RoundCollection } from '../../competition/models/Round.js';

const ROUND_MINUTES = 4;
export default class Player extends Backbone.Model {
    get urlRool() { return '/api/players'; }
    parse(response) {
        this.rounds = new RoundCollection(response.rounds, { parse: true });
        return super.parse(response);
    }
    name() {
        return `${this.get('firstname')} ${this.get('lastname')}`;
    }
    club() {
        return this.get('club_name') || 'Ingen klubb';
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
        if (id === 1) return 'Bekreftet / Innledende';
        if (id === 2) return 'Semifinale';
        if (id === 3) return 'Finale ';
        if (id === 4) return 'Finale 2';
        if (id === 5) return 'Ferdig';
        if (id === 6) return 'Kansellert / Ikke møtt';
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
    isFinished() {
        return false; // Placeholder, implement logic to determine if the player is finished
    }
    isStarted() {
        return false; // Placeholder, implement logic to determine if the player has started
    }
    isNextUp() {
        return false;
    }
    minsUntil() {
        const ongoingCount = this.collection.filter(p => p.isStarted()).length;
        const idx = this.collection.filter(p => !p.isFinished()).indexOf(this);
        let min = ((idx % 2 === 1) ? ((idx - 1) * (ROUND_MINUTES/2)) : idx * (ROUND_MINUTES/2));
        if (ongoingCount > 1) {
            min -= ROUND_MINUTES;
        }
        return min;
    }
    semiScore() {
        const s1s = this.rounds.at(0).get('score') || 0;
        const s2s = this.rounds.at(1).get('score') || 0;
        return s1s + s2s;
    }
    totalScore() {
        return this.rounds.reduce((sum, r) => sum + (r.get('score') || 0), 0);
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