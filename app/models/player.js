var List = require('./list');


module.exports = Backbone.Model.extend({

  defaults: {
    width:    200,
    height:   200,
    state:    -1
  },

  initialize: function() {
    var self = this;
    window.onYouTubeIframeAPIReady = function() {
      self.createPlayer();
    };
  },

  createPlayer: function() {
    var player = $('#player');
    var self = this;
    self.YTPlayer = new YT.Player(
      player[0],
      {
        height:   self.get('height'),
        width:    self.get('width'),
        events: {
          onStateChange: self.stateChanged.bind(self)
        }
      }
    );
  },

  stateChanged: function(event) {
    this.set('state', event.data);
    console.log(this.get('state'));

    switch(this.get('state')) {
      case -1:
        // console.log('unstarted');
        break;
      // Ended
      case 0:
        // console.log('ended');
        this.next();
        this.play();
        break;
      // Playing
      case 1:
        // console.log('playing');
        break;
      // Paused
      case 2:
        // console.log('paused');
        break;
      // Buffering
      case 3:
        break;
      // Video Cued
      case 5:
        break;
    }
  },

  load: function() {
    var col = this.get('model');
    var curr = col.current;
    var pos = col.at(curr);
    if (typeof pos !== 'undefined') {
      this.YTPlayer.cueVideoById( pos.get('videoId') );
    }
  },

  play: function() {
    this.YTPlayer.playVideo();
  },

  unload: function() {
    if (typeof this.get('state') !== 'undefined' && this.get('state') !== -1) {
      this.YTPlayer.cueVideoById( '' );
    }
  },

  next: function() {
    var col = this.get('model');
    col.next();
    this.load();
    this.play();
  },

  prev: function() {
    var col = this.get('model');
    col.prev();
    this.load();
    this.play();
  },

  mute: function() {
    if (typeof this.get('state') !== 'undefined' && this.get('state') !== -1) {
      if (this.YTPlayer.isMuted()) {
        this.YTPlayer.unMute();
      } else {
        this.YTPlayer.mute();
      }
    }
  }

});
