// Control View
var Template = require('./templates/control');

module.exports = Backbone.View.extend({

  el: $('#control'),

  template: Template,

  events: {
    'click #playBtn': 'play',
    'click #prevBtn': 'prev',
    'click #loadBtn': 'loadClicked',
    'click #nextBtn': 'next',
    'click #muteBtn': 'mute'
  },

  initialize: function() {
    this.render();

    var self = this;
    var col = this.model.get('model');

    col.bind('change:inc', function(model, value) {
      if (value) {
        self.model.load();
      } else {
        var col = self.model.get('model');
        var curr = col.current;
        var pos = col.at(curr);
        if (model === pos) {
          self.model.unload();
        }
      }
    });

    col.bind('reset', function(models) {
      self.model.unload();
    });
  },

  render: function() {
    this.$el.html(this.template);
    return this;
  },

  play: function() {
    this.model.play();
  },

  next: function() {
    this.model.next();
  },

  prev: function() {
    this.model.prev();
  }
});