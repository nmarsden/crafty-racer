require('../../lib/crafty_0.9.0');

Crafty.c('GlassOverlay', {
    init: function () {
        this.requires('UILayer, 2D, DOM, spr_glass_overlay');
        this.attr({ w: 700, h: 450 });
        this.css({'display':'none'});
        this.bind("ViewportChanged", this._updatePosition.bind(this));

        this._updatePosition();
    },

    _updatePosition: function () {
        let x = Crafty.viewport.width/2 - (this.w / 2);
        let y = Crafty.viewport.height/2 - (this.h / 2);
        this.attr({x: x, y: y});
    },
});
