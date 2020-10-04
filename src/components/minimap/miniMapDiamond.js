require('../../../lib/crafty_0.9.0');

Crafty.c('MiniMapDiamond', {
    init: function () {
        this.requires('UILayer, 2D, DOM, spr_minimap_diamond, Level');
        this.borderWidth = 2;
    }
});
