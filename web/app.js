import MainView from "./registration/views/MainView.js";
import TopNav from "./registration/views/TopNav.js";

class App extends Backbone.Router {
  get routes() {
    return {
      'registrering': 'reg'
    };
  }  
  reg() {
    const t = new TopNav({ el: $('nav') });
    t.render();
    const v = new MainView();
    v.render().$el.appendTo($('main').empty());
  }
};

const app = new App();
// Backbone.history.start({ pushState: true });
Backbone.history.start();