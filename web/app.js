import { default as MainViewReg } from "./registration/views/MainView.js";
import { default as MainViewComp } from "./competition/views/MainView.js";
import TopNav from "./registration/views/TopNav.js";

class App extends Backbone.Router {
  get routes() {
    return {
      '': 'reg',
      'registrering': 'reg',
      'konkurranse': 'comp'
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
  comp() {
    this.renderTopNav();
    const v = new MainViewComp();
    v.render().$el.appendTo($('main').empty());
  }
};

const app = new App();
// Backbone.history.start({ pushState: true });
Backbone.history.start();