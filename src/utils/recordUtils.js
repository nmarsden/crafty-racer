require('../../lib/crafty_0.9.0');

import {Game} from "../game";

export let RecordUtils = {
    recording : false,
    recordedData : [],

    isRecording: function() {
        return this.recording;
    },

    startRecording: function(playerX, playerY) {
        this.recording = true;
        this.recordedData = [playerX, playerY];
    },

    stopRecording: function() {
        this.recording = false;
        console.log("recordedData: [" + this._cleanData(this.recordedData).join(",") + "]");
    },

    recordValue: function(storedValue) {
        if (!this.recording) {
            return;
        }
        this.recordedData.push(Crafty.frame());
        this.recordedData.push(storedValue);
    },

    recordPosition: function(playerX, playerY) {
        if (!this.recording) {
            return;
        }
        this.recordedData.push(playerX);
        this.recordedData.push(playerY);

        // TODO Debug - draw recorded line
//    var i = this.recordedData.length - 4;
//    this._drawLine(this.recordedData[i],this.recordedData[i+1],this.recordedData[i+2],this.recordedData[i+3]);
    },

    drawRecordedPath: function(recordedData) {
        var maxIndex = recordedData.length - 2;
        var indexIncrement = Game.SEEK_TARGET_FREQUENCY*2;
        var targetNumber = 1;
        for (var i=2; i<maxIndex; i=i+indexIncrement) {
            //this._drawLine(recordedData[i],recordedData[i+1],recordedData[i+2],recordedData[i+3]);
            //this._drawArrow(recordedData[i],recordedData[i+1],recordedData[i+2],recordedData[i+3]);
            //console.log("#", targetNumber++, ": target index=", i);
            this._drawPoint(recordedData[i],recordedData[i+1]);
        }
    },

    _drawLine: function(x1, y1, x2, y2) {
        var path = Crafty.e('Path');
        path.setPoints(x1, y1, x2, y2);
    },

    _drawArrow: function(x1, y1, x2, y2) {
        var path = Crafty.e('Arrow');
        path.setPoints(x1, y1, x2, y2);
    },

    _drawPoint: function(x, y) {
        var point = Crafty.e('Point');
        point.setPosition(x, y);
        point.setRadius(Game.SEEK_TARGET_RADIUS);
    },

    _cleanData: function(recordedData) {
        if (recordedData.length === 0) {
            return [];
        }
        var cleanedData = [];
        var recordedPoint = new Crafty.math.Vector2D(recordedData[0], recordedData[1]);
        var latestCleanPoint = recordedPoint.clone();
        cleanedData.push(recordedPoint.x); // player x start pos
        cleanedData.push(recordedPoint.y); // player y start pos
        for (var i=2; i<recordedData.length; i=i+2) {
            recordedPoint.setValues(recordedData[i], recordedData[i+1]);
            if (latestCleanPoint.distance(recordedPoint) > 30) {
                latestCleanPoint.setValues(recordedPoint);
                cleanedData.push(recordedPoint.x);
                cleanedData.push(recordedPoint.y);
            }
        }
        return cleanedData;
    }
};
