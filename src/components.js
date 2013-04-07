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

Crafty.c('FlashingText', {
  init: function() {
    this.requires('Text');
    this.css({
      '-moz-animation-duration': '2s',
      '-webkit-animation-duration': '2s',
      '-moz-animation-name': 'flash',
      '-webkit-animation-name': 'flash',
      '-moz-animation-iteration-count': 'infinite',
      '-webkit-animation-iteration-count': 'infinite'
    });
  }
});

Crafty.c('TipText', {
  init: function() {
    this.requires('2D, DOM, Text');
    this.delay = 10;
    this.animating = false;
    this.startTime = Date.now();
    this.attr({ w: 320 })
    this.textFont({ type: 'normal', weight: 'bold', size: '20px', family: 'Arial' })
    this.textColor('#0061FF');

    var x = Crafty.viewport.width/2 - Crafty.viewport.x - 160;
    var y = Crafty.viewport.height/2 - Crafty.viewport.y;

    this.attr({ x: x, y: y - 100 });
    this.text("WOOHOO!");
    this.css({
      'transition-property': 'opacity, top',
      'transition-duration': '4s, 1s',
      'transition-timing-function': 'ease'
    });

    this.bind("EnterFrame", function() {
      var x = Crafty.viewport.width/2 - Crafty.viewport.x - 160;
      var y = Crafty.viewport.height/2 - Crafty.viewport.y;
      this.attr({ x: x, y: y - 100 });

      if (this.animating) {
        return;
      }
      var timeElapsed = Date.now() - this.startTime;
      if (timeElapsed > this.delay) {
        this.animating = true;
        this.css({ 'top': '-50px', 'opacity': '0.0' });
      }
    });
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
    Crafty.audio.play('woop');
    Crafty.e('TipText').setName("TipText");

    Crafty.trigger('WaypointReached', this);
  }

});

Crafty.c('Waypoint', {
  init: function() {
    this.requires('Actor, spr_waypoint, SpriteAnimation');
    this.z = 1000;

    this.animate('ChangeColour', 0, 0, 10); //setup animation
    this.animate('ChangeColour', 15, -1); // start animation

    // Uncomment to slowly rotate waypoint
    // ===================================
    /*
    this.origin(96/2, 96/2);

    this.bind("EnterFrame", function() {
      this.rotation = (this.rotation + 1) % 360;
    });
    */

    Crafty.e('WaypointHitBox').attachToWaypoint(this);
  }
});

