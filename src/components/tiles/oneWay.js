require('../../../lib/crafty_0.9.0');

Crafty.c('OneWay', {
    init: function () {
        this.oneWayDirections = {
            'NE': -26.6,
            'SE': 26.6,
            'SW': 153.4,
            'NW': -153.4
        };
        this.allowedDirection = null;
        this.addComponent("Collision")
//    this.z = Math.floor(this._y);
        this.z = Math.floor(this._y - 64 - 10);
        this.collision(new Crafty.polygon([0, 32, 64, 0, 128, 32, 64, 64]));
    },

    setOneWayType: function (type) {
        this.allowedDirection = this.oneWayDirections[type];
    },

    isDirectionAllowed: function (carDirection, isReversing) {
        if (isReversing) {
            return this.oppositeCarDirection(carDirection) == this.allowedDirection;
        } else {
            return carDirection == this.allowedDirection;
        }
    },

    oppositeCarDirection: function (carDirection) {
        // Note: carDirection: 0 is East, -90 is North, +90 is South, and -180/+180 is West
        return Math.round((((carDirection + 360) % 360 - 180)) * 10) / 10;
    }
});

Crafty.c('OneWayNE', {
    init: function () {
        this.requires('OneWay');
        this.setOneWayType('NE');
    }
});

Crafty.c('OneWaySE', {
    init: function () {
        this.requires('OneWay');
        this.setOneWayType('SE');
    }
});

Crafty.c('OneWaySW', {
    init: function () {
        this.requires('OneWay');
        this.setOneWayType('SW');
    }
});

Crafty.c('OneWayNW', {
    init: function () {
        this.requires('OneWay');
        this.setOneWayType('NW');
    }
});
