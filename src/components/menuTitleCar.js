require('../../lib/crafty_0.9.0');

Crafty.c('MenuTitleCar', {
    init: function () {
        this.requires('2D, DOM, SpriteAnimation, spr_car');
        this.reel('Menu_Title_Car', 2000, 4, 6, 32, 10);
        this.animate('Menu_Title_Car', -1);
    }

});
