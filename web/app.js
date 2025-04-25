import { default as MainViewReg } from "./registration/views/MainView.js";
import { default as MainViewComp } from "./competition/views/MainView.js";
import TopNav from "./registration/views/TopNav.js";
import * as Stages from './Stages.js';

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
      'konkurranse/:stage': 'comp'
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
};

window.app = new App();
window.app.start();