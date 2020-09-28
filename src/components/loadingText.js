require('../../lib/crafty_0.9.0');

Crafty.c('LoadingText', {
    init: function () {
        this.requires('FlashingText');
        this.text('LOADING')
            .textFont({type: 'normal', weight: 'normal', size: '30px', family: 'ARCADE'})
            .textColor('#0061FF')
            .attr({w: 320});
        this._updatePosition();

        this.bind("ViewportChanged", this._updatePosition.bind(this));
    },

    _updatePosition: function () {
        this.attr({x: Crafty.viewport.width / 2 - 160, y: Crafty.viewport.height / 2 - 15});
    },
});
