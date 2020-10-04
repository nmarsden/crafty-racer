import {Game} from "../../game";

require('../../../lib/crafty_0.9.0');

Crafty.c('MiniMapMarker', {
    init: function () {
        this.requires('UILayer, 2D, DOM, Level');
        this.attr({w:4, h:4});
        this.origin(this.w / 2, this.h / 2);

        this.miniMapConfig = {w:0, h:0, paddingTop:0, paddingRight:0};
        this.offset = {x:0, y:0};

        this.bind("MiniMapConfigChanged", (miniMapConfig) => {
            this.miniMapConfig = miniMapConfig;
        });
    },

    setOffset: function (offsetX, offsetY) {
        this.offset = { x : offsetX, y : offsetY };
    },

    setPosition: function (position) {
        this.x = this.offset.x + (position ? Math.round(((6200 + position.x) / Game.width()) * this.miniMapConfig.w) : 0);
        this.y = this.offset.y + (position ? Math.round((position.y / Game.height()) * this.miniMapConfig.h) : 0);
    }

});
