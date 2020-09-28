require('../../lib/crafty_0.9.0');

Crafty.c('Point', {
    init: function () {
        this.requires('2D, Canvas');
        this.z = 8000;
        this.position = {x: 0, y: 0};
        this.xOffset = 50;
        this.yOffset = 50;
        this.radius = 5;
        this.circleColour = 'green';

        this.bind("Draw", this._drawHandler);

        this.ready = true;
    },

    setPosition: function (x, y) {
        this.position.x = x;
        this.position.y = y;
        this.x = x;
        this.y = y;
        this.w = 100;
        this.h = 100;
    },

    setCircleColour: function (circleColour) {
        this.circleColour = circleColour;
    },

    setRadius: function (radius) {
        this.radius = radius;
    },

    _drawHandler: function (e) {
        this._drawCircle(e.ctx);
    },

    _drawCircle: function (ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.xOffset + this.position.x, this.yOffset + this.position.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.circleColour;
        ctx.fill();
//    ctx.lineWidth = 1;
//    ctx.strokeStyle = '#003300';
//    ctx.stroke();
        ctx.restore();
    }
});
