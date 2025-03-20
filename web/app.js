import MainView from "./registration/views/MainView.js";

const User = Backbone.Model.extend({
});

const Users = Backbone.Collection.extend({
  model: User,
  url: 'http://localhost:6307/players'
});

// Backbone View for displaying a single user
const UserView = Backbone.View.extend({
  tagName: 'div',
  className: 'user',
  render() {
    this.$el.html(`${this.model.get('firstname')}`);
    return this;
  },
});

// Backbone View for displaying the list of users
const UserListView = Backbone.View.extend({
  el: '#user-list',
  initialize() {
    this.collection = new Users();
    this.listenTo(this.collection, 'reset', this.render);
    this.collection.fetch({reset: true});
  },
  render() {
    this.$el.empty();
    this.collection.each((user) => {
      const userView = new UserView({ model: user });
      this.$el.append(userView.render().$el);
    });
    return this;
  },
});

// Initialize the UserListView to fetch and display users
// const userListView = new UserListView();
const r = new MainView();
r.render().$el.appendTo($('main'));
