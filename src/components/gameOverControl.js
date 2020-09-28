require('../../lib/crafty_0.9.0');

import {Game} from "../game";

Crafty.c('GameOverControl', {
    textWidth: 300,
    textHeight: 100,
    textColour: '#0061FF',

    init: function () {
        this.requires('UILayer, 2D, DOM, Text, Color');
        this.attr({z:10});
        this.color('#000000', 0.8);
        this.showLoadingMessage = false;
        this.keyPressDelay = true;

        this.reasonText = Crafty.e('OutlineText');
        this.reasonText.setName("GameOverReason");
        this.reasonText.attr({w: this.textWidth, height: this.textHeight, z:50})
        this.reasonText.textFont({type: 'normal', weight: 'normal', size: '40px', family: 'ARCADE'})
        this.reasonText.textColor(this.textColour, 1.0);

        this.gameOverText = Crafty.e('OutlineText');
        this.gameOverText.setName("GameOver");
        this.gameOverText.text('GAME OVER!')
        this.gameOverText.attr({w: this.textWidth, height: this.textHeight, z:50})
        this.gameOverText.textFont({type: 'normal', weight: 'normal', size: '60px', family: Game.fontFamily})
        this.gameOverText.textColor(this.textColour);

        this.pressAnyKey = Crafty.e('OutlineText, Button');
        this.pressAnyKey.setName("PausePressAnyKeyText");
        this.pressAnyKey.attr({w: this.textWidth, h: 60, z:50})
        this.pressAnyKey.text("RETRY");
        this.pressAnyKey.textFont({type: 'normal', weight: 'normal', size: '50px', family: 'ARCADE'})
        this.pressAnyKey.textColor(this.textColour);
        this.pressAnyKey.css({
            'line-height': '70px',
            'border': `2px solid ${this.textColour}`,
        });
        this.pressAnyKey.bind('MouseDown', this.showLoading.bind(this));
        this.pressAnyKey.bind('TouchStart', this.showLoading.bind(this));

        Game.playSoundEffect('game_over', 1, 1.0);

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
        var x = Crafty.viewport.width / 2 - (this.textWidth / 2);
        var y = Crafty.viewport.height / 2;
        this.attr({w:Crafty.viewport.width, h:Crafty.viewport.height});
        this.reasonText.attr({x: x, y: y - 120})
        this.gameOverText.attr({x: x, y: y - 70})
        this.pressAnyKey.attr({x: x, y: y + 80})
    },

    setReason: function (reason) {
        this.reasonText.text(reason);
    },

    enableKeyPress: function () {
        this.keyPressDelay = false;
    },

    enableRestart: function () {
        this.showLoadingMessage = true;
    },

    showLoading: function () {
        if (!this.keyPressDelay) {
            this.reasonText.text("");
            this.gameOverText.text("");
            this.pressAnyKey.text("LOADING");
            this.pressAnyKey.css({
                'border': 'none',
            });

            // Introduce delay to ensure Loading... text is rendered before next level or restart
            setTimeout(this.enableRestart.bind(this), 100);
        }
    },

    restartGame: function () {
        if (this.showLoadingMessage) {
            this.reasonText.destroy();
            this.gameOverText.destroy();
            this.pressAnyKey.destroy();
            this.overlay.destroy();
            this.destroy();

            Game.retryLevel();
        }
    }

});
