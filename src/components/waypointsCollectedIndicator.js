require('../../lib/crafty_0.9.0');

Crafty.c('WaypointsCollectedIndicator', {
    init: function () {
        this.requires('UILayer, 2D, DOM, Level');
        this.size = 11;
        this.x = 10;
        this.y = 48;
        this.w = 10 * (this.size + 2);
        this.h = this.size;
        this.numberCollected = 0;

        this.waypointIndicators = this._createWaypointIndicators();

        this.bind('WaypointReached', function () {
            this.waypointIndicators[this.numberCollected].collected();
            this.numberCollected++;
        });
    },

    resetNumberCollected: function () {
        this.numberCollected = 0;
        for (var i = 0; i < 10; i++) {
            this.waypointIndicators[i].notFound();
        }
    },

    _createWaypointIndicators: function () {
        var wps = [], i = 0, wp, x = this.x;
        for (; i < 10; i++) {
            wp = Crafty.e('WaypointIndicator');
            wp.setName('WaypointIndicator');
            wp.attr({x: x, y: this.y});
            wps.push(wp);

            this.attach(wp);
            x += (this.size + 2);
        }
        return wps;
    }

});
