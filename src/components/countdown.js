require('../../lib/crafty_0.9.0');

import {Game} from "../game";

Crafty.c('Countdown', {
    init: function () {
        this.requires('UILayer, 2D, Level');
        this.playWarningSound = false;
        this.lowTime = false;
        this.noAnimation = {
            '-moz-animation-duration': '',
            '-moz-animation-name': '',
            '-moz-animation-iteration-count': '',
            '-webkit-animation-duration': '',
            '-webkit-animation-name': '',
            '-webkit-animation-iteration-count': ''
        };
        this.lowTimeAnimation = {
            '-moz-animation-duration': '1s',
            '-moz-animation-name': 'low_time',
            '-moz-animation-iteration-count': 'infinite',
            '-webkit-animation-duration': '1s',
            '-webkit-animation-name': 'low_time',
            '-webkit-animation-iteration-count': 'infinite'
        };

        this.minutes = Crafty.e('UILayer, 2D, DOM, Text');
        this.minutes.setName("Minutes");
        this.minutes.textFont({type: 'normal', weight: 'normal', size: '60px', family: 'ARCADE'});
        this.minutes.textColor('#0061FF');
        this.minutes.attr({w: 70});
        this.minutes.textAlign('center');

        this.seconds = Crafty.e('UILayer, 2D, DOM, Text');
        this.seconds.setName("Seconds");
        this.seconds.textFont({type: 'normal', weight: 'normal', size: '60px', family: 'ARCADE'});
        this.seconds.textColor('#0061FF');
        this.seconds.attr({w: 70});
        this.seconds.textAlign('center');

        this._updatePosition();

        this.complete = false;
        this.paused = false;

        this.startTime = 0;
        this.totalTime = 0;

        this.bind("EnterFrame", this._enterFrame);
        this.bind("PauseGame", this._pauseGame);
        this.bind("UnpauseGame", this._unpauseGame);
    },

    _updatePosition: function () {
        var x = 10;
        var y = 170;
        this.minutes.x = x;
        this.minutes.y = y - 100;
        this.seconds.x = x + 70;
        this.seconds.y = y - 100;
    },

    _enterFrame: function () {
        if (this.complete || this.paused) {
            return;
        }
        if (this.stopping) {
            this.stopping = false;
            this.complete = true;
            return;
        }
        var timeLeft = this.totalTime - (Date.now() - this.startTime);

        if (timeLeft <= 0) {
            this.complete = true;
            Crafty.trigger('TimesUp', this);
        } else {
            this._updateDisplay(timeLeft);
        }
    },

    _pauseGame: function () {
        this.paused = true;
        this.totalTime -= (Date.now() - this.startTime);
    },

    _unpauseGame: function () {
        this.startTime = Date.now();
        this.paused = false;
    },

    _updateDisplay: function (timeLeft) {
        if (timeLeft <= 10000 && !this.lowTime) {
            this.lowTime = true;
            this.minutes.css(this.lowTimeAnimation);
            this.seconds.css(this.lowTimeAnimation);
            this.playWarningSound = true;
        }

        var timeLeftMs = timeLeft / 10;
        var secs = Math.floor(timeLeftMs / 100);
        var msecs = Math.floor(timeLeftMs - (secs * 100));

        if (secs < 0 || msecs < 0) {
            secs = 0;
            msecs = 0;
        }
        var secsPadding = "";
        var msecsPadding = "";
        if (secs < 10) {
            secsPadding = "0";
        }
        if (msecs < 10) {
            msecsPadding = "0";
        }
        if (this.playWarningSound && msecs <= 3) {
            Game.stopSound('low_time');
            Game.playSoundEffect('low_time', 1, 1.0);
        }
        this.minutes.text(secsPadding + secs + ":");
        this.seconds.text(msecsPadding + msecs);
    },

    start: function (duration) {
        this.totalTime = duration;
        this.startTime = Date.now();
        this.playWarningSound = false;
        this.lowTime = false;
        this.minutes.css(this.noAnimation);
        this.seconds.css(this.noAnimation);
        this.complete = false;
    },

    stop: function () {
        this.minutes.text("");
        this.seconds.text("");
        this.stopping = true;
    }
});
