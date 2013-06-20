var application = require('application');

module.exports = Backbone.Router.extend({
    routes: {
        '': 'home',
        '*action': 'action'
    },

    home: function() {
    },

    action: function(route) {
      $('#deleteAllBtn').click();
      $('#searchBox').val(route);
      $('#searchBtn').click();
    }

});
