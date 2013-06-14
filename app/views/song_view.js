// Song View
var Template = require('./templates/song');

module.exports = Backbone.View.extend({

  className: 'song',

  template: Template,

  initialize: function() {
    this.render();

    var self = this;
    this.$el.click(function() {
      self.add();
    });
  },

  render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
  },

  events: {
    'click #play':    'play',
    'click #add':     'add'
  },

  whole: function() {
    console.log('whole row clicked...');
  },

  play: function() {
    this.model.set('inc',true);
  },

  add: function() {
    // TODO
    // dry this should be binded to the change
    // update the icon accordingly
    if (!this.model.get('inc')) {
      this.$el
        .find('#add i')
        .removeClass('icon-plus')
        .addClass('icon-minus');

      this.$el
        .css('background', 'black');

      this.model.set('inc',true);

    } else {
      this.$el
        .find('#add i')
        .removeClass('icon-minus')
        .addClass('icon-plus');

      this.$el
        .css('background', 'none');

      this.model.set('inc',false);
    }
  }

});