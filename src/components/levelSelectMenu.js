require('../../lib/crafty_0.9.0');

import {Game} from "../game";

Crafty.c('LevelSelectMenu', {
    init: function () {
        this.requires('Menu');

        var numberOfLevels = Game.numberOfLevels();
        for (var i = 0; i < numberOfLevels; i++) {
            this.addMenuItem("Level " + (i + 1), this.getLevelSelectHandler(i))
        }

    },

    getLevelSelectHandler: function (levelIndex) {
        return function () {
            Game.selectLevel(levelIndex);
        }
    }
});
