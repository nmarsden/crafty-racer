import {Game} from "../../game";

require('../../../lib/crafty_0.9.0');

Crafty.c('MiniMapMarker', {
    init: function () {
        this.requires('2D, Canvas, Level');
        this.z = 7000;
        this.miniMapConfig = {w:0, h:0, paddingTop:0, paddingRight:0};
        this.miniMapPosition = {x: 0, y: 0};
        this.colour = "#0061FF";
        this.markerSize = {w:4, h:2};

        this.bind("MiniMapConfigChanged", (miniMapConfig) => {
            this.miniMapConfig = miniMapConfig;
            this.w = this.miniMapConfig.w;
            this.h = this.miniMapConfig.h;
        });
        this.bind("Draw", this.drawMarker.bind(this));

        this.ready = true;
    },

    setColour: function (colour) {
        this.colour = colour;
    },

    setOffset: function (offsetX, offsetY) {
        this.x = offsetX;
        this.y = offsetY;
    },

    setPosition: function (position) {
        this.miniMapPosition.x = position ? Math.round(((6200 + position.x) / Game.width()) * this.miniMapConfig.w) : 0;
        this.miniMapPosition.y = position ? Math.round((position.y / Game.height()) * this.miniMapConfig.h) : 0;
    },

    drawMarker: function (e) {
        let ctx = e.ctx;
        ctx.save();
        ctx.fillStyle = this.colour;
        ctx.fillRect(
            this.miniMapPosition.x + this.x - (this.markerSize.w/2) - this.miniMapConfig.paddingRight,
            this.miniMapPosition.y + this.y - (this.markerSize.h/2) + this.miniMapConfig.paddingTop,
            this.markerSize.w,
            this.markerSize.h);
        ctx.restore();
    }

});
