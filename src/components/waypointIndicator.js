require('../../lib/crafty_0.9.0');

Crafty.c('WaypointIndicator', {
    init: function () {
        this.requires('UILayer, 2D, DOM, spr_waypoint_indicator, SpriteAnimation');
        this.w = 11;
        this.h = 11;

        this.reel('Collected', 1, 0, 0, 1);
        this.reel('NotFound', 1000, 1, 0, 1);

        this.notFound();
    },

    collected: function () {
        this.animate('Collected', -1);
    },

    notFound: function () {
        this.animate('NotFound', -1);
    }

});
