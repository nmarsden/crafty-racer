require('../../../lib/crafty_0.9.0');

Crafty.c('Navigator', {
    init: function () {
        this.requires('UILayer, 2D, DOM, spr_minimap_arrow, Level');
        this.w = 70;
        this.h = 70;
        this.origin(this.w / 2, this.h / 2);

        this.bind("WaypointMoved", function (waypointPosition) {
            this.waypointPosition = waypointPosition;
        });

        this.bind("PlayerMoved", function (playerPosition) {
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
    }
});
