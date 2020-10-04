require('../../../lib/crafty_0.9.0');

Crafty.c('MiniMapMarker', {
    init: function () {
        this.requires('UILayer, 2D, DOM, Level');
        this.attr({w:4, h:4});
    }
});
