require('../../../lib/crafty_0.9.0');

Crafty.c('Solid', {
    init: function () {
        this.requires('Collision');
        this.z = Math.floor(this._y + 64);
        var polygon = new Crafty.polygon([0, 32, 64, 0, 128, 32, 64, 64]);
        polygon.shift(0, 64);
        this.collision(polygon);
    }
});
