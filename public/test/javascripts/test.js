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

window.require.register("test/initialize", function(exports, require, module) {
  var tests = [
    './models/song_test',
    './models/list_test',
    './models/player_test'

  ];

  for (var test in tests) {
    require(tests[test]);
  }
  
});
window.require.register("test/models/list_test", function(exports, require, module) {
  var List = require('models/list'),
      Song = require('models/song');

  describe("List collection", function() {

    beforeEach(function() {
      this.list = new List();
    });

    afterEach(function() {
      delete this.list;
    });

    it("should be defined", function() {
      expect(this.list).to.exist;
    });

    it("should be able to add and remove", function() {
      var song = new Song({ 'title': 'one'});
      this.list.add(song);
      expect(this.list.length).to.equal(1);
      this.list.remove(song);
      expect(this.list.length).to.equal(0);
      this.list.add(song);
      expect(this.list.length).to.equal(1);
      this.list.reset();
      expect(this.list.length).to.equal(0);
    });

    it("should be able to reorder", function() {
      var s1 = new Song({ 'title': 'zzz', 'viewCount': 10});
      var s2 = new Song({ 'title': 'two', 'viewCount': 999});
      var s3 = new Song({ 'title': 'aaa', 'viewCount': 0});
      this.list.add([s1,s2,s3]);

      this.list.comparator = function(song) {
        return song.get('title');
      };
      this.list.sort();
      expect( _.sortBy(this.list.pluck('title'), function(title){ return title; }) ).to.eql(this.list.pluck('title'));

      this.list.comparator = function(song) {
        return song.get('viewCount');
      };
      this.list.sort();
      expect( _.sortBy(this.list.pluck('viewCount'), function(viewCount){ return viewCount; }) ).to.eql(this.list.pluck('viewCount'));


      this.list.comparator = function(song) {
        return -song.get('viewCount');
      };
      this.list.sort();
      expect( _.sortBy(this.list.pluck('viewCount'), function(viewCount){ return -viewCount; }) ).to.eql(this.list.pluck('viewCount'));
    });

    it("should be able to modify from separate list", function() {
      var list2 = new List();
      var s1 = new Song({ 'title': 'zzz', 'viewCount': 10});
      list2.add(s1);

      this.list.add(list2.at(0));

      expect(list2.length).to.be.equal(1);
      list2.pop();
      expect(list2.length).to.be.equal(0);
      expect(this.list.length).to.be.equal(1);
    });

    it("should fire events", function() {
      var eventSpy = sinon.spy();
      this.list.bind("add", eventSpy);
      var s1 = new Song({ 'title': 'zzz', 'viewCount': 10});
      this.list.add(s1);
      expect(eventSpy.calledOnce).to.be.true;
    });

    it("current should initialise as empty", function() {
      expect(this.list.current).to.be.equal(-1);
    });

    it("should have a current on add", function() {
      var song = new Song({ 'title': 'one'});
      this.list.add(song);
      expect(this.list.current).to.be.equal(0);
      this.list.remove(song);
      expect(this.list.current).to.be.equal(-1);

      this.list.add(song);
      this.list.reset();
      expect(this.list.current).to.be.equal(-1);

    });

    // it("should be able to next", function() {
    //   expect(this.list.current).to.be.equal(-1);
    //   var s1 = new Song({ 'title': 'one'});
    //   var s2 = new Song({ 'title': 'two'});
    //   this.list.add([s1, s2]);    
    //   expect(this.list.current).to.be.equal(0);
    //   this.list.next();
    //   expect(this.list.current).to.be.equal(1);
    // });

    // it("should not return next if none available", function() {
    //   this.list.next();
    //   expect(this.list.current).to.be.equal(-1);         
    // });

    // it("should return last on next of last", function() {
    //   var s1 = new Song({ 'title': 'one'});
    //   this.list.add(s1); 
    //   expect(this.list.current).to.be.equal(0);
    //   this.list.next();
    //   expect(this.list.current).to.be.equal(0);        
    // });

    // it("should be able to prev", function() {
    //   var s1 = new Song({ 'title': 'one'});
    //   var s2 = new Song({ 'title': 'two'});
    //   this.list.add([s1, s2]);    
    //   this.list.next();
    //   this.list.prev();
    //   expect(this.list.current).to.be.equal(0);   
    // });

    // it("should not return prev if none available", function() {
    //   this.list.prev();
    //   expect(this.list.current).to.be.equal(-1);      

    //   var s1 = new Song({ 'title': 'one'});
    //   this.list.add(s1);    
    //   this.list.prev();
    //   expect(this.list.current).to.be.equal(0);
    // });

    it("should be able to set current", function() {
      var s1 = new Song({ 'title': 'one'});
      var s2 = new Song({ 'title': 'two'});
      this.list.add([s1, s2]); 
      this.list.current = 1;
      expect(this.list.current).to.be.equal(1);
    });

    it("should be able to set current back on reset", function() {
      var s1 = new Song({ 'title': 'one'});
      var s2 = new Song({ 'title': 'two'});
      this.list.add([s1, s2]); 
      this.list.current = 1;
      this.list.reset();
      expect(this.list.current).to.be.equal(-1);
    });

    it("should be able to include particular song", function() {
      var s1 = new Song({ 'title': 'one'});
      this.list.add(s1); 
      this.list.inc(s1);
      expect(this.list.get(s1).get('inc')).to.be.true;
      this.list.inc(s1);
      expect(this.list.get(s1).get('inc')).to.be.false;
    });

    it("should error on including a none song", function() {
      var s1 = new Song({ 'title': 'one'});
      var fn = function(){ this.list.inc(s1); }
      expect(fn).throw(Error);
    });

    it("should be able to find the next inc", function() {
      var s1 = new Song({ 'title': 'one'});
      var s2 = new Song({ 'title': 'two'});
      var s3 = new Song({ 'title': 'three'});
      var s4 = new Song({ 'title': 'four'});
      this.list.add([s1, s2, s3, s4]); 
      this.list.inc(s2);
      this.list.inc(s4);
      expect(this.list.current).to.be.equal(0);
      this.list.next();
      expect(this.list.current).to.be.equal(1);
      this.list.next();
      expect(this.list.current).to.be.equal(3);

      // reset
      this.list.current = 0;
      expect(this.list.current).to.be.equal(0);
      this.list.inc(s2);
      this.list.inc(s3);
      this.list.next();
      expect(this.list.current).to.be.equal(2);
      this.list.next();
      expect(this.list.current).to.be.equal(3);
    });

    it("should be able to find the prev inc", function() {
      var s1 = new Song({ 'title': 'one'});
      var s2 = new Song({ 'title': 'two'});
      var s3 = new Song({ 'title': 'three'});
      var s4 = new Song({ 'title': 'four'});
      this.list.add([s1, s2, s3, s4]); 
      this.list.inc(s1);
      this.list.inc(s3);
      this.list.current = 3;
      expect(this.list.current).to.be.equal(3);
      this.list.prev();
      expect(this.list.current).to.be.equal(2);
      this.list.prev();
      expect(this.list.current).to.be.equal(0);

      // reset
      this.list.current = 2;
      expect(this.list.current).to.be.equal(2);
      this.list.inc(s1);
      this.list.prev();
      expect(this.list.current).to.be.equal(2);

      this.list.inc(s3);
      this.list.prev();

      this.list.current = 3;
      this.list.inc(s2);
      this.list.prev();    
      expect(this.list.current).to.be.equal(1);
    });


  });
});
window.require.register("test/models/player_test", function(exports, require, module) {
  var Player = require('models/player'),
      Song   = require('models/song');

  describe("Player model", function() {

    beforeEach(function() {
      this.player = new Player();
    });

    afterEach(function() {
      delete this.player;
    });

    it("should be defined", function() {
      expect(this.player).to.exist;
    });

    it("should be creatable", function() {
      // onload etc
    });

    it("should be able to load", function() {
      // var song = new Song();
      // this.player.add()
      // this.player.load(song);
      // expect(this.player.);  
    });

    it("should be playable", function() {
      
    });

    it("should be pausable", function() {
      
    });

    it("should be able to mute", function() {
      
    });

    it("should be able to resize", function() {
      
    });



  });
});
window.require.register("test/models/song_test", function(exports, require, module) {
  var Song = require('models/song');

  describe("Song model", function() {

    beforeEach(function() {
      this.song = new Song();
    });

    afterEach(function() {
      delete this.song;
    });

    it("should be defined", function() {
      expect(this.song).to.exist;
    });

    it("should have defaults", function() {
      expect(this.song.get('favCount')).to.equal(0);
      expect(this.song.get('viewCount')).to.equal(0);
      expect(this.song.get('thumb')).to.equal('');
    });

    it("should be able to change", function() {
      this.song.set('favCount',100);
      expect(this.song.get('favCount')).to.equal(100);
    });

    it("should have inc", function() {
      expect(this.song.get('inc')).to.be.false;
    });

  });
});
window.require.register("test/views/home_view_test", function(exports, require, module) {
  var HomeView = require('views/home_view');

  describe("HomeView", function() {

    beforeEach(function() {
      this.view = new HomeView();
    });

    afterEach(function() {
      delete this.view;
    });

    it("should exist", function() {
      expect(this.view).to.be.ok;
    });

    it("should have correct id", function() {
      expect(this.view.$el.attr('id')).to.equal('home-view');
    });

  });
  
});
