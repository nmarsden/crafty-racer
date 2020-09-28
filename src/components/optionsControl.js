require('../../lib/crafty_0.9.0');

import {Game} from "../game";
import {Editor} from "../editor";

Crafty.c('OptionsControl', {
    init: function () {
        this.requires('2D, Keyboard, Level');
        this.paused = false;
        this.isShowExhaust = true;

        this.bind("PauseGame", this._pauseGame);
        this.bind("UnpauseGame", this._unpauseGame);
        this.bind("KeyDown", this._handleKeyDown);
    },

    _pauseGame: function () {
        this.paused = true;
    },

    _unpauseGame: function () {
        this.paused = false;
    },

    _handleKeyDown: function (e) {
        if (this.paused) {
            return;
        }
        if (this.isDown('X')) {
            this._toggleShowExhaust();
        } else if (this.isDown('F4')) {
            this._editLevel();
        }
    },

    _toggleShowExhaust: function () {
        this.isShowExhaust = !this.isShowExhaust;
        Game.player.setShowExhaust(this.isShowExhaust);
    },

    _editLevel: function () {
        Game.stopAllSoundsExcept();
        Game.shutdownLevel();
        Game.restoreBrokenGround();
        Game.showMarkers();

        Editor.initEditor();
    }
});
