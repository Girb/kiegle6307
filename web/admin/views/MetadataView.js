import View from "../../views/View.js";
import Metadata from "../models/Metadata.js";

export default class MetadataView extends View {
    get className() { return 'card'; }
    get events() {
        return {
            'click .backup': 'backup',
            'click .truncate': 'truncate'
        };
    }
    backup(e) {
        e.preventDefault();
        fetch('/api/admin/backup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    this.$('.backupstatus').html(`<div class="alert alert-success">${data.message}</div>`);
                });
            } else {
                alert('Feil under backup');
            }
        });
    }
    truncate(e) {
        e.preventDefault();
        if (confirm('Er du HELT sikker på at du vil tømme databasen?')) {
            fetch('/api/admin/truncate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    response.json().then(data => {
                    this.$('.backupstatus').html(`<div class="alert alert-success">${data.message}</div>`);
                    });
                } else {
                    alert('Feil under tømming av database');
                }
            });
        }
    }
    row(key, value) {
        const tr = `<tr><td>${key}</td><td class="font-monospace">${value}</td></tr>`;
        this.$('table').append(tr);
    }
    get template() {
        return /* html */ `
            <div class="card-body">
                <table class="table table-striped table-hover"></table>
                <div class="d-flex align-items-center">
                    <button class="btn btn-primary backup">Ta backup</button>
                    <button class="btn btn-danger truncate ms-auto">Tøm database</button>
                </div>
                <div class="backupstatus mt-2"></div>
            </div>
    `;
    }
    render() {
        super.render();
        const model = new Metadata();
        model.fetch().then(() => {
            this.row('Database', model.get('path'));
            this.row('Opprettet', new Date(model.get('created')).toLocaleString());
            this.row('Sist endret', new Date(model.get('modified')).toLocaleString());
        });
        return this;
    }
}
