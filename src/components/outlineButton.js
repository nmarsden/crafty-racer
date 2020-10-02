require('../../lib/crafty_0.9.0');

Crafty.c('OutlineButton', {
    enabled: true,
    clickHandler: () => {},

    init: function () {
        this.requires('OutlineText, Button');
        this.attr({w: 300, h: 60, z:50})
        this.text("BUTTON");
        this.textFont({type: 'normal', weight: 'normal', size: '50px', family: 'ARCADE'})
        this.textColor('#0061FF');
        this.css({
            'line-height': '72px',
            'border': `2px solid #0061FF`,
            'cursor': 'pointer'
        });
        this.bind('Click', this.buttonClickHandler.bind(this));
        this.bind('MouseDown', this.buttonClickHandler.bind(this));
        this.bind('TouchStart', this.buttonClickHandler.bind(this));
    },

    onClick: function(clickHandler) {
        this.clickHandler = clickHandler;
    },

    buttonClickHandler: function() {
        if (!this.enabled) {
            return;
        }
        this.clickHandler();
        Crafty.s('Touch').resetTouchPoints();
    },

    enable: function() {
        this.enabled = true;
    },

    disable: function() {
        this.enabled = false;
    }

});
