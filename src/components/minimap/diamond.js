require('../../../lib/crafty_0.9.0');

Crafty.c('Diamond', {
    init: function () {
        this.requires('2D, Canvas, Level');
        this.z = 7000;
        this.w = 200;
        this.h = 100;

        this.bind("Draw", function (e) {
            this.drawHandler(e);
        }.bind(this));

        this.ready = true;
    },

    drawHandler: function (e) {
        this.drawDiamond(e.ctx, this.x, this.y);
    },

    drawDiamond: function (ctx, offsetX, offsetY) {
        ctx.save();
        ctx.strokeStyle = "#0061FF";
        ctx.beginPath();
        ctx.moveTo(offsetX + this.w / 2 - 1, offsetY - 1);
        ctx.lineTo(offsetX + this.w, offsetY + this.h / 2 - 1);
        ctx.lineTo(offsetX + this.w / 2 - 1, offsetY + this.h);
        ctx.lineTo(offsetX - 1, offsetY + this.h / 2 - 1);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

});
