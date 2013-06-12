// Control View
var Template = require('./templates/control'),
    Player = require('models/player');

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


    // this.model.get('list').bind('reset', function(models) {
    //   console.log('deleted in control view');
    //   console.log(models);
    //   // model.unload();
    // });

    // this.model.get('list').on('change:inc', function(model, value) {
    //   console.log('changed inc from control view');
    //   console.log(model + ' ' + value);
    //   console.log(this);

    // });

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
    // var col = this.model.get('model');

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