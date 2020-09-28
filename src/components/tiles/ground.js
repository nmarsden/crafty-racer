require('../../../lib/crafty_0.9.0');

Crafty.c('Ground', {
    init: function () {
        this.requires('Collision');
        this.z = Math.floor(this._y - 64 - 10);
        this.collision(new Crafty.polygon([0, 32, 64, 0, 128, 32, 64, 64]));
    }
});
