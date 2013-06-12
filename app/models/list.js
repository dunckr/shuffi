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
