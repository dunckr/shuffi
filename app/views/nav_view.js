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
        // TODO: hour:min:sec
        song.set('duration', details.media$group.yt$duration.seconds);

        if (typeof details.yt$statistics == 'undefined') {
          song.set('viewCount', 0 );
          song.set('favCount', 0 );
        } else {
          // TODO
          // 100,000,00
          song.set('viewCount', details.yt$statistics.viewCount || 0);
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
      .removeClass('icon-time')
      .removeClass('icon-eye-open')
      .addClass('icon-zoom-in');
  },
  setViewCount: function() {
    this.searchBy = 'viewCount';
    $('#searchByIcon')
      .removeClass('icon-time')
      .removeClass('icon-zoom-in')
      .addClass('icon-eye-open');
  },
  setPublished: function() {
    this.searchBy = 'published';
    $('#searchByIcon')
      .removeClass('icon-zoom-in')
      .removeClass('icon-eye-open')
      .addClass('icon-time');
  }




});
