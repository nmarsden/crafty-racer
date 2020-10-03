require('../../lib/crafty_0.9.0');

import {Game} from "../game";

Crafty.c('LevelIndicator', {
    init: function () {
        this.requires('UILayer, 2D, DOM, OutlineText, Level');
        this.attr({x:10, y:5, w:300, h:30});
        this.textFont({type: 'normal', weight: 'normal', size: '30px', family: Game.fontFamily});
        this.css('text-align', 'left');
        this.textColor('#0061FF', 0.6);
        this.text("LEVEL " + Game.getLevelNumber());
    }
});
