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
      var total = self.model.get('total');
      console.log('before ' + total + ' value = ' + value);
      if (value) {
        self.model.set('total', total+1);
      } else {
        self.model.set('total', total-1);
      }
      console.log('binding side total: ' + self.model.get('total'));
      self.model.load();
    });

    col.bind('reset', function(models) {
      self.model.unload();
    });

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