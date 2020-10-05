require('../../../lib/crafty_0.9.0');

Crafty.c('OutlineButton', {
    init: function () {
        this.requires('OutlineText, Clickable');
        this.attr({w: 300, h: 60})
        this.text("BUTTON");
        this.textFont({type: 'normal', weight: 'normal', size: '50px', family: 'ARCADE'})
        this.textColor('#0061FF');
        this.css({
            'line-height': '72px',
            'border': `2px solid #0061FF`,
        });
    }

});
