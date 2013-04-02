// TODO Fix memory leak problem
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },

  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
    } else {
      this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
      return this;
    }
  }
});

Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid');
  }
});

Crafty.c('Block', {
  init: function() {
    this.requires('Actor, Solid, spr_block');
  }
});

Crafty.c('WaypointHitBox', {
  init: function() {
    this.requires('Actor');
    this.z = -1;
    this.w = 10;
    this.h = 10;
  },

  attachToWaypoint: function(waypoint) {
    waypoint.attach(this);
    this.x = waypoint.x + 43;
    this.y = waypoint.y + 43;
  },

  reached: function() {
    // TODO play a sound to indicate a waypoint has been reached
    // TODO destroy this waypoint
    //this.destroy();
    //Crafty.audio.play('knock');
    Crafty.trigger('WaypointReached', this);
  }

});

Crafty.c('Waypoint', {
  init: function() {
    this.requires('Actor, spr_waypoint');
    this.z = -1;
    Crafty.e('WaypointHitBox').attachToWaypoint(this);
  }
});

Crafty.c('Navigator', {
  init: function() {
    this.requires('Actor, spr_navigator');
    this.z = 2;

    this.setWaypointPosition(100, 100);

    this.bind("EnterFrame", function() {
      this.x = Game.viewportWidth() - this.w - Crafty.viewport.x;
      this.y = Game.viewportHeight() - this.h - Crafty.viewport.y;
      this.origin(96/2, 96/2);
    });

    this.bind("PlayerMoved", function(playerPosition) {
      if (!this.waypointPosition) {
        this.rotation = 0;
      } else {
        // calculate angle between player and waypoint
        var deltaX = playerPosition.x - this.waypointPosition.x;
        var deltaY = playerPosition.y - this.waypointPosition.y;
        var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

        this.rotation = (angle - 90) % 360;
      }
    });
  },

  setWaypointPosition:function (x, y) {
    this.waypointPosition = {x: x, y: y};
  }

});

Crafty.c('ShowFPS', {
  init: function() {
    this.requires('2D, DOM, FPS, Text, Grid');
    this.attr({maxValues:10});

    this.bind("MessureFPS", function(fps){
      this.text("FPS: "+fps.value); //Display Current FPS
      //console.log(this.values); // Display last x Values
    });

    this.bind("EnterFrame", function() {
      this.x = -Crafty.viewport.x;
      this.y = -Crafty.viewport.y + 10;

      //console.log("ShowFPS:", "x", this.x, "y", this.y);
    });

  }
});

Crafty.c('Countdown', {
  init: function() {
    this.requires('2D, DOM, Text');
    var element = $("#countdown")[0];
    this.DOM(element);
    this.x = Game.viewportWidth() - 85;
    this.y = 5;
    this.complete = false;
    this.paused = false;

    this.startTime = Date.now();
    this.totalTime = 0;

    this.bind("EnterFrame", function() {
      if (this.complete || this.paused) {
        return;
      }
      var timeLeft = this._timeLeft();
      if (timeLeft <= 0) {
        this.complete = true;
        Crafty.trigger('TimesUp', this);
      } else {
        this._updateText(timeLeft);
      }
    });

    this.bind("Pause", function() {
      this.paused = true;
      this.totalTime = this._timeLeft();
    });

    this.bind("Unpause", function() {
      this.startTime = Date.now();
      this.paused = false;
    });

    this.bind('SceneEnding', function() {
      // Hack: We clear the _element here before the scene ends to avoid an error (and also prevent
      // our DOM element being removed)
      // Long Explanation:
      // When a scene ends, all the entities are removed, and removing an entity with a DOM component
      // results in the DOM component's undraw() method attempting to remove the _element from the stage via...
      //  <code>Crafty.stage.inner.removeChild(this._element);</code>
      // which causes a NotFoundError
      // In our case, since our DOM element is explicitly defined in the HTML and we are setting this
      // component's element via the DOM() method, the element has not been added to the stage, and in any case,
      // we don't want to remove the element when this component is removed
      this._element = null;
    });
  },

  _timeLeft:function() {
    var timeElapsed = Date.now() - this.startTime;
    return this.totalTime - timeElapsed;
  },

  _updateText:function(timeLeft) {
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
    this.text(secsPadding + secs + ":" + msecsPadding + msecs);
  },

  start:function(duration) {
    this.totalTime = duration;
    this.startTime = Date.now();
  }
});

