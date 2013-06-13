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