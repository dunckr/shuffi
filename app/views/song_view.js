// Song View
var Template = require('./templates/song');

module.exports = Backbone.View.extend({

  className: 'song',

  template: Template,

  initialize: function() {
    this.render();
  },

  render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
  },

  events: {
    'click #play':    'play',
    'click #add':     'add'
  },

  play: function() {
    this.model.set('inc',true);
  },

  add: function() {
    if (!this.model.get('inc')) {
      this.$el
        .find('#add i')
        .removeClass('icon-plus')
        .addClass('icon-minus');

      this.model.set('inc',true);

    } else {
      this.$el
        .find('#add i')
        .removeClass('icon-minus')
        .addClass('icon-plus');

      this.model.set('inc',false);
    }
  }

});