Crafty.c('PauseControl', {
  init: function() {
    this.requires('2D, DOM, Keyboard, Text, Grid');
    this.paused = false;
    var element = $("#paused")[0];
    this.DOM(element);

    this.bind('KeyDown', function () {
      if (this.isDown('SPACE')) {
        this.togglePause();
      }
    });

    this.bind("EnterFrame", function() {
      if (this.paused) {
        // Actually pause the game only after PAUSED text has been rendered
        Crafty.pause();
      }
    });

    this.bind('SceneEnding', function() {
      // Hack: We clear the _element here before the scene ends to avoid an error (and also prevent
      // our DOM element being removed)
      // Long Explanation:
      // When a scene ends, all the entities are removed, and removing an entity with a DOM component
      // results in the DOM component's undraw() method attempting to remove the _element from the stage via...
      //  <code>Crafty.stage.inner.removeChild(this._element);</code>
      // which causes a NotFoundError
      // In our case, since our DOM element is explicitly defined in the HTML and we are setting this
      // component's element via the DOM() method, the element has not been added to the stage, and in any case,
      // we don't want to remove the element when this component is removed
      this._element = null;
    });

  },

  togglePause: function() {
    this.paused = !this.paused;
    if (this.paused) {
      Crafty.audio.mute();
      this.x = Game.width() / 8 - (40 * 6)/2;
      this.text('PAUSED');
      this.css("visibility", "visible");
    } else {
      this.css("visibility", "hidden");
      Crafty.audio.unmute();
      // Actually unpause the game
      Crafty.pause();
    }
  }

});

