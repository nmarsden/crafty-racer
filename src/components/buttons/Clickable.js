require('../../../lib/crafty_0.9.0');

Crafty.c('Clickable', {
    enabled: true,
    wrappedClickHandler: () => {},

    init: function () {
        this.requires('UILayer, 2D, DOM, Button');
        this.attr({z:50})
        this.css({
            'cursor': 'pointer'
        });
        this.bind('Click', this.clickHandler.bind(this));
        this.bind('MouseDown', this.clickHandler.bind(this));
        this.bind('TouchStart', this.clickHandler.bind(this));
    },

    onClick: function(wrappedClickHandler) {
        this.wrappedClickHandler = wrappedClickHandler;
    },

    clickHandler: function() {
        if (!this.enabled) {
            return;
        }
        this.wrappedClickHandler();
        Crafty.s('Touch').resetTouchPoints();
    },

    enable: function() {
        this.enabled = true;
    },

    disable: function() {
        this.enabled = false;
    }

});
