// redo from scratch
// start at start with events!!!

var List = require('./list');


module.exports = Backbone.Model.extend({

  defaults: {
    width:    200,
    height:   200,
    state:    -1,
    total:     0
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
        // console.log('queued so try and play!');
        // console.log(this.get('total'));
        if (this.get('total') === 1) {
          // this.play();
        }
        break;
      // case 0:
      //   console.log('unstarted');
      //   this.next();
      //   break;
      // case 1:
      //   break;
      // case 5:

      //   this.play();
      //   break;
    }
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
    console.log('current pos: ' + curr);

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
