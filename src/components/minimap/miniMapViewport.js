require('../../../lib/crafty_0.9.0');

import {Game} from "../../game";

Crafty.c('MiniMapViewport', {
    init: function () {
        this.requires('2D, Canvas, Level');
        this.z = 7000;
        this.w = 200;
        this.h = 100;
        this.miniMapPosition = {x: 0, y: 0};
        this.viewportSize = {w: 0, h: 0};

        this.updateViewportSize();

        this.bind("Draw", this.drawViewport.bind(this));
        this.bind("ViewportChanged", this.updateViewportSize.bind(this));

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

    drawViewport: function (e) {
        let ctx = e.ctx;
        ctx.save();
        ctx.strokeStyle = "rgba(255,0,0,0.2)";
        ctx.stroke
        ctx.beginPath();
        ctx.moveTo(this.miniMapPosition.x + this.x - (this.viewportSize.w/2), this.miniMapPosition.y + this.y - (this.viewportSize.h/2));
        ctx.lineTo(this.miniMapPosition.x + this.x + (this.viewportSize.w/2), this.miniMapPosition.y + this.y - (this.viewportSize.h/2));
        ctx.lineTo(this.miniMapPosition.x + this.x + (this.viewportSize.w/2), this.miniMapPosition.y + this.y + (this.viewportSize.h/2));
        ctx.lineTo(this.miniMapPosition.x + this.x - (this.viewportSize.w/2), this.miniMapPosition.y + this.y + (this.viewportSize.h/2));
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    },

    updateViewportSize: function() {
        this.viewportSize.w = Math.round((Crafty.viewport.width / Game.width()) * this.w);
        this.viewportSize.h = Math.round((Crafty.viewport.height / Game.height()) * this.h);
    }
});
