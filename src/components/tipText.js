require('../../lib/crafty_0.9.0');

Crafty.c('TipText', {
    init: function () {
        this.requires('OutlineText, Tween');
        this.delay = 500;
        this.animating = false;
        this.startTime = null;
        this.totalShowDuration = 2000;
        this.visible = false;
        this.alphaZero = {alpha: 0.0};

        this.attr({w: 320})
        this.textFont({type: 'normal', weight: 'normal', size: '30px', family: 'ARCADE'})
        this.textColor('#0061FF', 1.0);

        this._updatePosition();

        this.bind("ViewportChanged", this._updatePosition.bind(this));
    },

    show: function () {
        this.startTime = Date.now();
        this.animating = false;
        this.alpha = 1.0;
        this.bind("EnterFrame", this._enterFrameHandler.bind(this));
    },

    _updatePosition: function () {
        this.attr({x: Crafty.viewport.width / 2 - 160, y: Crafty.viewport.height / 2 - 100});
    },

    _enterFrameHandler: function () {
        var timeElapsed = Date.now() - this.startTime;
        if (timeElapsed > this.totalShowDuration) {
            this.visible = false;
            this.unbind("EnterFrame", this._enterFrameHandler);
            return;
        }

        if (!this.visible) {
            this.visible = true;
        }

        if (!this.animating && timeElapsed > this.delay) {
            this.animating = true;
            this.tween(this.alphaZero, 1000);
        }
    }
});
