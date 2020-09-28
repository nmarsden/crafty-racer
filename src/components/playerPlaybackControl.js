require('../../lib/crafty_0.9.0');

import {Game} from "../game";

Crafty.c('PlayerPlaybackControl', {
    init: function () {
        this.requires('2D, DOM, Text');
        this.playbackIndex = 0;
        this.recordedData = [];
        this.player = null;
        this.seekTarget = null;
        this.debugMode = Game.SEEK_DEBUG_MODE_ON;

        this.bind("SeekTargetReached", this._seekTargetReached);
    },

    /*
     Recorded Data Format:
     0:    player start x pos
     1:    player start y pos
     2:    1st seek target x pos
     3:    1st seek target y pos
     ...
     n-1:  Last seek target x pos
     n:    Last seek target y pos
     */
    start: function (player, recordedData) {
        this.player = player;
        this.player.setPosition(recordedData[0], recordedData[1]);

        if (this.debugMode) {
            this.seekTarget = Crafty.e('Point');
            this.seekTarget.setPosition(0, 0);
            this.seekTarget.setRadius(Game.SEEK_TARGET_RADIUS);
            this.seekTarget.setCircleColour('blue');
        }

        this.playbackIndex = 2;
        this.recordedData = recordedData;

        this._setupNextSeekTarget();

        Crafty.trigger("PlaybackStarted");
    },

    _seekTargetReached: function () {
        if (this.playbackIndex >= this.recordedData.length) {
            if (this.debugMode) {
                this.seekTarget.setPosition(0, 0);
            }
            Crafty.trigger("PlaybackEnded");
            return;
        }
        this._setupNextSeekTarget();
    },

    _setupNextSeekTarget: function () {
        var targetX = this.recordedData[this.playbackIndex];
        var targetY = this.recordedData[this.playbackIndex + 1];
        if (this.debugMode) {
            this.seekTarget.setPosition(targetX, targetY);
        }
        this.player.seek(targetX, targetY);
        this.playbackIndex += Game.SEEK_TARGET_FREQUENCY * 2;
    }
});
