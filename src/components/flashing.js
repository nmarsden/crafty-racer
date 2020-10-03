require('../../lib/crafty_0.9.0');

Crafty.c('Flashing', {
    init: function () {
        this.requires('DOM');
        this.css({
            '-moz-animation-duration': '2s',
            '-webkit-animation-duration': '2s',
            '-moz-animation-name': 'flash',
            '-webkit-animation-name': 'flash',
            '-moz-animation-iteration-count': 'infinite',
            '-webkit-animation-iteration-count': 'infinite'
        });
    }
});
