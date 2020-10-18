require('../../lib/crafty_0.9.0');

import {RecordUtils} from "../utils/index";
import {Game} from "../game";

Crafty.c('Car', {
    init: function () {
        this.directionIndex = 27;  // NE
        this.snappedDirectionIndex = this.directionIndex;
        this.DIRECTIONS = [
            {angle: -90.0, spriteNum: 16, snapLeftIndex: 0, snapRightIndex: 0},   // N (0)
            {angle: -102.7, spriteNum: 15, snapLeftIndex: 5, snapRightIndex: 0},
            {angle: -115.4, spriteNum: 14, snapLeftIndex: 5, snapRightIndex: 0},
            {angle: -128.1, spriteNum: 13, snapLeftIndex: 5, snapRightIndex: 0},
            {angle: -140.8, spriteNum: 12, snapLeftIndex: 5, snapRightIndex: 0},
            {angle: -153.4, spriteNum: 11, snapLeftIndex: 5, snapRightIndex: 5},   // NW (5)
            {angle: -162.3, spriteNum: 10, snapLeftIndex: 8, snapRightIndex: 5},
            {angle: -171.2, spriteNum: 9, snapLeftIndex: 8, snapRightIndex: 5},
            {angle: 180.0, spriteNum: 8, snapLeftIndex: 8, snapRightIndex: 8},   // W (8)
            {angle: 173.4, spriteNum: 7, snapLeftIndex: 12, snapRightIndex: 8},
            {angle: 166.7, spriteNum: 6, snapLeftIndex: 12, snapRightIndex: 8},
            {angle: 160.1, spriteNum: 5, snapLeftIndex: 12, snapRightIndex: 8},
            {angle: 153.4, spriteNum: 4, snapLeftIndex: 12, snapRightIndex: 12},  // SW (12)
            {angle: 137.5, spriteNum: 3, snapLeftIndex: 16, snapRightIndex: 12},
            {angle: 121.6, spriteNum: 2, snapLeftIndex: 16, snapRightIndex: 12},
            {angle: 105.7, spriteNum: 1, snapLeftIndex: 16, snapRightIndex: 12},
            {angle: 90.0, spriteNum: 0, snapLeftIndex: 16, snapRightIndex: 16},  // S (16)
            {angle: 74.1, spriteNum: 31, snapLeftIndex: 20, snapRightIndex: 16},
            {angle: 58.2, spriteNum: 30, snapLeftIndex: 20, snapRightIndex: 16},
            {angle: 42.3, spriteNum: 29, snapLeftIndex: 20, snapRightIndex: 16},
            {angle: 26.6, spriteNum: 28, snapLeftIndex: 20, snapRightIndex: 20},  // SE (20)
            {angle: 19.9, spriteNum: 27, snapLeftIndex: 24, snapRightIndex: 20},
            {angle: 13.2, spriteNum: 26, snapLeftIndex: 24, snapRightIndex: 20},
            {angle: 6.5, spriteNum: 25, snapLeftIndex: 24, snapRightIndex: 20},
            {angle: 0.0, spriteNum: 24, snapLeftIndex: 24, snapRightIndex: 24},  // E (24)
            {angle: -8.9, spriteNum: 23, snapLeftIndex: 27, snapRightIndex: 24},
            {angle: -17.8, spriteNum: 22, snapLeftIndex: 27, snapRightIndex: 24},
            {angle: -26.6, spriteNum: 21, snapLeftIndex: 27, snapRightIndex: 27},  // NE (27)
            {angle: -39.3, spriteNum: 20, snapLeftIndex: 0, snapRightIndex: 27},
            {angle: -52.0, spriteNum: 19, snapLeftIndex: 0, snapRightIndex: 27},
            {angle: -64.7, spriteNum: 18, snapLeftIndex: 0, snapRightIndex: 27},
            {angle: -77.4, spriteNum: 17, snapLeftIndex: 0, snapRightIndex: 27}
        ];

        this.BOUNDING_BOXES = [
            [[38, 18], [60, 18], [60, 65], [38, 65]],
            [[33, 21], [55, 16], [65, 62], [43, 67]],
            [[29, 25], [49, 16], [69, 58], [49, 67]],
            [[26, 30], [43, 16], [72, 53], [55, 67]],
            [[24, 35], [38, 18], [74, 48], [60, 65]],
            [[23, 41], [33, 21], [75, 42], [65, 62]],
            [[23, 45], [30, 24], [75, 38], [68, 59]],
            [[24, 49], [27, 27], [74, 34], [71, 56]],
            [[26, 53], [26, 31], [73, 31], [73, 53]],
            [[27, 55], [24, 33], [71, 28], [74, 50]],
            [[29, 58], [24, 36], [69, 25], [74, 47]],
            [[31, 60], [23, 39], [67, 23], [75, 44]],
            [[33, 62], [23, 42], [65, 21], [75, 41]],
            [[39, 65], [24, 49], [59, 18], [74, 34]],
            [[46, 67], [27, 56], [52, 16], [71, 27]],
            [[53, 67], [32, 61], [45, 16], [66, 22]],
            [[60, 65], [38, 65], [38, 18], [60, 18]],
            [[66, 61], [45, 67], [32, 22], [53, 16]],
            [[71, 56], [52, 67], [27, 27], [46, 16]],
            [[74, 49], [59, 65], [24, 34], [39, 18]],
            [[75, 42], [65, 62], [23, 41], [33, 21]],
            [[75, 39], [67, 60], [23, 44], [31, 23]],
            [[74, 36], [69, 58], [24, 47], [29, 25]],
            [[74, 33], [71, 55], [24, 50], [27, 28]],
            [[73, 31], [73, 53], [26, 52], [26, 30]],
            [[71, 27], [74, 49], [27, 56], [24, 34]],
            [[68, 24], [75, 45], [30, 59], [23, 38]],
            [[65, 21], [75, 41], [33, 62], [23, 42]],
            [[60, 18], [74, 35], [38, 65], [24, 48]],
            [[55, 16], [72, 30], [43, 67], [26, 53]],
            [[49, 16], [69, 25], [49, 67], [29, 58]],
            [[43, 16], [65, 21], [55, 67], [33, 62]]
        ];

        this.gamePadMapping = {
            'B': 'UP_ARROW',
            'A': 'DOWN_ARROW',
            'DPAD_LEFT': 'LEFT_ARROW',
            'DPAD_RIGHT': 'RIGHT_ARROW'
        };

        this.engineMagnitude = 1.1;
        this.frictionMagnitude = 0.8;
        this.TURN_DELAY = 40;
        this.turningStartTime = 0;
        this.enginePower = this.engineMagnitude;
        this.direction = -26.6;
        this.directionIncrement = 0;
        this.engineOn = false;
        this.movement = {};
        this.falling = false;
        this.spinning = false;
        this.fallDelay = 0;
        this.fallStepsDropping = 0;
        this.reversing = false;
        this.rightArrowDown = false;
        this.leftArrowDown = false;
        this.paused = false;
        this.playback = false;
        this.goingOneWay = false;
        this.velocity = new Crafty.math.Vector2D(0, 0);
        this.engineForce = new Crafty.math.Vector2D(0, 0);
        this.friction = new Crafty.math.Vector2D(0, 0);
        this.acceleration = new Crafty.math.Vector2D(0, 0);
        this.MAX_VELOCITY = 10;
        this.currentReelId = "";
        this.lastRecordedFrame = 0;
        this.seekTarget = {x: 0, y: 0};
        this.seekMode = false;
        this.seekEnginePower = this.engineMagnitude;
        this.playingSounds = [];
        this.revStartTime = 0;
        this.showExhaust = true;
        this.playerPosition = {x: 0, y: 0};
        // Note: re-using vectors to avoid memory allocation per frame
        this.seekTargetVars = {
            target: new Crafty.math.Vector2D(0, 0),
            position: new Crafty.math.Vector2D(0, 0),
            steeringForce: new Crafty.math.Vector2D(0, 0),
            newVelocity: new Crafty.math.Vector2D(0, 0)
        };
        // Note: re-using collisionPolygon to avoid memory allocation per frame
        this.collisionPolygon = new Crafty.polygon([35, 15, 63, 15, 63, 68, 35, 68]);

        this.fallingText = Crafty.e('TipText');
        this.fallingText.setName("FallingText");
        this.fallingText.text("UH OH!");

        this.RECORDABLE_METHODS = [
            this._upArrowPressed,
            this._upArrowReleased,
            this._downArrowPressed,
            this._downArrowReleased,
            this._leftArrowPressed,
            this._leftArrowReleased,
            this._rightArrowPressed,
            this._rightArrowReleased
        ];

        this.requires('Actor, Keyboard, Collision, spr_car, SpriteAnimation, Level');

        this.attr({z: 1000});
        this.collision(this.collisionPolygon);

        this.onHit('Solid', this.stopMovement);
        this.onHit('Oil', this.oilHit);
        this.onHit('NormalGround', this.normalGroundHit);
        this.onHit('IceGround', this.iceGroundHit);
        this.onHit('MudGround', this.mudGroundHit);
        this.onHit('BreakingGround', this.breakingGroundHit);
        this.onHit('OneWay', this.oneWayHit, this.oneWayFinished);
        this.onHit('Waypoint', this.waypointReached);

        this._bindKeyControls();
        this._bindGamePadControls();

        this.bind("EnterFrame", this._enterFrame);

        this.bind("PauseGame", this._pause);

        this.bind("UnpauseGame", this._unpause);

        // Init sprites
        var pos, spriteSheet;
        for (pos = 0; pos < 32; pos++) {
            spriteSheet = this.spriteSheetXY(pos);
            this.reel('Straight_' + pos, 1, spriteSheet.x, spriteSheet.y, 1);
            spriteSheet = this.spriteSheetXY(32 + pos);
            this.reel('TurnLeft_' + pos, 1, spriteSheet.x, spriteSheet.y, 1);
            spriteSheet = this.spriteSheetXY(64 + pos);
            this.reel('TurnRight_' + pos, 1, spriteSheet.x, spriteSheet.y, 1);
        }

        // Init exhaust
        this.exhaust = Crafty.e('Exhaust');

        // Generate all bounding polygons
//    var boundingBoxes = "[";
//    for (var dirIndex=0; dirIndex<this.DIRECTIONS.length; dirIndex++) {
//      var polygon = this.boundingPolygon(this.DIRECTIONS[dirIndex].angle, this.w, this.h);
//
//      var polyString = "[";
//      for (var i=0; i<polygon.points.length; i++) {
//        polyString += "[" + Math.round(polygon.points[i][0]) + ", " + Math.round(polygon.points[i][1]) + "]"
//        if (i < polygon.points.length-1) {
//          polyString += ", ";
//        }
//      }
//      polyString += "]";
//
//      boundingBoxes += polyString;
//      if (dirIndex<this.DIRECTIONS.length-1) {
//        boundingBoxes += ",\n";
//      }
//    }
//    boundingBoxes += "];";
//
//    console.log(boundingBoxes);

    },

    _polygonString: function (polygon) {
        var polyString = "[";
        for (var i = 0; i < polygon.points.length; i++) {
            polyString += "[" + Math.round(polygon.points[i][0]) + ", " + Math.round(polygon.points[i][1]) + "]"
            if (i < polygon.points.length - 1) {
                polyString += ", ";
            }
        }
        polyString += "]";
        return polyString;
    },

    _recordPlayerAction: function _recordPlayerAction() {
//    RecordUtils.recordValue(this.RECORDABLE_METHODS.indexOf(_recordPlayerAction.caller));
    },

    _upArrowPressed: function () {
        this._recordPlayerAction();
        if (!this.engineOn) {
            this.engineOn = true;
            this.reversing = false;
        }
    },

    _downArrowPressed: function () {
        this._recordPlayerAction();
        if (!this.engineOn) {
            this.engineOn = true;
            this.reversing = true;
        }
    },

    _leftArrowPressed: function () {
        this._recordPlayerAction();
        this.directionIncrement = (this.reversing ? +1 : -1);
        this.turningStartTime = Date.now();
    },

    _rightArrowPressed: function () {
        this._recordPlayerAction();
        this.directionIncrement = (this.reversing ? -1 : +1);
        this.turningStartTime = Date.now();
    },

    _leftArrowReleased: function () {
        this._recordPlayerAction();
        this.snappedDirectionIndex = (this.reversing ?
            this.DIRECTIONS[this.directionIndex].snapRightIndex :
            this.DIRECTIONS[this.directionIndex].snapLeftIndex);
        this.directionIncrement = 0;
    },

    _rightArrowReleased: function () {
        this._recordPlayerAction();
        this.snappedDirectionIndex = (this.reversing ?
            this.DIRECTIONS[this.directionIndex].snapLeftIndex :
            this.DIRECTIONS[this.directionIndex].snapRightIndex);
        this.directionIncrement = 0;
    },

    _upArrowReleased: function () {
        this._recordPlayerAction();
        this.engineOn = false;
    },

    _downArrowReleased: function () {
        this._recordPlayerAction();
        this.engineOn = false;
    },

    _keyDown: function () {
        if (this.paused || this.playback) {
            return;
        }
        if (this.isDown('UP_ARROW')) {
            this._upArrowPressed();
        }
        if (this.isDown('DOWN_ARROW')) {
            this._downArrowPressed();
        }
        if (this.isDown('LEFT_ARROW')) {
            this._leftArrowPressed();
        } else if (this.isDown('RIGHT_ARROW')) {
            this._rightArrowPressed();
        }
    },

    _keyUp: function (e) {
        if (this.paused || this.playback) {
            return;
        }
        if (e.key == Crafty.keys['LEFT_ARROW']) {
            this._leftArrowReleased();
        } else if (e.key == Crafty.keys['RIGHT_ARROW']) {
            this._rightArrowReleased();
        } else if (e.key == Crafty.keys['UP_ARROW']) {
            this._upArrowReleased();
        } else if (e.key == Crafty.keys['DOWN_ARROW']) {
            this._downArrowReleased();
        }
    },

    _bindKeyControls: function () {
        this.bind('KeyDown', this._keyDown);
        this.bind('KeyUp', this._keyUp);
    },

    _bindGamePadControls: function () {
        Game.gamePad.bind(Gamepad.Event.BUTTON_DOWN, this._gamePadButtonDown.bind(this));
        Game.gamePad.bind(Gamepad.Event.BUTTON_UP, this._gamePadButtonUp.bind(this));
        Game.gamePad.bind(Gamepad.Event.AXIS_CHANGED, this._gamePadAxisChanged.bind(this));
    },

    _gamePadButtonDown: function (e) {
        if (this.paused || this.playback) {
            return;
        }
        Game.dispatchKeyDown(this.gamePadMapping[e.control]);
    },

    _gamePadButtonUp: function (e) {
        if (this.paused || this.playback) {
            return;
        }
        Game.dispatchKeyUp(this.gamePadMapping[e.control]);
    },

    _gamePadAxisChanged: function (e) {
        if (this.paused || this.playback) {
            return;
        }
        if (e.axis === "LEFT_STICK_X") {
            if (e.value > 0.2) {
                this.rightArrowDown = true;
                Game.dispatchKeyDown('RIGHT_ARROW');
            } else if (e.value < -0.2) {
                this.leftArrowDown = true;
                Game.dispatchKeyDown('LEFT_ARROW');
            } else {
                if (this.rightArrowDown) {
                    this.rightArrowDown = false;
                    Game.dispatchKeyUp('RIGHT_ARROW');
                }
                if (this.leftArrowDown) {
                    this.leftArrowDown = false;
                    Game.dispatchKeyUp('LEFT_ARROW');
                }
            }
        }
    },

    _changeSprite: function () {
        var spriteNumber = this.DIRECTIONS[this.directionIndex].spriteNum;
        if (this.directionIncrement == 0) {
            this._animateIfNecessary('Straight_' + spriteNumber);
        } else if (this.directionIncrement > 0) {
            this._animateIfNecessary('TurnRight_' + spriteNumber);
        } else if (this.directionIncrement < 0) {
            this._animateIfNecessary('TurnLeft_' + spriteNumber);
        }
    },

    _animateIfNecessary: function (reelId) {
        if (this.currentReelId === reelId) {
            return;
        }
        this.currentReelId = reelId;
        this.animate(reelId, -1);
    },

    _adjustDirectionIndexForSnapToDirection: function () {
        if (this.falling || this.goingOneWay || this.spinning || this.seekMode) {
            return;
        }
        var timeTurning = Date.now() - this.turningStartTime;

        if (timeTurning > this.TURN_DELAY && this.directionIncrement === 0 && this.directionIndex != this.snappedDirectionIndex) {
            if (this.snappedDirectionIndex === 0 & this.directionIndex > 10) {
                this.directionIndex++;
            } else if (this.snappedDirectionIndex - this.directionIndex > 0) {
                this.directionIndex++;
            } else {
                this.directionIndex--;
            }
            if (this.directionIndex === this.DIRECTIONS.length) {
                this.directionIndex = 0;
            }
            this.turningStartTime = Date.now();
        }
    },

    _adjustEnginePowerAndChangeSoundEffect: function () {
        this._playSoundEffect('engine_idle', -1, 1.0);

        if (this.engineOn) {
            this.enginePower = this.reversing ? -this.engineMagnitude : this.engineMagnitude;
            this._stopSoundEffect('engine_slow_down');

            if (!this.playingSounds['engine_speed_up'].playing) {
                this.revStartTime = Date.now();
            }
            this._playSoundEffect('engine_speed_up', 1, 1.0);

            // play top speed after 1.5 secs of revving time (aka. speed up time)
            var revvingTime = Date.now() - this.revStartTime;
            if (revvingTime > 1500) {
                this._playSoundEffect('engine_top_speed', -1, 0.7);
            }

            if (this.directionIncrement == 0) {
                this._stopSoundEffect('wheel_spin');
            } else {
                this._playSoundEffect('wheel_spin', -1, 0.6);
            }

        } else {
            this.enginePower = 0.0;
            this._stopSoundEffect('wheel_spin');

            if (this.playingSounds['engine_speed_up'].playing) {
                this._playSoundEffect('engine_slow_down', 1, 1.0);
            }
            this._stopSoundEffect('engine_top_speed');
            this._stopSoundEffect('engine_speed_up');
        }
    },

    _playSoundEffect: function (soundName, repeat, volume) {
        if (!this.playingSounds[soundName].playing) {
            this.playingSounds[soundName].playing = true;
            Game.playSoundEffect(soundName, repeat, volume);
        }
    },

    _stopSoundEffect: function (sound) {
        if (this.playingSounds[sound].playing) {
            this.playingSounds[sound].playing = false;
            Game.stopSound(sound);
        }
    },

    _updateDirection: function () {
        if (this.falling || this.goingOneWay) {
            return;
        }

        var timeTurning = Date.now() - this.turningStartTime;
        if (this.spinning || (timeTurning > this.TURN_DELAY && this.velocity.magnitude() > 0.1)) {
            if (this.directionIncrement < 0) {
                this.directionIndex++;
            } else if (this.directionIncrement > 0) {
                this.directionIndex--;
            }
            if (this.directionIndex === this.DIRECTIONS.length) {
                this.directionIndex = 0;
            }
            if (this.directionIndex < 0) {
                this.directionIndex = this.DIRECTIONS.length - 1;
            }
            this.direction = this.DIRECTIONS[this.directionIndex].angle;

            this.turningStartTime = Date.now();
        }

        // update exhaust angle
        if (this.showExhaust) {
            this.exhaust.updateAngle(this.DIRECTIONS[this.directionIndex].angle);
        }
    },

//  _updateMovementToSeek: function(targetX, targetY) {
//    var target = new Crafty.math.Vector2D(targetX, targetY);
//    var position = new Crafty.math.Vector2D(this.x, this.y);
//    var desiredVelocity = target.subtract(position);
//    desiredVelocity.normalize();
//    // Calculating the desired velocity to target at max speed
//    desiredVelocity.scale(this.MAX_VELOCITY);
//
//    // Steering force = desired velocity - current velocity
//    var steeringForce = desiredVelocity.clone();
//    steeringForce.subtract(this.velocity);
//
//    // Apply the force to the car’s velocity
//    this.velocity.add(steeringForce);
//
//    this.movement.x = this.velocity.x;
//    this.movement.y = this.velocity.y;
//  },

//  _updateMovementToArrive: function(targetX, targetY) {
//    var target = new Crafty.math.Vector2D(targetX, targetY);
//    var position = new Crafty.math.Vector2D(this.x, this.y);
//    var desiredVelocity = target.subtract(position);
//
//    // The distance is the magnitude of the vector pointing from location to target.
//    var distance = desiredVelocity.magnitude();
//    desiredVelocity.normalize();
//    // If we are closer than 100 pixels...
//    if (distance < 100) {
//      // Set the magnitude according to how close we are.
//      var m = (distance / 100) * (this.MAX_VELOCITY*2);
//      desiredVelocity.scale(m);
//    } else {
//      // Otherwise, proceed at maximum speed.
//      desiredVelocity.scale(this.MAX_VELOCITY*2);
//    }
//    // Steering force = desired velocity - current velocity
//    var steeringForce = desiredVelocity.clone();
//    steeringForce.subtract(this.velocity);
//
//    // Apply the force to the car’s velocity
//    this.velocity.add(steeringForce);
//
//    this.movement.x = this.velocity.x;
//    this.movement.y = this.velocity.y;
//  },

    _adjustDirectionIncrementForSeekTarget: function () {
        var target = this.seekTargetVars.target.setValues(this.seekTarget.x, this.seekTarget.y);
        var position = this.seekTargetVars.position.setValues(this.x, this.y);
        var desiredVelocity = target.subtract(position);

        // The distance is the magnitude of the vector pointing from location to target.
        var distance = desiredVelocity.magnitude();
        desiredVelocity.normalize();
        // If we are closer than a certain number of pixels...
        if (distance < Game.SEEK_DISTANCE_BEFORE_SLOW_DOWN) {
            // Set the magnitude according to how close we are.
            var m = (distance / 100) * (Game.SEEK_MAX_VELOCITY);
            desiredVelocity.scale(m);
        } else {
            // Otherwise, proceed at maximum speed.
            desiredVelocity.scale(Game.SEEK_MAX_VELOCITY);
        }

        // Steering force = desired velocity - current velocity
        var steeringForce = this.seekTargetVars.steeringForce.setValues(desiredVelocity.x, desiredVelocity.y);
        steeringForce.subtract(this.velocity);

        // New velocity = current velocity + steering force
        var newVelocity = this.seekTargetVars.newVelocity.setValues(this.velocity.x, this.velocity.y);
        newVelocity.add(steeringForce);

        // Determine angle between current and new velocity
        var angleBetween = Crafty.math.radToDeg(this.velocity.angleBetween(newVelocity));

        if (angleBetween > Game.SEEK_ANGLE) {
            this.directionIncrement = +1;
        } else if (angleBetween < -Game.SEEK_ANGLE) {
            this.directionIncrement = -1;
        } else {
            this.directionIncrement = 0;
        }

        // Adjust seek engine power according to distance from target
        this.seekEnginePower = desiredVelocity.magnitude();
    },

    _finishSeeking: function () {
        // TODO remove logging
        //console.log("Seek target reached!");
        this.seekMode = false;
        Crafty.trigger("SeekTargetReached");
    },

    _isSeekTargetReached: function () {
        var target = this.seekTargetVars.target.setValues(this.seekTarget.x, this.seekTarget.y);
        var position = this.seekTargetVars.position.setValues(this.x, this.y);
        var distanceVector = target.subtract(position);
        var distance = distanceVector.magnitude();
        return (distance < Game.SEEK_TARGET_RADIUS);
    },

    _startFalling: function () {
        Crafty.trigger("CarFallingStarted");
        // stop all car sounds except slow down & idle
        this._stopSoundEffect('wheel_spin');
        this._stopSoundEffect('engine_speed_up');
        this._stopSoundEffect('engine_top_speed');
        // play car horn sound
        Game.playSoundEffect('car_horn', 1, 1.0);
        // show falling text
        this.fallingText.show();
        // start falling mode
        this.fallDelay = 40;
        this.falling = true;
    },

    _handleFalling: function () {
        if (this.fallStepsDropping > 0) {
            this.fallStepsDropping--;
            if (this.fallStepsDropping === 0) {
                // Game over - off the edge
                Crafty.trigger('OffTheEdge', this);
            }
            // Animate dropping
            this.movement.x = 0;
            this.movement.y = 20;
            this.x += this.movement.x;
            this.y += this.movement.y;
            return;
        }

        // Wait until fall delay is complete before starting to drop
        if (this.fallDelay < 0) {
            // Start dropping
            // -play falling sound
            Game.playSoundEffect('falling', 1, 1.0);
            // -adjust z otherwise the car sometimes drops through the floor
            this.z -= 50;
            // -stop exhaust
            if (this.showExhaust) {
                this.exhaust.stop();
            }
            // -setup dropping movement
            this.fallStepsDropping = 40;
        } else {
            // Reduce fall delay
            this.fallDelay--;
        }
    },

    _updateMovement: function () {
        // going one-way or spinning means enginePower cannot be zero

        var enginePower = this.goingOneWay ? (this.reversing ? -this.engineMagnitude : this.engineMagnitude) : this.enginePower;
        enginePower = this.spinning ? this.spinningEnginePower : enginePower;
        enginePower = this.seekMode ? this.seekEnginePower : enginePower;

        var maxVelocity = this.seekMode ? Game.SEEK_MAX_VELOCITY : this.MAX_VELOCITY;

        var directionIndex = this.spinning ? this.spinningDirectionIndex : this.directionIndex;

        var carAngleInRadians = this.DIRECTIONS[directionIndex].angle * (Math.PI / 180);

        if (enginePower == 0.0 && this.velocity.magnitude() < 0.5) {
            // force car to stop
            this.velocity.setValues(0.0, 0.0);

        } else {

            this.engineForce.setValues(
                Math.cos(carAngleInRadians) * enginePower,
                Math.sin(carAngleInRadians) * enginePower
            );

            this.friction.setValues(this.velocity);
            this.friction.normalize();
            this.friction.negate();
            this.friction.x = (isNaN(this.friction.x) ? 0.0 : Math.round(this.friction.x * 100) / 100);
            this.friction.y = (isNaN(this.friction.y) ? 0.0 : Math.round(this.friction.y * 100) / 100);
            this.friction.scale(this.frictionMagnitude);

            this.acceleration.setValues(0.0, 0.0);
            this.acceleration.add(this.engineForce);
            this.acceleration.add(this.friction);

            this.velocity.add(this.acceleration);
        }

        // Limit max velocity
        if (this.velocity.magnitude() > maxVelocity) {
            this.velocity.scaleToMagnitude(maxVelocity);
        }

        this.movement.x = this.velocity.x;
        this.movement.y = this.velocity.y;
    },

    _updatePosition: function () {
        this.x += this.movement.x;
        this.y += this.movement.y;

        //set z-index
        var z = this._y;
        //console.log("Car:", "z", z);
        this.z = Math.floor(z);

        // update exhaust position
        if (this.showExhaust) {
            this.exhaust.updatePosition(this.x, this.y, this.DIRECTIONS[this.directionIndex].angle);
        }
    },

    _updateCollisionBoundingBox: function () {
        var bb = this.BOUNDING_BOXES[this.directionIndex];
        var len = bb.length;
        for (var i = 0, j=0; i < len; i++, j=j+2) {
            this.collisionPolygon.points[j]   = bb[i][0];
            this.collisionPolygon.points[j+1] = bb[i][1];
        }
        this.collision(this.collisionPolygon);
    },

    _updateViewportWithPlayerInCenter: function () {
        Game.scrollXYViewport(((Crafty.viewport.width / Crafty.viewport._scale) / 2 - this.x - this.w / 2), ((Crafty.viewport.height / Crafty.viewport._scale) / 2 - this.y - this.h / 2));
    },

    _triggerPlayerMoved: function () {
        this.playerPosition.x = this.x;
        this.playerPosition.y = this.y;
        Crafty.trigger("PlayerMoved", this.playerPosition);
    },

    _enterFrame: function () {
        if (this.paused) {
            return;
        }

        if (this.seekMode) {
            if (this._isSeekTargetReached()) {
                this._finishSeeking();
                return;
            }
            this._adjustDirectionIncrementForSeekTarget();
        }

        if (!this.falling && !this.hit("Ground")) {
            this._startFalling();
        }

        if (this.falling) {
            this._handleFalling();
            return;
        }

        if (RecordUtils.isRecording()) {
            var RECORDING_RATE = 10;
            var frameDelta = (this.lastRecordedFrame === 0) ? RECORDING_RATE : (Crafty.frame() - this.lastRecordedFrame);
            if (frameDelta === RECORDING_RATE) {
                RecordUtils.recordPosition(Math.round(this.x), Math.round(this.y));
                this.lastRecordedFrame = Crafty.frame();
            }
        }

        if (this.spinning) {
            if (this.spinningSteps > 0) {
                // force turning
                this.spinningSteps--;
                this.directionIncrement = +1;
            }
            if (this.spinningSteps === 0) {
                // finish turning
                this.directionIncrement = 0;
                this.spinning = false;
            }
        }

        this._changeSprite();
        this._adjustDirectionIndexForSnapToDirection();
        this._adjustEnginePowerAndChangeSoundEffect();

        this._updateDirection();
        this._updateMovement();
        this._updatePosition();
        this._updateCollisionBoundingBox();
        //console.log("Player:", "x", this.x, "y", this.y);
        this._updateViewportWithPlayerInCenter();
        this._triggerPlayerMoved();
        //console.log("EnterFrame: player: x", this.x, "y", this.y, "z", this.z, "w", this.w, "h", this.h);
    },

    _pause: function () {
        this.paused = true;
        // destroy exhaust
        if (this.showExhaust) {
            this._destroyExhaust();
        }
    },

    _unpause: function () {
        this.paused = false;
        // recreate exhaust
        if (this.showExhaust) {
            this._createExhaust();
        }
    },

    _createExhaust: function () {
        this.exhaust = Crafty.e('Exhaust');
        this.exhaust.updateAngle(this.DIRECTIONS[this.directionIndex].angle);
        this.exhaust.updatePosition(this.x, this.y, this.DIRECTIONS[this.directionIndex].angle);
    },

    _destroyExhaust: function () {
        this.exhaust.destroy();
    },

    _initSounds: function () {
        this.playingSounds["engine_idle"] = {playing: false};
        this.playingSounds["engine_speed_up"] = {playing: false};
        this.playingSounds["engine_top_speed"] = {playing: false};
        this.playingSounds["engine_slow_down"] = {playing: false};
        this.playingSounds["wheel_spin"] = {playing: false};
    },

    setPosition: function (x, y) {
        this.falling = false;
        this.spinning = false;
        this.seekMode = false;
        this.goingOneWay = false;
        this.engineOn = false;
        this.enginePower = 0.0;
        this.velocity = new Crafty.math.Vector2D(0, 0);
        this.directionIncrement = 0;
        this.directionIndex = 27;  // NE
        this.snappedDirectionIndex = this.directionIndex;
        this.lastRecordedFrame = 0;
        this.x = x;
        this.y = y;
        this.z = Math.floor(y);
        this._initSounds();
        this._updateViewportWithPlayerInCenter();
        this._triggerPlayerMoved();
        // set exhaust
        if (this.showExhaust) {
            this.exhaust.updateAngle(this.DIRECTIONS[this.directionIndex].angle);
            this.exhaust.updatePosition(this.x, this.y, this.DIRECTIONS[this.directionIndex].angle);
        }
    },

    setShowExhaust: function (isShowExhaust) {
        if (isShowExhaust === this.showExhaust) {
            return; // no change, do nothing!
        }
        if (isShowExhaust) {
            this._createExhaust();
        } else {
            this._destroyExhaust();
        }
        this.showExhaust = isShowExhaust;
    },

    seek: function (targetX, targetY) {
        this.seekTarget.x = targetX;
        this.seekTarget.y = targetY;
        this.engineOn = true;
        this.seekMode = true;
    },

    setPlaybackMode: function () {
        this.playback = true;
    },

    playbackStoredValue: function (storedValue) {
        this.RECORDABLE_METHODS[storedValue].call(this);
    },

    waypointReached: function (data) {
        if (this.falling) {
            return;
        }
        //console.log("Waypoint reached");
        var waypoint = data[0].obj;
        waypoint.reached();
    },

    spriteSheetXY: function (pos) {
        var x = pos % 10,
            y = Math.floor(pos / 10);
        return {x: x, y: y};
    },

    stopMovement: function (hitData) {
        if (this.falling) {
            return;
        }
        // undo previous movement
        if (this.engineOn) {
            this.x -= this.movement.x;
            this.y -= this.movement.y;
        }
        // set velocity to zero
        this.velocity.setValues(0.0, 0.0);

        // move away from obstacle
        // Note: not exactly sure what 'normal' is, but adding it x and y seems to avoid the car getting stuck :-)
        var hd = hitData[0];
        this.x += hd.nx;
        this.y += hd.ny;
    },

    oilHit: function (hitData) {
        if (this.falling || this.spinning) {
            return;
        }
        this.spinning = true;
        this.spinningEnginePower = (this.reversing ? -this.engineMagnitude : this.engineMagnitude);
        this.spinningDirectionIndex = this.directionIndex;
        this.spinningSteps = 100;
    },

    normalGroundHit: function (hitData) {
        if (this.falling) {
            return;
        }
        this.frictionMagnitude = 0.3;
        this.engineMagnitude = 1.1;
    },

    iceGroundHit: function (hitData) {
        if (this.falling) {
            return;
        }
        this.frictionMagnitude = 0.05;
        this.engineMagnitude = 0.2;
    },

    mudGroundHit: function (hitData) {
        if (this.falling) {
            return;
        }
        this.frictionMagnitude = 0.9;
        this.engineMagnitude = 0.5;
    },

    breakingGroundHit: function (hitData) {
        if (this.falling) {
            return;
        }
        this.frictionMagnitude = 0.3;
        this.engineMagnitude = 1.1;
        hitData.forEach(function (hd) {
            var breakingGround = hd.obj;
            breakingGround.startBreaking();
        });
    },

    oneWayHit: function (hitData) {
        if (this.goingOneWay) {
            return;
        }
        var hd = hitData[0];
        if (hd.obj.isDirectionAllowed(this.direction, this.reversing)) {
            this.goingOneWay = true;
        } else {
            this.stopMovement(hitData);
        }
    },

    oneWayFinished: function () {
        if (this.goingOneWay) {
            this.goingOneWay = false;
        }
    },

//  boundingPolygon: function(direction, w, h) {
//    var LEFT_PADDING = 38;
//    var TOP_PADDING = 18;
//    var RIGHT_PADDING = 38;
//    var BOTTOM_PADDING = 33;
//
//    var DEG_TO_RAD = Math.PI / 180;
//    var polygon = new Crafty.polygon(
//      [LEFT_PADDING, TOP_PADDING],
//      [w - RIGHT_PADDING, TOP_PADDING],
//      [w - RIGHT_PADDING, h - BOTTOM_PADDING],
//      [LEFT_PADDING, h - BOTTOM_PADDING]);
//
//    var angle = this.convertToAngle(direction);
//    var drad = angle * DEG_TO_RAD;
//
//    var centerX = LEFT_PADDING + (w - LEFT_PADDING - RIGHT_PADDING)/2;
//    var centerY = TOP_PADDING + (h - TOP_PADDING - BOTTOM_PADDING)/2;
//
//    var e = {
//      cos: Math.cos(drad),
//      sin: Math.sin(drad),
//      o: { x: centerX, y: centerY }
//    }
//
//    polygon.rotate(e);
//    return polygon;
//  },

    convertToAngle: function (direction) {
        return 360 - ((direction + 360 + 90) % 360);
    }
});
