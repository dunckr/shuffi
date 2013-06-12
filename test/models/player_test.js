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