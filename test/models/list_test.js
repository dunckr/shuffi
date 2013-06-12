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