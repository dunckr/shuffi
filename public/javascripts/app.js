(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("application", function(exports, require, module) {
  // Application bootstrapper.
  Application = {
      initialize: function() {

        var List = require('models/list');
        this.list = new List();

        var NavView = require('views/nav_view');
        this.navView = new NavView({collection: this.list});

        var DisplayView = require('views/display_view');
        this.displayView = new DisplayView({collection: this.list});

        var Player = require('models/player');
        this.player = new Player({model: this.list});

        var ControlView = require('views/control_view');
        this.controlView = new ControlView({model: this.player});

        if (typeof Object.freeze === 'function') Object.freeze(this);
      }
  };

  module.exports = Application;
  
});
window.require.register("initialize", function(exports, require, module) {
  var application = require('application');

  $(function() {

      // Load YT
      $('head').append('<script src="https://www.youtube.com/iframe_api"></script>');

      application.initialize();
      Backbone.history.start();
  });
  
});
window.require.register("lib/router", function(exports, require, module) {
  var application = require('application')

  module.exports = Backbone.Router.extend({
      routes: {
          '': 'home'
      },
      
      home: function() {
          $('body').html(application.homeView.render().el)
      }
  })
  
});
window.require.register("lib/view_helper", function(exports, require, module) {
  // Put handlebars.js helpers here
  
});
window.require.register("models/list", function(exports, require, module) {
  // List
  module.exports = Backbone.Collection.extend({

    initialize: function() {
      this.current = -1;

      this.on('add', function() {
        if (this.current === -1) {
          this.current = 0;
        }
      });

      this.on('remove', function() {
        this.isEmpty();
      });

      this.on('reset', function() {
        this.isEmpty();
      });
    },

    isEmpty: function() {
      if (this.length === 0) {
        this.current = -1;
      }
    },

    next: function() {
      var l = this.length;
      if (l === 0) {
        return -1;
      } else if (l > this.current+1) {

        for (var i = this.current+1; i <= l; i++) {

          if (typeof this.at(i) === 'undefined') { return -1; }

          if (this.at(i).get('inc') === true) {
            this.current = i;
            return i;
          }
        }
      }
    },

    prev: function() {
      var l = this.length;
      if (l === 0) {
        return -1;
      } else if (-1 < this.current-1) {

        for (var i = this.current-1; i > -1; i--) {

          if (typeof this.at(i) === 'undefined') { return -1; }

          if (this.at(i).get('inc') === true) {
            this.current = i;
            return i;
          }
        }
      }
    },

    inc: function(cid) {
      var c = this.get(cid);
      c.get('inc') ? c.set('inc',false) : c.set('inc',true);
      return c;
    }

  });
  
});
window.require.register("models/player", function(exports, require, module) {
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
  
});
window.require.register("models/song", function(exports, require, module) {
  // Song model
  module.exports = Backbone.Model.extend({

    defaults: {
      favCount: 0,
      viewCount: 0,
      thumb: '',
      inc: false // included
    }
  });
  
});
window.require.register("views/control_view", function(exports, require, module) {
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
});
window.require.register("views/display_view", function(exports, require, module) {
  // Display View
  var SongView = require('views/song_view'),
      Template = require('./templates/display');

  module.exports = Backbone.View.extend({

    el: $('#display'),

    elm: 'displayTable',

    template: Template,

    initialize: function() {

      this.render();

      if (typeof this.collection !== 'undefined') {
        var self = this;
        this.collection.bind('add', function(model) {
          self.renderEach(model);
        });
        this.collection.bind('remove', function(model) {
          self.render();
        });
        this.collection.bind('reset', function(model) {
          self.render();
        });
      }
    },

    events: {
      'click #deleteAllBtn':  'deleteAll',
      'click #addAllBtn':     'addAll'
    },

    render: function() {
      this.$el.html(this.template);

      if (typeof this.collection !== 'undefined') {
        var self = this;
        _.each(this.collection.models, function(item) {
          self.renderEach(item);
        });
      }
      return this;
    },

    renderEach: function(item) {
      var songView = new SongView({model: item});
      $('#' + this.elm).append(songView.render().el);
    },

    deleteAll: function() {
      this.collection.reset();

    },

    addAll: function() {
      // TODO
      // this.collection.each(function(model,index) {
      //   model.set('inc',true);
        
      // });
    }

  });
});
window.require.register("views/nav_view", function(exports, require, module) {
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
          song.set('duration', details.media$group.yt$duration.seconds);

          if (typeof details.yt$statistics == 'undefined') {
            song.set('viewCount', 0 );
            song.set('favCount', 0 );
          } else {
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
  
});
window.require.register("views/song_view", function(exports, require, module) {
  // Song View
  var Template = require('./templates/song');

  module.exports = Backbone.View.extend({

    className: 'song',

    template: Template,

    initialize: function() {
      this.render();
    },

    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
      'click #play':    'play',
      'click #add':     'add'
    },

    play: function() {
      this.model.set('inc',true);
    },

    add: function() {
      // TODO
      // dry this should be binded to the change
      // update the icon accordingly
      if (!this.model.get('inc')) {
        this.$el
          .find('#add i')
          .removeClass('icon-plus')
          .addClass('icon-minus');

        this.model.set('inc',true);

      } else {
        this.$el
          .find('#add i')
          .removeClass('icon-minus')
          .addClass('icon-plus');

        this.model.set('inc',false);
      }
    }

  });
});
window.require.register("views/templates/control", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<div class=\"navbar navbar-fixed-bottom navbar-inverse\">\n  	<div class=\"navbar-inner\">\n		<div class=\"span6\" style=\"float: none; margin: 0 auto;\">\n			<ul class=\"nav\">\n				<li><button id=\"prevBtn\"><i class=\"icon-step-backward\"></i></button></li>\n				<li><div id=\"player\"></div></li>\n				<li><button id=\"nextBtn\"><i class=\"icon-step-forward\"></i></button></li>\n			</ul>\n		</div>\n	</div>\n</div>";
    });
});
window.require.register("views/templates/display", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<button id=\"addAllBtn\"><i class=\"icon-plus\"></i> Add All</button>\n<button id=\"deleteAllBtn\"><i class=\"icon-trash\"></i> Delete All</button>\n\n<table id=\"displayTable\" class=\"table table-striped table-bordered\">\n\n</table>";
    });
});
window.require.register("views/templates/home", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<header>\n	<div class=\"container\">\n		<h1>Banana Pancakes</h1>\n	</div>\n</header>\n\n<div class=\"container\">\n	\n	<p class=\"lead\">Congratulations, your Brunch project is set up and very yummy. Thanks for using Banana Pancakes!</p>\n	\n	<div class=\"row\">\n		\n		<div class=\"span4\">\n			<h2>Banana Pancakes I</h2>\n			<p><a href=\"http://allrecipes.com/recipe/banana-pancakes-i/\"><img src=\"http://i.imgur.com/YlAsp.jpg\" /></a></p>\n			<blockquote>\n				<p>Crowd pleasing banana pancakes made from scratch. A fun twist on ordinary pancakes.</p>\n				<small><a href=\"http://allrecipes.com/cook/1871017/profile.aspx\">ADDEAN1</a> from <cite title=\"allrecepies.com\">allrecepies.com</cite></small>\n			</blockquote>\n			<p><a class=\"btn\" href=\"http://allrecipes.com/recipe/banana-pancakes-i/\">View Recipe &raquo;</a></p>\n		</div>\n		\n		<div class=\"span4\">\n			<h2>Banana Brown Sugar Pancakes</h2>\n			<p><a href=\"http://allrecipes.com/recipe/banana-brown-sugar-pancakes\"><img src=\"http://i.imgur.com/Yaq7Y.jpg\" /></a></p>\n			<blockquote>\n				<p>This recipe I made because I wanted to use up some instant banana oatmeal I had. I don't use syrup on it because of the sweetness from the oatmeal and brown sugar.</p>\n				<small><a href=\"http://allrecipes.com/cook/10041806/profile.aspx\">Nscoober2</a> from <cite title=\"allrecepies.com\">allrecepies.com</cite></small>\n			</blockquote>\n			<p><a class=\"btn\" href=\"http://allrecipes.com/recipe/banana-brown-sugar-pancakes\">View Recipe &raquo;</a></p>\n		</div>\n		\n		<div class=\"span4\">\n			<h2>Banana Pancakes II</h2>\n			<p><a href=\"http://allrecipes.com/recipe/banana-pancakes-ii/\"><img src=\"http://i.imgur.com/dEh09.jpg\" /></a></p>\n			<blockquote>\n				<p>These yummy pancakes are a snap to make.</p>\n				<small><a href=\"http://allrecipes.com/cook/18911/profile.aspx\">sal</a> from <cite title=\"allrecepies.com\">allrecepies.com</cite></small>\n			</blockquote>\n			<p><a class=\"btn\" href=\"http://allrecipes.com/recipe/banana-pancakes-ii/\">View Recipe &raquo;</a></p>\n		</div>\n		\n	</div>\n	\n</div>\n";
    });
});
window.require.register("views/templates/nav", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    


    return "<div class=\"navbar navbar-fixed-top navbar-inverse\">\n  <div class=\"navbar-inner\">\n    <div class=\"container\">\n      <a class=\"brand\" href=\"#\">shuffi</a>\n      <ul class=\"nav\">\n        <li>\n          \n      <div class=\"controls\">\n        <div class=\"navbar-search input-append\">\n          <input id=\"searchBox\" class=\"search-query\" type=\"text\" placeholder='e.g. chillstep mix' autofocus>\n\n          <div class=\"btn-group\">\n            <button type=\"submit\" class=\"btn btn-inverse\"><i class=\"icon-search icon-white\"></i></button>\n            <a class=\"btn btn-primary btn-inverse\" href=\"#\"><i id=\"searchByIcon\" class=\"icon-eye-open icon-white\"></i></a>\n            <a class=\"btn btn-primary btn-inverse dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\"><span class=\"caret icon-white\"></span></a>\n            <ul class=\"dropdown-menu\">\n              <li><span id=\"relevanceBtn\" href=\"\"><i class=\"icon-zoom-in\"></i> Relevance</span></li>\n              <li><span id=\"viewCountBtn\"><i class=\"icon-eye-open\"></i> View Count</span></li>\n              <li><span id=\"publishedBtn\"><i class=\"icon-time\"></i> Published</span></li>\n            </ul>\n          </div>\n\n        </div>\n      </div>\n\n        </li>\n      </ul>\n  	</div>\n  </div>\n</div>\n";
    });
});
window.require.register("views/templates/song", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [3,'>= 1.0.0-rc.4'];
  helpers = helpers || Handlebars.helpers; data = data || {};
    var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


    buffer += "<tr>\n<!-- 	<td><button id=\"inc\" type=\"checkbox\"></button></td>\n	<td><button id=\"play\"><i class=\"icon-play\"></button></td>\n -->	<td><button id=\"add\"><i class=\"icon-plus\"></i></button></td>\n	<td><img src=\"";
    if (stack1 = helpers.thumb) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.thumb; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\" alt=\"";
    if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "\"></td>\n	<td>";
    if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "</td>\n	<td>";
    if (stack1 = helpers.author) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.author; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "</td>\n	<td>";
    if (stack1 = helpers.duration) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.duration; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + "</td>\n	<td>";
    if (stack1 = helpers.viewCount) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.viewCount; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + " <i class=\"icon-eye-open\"></i></td>\n	<td>";
    if (stack1 = helpers.favCount) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
    else { stack1 = depth0.favCount; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
    buffer += escapeExpression(stack1)
      + " <i class=\"icon-heart\"></i></td>\n</tr>";
    return buffer;
    });
});
