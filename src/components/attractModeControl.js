require('../../lib/crafty_0.9.0');

import {Game} from "../game";

Crafty.c('AttractModeControl', {
    textWidth: 650,
    textHeight: 60,
    titleColour: "#AD0000",
    pressAnyKeyColour: "#0061FF",

    init: function () {
        this.requires('UILayer, 2D, DOM, Text, Persist');

        this.demo = Crafty.e('FlashingText');
        this.demo.addComponent("Persist");
        this.demo.setName("TitleText");
        this.demo.attr({w: this.textWidth, h: this.textHeight, z:50});
        this.demo.text("DEMO");
        this.demo.textFont({type: 'normal', weight: 'normal', size: '60px', family: 'ARCADE'})
        this.demo.textColor(this.titleColour);
        this.demo.visible = false;

        this.pressAnyKey = Crafty.e('FlashingText');
        this.pressAnyKey.addComponent("Persist");
        this.pressAnyKey.setName("PressAnyKeyText");
        this.pressAnyKey.attr({w: this.textWidth, h: this.textHeight, z:50});
        this.pressAnyKey.text("PRESS ANY KEY");
        this.pressAnyKey.textFont({type: 'normal', weight: 'normal', size: '30px', family: 'ARCADE'})
        this.pressAnyKey.textColor(this.pressAnyKeyColour);
        this.pressAnyKey.visible = false;

        this.bind("ViewportChanged", this._updatePosition.bind(this));
        this.bind("PlaybackStarted", this._playbackStarted);
        this.bind("PlaybackEnded", this._playbackEnded);
        this.bind('KeyDown', this._handleKeyDownOrButtonDown);
        Game.gamePad.bind(Gamepad.Event.BUTTON_DOWN, this._handleKeyDownOrButtonDown.bind(this));

        this._updatePosition()
    },

    stop: function () {
        this.demo.visible = false;
        this.pressAnyKey.visible = false;
        Game.stopAttractMode();
    },

    _updatePosition: function () {
        let x = Crafty.viewport.width / 2 - (this.textWidth / 2);
        let y = Crafty.viewport.height;

        this.demo.attr({x: x, y: y - 150})
        this.pressAnyKey.attr({x: x, y: y - 90})
    },

    _playbackStarted: function () {
        this.demo.visible = true;
        this.pressAnyKey.visible = true;
    },

    _playbackEnded: function () {
        Game.resetAttractMode();
    },

    _handleKeyDownOrButtonDown: function (e) {
        this.stop();
    }
});
