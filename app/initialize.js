var application = require('application');

$(function() {

    // Load YT
    $('head').append('<script src="https://www.youtube.com/iframe_api"></script>');

    application.initialize();
    Backbone.history.start();
});
