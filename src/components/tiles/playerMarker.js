require('../../../lib/crafty_0.9.0');

Crafty.c('PlayerMarker', {
    init: function () {
        this.z = Math.floor(this._y);
    },

    getPlayerPosition: function () {
        return {
            x: this._x + 15,
            y: this._y - 17
        }
    }
});
