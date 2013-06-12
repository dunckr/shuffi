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
      this.player = new Player({list: this.list});

      var ControlView = require('views/control_view');
      this.controlView = new ControlView({model: this.player});

      if (typeof Object.freeze === 'function') Object.freeze(this);
    }
};

module.exports = Application;