Crafty.c('Navigator', {
  init: function() {
    this.requires('Actor, spr_navigator');
    this.z = 2;
    this.origin(96/2, 96/2);
    this.updatePosition();
    this.setWaypointPosition(100, 100);

    this.bind("PlayerMoved", function(playerPosition) {
      this.updatePosition();

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

  updatePosition: function() {
    this.x = Game.viewportWidth() - this.w - Crafty.viewport.x + 5;
    this.y = Game.viewportHeight() - this.h - Crafty.viewport.y + 5;
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
    this.textFont({ type: 'normal', weight: 'normal', size: '30px', family: 'Arial' });
    this.textColor('#FFFFFF');
    this.attr({ w: 100 });
    this._updatePosition();

    this.complete = false;
    this.paused = false;

    this.startTime = Date.now();
    this.totalTime = 0;

    this.bind("PlayerMoved", this._updatePosition);

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
  },

  _updatePosition:function () {
    var x = Crafty.viewport.width - Crafty.viewport.x - this.w; // - 5;
    var y = - Crafty.viewport.y + 105;
    this.attr({ x: x, y: y - 100 });
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

Crafty.c('LevelIndicator', {
  init: function() {
    this.requires('2D, DOM, Text');
    this.h = 30;
    this.w = 100;
    this.textFont({ type: 'normal', weight: 'bold', size: '20px', family: 'Arial' });
    this.css('text-align', 'left');
    this.textColor('#0061FF');
    this.text("LEVEL " + Game.getLevelNumber());
    this.updatePosition();

    this.bind("PlayerMoved", this.updatePosition);
  },

  updatePosition: function() {
    this.x = 10 - Crafty.viewport.x;
    this.y = Game.viewportHeight() - this.h - Crafty.viewport.y;
  }
});

Crafty.c('LevelCompleteControl', {
  init: function() {
    this.requires('2D, DOM, Text');
    this.showLoadingMessage = false;
    this.keyPressDelay = true;

    this.levelComplete = Crafty.e('2D, DOM, Text');
    this.levelComplete.text(Game.getLevelCompleteMessage)
    var x = Crafty.viewport.width/2 - Crafty.viewport.x - 160;
    var y = Crafty.viewport.height/2 - Crafty.viewport.y - 60;
    this.levelComplete.attr({ x: x, y: y, w: 320 })
    this.levelComplete.textFont({ type: 'normal', weight: 'bold', size: '50px', family: 'Arial' })
    this.levelComplete.textColor('#0061FF');

    this.pressAnyKey = Crafty.e('2D, DOM, FlashingText');
    this.pressAnyKey.attr({ x: x, y: y + 120, w: 320 })
    this.pressAnyKey.text("PRESS ANY KEY TO CONTINUE");
    this.pressAnyKey.textFont({ type: 'normal', weight: 'normal', size: '20px', family: 'Arial' })
    this.pressAnyKey.textColor('#0061FF');

    // After a short delay, watch for the player to press a key, then restart
    // the game when a key is pressed
    setTimeout(this.enableKeyPress.bind(this), 1000);

    this.bind('KeyDown', this.showLoading);

    this.bind('EnterFrame', this.restartGame);
  },

  enableKeyPress: function() {
    this.keyPressDelay = false;
  },

  enableRestart: function() {
    this.showLoadingMessage = true;
  },

  showLoading: function() {
    if (!this.keyPressDelay) {
      this.pressAnyKey.text("LOADING");
      this.levelComplete.text("");
      // Introduce delay to ensure Loading... text is rendered before next level or restart
      setTimeout(this.enableRestart.bind(this), 100);
    }
  },

  restartGame: function() {
    if (this.showLoadingMessage) {
      if (Game.isGameComplete()) {
        Game.resetLevels();
      } else {
        Game.nextLevel();
      }
      Crafty.scene('Game');
    }
  }

});

Crafty.c('GameOverControl', {
  init: function() {
    this.requires('2D, DOM, Text');
    this.showLoadingMessage = false;
    this.keyPressDelay = true;

    this.levelComplete = Crafty.e('2D, DOM, Text');
    this.levelComplete.text("TIMES UP");
    var x = Crafty.viewport.width/2 - Crafty.viewport.x - 160;
    var y = Crafty.viewport.height/2 - Crafty.viewport.y - 60;
    this.levelComplete.attr({ x: x, y: y, w: 320 })
    this.levelComplete.textFont({ type: 'normal', weight: 'bold', size: '30px', family: 'Arial' })
    this.levelComplete.textColor('#0061FF');

    this.gameOverText = Crafty.e('2D, DOM, Text');
    this.gameOverText.text('GAME OVER!')
    this.gameOverText.attr({ x: x, y: y + 40, w: 320 })
    this.gameOverText.textFont({ type: 'normal', weight: 'bold', size: '50px', family: 'Arial' })
    this.gameOverText.textColor('#0061FF');

    this.pressAnyKey = Crafty.e('2D, DOM, FlashingText');
    this.pressAnyKey.attr({ x: x, y: y + 120, w: 320 })
    this.pressAnyKey.text("PRESS ANY KEY TO CONTINUE");
    this.pressAnyKey.textFont({ type: 'normal', weight: 'normal', size: '20px', family: 'Arial' })
    this.pressAnyKey.textColor('#0061FF');

    // After a short delay, watch for the player to press a key, then restart
    // the game when a key is pressed
    setTimeout(this.enableKeyPress.bind(this), 1000);

    this.bind('KeyDown', this.showLoading);

    this.bind('EnterFrame', this.restartGame);
  },

  enableKeyPress: function() {
    this.keyPressDelay = false;
  },

  enableRestart: function() {
    this.showLoadingMessage = true;
  },

  showLoading: function() {
    if (!this.keyPressDelay) {
      this.levelComplete.text("");
      this.gameOverText.text("");
      this.pressAnyKey.text("LOADING");
      // Introduce delay to ensure Loading... text is rendered before next level or restart
      setTimeout(this.enableRestart.bind(this), 100);
    }
  },

  restartGame: function() {
    if (this.showLoadingMessage) {
      Crafty.scene('Game');
    }
  }

});

Crafty.c('PauseControl', {
  init: function() {
    this.requires('2D, DOM, Keyboard');
    this.paused = false;

    this.pauseText = Crafty.e('2D, DOM, Text');
    this.pauseText.attr({ w: 320 })
    this.pauseText.textFont({ type: 'normal', weight: 'normal', size: '60px', family: 'Arial' })
    this.pauseText.textColor('#0061FF');

    this.pressAnyKey = Crafty.e('2D, DOM, FlashingText');
    this.pressAnyKey.attr({ w: 320 })
    this.pressAnyKey.textFont({ type: 'normal', weight: 'normal', size: '20px', family: 'Arial' })
    this.pressAnyKey.textColor('#0061FF');

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

  },

  togglePause: function() {
    this.paused = !this.paused;
    if (this.paused) {
      Crafty.audio.mute();

      var x = Crafty.viewport.width/2 - Crafty.viewport.x - 160;
      var y = Crafty.viewport.height/2 - Crafty.viewport.y;

      this.pauseText.attr({ x: x, y: y - 100 });
      this.pauseText.text("PAUSED");

      this.pressAnyKey.attr({ x: x, y: y + 30 });
      this.pressAnyKey.text("PRESS SPACE TO CONTINUE");

    } else {
      this.pauseText.text("");
      this.pressAnyKey.text("");

      Crafty.audio.unmute();
      // Actually unpause the game
      Crafty.pause();
    }
  }

});

// TODO Fix bug where sometimes the car gets stuck when trying to move away from an obstacle which is behind the car.
// TODO  - possible solution 1: allow car to be reversed so that you can reverse away from the obstacle rather than trying to steer away
// TODO  - possible solution 2: change the logic in the stopMovement() function
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

    this.attr({z:1000});
    this.collision( new Crafty.polygon([35,15],[63,15],[63,68],[35,68]) );

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

      //set z-index
      var z = this._y;
      //console.log("Car:", "z", z);
      this.z = Math.floor(z);

      // TODO Use pre-calculated bounding box based on direction
      var boundingBox = this.boundingPolygon(this.direction, this.w, this.h);
      this.collision(boundingBox);

      //console.log("Player:", "x", this.x, "y", this.y);

      Crafty.viewport.scroll('_x', Crafty.viewport.width/2 - this.x - this.w/2);
      Crafty.viewport.scroll('_y', Crafty.viewport.height/2 - this.y - this.h/2);

      Crafty.trigger("PlayerMoved",{x:this.x, y:this.y});
    }

    //console.log("EnterFrame: player: x", this.x, "y", this.y, "z", this.z, "w", this.w, "h", this.h);

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
      //console.log("StopMovement called:", "x", this.x, "y", this.y);
      this.x -= this.movement.x;
      this.y -= this.movement.y;
    }
  },

  boundingPolygon: function(direction, w, h) {
    var LEFT_PADDING = 35;
    var TOP_PADDING = 15;
    var RIGHT_PADDING = 35;
    var BOTTOM_PADDING = 30;

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