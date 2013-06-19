// Navigation View
var Song     = require('models/song'),
    Template = require('./templates/nav');

module.exports = Backbone.View.extend({

  el: $('#nav'),

  template: Template,

  events: {
    'click #searchBtn':           'getSongs',
    'keypress input[type=text]':  'onReturn',
    'click #relevanceBtn':        'setRelevance',
    'click #viewCountBtn':        'setViewCount',
    'click #publishedBtn':       'setPublished'
  },

  initialize: function() {
    this.render();
    this.searchBy = 'viewCount';
  },

  render: function() {
    this.$el.html(this.template);
    return this;
  },

  onReturn: function(event) {
    if (event.keyCode === 13) {
      this.getSongs();
    }
  },

  getData: function(callback) {
    // TODO: get x4 
    var url = this.buildUrl();
    $.getJSON(url, function(json, textStatus) {
      var vids = json.feed.entry;
      callback(vids);
    });
  },

  buildUrl: function(startIndex) {
    var url = "http://gdata.youtube.com/feeds/api/videos?alt=json";
    url += "&q=" + this.search;
    if (this.searchBy === 'viewCount') {
      url += "&orderby=viewCount";
    } else if (this.searchBy === 'published') {
      url += "&orderby=published";
    }
    if (startIndex) {
      url += "&start-index=25";
    }
    return url;
  },

  getSongs: function() {
    var self = this;

    this.search = _.escape($('#searchBox').val());

    this.getData(function(data) {
    for (var i=0; i< data.length; i++) {
    // for (var i=0; i< 5; i++) {
        var details = data[i];
        var song = new Song();
        var syntax = /[a-zA-Z0-9\-\_]{11}/;
        var videoId = details.link[0].href;

        song.set('videoId', videoId.match(syntax)[0]);
        song.set('title',details.title.$t);
        song.set('author', details.author[0].name.$t );
        song.set('date', details.published.$t );

        var time = self.timeFormat(details.media$group.yt$duration.seconds);
        song.set('duration', time );

        if (typeof details.yt$statistics == 'undefined') {
          song.set('viewCount', 0 );
          song.set('favCount', 0 );
        } else {
          var viewCount = self.countFormat(details.yt$statistics.viewCount);
          song.set('viewCount', viewCount || 0);
          song.set('favCount', (details.yt$statistics.favoriteCount || 0));
        }

        if (typeof details.media$group.media$thumbnail[0].url !== 'undefined') {
          song.set('thumb', details.media$group.media$thumbnail[0].url);
        }

        self.collection.add( song );
      }
    });
  },

  setRelevance: function() {
    this.searchBy = 'relevance';
    $('#searchByIcon')
      .removeClass('icon-calendar')
      .removeClass('icon-eye-open')
      .addClass('icon-zoom-in');
  },
  setViewCount: function() {
    this.searchBy = 'viewCount';
    $('#searchByIcon')
      .removeClass('icon-calendar')
      .removeClass('icon-zoom-in')
      .addClass('icon-eye-open');
  },
  setPublished: function() {
    this.searchBy = 'published';
    $('#searchByIcon')
      .removeClass('icon-zoom-in')
      .removeClass('icon-eye-open')
      .addClass('icon-calendar');
  },

  timeFormat: function(secs) {
    var d = Number(secs);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
  },

  countFormat: function(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }




});
