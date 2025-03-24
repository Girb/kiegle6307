import { default as MainViewReg } from "./registration/views/MainView.js";
import { default as MainViewComp } from "./competition/views/MainView.js";
import TopNav from "./registration/views/TopNav.js";

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

window.app = new App();
window.app.start();