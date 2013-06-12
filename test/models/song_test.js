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