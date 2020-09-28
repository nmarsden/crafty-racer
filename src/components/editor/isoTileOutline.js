require('../../../lib/crafty_0.9.0');

Crafty.c('IsoTileOutline', {
    init: function() {
        this.requires('2D, Canvas, Editor');
        this.z = 7000;
        this.w = 128;
        this.h = 64;
        this.destroyAfterDraw = false;

        this.bind("Draw", function(e) {
            this._drawHandler(e);
        }.bind(this));

        this.ready = true;
    },

    clearAndDestroy: function() {
        // Move out of view (hopefully)
        this.x = -5000;
        this.y = -5000;
        // Next draw should destroy
        this.destroyAfterDraw = true;
    },

    _drawHandler : function (e) {
        this._drawIsoTileOutline(e.ctx, this.x, this.y);
        if (this.destroyAfterDraw) {
            this.destroy();
        }
    },

    _drawIsoTileOutline : function(ctx, offsetX, offsetY) {
        ctx.save();
        ctx.strokeStyle = "rgba(0,0,0,1.0)";
        ctx.beginPath();
        ctx.moveTo(offsetX + this.w/2,      offsetY + 1);
        ctx.lineTo(offsetX + this.w - 2,    offsetY + this.h/2);
        ctx.lineTo(offsetX + this.w/2,      offsetY + this.h - 1);
        ctx.lineTo(offsetX + 2,             offsetY + this.h/2);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

});
