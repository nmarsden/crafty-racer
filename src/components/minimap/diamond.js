require('../../../lib/crafty_0.9.0');

Crafty.c('Diamond', {
    init: function () {
        this.requires('2D, Canvas, Level');
        this.z = 7000;
        this.miniMapConfig = {w:0, h:0, paddingTop:0, paddingRight:0};

        this.bind("MiniMapConfigChanged", (miniMapConfig) => {
            this.miniMapConfig = miniMapConfig;
            this.w = this.miniMapConfig.w;
            this.h = this.miniMapConfig.h;
        });
        this.bind("Draw", this.drawDiamond.bind(this));

        this.ready = true;
    },

    drawDiamond: function (e) {
        let ctx = e.ctx;
        ctx.save();
        ctx.strokeStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.moveTo(this.x + this.miniMapConfig.w / 2  - this.miniMapConfig.paddingRight - 1, this.y + this.miniMapConfig.paddingTop - 1);
        ctx.lineTo(this.x + this.miniMapConfig.w - this.miniMapConfig.paddingRight, this.y + this.miniMapConfig.h / 2 + this.miniMapConfig.paddingTop - 1);
        ctx.lineTo(this.x + this.miniMapConfig.w / 2  - this.miniMapConfig.paddingRight - 1, this.y + this.miniMapConfig.h + this.miniMapConfig.paddingTop);
        ctx.lineTo(this.x  - this.miniMapConfig.paddingRight - 1, this.y + this.miniMapConfig.h / 2 + this.miniMapConfig.paddingTop - 1);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

});
