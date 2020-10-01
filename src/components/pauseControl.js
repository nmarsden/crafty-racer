require('../../lib/crafty_0.9.0');

import {Debug} from "../utils";
import {Game} from "../game";

Crafty.c('PauseControl', {
    init: function () {
        this.requires('UILayer, 2D, Keyboard, Level, Color');
        this.attr({z:10});
        this.color('#000000', 0.8);
        this.css({'display':'none'});

        this.paused = false;
        this.enabled = true;
        var textColour = "#0061FF";

        this.pauseText = Crafty.e('OutlineText');
        this.pauseText.setName("PauseText");
        this.pauseText.attr({w: 320, z:50})
        this.pauseText.text("PAUSED");
        this.pauseText.textFont({type: 'normal', weight: 'normal', size: '60px', family: Game.fontFamily})
        this.pauseText.textColor(textColour);
        this.pauseText.css({'display': 'none'});

        this.resumeButton = Crafty.e('OutlineButton');
        this.resumeButton.setName("ResumeButton");
        this.resumeButton.text("RESUME");
        this.resumeButton.css({
            'display': 'none',
        });
        this.resumeButton.onClick(this._handleKeyDownOrButtonDown.bind(this));
        this.resumeButton.disable();

        this.quitButton = Crafty.e('OutlineButton');
        this.quitButton.setName("QuitButton");
        this.quitButton.text("QUIT");
        this.quitButton.css({
            'display': 'none',
        });
        this.quitButton.onClick(this._handleQuitButtonPressed.bind(this));
        this.quitButton.disable();

        this._updatePosition();

        this.bind("ViewportChanged", this._updatePosition.bind(this));

        this.bind('KeyDown', this._handleKeyDownOrButtonDown.bind(this));
        Game.gamePad.bind(Gamepad.Event.BUTTON_DOWN, this._handleKeyDownOrButtonDown.bind(this));
    },

    _updatePosition: function () {
        if (!this.enabled) {
            return;
        }
        let x = Crafty.viewport.width / 2;
        let y = Crafty.viewport.height / 2;

        this.attr({w:Crafty.viewport.width, h:Crafty.viewport.height});
        this.pauseText.attr({x: x - (this.pauseText.w/2), y: y - 100});
        this.resumeButton.attr({x: x - (this.resumeButton.w/2), y: y + 30});
        this.quitButton.attr({x: x - (this.quitButton.w/2), y: y + 100});
    },

    _isBackButton: function (e) {
        return (e.control && e.control == 'BACK');
    },

    _handleKeyDownOrButtonDown: function (e) {
        if (!this.enabled) {
            return;
        }
        if (!this.paused && (this.isDown('ESC') || this._isBackButton(e))) {
            Crafty.s('Keyboard').resetKeyDown();
            this.pause();
        } else if (this.paused) {
            Crafty.s('Keyboard').resetKeyDown();
            this.unpause();
        }
    },

    _handleQuitButtonPressed: function() {
        if (!this.paused) {
            return;
        }
        Crafty.audio.unmute();
        Crafty.trigger('Quit');
    },

    enable: function () {
        this.enabled = true;
    },

    disable: function () {
        this.enabled = false;
    },

    pause: function () {
        Debug.logEntitiesAndHandlers("Pause");

        this.paused = true;
        Game.pauseGame();
        Crafty.audio.mute();

        this.css({'display':'block'});
        this.pauseText.css({'display':'block'});
        this.resumeButton.css({'display':'block'});
        this.resumeButton.enable();
        this.quitButton.css({'display':'block'});
        this.quitButton.enable();

        this.overlay = Crafty.e("GlassOverlay");
    },

    unpause: function () {
        this.paused = false;
        this.css({'display':'none'});
        this.pauseText.css({'display':'none'});
        this.resumeButton.css({'display':'none'});
        this.resumeButton.disable();
        this.quitButton.css({'display':'none'});
        this.quitButton.disable();
        this.overlay.destroy();

        Crafty.audio.unmute();

        Game.unpauseGame();
    }

});
