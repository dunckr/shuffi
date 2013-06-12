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
    var self = this;
    this.YTPlayer = new YT.Player(
      'player',
      {
        height:   this.get('height'),
        width:    this.get('width'),
        events: {
          'onStateChange': function(event) {
            self.set('state', event.data);
            self.stateChanged(event);
          }
        }
      }
    );
  },

  stateChanged: function(event) {
    console.log('STATECHANGED: ' + this.get('state'));
    var state = this.get('state');
    switch(state) {
      case 1:

        break;
      case 2:

        break;
    }
    if (state === 0) {
      console.log('statechanged and is 0');
    }
  },

  play: function() {
    switch(this.get('state')) {
      // Unstarted
      case -1:
        console.log('unstarted');
        this.load();
        break;
      // Ended
      case 0:
        console.log('ended');
        this.YTPlayer.playVideo();
        break;
      // Playing
      case 1:
        console.log('playing');
        this.YTPlayer.pauseVideo();
        break;
      // Paused
      case 2:
        console.log('paused');
        this.YTPlayer.playVideo();
        break;
      // Buffering
      case 3:
        break;
      // Video Cued
      case 5:
        this.YTPlayer.playVideo();
        break;
    }

    // if (typeof this.get('state') !== 'undefined' && this.get('state') !== -1) {      

    //   if (this.get('state') === 1) {
    //     this.YTPlayer.pauseVideo();
    //   } else {
    //     this.YTPlayer.playVideo();
    //   }
    // }
  },

  load: function() {
    // err
    // var list = this.get('list');
    // this.YTPlayer.cueVideoById( list.at( list.current ).get('videoId') );
    this.YTPlayer.cueVideoById(this.get('list').at(this.get('list').current).get('videoId'));
  },

  unload: function() {
    this.YTPlayer.stopVideo();
    this.YTPlayer.clearVideo();
  },

  next: function() {
    if (typeof this.get('state') !== 'undefined' && this.get('state') !== -1) {
      this.list.next();
      console.log(this.list);
      this.load();
    }
  },

  prev: function() {
    if (typeof this.get('state') !== 'undefined' && this.get('state') !== -1) {
      this.list.prev();
    }
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
