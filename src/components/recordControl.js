require('../../lib/crafty_0.9.0');

import {RecordUtils} from "../utils";

Crafty.c('RecordControl', {
    init: function () {
        this.requires('2D, DOM, Keyboard, Level');
        this.playerX = 0;
        this.playerY = 0;

        this.bind('KeyDown', this._keyDown);
        this.bind("PlayerMoved", this._updatePosition);
    },

    _updatePosition: function (playerPos) {
        this.playerX = playerPos.x;
        this.playerY = playerPos.y;
        if (RecordUtils.isRecording()) {
            this.recordingMessage.x = 10 - Crafty.viewport.x;
            this.recordingMessage.y = 10 - Crafty.viewport.y;
        }
    },

    _keyDown: function () {
        if (this.isDown('F2')) {
            if (RecordUtils.isRecording()) {
                this._hideRecordingMessage();
                RecordUtils.stopRecording();
            } else {
                this._showRecordingMessage();
                RecordUtils.startRecording(this.playerX, this.playerY);
            }
        }
    },

    _showRecordingMessage: function () {
        this.recordingMessage = Crafty.e('FlashingText');
        this.recordingMessage.setName("Recording");
        this.recordingMessage.attr({w: 150, h: 100})
        this.recordingMessage.text("RECORDING");
        this.recordingMessage.textFont({type: 'normal', weight: 'normal', size: '30px', family: 'ARCADE'})
        this.recordingMessage.textColor("#0061FF");
    },

    _hideRecordingMessage: function () {
        this.recordingMessage.destroy()
    }
});
