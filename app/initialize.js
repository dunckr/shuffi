var application = require('application');

$(function() {

    // Load YT
    // $('head').append('<script src="https://www.youtube.com/iframe_api"></script>');
    $('head').append('<script src="https://www.youtube.com/iframe_api?modestbranding=1&autoplay=1"></script>');

    application.initialize();
    Backbone.history.start();
});
