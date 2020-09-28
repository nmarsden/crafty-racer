require('../../lib/crafty_0.9.0');

Crafty.c('Exhaust', {

    init: function () {
        this.requires('Actor,Particles,Level');
        this.attr({ w: 12800, h: 6400, x:-6400, y:0, z:7000 });

        // Note: reusing exhaustPosition which is allocated only once to reduce GC
        this.exhaustPosition = new Crafty.math.Vector2D(0, 0);

        this.DIRECTION_VECTORS = {
            180: new Crafty.math.Vector2D(0, 44),
            167.3: new Crafty.math.Vector2D(9.63, 42.93),
            154.6: new Crafty.math.Vector2D(18.93, 39.72),
            141.9: new Crafty.math.Vector2D(27.08, 34.68),
            129.2: new Crafty.math.Vector2D(34.14, 27.76),
            116.6: new Crafty.math.Vector2D(39.3, 19.78),
            107.7: new Crafty.math.Vector2D(41.97, 13.22),
            98.8: new Crafty.math.Vector2D(43.5, 6.6),
            90: new Crafty.math.Vector2D(44, 0),
            83.4: new Crafty.math.Vector2D(43.73, -4.84),
            76.7: new Crafty.math.Vector2D(42.82, -10.12),
            70.1: new Crafty.math.Vector2D(41.38, -14.96),
            63.4: new Crafty.math.Vector2D(39.3, -19.78),
            47.5: new Crafty.math.Vector2D(32.34, -29.83),
            31.6: new Crafty.math.Vector2D(23.09, -37.46),
            15.7: new Crafty.math.Vector2D(11.94, -42.35),
            0: new Crafty.math.Vector2D(0, -44),
            344.1: new Crafty.math.Vector2D(-12.07, -42.31),
            328.2: new Crafty.math.Vector2D(-23.18, -37.4),
            312.3: new Crafty.math.Vector2D(-32.61, -29.54),
            296.6: new Crafty.math.Vector2D(-39.3, -19.78),
            289.9: new Crafty.math.Vector2D(-41.38, -14.96),
            283.2: new Crafty.math.Vector2D(-42.82, -10.12),
            276.5: new Crafty.math.Vector2D(-43.73, -4.84),
            270: new Crafty.math.Vector2D(-44, 0),
            261.1: new Crafty.math.Vector2D(-43.5, 6.6),
            252.2: new Crafty.math.Vector2D(-41.84, 13.62),
            243.4: new Crafty.math.Vector2D(-39.3, 19.78),
            230.7: new Crafty.math.Vector2D(-34.12, 27.78),
            218: new Crafty.math.Vector2D(-27.05, 34.71),
            205.3: new Crafty.math.Vector2D(-18.87, 39.75),
            192.6: new Crafty.math.Vector2D(-9.56, 42.95)
        };

        var options = {
            maxParticles: 50,
            size: 10,
            sizeRandom: 4,
            speed: 0.2,
            speedRandom: 0.2,
            // Lifespan in frames
            lifeSpan: 100,
            lifeSpanRandom: 7,
            // Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
            angle: 270,
            angleRandom: 10,
            startColour: [60, 60, 60, 1],
            startColourRandom: [5, 5, 5, 0],
            endColour: [60, 60, 60, 0],
            endColourRandom: [60, 60, 60, 0],
            // Only applies when fastMode is off, specifies how sharp the gradients are drawn
            sharpness: 20,
            sharpnessRandom: 10,
            // Random spread from origin
            spread: 1,
            // How many frames should this last
            duration: -1,
            // Will draw squares instead of circle gradients
            fastMode: false,
            gravity: {x: 0, y: -0.01},
            // sensible values are 0-3
            jitter: 1, //0
            originOffset: {x: 0, y: 0}
        }

        this.particles(options);

        // pre-calculate all exhaust direction vectors to reduce GC
//    this.CAR_ANGLES = [
//      -90.0,
//      -102.7,
//      -115.4,
//      -128.1,
//      -140.8,
//      -153.4,   // NW (5)
//      -162.3,
//      -171.2,
//      180.0,    // W (8)
//      173.4,
//      166.7,
//      160.1,
//      153.4,    // SW (12)
//      137.5,
//      121.6,
//      105.7,
//      90.0,     // S (16)
//      74.1,
//      58.2,
//      42.3,
//      26.6,     // SE (20)
//      19.9,
//      13.2,
//      6.5,
//      0.0,      // E (24)
//      -8.9,
//      -17.8,
//      -26.6,    // NE (27)
//      -39.3,
//      -52.0,
//      -64.7,
//      -77.4
//    ];
//
//    var len = this.CAR_ANGLES.length;
//    var directionVectors = "this.DIRECTION_VECTORS = {";
//    for (var i=0; i<len; i++) {
//      var carAngle = this.CAR_ANGLES[i];
//      var normalizedCarAngle = Math.round(((carAngle + 270.0) % 360.0) * 10) / 10;
//
//      var directionVector = new Crafty.math.Vector2D(
//        Math.cos(carAngle * (Math.PI / 180)),
//        Math.round(Math.sin(carAngle * (Math.PI / 180)) * 100) / 100
//      );
//      directionVector.scaleToMagnitude(44);
//      directionVector.negate();
//
//      directionVectors += normalizedCarAngle + ": new Crafty.math.Vector2D(";
//      directionVectors += (Math.round(directionVector.x * 100) / 100) + ", "
//      directionVectors += (Math.round(directionVector.y * 100) / 100) + ")";
//
//      if (i < len-1) {
//        directionVectors += ",\n";
//      }
//    }
//    directionVectors += "}";
//    console.log(directionVectors);

    },

    updatePosition: function (carX, carY, carAngle) {
        var normalizedCarAngle = Math.round(((carAngle + 270.0) % 360.0) * 10) / 10;
        var directionVector = this.DIRECTION_VECTORS[normalizedCarAngle];

        this.exhaustPosition.setValues(carX, carY);
        this.exhaustPosition.translate(46, 36);
        this.exhaustPosition.add(directionVector);

        this._Particles.originOffset = {x: 6400 + this.exhaustPosition.x, y: this.exhaustPosition.y};
    },

    updateAngle: function (carAngle) {
        this._Particles.angle = (carAngle + 270.0) % 360.0;
    },

    stop: function () {
        this._Particles.duration = 0;
    }
});
