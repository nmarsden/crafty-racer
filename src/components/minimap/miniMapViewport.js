require('../../../lib/crafty_0.9.0');

import {Game} from "../../game";

Crafty.c('MiniMapViewport', {
    init: function () {
        this.requires('2D, Canvas, Level');
        this.z = 7000;
        this.w = 200;
        this.h = 100;
        this.miniMapPosition = {x: 0, y: 0};

        this.bind("Draw", function (e) {
            this.drawHandler(e);
        }.bind(this));

        this.ready = true;
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
        this.drawViewport(e.ctx);
    },

    drawViewport: function (ctx) {
        ctx.save();
        ctx.strokeStyle = "rgba(255,0,0,0.2)";
        ctx.stroke
        ctx.beginPath();
        ctx.moveTo(this.miniMapPosition.x + this.x - 8, this.miniMapPosition.y + this.y - 5);
        ctx.lineTo(this.miniMapPosition.x + this.x + 8, this.miniMapPosition.y + this.y - 5);
        ctx.lineTo(this.miniMapPosition.x + this.x + 8, this.miniMapPosition.y + this.y + 5);
        ctx.lineTo(this.miniMapPosition.x + this.x - 8, this.miniMapPosition.y + this.y + 5);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

});
