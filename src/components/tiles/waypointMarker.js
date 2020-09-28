require('../../../lib/crafty_0.9.0');

Crafty.c('WaypointMarker', {
    init: function () {
        this.z = Math.floor(this._y);
        this.waypointPosition = {
            x: this._x + 32,
            y: this._y - 16
        };
    },

    getWaypointPosition: function () {
        return this.waypointPosition;
    }
});
