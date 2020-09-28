require('../../lib/crafty_0.9.0');

import {VectorUtils} from "../utils";

Crafty.c('Arrow', {
    init: function () {
        this.requires('2D, Canvas');
        this.z = 7000;
        this.points = {x1: 0, y1: 0, x2: 0, y2: 0};
        this.xOffset = 50;
        this.yOffset = 50;
        this.arrowPoints = [{x: 0, y: 0}, {x: 0, y: 0}];

        this.bind("Draw", this._drawHandler);

        this.ready = true;
    },

    setPoints: function (x1, y1, x2, y2) {
        this.points.x1 = x1;
        this.points.y1 = y1;
        this.points.x2 = x2;
        this.points.y2 = y2;
        this.x = Math.min(x1, x2);
        this.y = Math.min(y1, y2);
        this.w = Math.abs(x1 - x2);
        this.h = Math.abs(y1 - y2);

        this.arrowPoints = this._calcArrowPoints(this.points);
    },

    _calcArrowPoints: function (linePoints) {
        var a = new Crafty.math.Vector2D(linePoints.x1, linePoints.y1);
        var b = new Crafty.math.Vector2D(linePoints.x2, linePoints.y2);
        var ab = b.clone().subtract(a);
        var c = ab.clone().scaleToMagnitude(20);
        var bc = b.clone().subtract(c);

        var arrowPoints = [];
        arrowPoints.push(VectorUtils.rotate(bc, b, 45));
        arrowPoints.push(VectorUtils.rotate(bc, b, -45));
        return arrowPoints;
    },

    _drawHandler: function (e) {
        this._drawLine(e.ctx);
    },

    _drawLine: function (ctx) {
        ctx.save();
        ctx.strokeStyle = "rgba(0,0,0,1.0)";
        ctx.beginPath();
        ctx.moveTo(this.xOffset + this.points.x1, this.yOffset + this.points.y1);
        ctx.lineTo(this.xOffset + this.points.x2, this.yOffset + this.points.y2);
        ctx.moveTo(this.xOffset + this.arrowPoints[0].x, this.yOffset + this.arrowPoints[0].y);
        ctx.lineTo(this.xOffset + this.points.x2, this.yOffset + this.points.y2);
        ctx.moveTo(this.xOffset + this.arrowPoints[1].x, this.yOffset + this.arrowPoints[1].y);
        ctx.lineTo(this.xOffset + this.points.x2, this.yOffset + this.points.y2);
        ctx.stroke();
        ctx.restore();
    }
});
