import { default as MainViewReg } from "./registration/views/MainView.js";
import { default as MainViewComp } from "./competition/views/MainView.js";
import TopNav from "./registration/views/TopNav.js";
import * as Stages from './Stages.js';
import NextUpView from "./results/views/NextUpView.js";
import ResultsView from "./results/views/ResultsView.js";
import { PlayerCollection } from "./registration/models/Player.js";
import AdminMainView from "./admin/views/AdminMainView.js";

class App extends Backbone.Router {
  start() {
    Backbone.history.start();
    $(window).on('focus', () => {
      this.trigger('window:focus');
    });
  }
  get routes() {
    return {
      '': 'reg',
      'registrering': 'reg',
      'konkurranse/:stage': 'comp',
      'resultater/:section': 'res',
      'admin': 'admin'
    };
  } 
  renderTopNav(index) {
    const t = new TopNav({ el: $('nav'), index });
    t.render();
  } 
  reg() {
    this.renderTopNav(0);
    const v = new MainViewReg();
    v.render().$el.appendTo($('main').empty());
  }
  comp(stage) {
    this.renderTopNav(1);
    const v = new MainViewComp({ stage: parseInt(stage) });
    v.render().$el.appendTo($('main').empty());
  }
  res(section) {
    this.renderTopNav(2);
    if (section === 'queue') {
      const v = new NextUpView({ section: 'queue' });
      v.render().$el.appendTo($('main').empty());
    } else if (section === '1' || section === '2' || section === '3') {
      const collection = new PlayerCollection();
      collection.url = `/api/results/${section}`;
      const v = new ResultsView({ collection, stage: parseInt(section) });
      v.render().$el.appendTo($('main').empty());
    }
  }
  admin() {
    this.renderTopNav();
    const v = new AdminMainView();
    v.render().$el.appendTo($('main').empty());
  }
};

window.app = new App();
window.app.start();