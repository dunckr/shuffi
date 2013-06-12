// Song model
module.exports = Backbone.Model.extend({

  defaults: {
    favCount: 0,
    viewCount: 0,
    thumb: '',
    inc: false // included
  }
});
