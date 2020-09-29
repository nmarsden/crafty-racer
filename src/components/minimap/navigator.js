require('../../../lib/crafty_0.9.0');

Crafty.c('Navigator', {
    init: function () {
        this.requires('Actor, spr_navigator, Level');
        this.z = 7000;
        this.w = 70;
        this.h = 70;
        this.miniMapConfig = {w:0, h:0, paddingTop:0, paddingRight:0};
        this.origin(this.w / 2, this.h / 2);
        this._updatePosition();

        this.bind("MiniMapConfigChanged", (miniMapConfig) => { this.miniMapConfig = miniMapConfig });

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
        this.x = -Crafty.viewport.x + Crafty.viewport.width - (this.w/2) - (this.miniMapConfig.w/2) - this.miniMapConfig.paddingRight;
        this.y = -Crafty.viewport.y - (this.h/2) + (this.miniMapConfig.h/2) + this.miniMapConfig.paddingTop;
    }
});
