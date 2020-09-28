require('../../../lib/crafty_0.9.0');

import {Game} from "../../game";

Crafty.c('BreakingGround', {
    init: function () {
        this.requires('Ground');

        this.TOTAL_BREAKING_FRAMES = 40;
        this.breaking = false;
        this.breakingStartFrame = null;

        this.bind("EnterFrame", this._enterFrame);
    },

    startBreaking: function () {
        if (this.breaking) {
            return;
        }
        this.breaking = true;
        Game.playSoundEffect('disappear', 1, 1.0);
    },

    restoreAsUnbroken: function () {
        this.addComponent("Ground");
        this.removeComponent("WasBreaking");
        this.breaking = false;
        this.breakingStartFrame = null;
        this.visible = true;
        this.alpha = 1.0;
        this.bind("EnterFrame", this._enterFrame);
    },

    _enterFrame: function (data) {
        if (!this.breaking) {
            return;
        }

        this.breakingStartFrame = this.breakingStartFrame || data.frame;
        var animFrame = data.frame - this.breakingStartFrame;

        if (animFrame < this.TOTAL_BREAKING_FRAMES) {
            this._animateBreaking(animFrame);
            return;
        }
        this._changeToBroken();
    },

    _animateBreaking: function (animFrame) {
        if (animFrame % 5 === 0) {
            var newAlpha = this.alpha - (5 / this.TOTAL_BREAKING_FRAMES);
            if (newAlpha < 0) {
                newAlpha = 0;
            }
            this.alpha = newAlpha;
        }
    },

    _changeToBroken: function () {
        this.unbind("EnterFrame", this._enterFrame);
        this.addComponent("WasBreaking");
        this.removeComponent("Ground");
        this.visible = false;
    }
});
