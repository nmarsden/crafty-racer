require('../../lib/crafty_0.9.0');

Crafty.c('Navigator', {
    init: function () {
        this.requires('Actor, spr_navigator, Level');
        this.z = 7000;
        this.w = 80;
        this.h = 80;
        this.origin(this.w / 2, this.h / 2);
        this._updatePosition();

        this.bind("WaypointMoved", function (waypointPosition) {
            this.waypointPosition = waypointPosition;
        });

        this.bind("PlayerMoved", function (playerPosition) {
            this._updatePosition();

            if (!this.waypointPosition) {
                this.rotation = 0;
            } else {
                // calculate angle between player and waypoint
                var deltaX = playerPosition.x - this.waypointPosition.x;
                var deltaY = playerPosition.y - this.waypointPosition.y;
                var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

                this.rotation = (angle - 90) % 360;
            }
        });
    },

    _updatePosition: function() {
        this.x = -Crafty.viewport.x + Crafty.viewport.width - (this.w/2) - 105;
        this.y = -Crafty.viewport.y - (this.h/2) + 55;
    }
});
