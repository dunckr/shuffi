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

    this.model.get('list').bind('reset', function(model) {

      // this.model.unload();
    });

  },

  render: function() {
    this.$el.html(this.template);
    return this;
  },

  play: function() {
    // var state = this.model.get('state');
    // if (state === 1) {
    //   this.$el
    //     .find('#playBtn i')
    //     .removeClass('icon-play')
    //     .addClass('icon-pause');
    // } else if (state === 2) {
    //   this.$el
    //     .find('#playBtn i')
    //     .removeClass('icon-pause')
    //     .addClass('icon-play');
    // }
    this.model.play();
  },

  next: function() {
    this.model.next();
    // this.model.play();
  },

  prev: function() {
    this.model.prev();
  }

  // mute: function() {
  //   this.model.mute();
  // }

});