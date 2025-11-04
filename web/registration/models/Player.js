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
        if (id === 1) return 'Innledende';
        if (id === 2) return 'Semifinale';
        if (id === 3) return 'Finale ';
        if (id === 4) return 'Ferdig';
        if (id === 5) return 'Kansellert';
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
    isInactive() {
        return this.get('current_stage_id') === 5;
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
    qualScore() {
        return this.get('prelim_score') || 0;
    }
    semiScore() {
        return this.get('semi_score') || 0;
    }
    final1Score() {
        return this.get('final1_score') || 0;
    }
    final2Score() {
        return this.get('final2_score') || 0;
    }
    finalScore() {
        return this.final1Score() + this.final2Score();
    }
    totalScore() {
        return this.get('total_score') || 0;
    }
    scoreAt(stageid) {
        if (stageid === 1) {
            return this.qualScore();
        } else if (stageid === 2) {
            return this.semiScore();
        } else if (stageid === 3) {
            return this.final1Score();
        } else if (stageid === 4) {
            return this.final2Score();
        }
    }
    totalAt(stageid) {
        if (stageid === 1) {
            return this.qualScore();
        } else if (stageid === 2) {
            return this.qualScore() + this.semiScore();
        } else if (stageid === 3 || stageid === 4) {
            return this.totalScore();
        }
        return 0;
    }
    isOngoing(stageid) {
        if (stageid === 1) return this.get('prelim_throws') > 0 && !this.isFinished(stageid);
        if (stageid === 2) return this.get('semi_throws') > 0 && !this.isFinished(stageid);
        if (stageid === 3) return this.get('final1_throws') > 0 && !this.isFinished(stageid);
        if (stageid === 4) return this.get('final2_throws') > 0 && !this.isFinished(stageid);
        return false;
    }
    isFinished(stageid) {
        if (stageid === 1) return this.get('prelim_throws') === 10;
        if (stageid === 2) return this.get('semi_throws') === 10;
        if (stageid === 3) return this.get('final1_throws') === 10;
        if (stageid === 4) return this.get('final2_throws') === 10;
        return false;
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