Crafty.c('Car', {
  init: function() {
    this.speed = 4;
    this.direction = -90;
    this.directionIncrement = 0;
    this.moving = false;
    this.movingStartTime = 0;
    this.movement = {};

    this.requires('Actor, Keyboard, Collision, spr_car, SpriteAnimation')
      .stopOnSolids()

    this.onHit('WaypointHitBox', this.waypointReached);

    this.bind('KeyDown', this._keyDown);

    this.bind('KeyUp', this._keyUp);

    this.bind("EnterFrame", this._enterFrame);

    // Init sprites
    var pos, spriteSheet;
    for (pos = 0; pos< 32; pos++) {
      spriteSheet = this.spriteSheetXY(pos);
      this.animate('Straight_'+pos,  spriteSheet.x, spriteSheet.y, spriteSheet.x)
      spriteSheet = this.spriteSheetXY(32 + pos);
      this.animate('TurnLeft_'+pos,  spriteSheet.x, spriteSheet.y, spriteSheet.x)
      spriteSheet = this.spriteSheetXY(64 + pos);
      this.animate('TurnRight_'+pos,  spriteSheet.x, spriteSheet.y, spriteSheet.x)
    }

  },

  _keyDown: function() {
      if (this.isDown('LEFT_ARROW')) {
        this.directionIncrement = -11.25;
      } else if (this.isDown('RIGHT_ARROW')) {
        this.directionIncrement = 11.25;
      }
      if (!this.moving && this.isDown('UP_ARROW')) {
        this.moving = true;
        this.movingStartTime = Date.now();
      }
  },

  _keyUp: function(e) {
    if(e.key == Crafty.keys['LEFT_ARROW']) {
      this.directionIncrement = 0;
    } else if (e.key == Crafty.keys['RIGHT_ARROW']) {
      this.directionIncrement = 0;
    } else if (e.key == Crafty.keys['UP_ARROW']) {
      this.moving = false;
    } else if (e.key == Crafty.keys['DOWN_ARROW']) {
    }
  },

  _enterFrame: function() {
    var spriteNumber = this.spriteNumberFor(this.direction);
    if (this.directionIncrement == 0) {
      this.animate('Straight_'+spriteNumber, 1, -1);
    } else if (this.directionIncrement > 0) {
      this.animate('TurnRight_'+spriteNumber, 1, -1);
    } else if (this.directionIncrement < 0) {
      this.animate('TurnLeft_'+spriteNumber, 1, -1);
    }

    if (this.moving) {
      this.speed = 4;
      if (this.directionIncrement == 0) {
        var timeMoving = Date.now() - this.movingStartTime;
        if (timeMoving < 500) {
          Game.playSoundEffect('engine_rev', 1.0);
        } else {
          Game.playSoundEffect('engine_rev_faster', 1.0);
          this.speed = 8;
        }
      } else {
        Game.playSoundEffect('wheel_spin', 1.0);
      }
    } else {
      Game.playSoundEffect('engine_idle', 0.3);
    }

    if (this.moving) {
      this.direction += this.directionIncrement;
      if (this.direction > 180) this.direction = -180 + 11.25;
      if (this.direction < -180) this.direction = 180 - 11.25;
      this.movement.x = Math.round(Math.cos(this.direction * (Math.PI / 180)) * 1000 * this.speed) / 1000;
      this.movement.y = Math.round(Math.sin(this.direction * (Math.PI / 180)) * 1000 * this.speed) / 1000;

      this.x += this.movement.x;
      this.y += this.movement.y;

      // TODO Use pre-calculated bounding box based on direction
      // TODO Determine why bounding box is not honoured
//          var boundingBox = this.boundingPolygon(this.direction, this.w, this.h);
//          this.collision(boundingBox);

      var bb = this.boundingPolygon(this.direction, this.w, this.h);
      var points = bb.points;

      this.map = bb;
      this.map.shift(this.x, this.y);

      // TODO Attempting to set _mbr to ensure bounding box is used unfortunately causes rending issues for the car for some unknown reason
//          this._mbr = {
//            _x: points[0][0], //minx,
//            _y: points[0][1], //miny,
//            _w: points[1][0] - points[0][0], //maxx - minx,
//            _h: points[2][1] - points[0][1] //maxy - miny
//          };

      //console.log("Player:", "x", this.x, "y", this.y);

      Crafty.viewport.scroll('_x', Crafty.viewport.width/2 - this.x - this.w/2);
      Crafty.viewport.scroll('_y', Crafty.viewport.height/2 - this.y - this.h/2);

      Crafty.trigger("PlayerMoved",{x:this.x, y:this.y});
    }
  },

  waypointReached: function(data) {
    //console.log("Waypoint reached");

    var waypoint = data[0].obj;
    waypoint.reached();
  },

  roundPoints: function(points) {
    return [Math.round(points[0]), Math.round(points[1])];
  },

  spriteSheetXY: function(pos) {
    var x = pos % 10,
        y = Math.floor(pos / 10);
    return {x: x, y: y};
  },

  spriteNumberFor: function(direction) {
    return ((direction / 11.25) + 24) % 32;  // -16 to +16
  },

  // Registers a stop-movement function to be called when
  //  this entity hits an entity with the "Solid" component
  stopOnSolids: function() {
    this.onHit('Solid', this.stopMovement);

    return this;
  },

  // Stops the movement
  stopMovement: function() {
    if (this.moving) {
      this.x -= this.movement.x;
      this.y -= this.movement.y;
    }
  },

  boundingPolygon: function(direction, w, h) {
//    var LEFT_PADDING = 40;
//    var TOP_PADDING = 40;
//    var RIGHT_PADDING = 40;
//    var BOTTOM_PADDING = 40;

    var LEFT_PADDING = 29;
    var TOP_PADDING = 10;
    var RIGHT_PADDING = 24;
    var BOTTOM_PADDING = 20;

    var DEG_TO_RAD = Math.PI / 180;
    var polygon = new Crafty.polygon(
      [LEFT_PADDING, TOP_PADDING],
      [w - RIGHT_PADDING, TOP_PADDING],
      [w - RIGHT_PADDING, h - BOTTOM_PADDING],
      [LEFT_PADDING, h - BOTTOM_PADDING]);

    var angle = this.convertToAngle(direction);
    var drad = angle * DEG_TO_RAD;

    var centerX = LEFT_PADDING + (w - LEFT_PADDING - RIGHT_PADDING)/2;
    var centerY = TOP_PADDING + (h - TOP_PADDING - BOTTOM_PADDING)/2;

    var e = {
      cos: Math.cos(drad),
      sin: Math.sin(drad),
      o: { x: centerX, y: centerY }
    }

    polygon.rotate(e);
    return polygon;
  },

  convertToAngle: function(direction) {
    return 360 - ((direction + 360 + 90) % 360);
  }
});