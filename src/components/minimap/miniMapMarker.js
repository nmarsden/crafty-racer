import {Game} from "../../game";

require('../../../lib/crafty_0.9.0');

Crafty.c('MiniMapMarker', {
    init: function () {
        this.requires('2D, Canvas, Level');
        this.z = 7000;
        this.w = 200;
        this.h = 100;
        this.miniMapPosition = {x: 0, y: 0};
        this.colour = "#0061FF";
        this.markerSize = {w:4, h:2};

        this.bind("Draw", function (e) {
            this.drawHandler(e);
        }.bind(this));

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
        this.miniMapPosition.x = position ? Math.round(((6200 + position.x) / Game.width()) * 200) : 0;
        this.miniMapPosition.y = position ? Math.round((position.y / Game.height()) * 100) : 0;
    },

    drawHandler: function (e) {
        this.drawMarker(e.ctx);
    },

    drawMarker: function (ctx) {
        ctx.save();
        ctx.fillStyle = this.colour;
        ctx.fillRect(this.miniMapPosition.x + this.x - (this.markerSize.w/2), this.miniMapPosition.y + this.y - (this.markerSize.h/2), 4, 2);
        ctx.restore();
    }

});
