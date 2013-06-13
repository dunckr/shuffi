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

    console.log(this.model.YTPlayer.getPlayerState());



    console.log($('#player')[0]);

    $("#player")[0].addEventListener("onStateChange", function() {
      console.log('here');
    });
    // $("#player").addEventListener("onStateChange", function() {
    //   console.log('here');
    // });

    // test if i can get the onstatechange change from here
    // if so... then need to setup after the onready above...

    this.model.next();
  },

  prev: function() {
    this.model.prev();
  }
});