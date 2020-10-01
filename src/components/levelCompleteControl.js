require('../../lib/crafty_0.9.0');

import {Game} from "../game";

Crafty.c('LevelCompleteControl', {
    textWidth:  300,
    textHeight: 100,
    textColour: "#0061FF",

    init: function () {
        this.requires('UILayer, 2D, DOM, Text, Color');
        this.attr({z:10});
        this.color('#000000', 0.8);

        this.showLoadingMessage = false;
        this.keyPressDelay = true;

        this.levelComplete = Crafty.e('OutlineText');
        this.levelComplete.setName("LevelCompleteText");
        this.levelComplete.text(Game.getLevelCompleteMessage)
        this.levelComplete.attr({w: this.textWidth, z:50})
        this.levelComplete.textFont({type: 'normal', weight: 'normal', size: '50px', family: Game.fontFamily})
        this.levelComplete.textColor(this.textColour);

        this.pressAnyKey = Crafty.e('OutlineButton');
        this.pressAnyKey.setName("PausePressAnyKeyText");
        this.pressAnyKey.text("CONTINUE");
        this.pressAnyKey.onClick(this.showLoading.bind(this));

        this.overlay = Crafty.e('GlassOverlay');

        // After a short delay, watch for the player to press a key, then restart
        // the game when a key is pressed
        setTimeout(this.enableKeyPress.bind(this), 1000);

        this.bind('KeyDown', this.showLoading);
        Game.gamePad.bind(Gamepad.Event.BUTTON_DOWN, this.showLoading.bind(this));

        this.bind('EnterFrame', this.restartGame);
        this.bind("ViewportChanged", this._updatePosition.bind(this));

        this._updatePosition();
    },

    _updatePosition: function () {
        var x = Crafty.viewport.width / 2 - this.textWidth/2;
        var y = Crafty.viewport.height / 2;
        this.attr({w:Crafty.viewport.width, h:Crafty.viewport.height});
        this.levelComplete.attr({x: x , y: y - 140})
        this.pressAnyKey.attr({x: x, y: y + 80})
    },

    enableKeyPress: function () {
        this.keyPressDelay = false;
    },

    enableRestart: function () {
        this.showLoadingMessage = true;
    },

    showLoading: function () {
        if (!this.keyPressDelay) {
            this.overlay.destroy();
            this.pressAnyKey.text("LOADING");
            this.pressAnyKey.css({
                'border': 'none',
            });
            this.levelComplete.text("");
            // Introduce delay to ensure Loading... text is rendered before next level or restart
            setTimeout(this.enableRestart.bind(this), 100);
        }
    },

    restartGame: function () {
        if (this.showLoadingMessage) {
            if (Game.isGameComplete()) {
                Game.resetLevels();
            } else {
                Game.nextLevel();
            }
            Game.startLevel();
        }
    }

});
