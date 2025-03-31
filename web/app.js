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
      'innledende': 'innledende',
      'semi': 'semi',
      'finale': 'finale'
    };
  } 
  renderTopNav() {
    const t = new TopNav({ el: $('nav') });
    t.render();
  } 
  reg() {
    this.renderTopNav();
    const v = new MainViewReg();
    v.render().$el.appendTo($('main').empty());
  }
  innledende() {
    this.renderTopNav();
    const v = new MainViewComp({ stage: Stages.INNLEDENDE });
    v.render().$el.appendTo($('main').empty());
  }
  semi() {
    this.renderTopNav();
    const v = new MainViewComp({ stage: Stages.SEMI });
    v.render().$el.appendTo($('main').empty());
  }
  finale() {
    this.renderTopNav();
    const v = new MainViewComp({ stage: Stages.FINALE });
    v.render().$el.appendTo($('main').empty());
  }
};

window.app = new App();
window.app.start();