require('../../lib/crafty_0.9.0');

Crafty.c('OutlineText', {
    init: function () {
        this.requires('UILayer, 2D, DOM, Text');
        this.css({'text-shadow': '1px 0 0 #000000, 0 -1px 0 #000000, 0 1px 0 #000000, -1px 0 0 #000000'})
        this.textAlign('center');
    }
});
