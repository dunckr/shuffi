// redo from scratch
// start at start with events!!!

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
          onStateChange: self.stateChanged
        }
      }
    );
  },

  stateChanged: function(evt) {
    console.log(evt.data);
     // var state = this.get('state');
    // switch(state) {
    //   // Unstarted
    //   case -1:
    //     console.log('unstarted');
    //     break;
    //   // Ended
    //   case 0:
    //     console.log('ended');
    //     this.next();
    //     break;
    //   // Playing
    //   case 1:
    //     console.log('playing');
    //     break;
    //   // Paused
    //   case 2:
    //     console.log('paused');
    //     break;
    //   // Buffering
    //   case 3:
    //     break;
    //   // Video Cued
    //   case 5:
    //     console.log('queued so try and play!');
    //     this.YTPlayer.playVideo();
    //     break;
  },

  load: function() {
    var col = this.get('model');
    var curr = col.current;
    var pos = col.at(curr);
    if (typeof pos !== 'undefined') {
      this.YTPlayer.cueVideoById( pos.get('videoId') );
    }
  },

  unload: function() {
    if (typeof this.get('state') !== 'undefined' && this.get('state') !== -1) {
      this.YTPlayer.stopVideo();
      this.YTPlayer.clearVideo();
    }
  },

  next: function() {
    var col = this.get('model');
    col.next();
    this.load();
  },

  prev: function() {
    var col = this.get('model');
    col.prev();
    this.load();
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
