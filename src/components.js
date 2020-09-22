// TODO Fix memory leak problem

import { Game, RecordUtils, VectorUtils, Debug } from './game';
import { Editor } from './editor';

export let setupComponents = () => {

  Crafty.c('OutlineText', {
    init: function () {
      this.requires('UILayer, 2D, DOM, Text');
      this.css({'text-shadow': '1px 0 0 #000000, 0 -1px 0 #000000, 0 1px 0 #000000, -1px 0 0 #000000'})
      this.textAlign('center');
    }
  });

  Crafty.c('FlashingText', {
    init: function () {
      this.requires('OutlineText');
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

  Crafty.c('LoadingText', {
    init: function () {
      this.requires('FlashingText');
      this.text('LOADING')
          .textFont({type: 'normal', weight: 'normal', size: '30px', family: 'ARCADE'})
          .textColor('#0061FF')
          .attr({w: 320});
      this._updatePosition();

      this.bind("ViewportChanged", this._updatePosition.bind(this));
    },

    _updatePosition: function () {
      this.attr({x: Crafty.viewport.width / 2 - 160, y: Crafty.viewport.height / 2 - 15});
    },
  });

  Crafty.c('TipText', {
    init: function () {
      this.requires('OutlineText, Tween');
      this.delay = 500;
      this.animating = false;
      this.startTime = null;
      this.totalShowDuration = 2000;
      this.visible = false;
      this.alphaZero = {alpha: 0.0};

      this.attr({w: 320})
      this.textFont({type: 'normal', weight: 'normal', size: '30px', family: 'ARCADE'})
      this.textColor('#0061FF', 1.0);

      this._updatePosition();

      this.bind("ViewportChanged", this._updatePosition.bind(this));
    },

    show: function () {
      this.startTime = Date.now();
      this.animating = false;
      this.alpha = 1.0;
      this.bind("EnterFrame", this._enterFrameHandler.bind(this));
    },

    _updatePosition: function () {
      this.attr({x: Crafty.viewport.width / 2 - 160, y: Crafty.viewport.height / 2 - 100});
    },

    _enterFrameHandler: function () {
      var timeElapsed = Date.now() - this.startTime;
      if (timeElapsed > this.totalShowDuration) {
        this.visible = false;
        this.unbind("EnterFrame", this._enterFrameHandler);
        return;
      }

      if (!this.visible) {
        this.visible = true;
      }

      if (!this.animating && timeElapsed > this.delay) {
        this.animating = true;
        this.tween(this.alphaZero, 1000);
      }
    }
  });

  Crafty.c('Actor', {
    init: function () {
      this.requires('2D, Canvas');
    }
  });

  Crafty.c('Waypoint', {
    init: function () {
      this.requires('Actor, spr_waypoint, SpriteAnimation, Collision, Level');
      this.collision(new Crafty.polygon([32, 0, 64, 16, 64, 48, 32, 64, 0, 48, 0, 16]));

      this.waypointPosition = {x: 0, y: 0};

      this.reel('ChangeColour', 1000, 4, 0, 2);
      this.animate('ChangeColour', -1);
      this.isReached = false;

      this.waypointReachedText = Crafty.e('TipText');
      this.waypointReachedText.setName("WaypointReachedText");
      this.waypointReachedText.text("WOOHOO!");
    },

    setPosition: function (x, y) {
      this.isReached = false;
      this.x = x;
      this.y = y;
      this.z = Math.floor(y);

      this.waypointPosition.x = this.x;
      this.waypointPosition.y = this.y;

      Crafty.trigger("WaypointMoved", this.waypointPosition);
    },

    reached: function () {
      if (this.isReached) {
        return;
      }
      this.isReached = true;
      Game.playSoundEffect('woop', 1, 1.0);
      this.waypointReachedText.show();

      Crafty.trigger('WaypointReached', this);
    }
  });

  Crafty.c('Diamond', {
    init: function () {
      this.requires('2D, Canvas, Level');
      this.z = 7000;
      this.w = 200;
      this.h = 100;

      this.bind("Draw", function (e) {
        this.drawHandler(e);
      }.bind(this));

      this.ready = true;
    },

    drawHandler: function (e) {
      this.drawDiamond(e.ctx, this.x, this.y);
    },

    drawDiamond: function (ctx, offsetX, offsetY) {
      ctx.save();
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.beginPath();
      ctx.moveTo(offsetX + this.w / 2 - 1, offsetY - 1);
      ctx.lineTo(offsetX + this.w, offsetY + this.h / 2 - 1);
      ctx.lineTo(offsetX + this.w / 2 - 1, offsetY + this.h);
      ctx.lineTo(offsetX - 1, offsetY + this.h / 2 - 1);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

  });

  Crafty.c('MiniMapMarker', {
    init: function () {
      this.requires('2D, Canvas, Level');
      this.z = 7000;
      this.w = 200;
      this.h = 100;
      this.miniMapPosition = {x: 0, y: 0};
      this.colour = "#000000";

      this.bind("Draw", function (e) {
        this.drawHandler(e);
      }.bind(this));

      this.ready = true;
    },

    setColour: function (colour) {
      this.colour = colour;
    },

    setOffset: function (offsetX, offsetY) {
      this.x = offsetX;
      this.y = offsetY;
    },

    setPosition: function (position) {
      this.miniMapPosition.x = position ? Math.round(((6200 + position.x) / Game.width()) * 200) : 0;
      this.miniMapPosition.y = position ? Math.round((position.y / Game.height()) * 100) : 0;
    },

    drawHandler: function (e) {
      this.drawMarker(e.ctx);
    },

    drawMarker: function (ctx) {
      ctx.save();
      ctx.strokeStyle = this.colour;
      ctx.beginPath();
      ctx.moveTo(this.miniMapPosition.x + this.x - 1, this.miniMapPosition.y + this.y);
      ctx.lineTo(this.miniMapPosition.x + this.x + 2, this.miniMapPosition.y + this.y);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

  });

  Crafty.c('MiniMapViewport', {
    init: function () {
      this.requires('2D, Canvas, Level');
      this.z = 7000;
      this.w = 200;
      this.h = 100;
      this.miniMapPosition = {x: 0, y: 0};

      this.bind("Draw", function (e) {
        this.drawHandler(e);
      }.bind(this));

      this.ready = true;
    },

    setOffset: function (offsetX, offsetY) {
      this.x = offsetX;
      this.y = offsetY;
    },

    setPosition: function (position) {
      this.miniMapPosition.x = position ? Math.round(((6200 + position.x) / Game.width()) * 200) : 0;
      this.miniMapPosition.y = position ? Math.round((position.y / Game.height()) * 100) : 0;
    },

    drawHandler: function (e) {
      this.drawViewport(e.ctx);
    },

    drawViewport: function (ctx) {
      ctx.save();
      ctx.strokeStyle = "rgba(255,0,0,0.2)";
      ctx.stroke
      ctx.beginPath();
      ctx.moveTo(this.miniMapPosition.x + this.x - 8, this.miniMapPosition.y + this.y - 5);
      ctx.lineTo(this.miniMapPosition.x + this.x + 8, this.miniMapPosition.y + this.y - 5);
      ctx.lineTo(this.miniMapPosition.x + this.x + 8, this.miniMapPosition.y + this.y + 5);
      ctx.lineTo(this.miniMapPosition.x + this.x - 8, this.miniMapPosition.y + this.y + 5);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

  });

  Crafty.c('MiniMap', {
    init: function () {
      this.requires('2D, Canvas, Level');
      this.z = 7000;
      this.w = 220;
      this.h = 110;
      this.ready = true;

      this.diamond = Crafty.e("Diamond");
      this.diamond.setName("Diamond");

      this.waypointMarker = Crafty.e("MiniMapMarker");
      this.waypointMarker.setName("MiniMapMarker");
      this.waypointMarker.setColour("#000000");

      this.playerMarker = Crafty.e("MiniMapMarker");
      this.playerMarker.setName("MiniMapMarker");
      this.playerMarker.setColour("#FF0000");

      this.viewportOutline = Crafty.e("MiniMapViewport");
      this.viewportOutline.setName("MiniMapViewport");

      this.bind("PlayerMoved", this._playerMovedHandler.bind(this));

      this.bind("WaypointMoved", this._waypointMovedHandler.bind(this));
    },

    _playerMovedHandler: function (playerPosition) {
      this.x = Crafty.viewport.width - Crafty.viewport.x - this.w + 5;
      this.y = -Crafty.viewport.y;

      var offsetX = this.x + 10;
      var offsetY = this.y + 5;

      this.diamond.x = offsetX;
      this.diamond.y = offsetY;

      this.playerMarker.setPosition(playerPosition);
      this.playerMarker.setOffset(offsetX, offsetY);

      this.waypointMarker.setOffset(offsetX, offsetY);

      this.viewportOutline.setPosition(playerPosition);
      this.viewportOutline.setOffset(offsetX, offsetY);
    },

    _waypointMovedHandler: function (waypointPosition) {
      this.x = Crafty.viewport.width - Crafty.viewport.x - this.w - 5;
      this.y = (-Crafty.viewport.y + 5);

      var offsetX = this.x + 10;
      var offsetY = this.y + 5;

      this.waypointMarker.setPosition(waypointPosition);
      this.waypointMarker.setOffset(offsetX, offsetY);
    }

  });

  Crafty.c('WaypointIndicator', {
    init: function () {
      this.requires('UILayer, 2D, DOM, spr_waypoint_indicator, SpriteAnimation');
      this.w = 11;
      this.h = 11;

      this.reel('Collected', 1, 0, 0, 1);
      this.reel('NotFound', 1000, 1, 0, 1);

      this.notFound();
    },

    collected: function () {
      this.animate('Collected', -1);
    },

    notFound: function () {
      this.animate('NotFound', -1);
    }

  });

  Crafty.c('WaypointsCollectedIndicator', {
    init: function () {
      this.requires('UILayer, 2D, DOM, Level');
      this.size = 11;
      this.x = 10;
      this.y = 48;
      this.w = 10 * (this.size + 2);
      this.h = this.size;
      this.numberCollected = 0;

      this.waypointIndicators = this._createWaypointIndicators();

      this.bind('WaypointReached', function () {
        this.waypointIndicators[this.numberCollected].collected();
        this.numberCollected++;
      });
    },

    resetNumberCollected: function () {
      this.numberCollected = 0;
      for (var i = 0; i < 10; i++) {
        this.waypointIndicators[i].notFound();
      }
    },

    _createWaypointIndicators: function () {
      var wps = [], i = 0, wp, x = this.x;
      for (; i < 10; i++) {
        wp = Crafty.e('WaypointIndicator');
        wp.setName('WaypointIndicator');
        wp.attr({x: x, y: this.y});
        wps.push(wp);

        this.attach(wp);
        x += (this.size + 2);
      }
      return wps;
    }

  });

  Crafty.c('Navigator', {
    init: function () {
      this.requires('Actor, spr_navigator, Level');
      this.z = 7000;
      this.w = 100;
      this.h = 100;
      this.origin(this.w / 2, this.h / 2);
      this._updatePosition();

      this.bind("WaypointMoved", function (waypointPosition) {
        this.waypointPosition = waypointPosition;
      });

      this.bind("PlayerMoved", function (playerPosition) {
        this._updatePosition();

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

    _updatePosition: function() {
      this.x = -Crafty.viewport.x + Crafty.viewport.width - (this.w/2) - 105;
      this.y = -Crafty.viewport.y - (this.h/2) + 55;
    }
  });

  Crafty.c('TouchControl', {
    buttons: [
      {
        key: 'LEFT_ARROW',
        rotation: -90,
        updatePosFn: (b) => {
          b.x = -Crafty.viewport.x;
          b.y = -Crafty.viewport.y + Crafty.viewport.height - b.w
        }
      },
      {
        key: 'RIGHT_ARROW',
        rotation: 90,
        updatePosFn: (b) => {
          b.x = -Crafty.viewport.x + b.w;
          b.y = -Crafty.viewport.y + Crafty.viewport.height - b.w
        }
      },
      {
        key: 'UP_ARROW',
        rotation: 0,
        updatePosFn: (b) => {
          b.x = -Crafty.viewport.x + Crafty.viewport.width - b.w;
          b.y = -Crafty.viewport.y + Crafty.viewport.height - b.w
        }
      },
      {
        key: 'DOWN_ARROW',
        rotation: 180,
        updatePosFn: (b) => {
          b.x = -Crafty.viewport.x + Crafty.viewport.width - (2 * b.w);
          b.y = -Crafty.viewport.y + Crafty.viewport.height - b.w
        }
      }
    ],
    arrowButtons: [],
    buttonSize: 80,

    init: function () {
      this.requires('Actor, Level');

      this.arrowButtons = this.buttons.map(button => this.createArrowButton(button));

      this.updatePosition();

      this.bind("PlayerMoved", this.updatePosition);
    },

    createArrowButton: function(button) {
      let arrow = Crafty.e('Actor, spr_navigator, Level, Mouse');
      arrow.w = this.buttonSize;
      arrow.h = this.buttonSize;
      arrow.z = 7000;
      arrow.origin(this.buttonSize / 2, this.buttonSize / 2);
      arrow.rotation = button.rotation;

      arrow.updatePosition = () => button.updatePosFn(arrow);
      arrow.bind('MouseDown', () => this.mouseDownHandler(button.key));
      arrow.bind('MouseUp', () => this.mouseUpHandler(button.key));
      return arrow;
    },

    mouseDownHandler: function(key) {
      Game.dispatchKeyDown(key);
    },

    mouseUpHandler: function(key) {
      Game.dispatchKeyUp(key);
    },

    updatePosition: function() {
      this.arrowButtons.forEach((arrowButton) => arrowButton.updatePosition());
    }
  });

  Crafty.c('ShowFPS', {
    init: function () {
      this.requires('2D, DOM, FPS, Text');
      this.attr({maxValues: 10});

      this.bind("MessureFPS", function (fps) {
        this.text("FPS: " + fps.value); //Display Current FPS
        //console.log(this.values); // Display last x Values
      });

      this.bind("EnterFrame", function () {
        this.x = -Crafty.viewport.x;
        this.y = -Crafty.viewport.y + 10;

        //console.log("ShowFPS:", "x", this.x, "y", this.y);
      });

    }
  });

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
      this.minutes.textColor('#000000', 1.0);
      this.minutes.attr({w: 70});
      this.minutes.textAlign('center');

      this.seconds = Crafty.e('UILayer, 2D, DOM, Text');
      this.seconds.setName("Seconds");
      this.seconds.textFont({type: 'normal', weight: 'normal', size: '60px', family: 'ARCADE'});
      this.seconds.textColor('#000000', 1.0);
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

  Crafty.c('LevelIndicator', {
    init: function () {
      this.requires('UILayer, 2D, DOM, Text, Level');
      this.attr({x:10, y:5, w:300, h:30});
      this.textFont({type: 'normal', weight: 'normal', size: '30px', family: Game.fontFamily});
      this.css('text-align', 'left');
      this.textColor('#0061FF', 0.6);
      this.text("LEVEL " + Game.getLevelNumber());
    }
  });

  Crafty.c('MainMenu', {
    init: function () {
      this.requires('Menu');

      this.addMenuItem("Play", this.showLevelMenu.bind(this), "P");
      // this.addMenuItem("Instructions", this.comingSoonHandler("Instructions").bind(this), "I");
      // this.addMenuItem("Settings", this.comingSoonHandler("Settings").bind(this), "S");
      // this.addMenuItem("Credits", this.comingSoonHandler("Credits").bind(this), "C");
    },

    showLevelMenu: function () {
      this.levelSelectMenu = Crafty.e('LevelSelectMenu');
      this.levelSelectMenu.setName("LevelSelectMenu");
      this.levelSelectMenu.setMenuOptions({
        parentMenu: this
      });
      this.levelSelectMenu.showMenu();
    },

    comingSoonHandler: function (name) {
      return function () {
        Crafty.e('Menu')
            .setName("Menu")
            .setMenuOptions({
              parentMenu: this
            })
            .addMenuItem(name + " Coming Soon", this.showMenu.bind(this))
            .showMenu();
      }
    }
  });

  Crafty.c('LevelSelectMenu', {
    init: function () {
      this.requires('Menu');

      var numberOfLevels = Game.numberOfLevels();
      for (var i = 0; i < numberOfLevels; i++) {
        this.addMenuItem("Level " + (i + 1), this.getLevelSelectHandler(i))
      }

    },

    getLevelSelectHandler: function (levelIndex) {
      return function () {
        Game.selectLevel(levelIndex);
      }
    }
  });

  Crafty.c('Menu', {
    init: function () {
      this.requires('UILayer, 2D, DOM, Text, Keyboard');
      this.backgroundImageDim = { width: 922, height: 555 };
      this.menuItems = [];
      this.selectedMenuIndex = 0;
      this.colour = '#0061FF';
      this.selectedColour = '#FFFF00';
      this.timeIdle = 0;
      this.MAX_IDLE_FRAMES = 60 * 30; // approx. 30 seconds
      this.gamePadMapping = {
        'DPAD_UP': 'UP_ARROW',
        'DPAD_DOWN': 'DOWN_ARROW',
        'B': 'ENTER',
        'X': 'ESC'
      };

      this.overlay = Crafty.e('UILayer, 2D, DOM, spr_menu_background, Tween');
      this.overlay.setName("MenuBackground")
      this.overlay.attr({alpha:0.5});

      this._resizeMenu();

      // this.displayMenuInstructions();

      Crafty.addEvent(this, window, "resize", this._resizeMenu.bind(this));
      this.bind('EnterFrame', this._enterFrame);

      this.options = {
        parentMenu: null,
        escapeKeyHidesMenu: true
      }
    },

    _resizeMenu: function() {
      if (Crafty.viewport.height > Crafty.viewport.width) {
        // Fit to width
        let scaleHeight = Crafty.viewport.width / this.backgroundImageDim.width;
        let x = 0;
        let width = Crafty.viewport.width;
        let height = scaleHeight * this.backgroundImageDim.height;
        let y = (Crafty.viewport.height - height)/2;

        this.overlay.attr({x: x, y: y, w: width, h: height});
      } else {
        // Fit to Height
        let scaleWidth = Crafty.viewport.height / this.backgroundImageDim.height;
        let y = 0;
        let height = Crafty.viewport.height;
        let width = scaleWidth * this.backgroundImageDim.width;
        let x = (Crafty.viewport.width - width)/2;

        this.overlay.attr({x: x, y: y, w: width, h: height});
      }
      this._resizeMenuItems();
    },

    setMenuOptions: function (options) {
      if (options.parentMenu != undefined) {
        this.options.parentMenu = options.parentMenu;
      }
      if (options.escapeKeyHidesMenu != undefined) {
        this.options.escapeKeyHidesMenu = options.escapeKeyHidesMenu;
      }
      return this;
    },

    addMenuItem: function (displayName, menuItemFunction, hotKey) {
      this.menuItems.push({
        displayName: displayName,
        menuItemFunction: menuItemFunction,
        hotKey: hotKey
      });
      return this;
    },

    handleSelectionChanged: function (obj) {
      Game.playSoundEffect('menu_nav', 1, 1.0);
      var oldItem = this.menuItems[obj.oldIndex].entity;
      var newItem = this.menuItems[obj.newIndex].entity;

      oldItem.textColor(this.colour, 1.0);
      oldItem.css({
        '-moz-animation-duration': '',
        '-moz-animation-name': '',
        '-moz-animation-iteration-count': '',
        '-webkit-animation-duration': '',
        '-webkit-animation-name': '',
        '-webkit-animation-iteration-count': ''
      });

      newItem.textColor(this.selectedColour, 1.0);
      newItem.css({
        '-moz-animation-duration': '1s',
        '-moz-animation-name': 'selected_menu_item',
        '-moz-animation-iteration-count': 'infinite',
        '-webkit-animation-duration': '1s',
        '-webkit-animation-name': 'selected_menu_item',
        '-webkit-animation-iteration-count': 'infinite'
      });
    },

    _resizeMenuItems: function () {
      var width = 800;
      var totalHeight = (100 * this.menuItems.length) - (100 - 60);
      var x = Crafty.viewport.width / 2 - (width / 2);
      var y = Crafty.viewport.height / 2 - (totalHeight / 2);
      for (var i = 0; i < this.menuItems.length; i++) {
        this.menuItems[i].entity.attr({x: x, y: y});
        y += 100;
      }
    },

    showMenu: function () {
      var width = 800;
      var height = 100;
      var alpha = 1.0;

      this.selectedMenuIndex = 0;

      this.bind('KeyDown', this.handleKeyDown);
      Game.gamePad.bind(Gamepad.Event.BUTTON_DOWN, this._gamePadButtonDown.bind(this));
      Game.gamePad.bind(Gamepad.Event.BUTTON_UP, this._gamePadButtonUp.bind(this));
      this.bind('SelectionChanged', this.handleSelectionChanged);

      // display menu items
      for (var i = 0; i < this.menuItems.length; i++) {
        var item = this.menuItems[i];
        var menuItem = Crafty.e('OutlineText, Tween, Mouse');
        menuItem.setName("MenuItem");
        var textColor = (i === 0) ? this.selectedColour : this.colour;
        menuItem.text(item.displayName);
        menuItem.attr({w: width, h: height, alpha: alpha});
        menuItem.textFont({type: 'normal', weight: 'normal', size: '60px', family: Game.fontFamily});
        menuItem.textColor(textColor, 1.0);
        if (i === 0) {
          menuItem.css({
            '-moz-animation-duration': '1s',
            '-moz-animation-name': 'selected_menu_item',
            '-moz-animation-iteration-count': 'infinite',
            '-webkit-animation-duration': '1s',
            '-webkit-animation-name': 'selected_menu_item',
            '-webkit-animation-iteration-count': 'infinite'
          });
        }
        let clickHandler = (menuIndex) => { return () => this.menuItemSelected(menuIndex); };
        menuItem.bind('Click', clickHandler(i));
        item.entity = menuItem;
      }

      this._resizeMenuItems();

      Game.playSoundEffect('menu_change_page', 1, 1.0);

    },

    displayMenuInstructions: function () {
      var x = this.overlay.x + this.overlay._w - 240;
      var y = this.overlay.y + 555 - 130;
      var alpha = 0.5
      var textColour = '#0061FF';

      // - up arrow / down arrow: navigate
      var upArrow = Crafty.e('2D, Canvas, spr_up_arrow');
      upArrow.setName("UpArrow");
      upArrow.attr({x: x, y: y, w: 51, h: 48});
      upArrow.alpha = alpha;
      var downArrow = Crafty.e('2D, Canvas, spr_down_arrow');
      downArrow.setName("DownArrow");
      downArrow.attr({x: x + 56, y: y, w: 51, h: 48});
      downArrow.alpha = alpha;
      var navigate = Crafty.e('2D, DOM, Text');
      navigate.setName("NavigateText");
      navigate.text("navigate");
      navigate.attr({x: x + 110, y: y, w: 100, h: 48});
      navigate.textFont({type: 'normal', weight: 'normal', size: '32px', family: 'ARCADE'});
      navigate.css({
        'padding': '5px',
        'text-align': 'left'
      });
      navigate.textColor(textColour, 1.0);
      navigate.alpha = alpha;

      this.overlay.attach(upArrow);
      this.overlay.attach(downArrow);
      this.overlay.attach(navigate);

      // - enter: select
      var enterKey = Crafty.e('2D, Canvas, spr_enter_key');
      enterKey.setName("EnterKey");
      enterKey.attr({x: x, y: y + 53, w: 100, h: 48});
      enterKey.alpha = alpha;
      var select = Crafty.e('2D, DOM, Text');
      select.setName("SelectText");
      select.text("select");
      select.attr({x: x + 110, y: y + 53, w: 100, h: 48});
      select.textFont({type: 'normal', weight: 'normal', size: '32px', family: 'ARCADE'});
      select.css({
        'padding': '5px',
        'text-align': 'left'
      });
      select.textColor(textColour, 1.0);
      select.alpha = alpha;

      this.overlay.attach(enterKey);
      this.overlay.attach(select);
    },

    hideMenu: function () {
      // unbind event handlers
      this.unbind('KeyDown', this.handleKeyDown);
      this.unbind('EnterFrame', this._enterFrame);
      Game.gamePad.unbind(Gamepad.Event.BUTTON_DOWN);
      Game.gamePad.unbind(Gamepad.Event.BUTTON_UP);
      this.unbind('SelectionChanged', this.handleSelectionChanged);
      // hide menu items
      for (var i = 0; i < this.menuItems.length; i++) {
        this.menuItems[i].entity.destroy();
      }
    },

    menuItemSelectedViaHotKey: function () {

    },

    _gamePadButtonDown: function (e) {
      Game.dispatchKeyDown(this.gamePadMapping[e.control]);
    },

    _gamePadButtonUp: function (e) {
      Game.dispatchKeyUp(this.gamePadMapping[e.control]);
    },

    _enterFrame: function () {
      this.timeIdle++;
      if (this.timeIdle > this.MAX_IDLE_FRAMES) {
        this.timeIdle = 0;
        Game.startAttractMode();
      }
    },

    menuItemSelected: function (menuIndex) {
      this.hideMenu();
      let selectedMenuItem = this.menuItems[menuIndex];
      selectedMenuItem.menuItemFunction();
    },

    handleKeyDown: function () {
      this.timeIdle = 0;
      var selectedMenuItem = null;
      var previousIndex = this.selectedMenuIndex;

      if (this.isDown('UP_ARROW')) {
        this.selectedMenuIndex--;
        if (this.selectedMenuIndex < 0) {
          this.selectedMenuIndex = this.menuItems.length - 1;
        }
        Crafty.trigger("SelectionChanged", {oldIndex: previousIndex, newIndex: this.selectedMenuIndex});

      } else if (this.isDown('DOWN_ARROW')) {
        this.selectedMenuIndex++;
        if (this.selectedMenuIndex > this.menuItems.length - 1) {
          this.selectedMenuIndex = 0;
        }
        Crafty.trigger("SelectionChanged", {oldIndex: previousIndex, newIndex: this.selectedMenuIndex});

      } else if (this.isDown('ENTER')) {
        this.menuItemSelected(this.selectedMenuIndex);

      } else if ((selectedMenuItem = this.menuItemSelectedViaHotKey()) != null) {
        this.hideMenu();
        selectedMenuItem.menuItemFunction();

      } else if (this.options.escapeKeyHidesMenu && this.isDown('ESC')) {
        this.hideMenu();
        if (this.options.parentMenu) {
          this.options.parentMenu.showMenu();
        } else {
          Game.startAttractMode();
        }
      } else if (this.isDown('F4')) {
//      this.hideMenu();
//      Game.loadAndEditLevel(3);
      }

    }

  });

  Crafty.c('GlassOverlay', {
    init: function () {
      this.requires('UILayer, 2D, DOM, spr_glass_overlay');
      this.attr({ w: 700, h: 450 });
      this.bind("ViewportChanged", this._updatePosition.bind(this));

      this._updatePosition();
    },

    _updatePosition: function () {
      let x = Crafty.viewport.width/2 - (this.w / 2);
      let y = Crafty.viewport.height/2 - (this.h / 2);
      this.attr({x: x, y: y});
    },
  });

  Crafty.c('LevelCompleteControl', {
    textWidth:  320,
    textHeight: 100,
    textColour: "#0061FF",

    init: function () {
      this.requires('UILayer, 2D, DOM, Text');

      this.showLoadingMessage = false;
      this.keyPressDelay = true;

      this.levelComplete = Crafty.e('OutlineText');
      this.levelComplete.setName("LevelCompleteText");
      this.levelComplete.text(Game.getLevelCompleteMessage)
      this.levelComplete.attr({w: this.textWidth, z:50})
      this.levelComplete.textFont({type: 'normal', weight: 'normal', size: '60px', family: Game.fontFamily})
      this.levelComplete.textColor(this.textColour);

      this.pressAnyKey = Crafty.e('FlashingText');
      this.pressAnyKey.setName("PressAnyKeyText");
      this.pressAnyKey.attr({w: this.textWidth, h: this.textHeight, z:50})
      this.pressAnyKey.text("PRESS ANY KEY TO CONTINUE");
      this.pressAnyKey.textFont({type: 'normal', weight: 'normal', size: '30px', family: 'ARCADE'})
      this.pressAnyKey.textColor(this.textColour);

      this.overlay = Crafty.e('GlassOverlay');

      // After a short delay, watch for the player to press a key, then restart
      // the game when a key is pressed
      setTimeout(this.enableKeyPress.bind(this), 1000);

      this.bind('KeyDown', this.showLoading);
      Game.gamePad.bind(Gamepad.Event.BUTTON_DOWN, this.showLoading.bind(this));

      this.bind('EnterFrame', this.restartGame);
      this.bind("ViewportChanged", this._updatePosition.bind(this));

      this._updatePosition();
    },

    _updatePosition: function () {
      var x = Crafty.viewport.width / 2 - this.textWidth/2;
      var y = Crafty.viewport.height / 2;
      this.levelComplete.attr({x: x , y: y - 140})
      this.pressAnyKey.attr({x: x, y: y + 80})
    },

    enableKeyPress: function () {
      this.keyPressDelay = false;
    },

    enableRestart: function () {
      this.showLoadingMessage = true;
    },

    showLoading: function () {
      if (!this.keyPressDelay) {
        this.overlay.destroy();
        this.pressAnyKey.text("LOADING");
        this.levelComplete.text("");
        // Introduce delay to ensure Loading... text is rendered before next level or restart
        setTimeout(this.enableRestart.bind(this), 100);
      }
    },

    restartGame: function () {
      if (this.showLoadingMessage) {
        if (Game.isGameComplete()) {
          Game.resetLevels();
        } else {
          Game.nextLevel();
        }
        Game.startLevel();
      }
    }

  });

  Crafty.c('GameOverControl', {
    textWidth: 320,
    textHeight: 100,
    textColour: '#0061FF',

    init: function () {
      this.requires('UILayer, 2D, DOM, Text');
      this.showLoadingMessage = false;
      this.keyPressDelay = true;

      this.reasonText = Crafty.e('OutlineText');
      this.reasonText.setName("GameOverReason");
      this.reasonText.attr({w: this.textWidth, height: this.textHeight, z:50})
      this.reasonText.textFont({type: 'normal', weight: 'normal', size: '40px', family: 'ARCADE'})
      this.reasonText.textColor(this.textColour, 1.0);

      this.gameOverText = Crafty.e('OutlineText');
      this.gameOverText.setName("GameOver");
      this.gameOverText.text('GAME OVER!')
      this.gameOverText.attr({w: this.textWidth, height: this.textHeight, z:50})
      this.gameOverText.textFont({type: 'normal', weight: 'normal', size: '60px', family: Game.fontFamily})
      this.gameOverText.textColor(this.textColour);

      this.pressAnyKey = Crafty.e('FlashingText');
      this.pressAnyKey.setName("GameOverPressAnyKey");
      this.pressAnyKey.attr({w: this.textWidth, height: this.textHeight, z:50})
      this.pressAnyKey.text("PRESS ANY KEY TO CONTINUE");
      this.pressAnyKey.textFont({type: 'normal', weight: 'normal', size: '30px', family: 'ARCADE'})
      this.pressAnyKey.textColor(this.textColour);

      Game.playSoundEffect('game_over', 1, 1.0);

      this.overlay = Crafty.e('GlassOverlay');

      // After a short delay, watch for the player to press a key, then restart
      // the game when a key is pressed
      setTimeout(this.enableKeyPress.bind(this), 1000);

      this.bind('KeyDown', this.showLoading);
      Game.gamePad.bind(Gamepad.Event.BUTTON_DOWN, this.showLoading.bind(this));

      this.bind('EnterFrame', this.restartGame);
      this.bind("ViewportChanged", this._updatePosition.bind(this));

      this._updatePosition();
    },

    _updatePosition: function () {
      var x = Crafty.viewport.width / 2 - (this.textWidth / 2);
      var y = Crafty.viewport.height / 2;
      this.reasonText.attr({x: x, y: y - 120})
      this.gameOverText.attr({x: x, y: y - 70})
      this.pressAnyKey.attr({x: x, y: y + 80})
    },

    setReason: function (reason) {
      this.reasonText.text(reason);
    },

    enableKeyPress: function () {
      this.keyPressDelay = false;
    },

    enableRestart: function () {
      this.showLoadingMessage = true;
    },

    showLoading: function () {
      if (!this.keyPressDelay) {
        this.reasonText.text("");
        this.gameOverText.text("");
        this.pressAnyKey.text("LOADING");
        // Introduce delay to ensure Loading... text is rendered before next level or restart
        setTimeout(this.enableRestart.bind(this), 100);
      }
    },

    restartGame: function () {
      if (this.showLoadingMessage) {
        this.reasonText.destroy();
        this.gameOverText.destroy();
        this.pressAnyKey.destroy();
        this.overlay.destroy();
        this.destroy();

        Game.retryLevel();
      }
    }

  });

  Crafty.c('OptionsControl', {
    init: function () {
      this.requires('2D, Keyboard, Level');
      this.paused = false;
      this.isShowExhaust = true;

      this.bind("PauseGame", this._pauseGame);
      this.bind("UnpauseGame", this._unpauseGame);
      this.bind("KeyDown", this._handleKeyDown);
    },

    _pauseGame: function () {
      this.paused = true;
    },

    _unpauseGame: function () {
      this.paused = false;
    },

    _handleKeyDown: function (e) {
      if (this.paused) {
        return;
      }
      if (this.isDown('X')) {
        this._toggleShowExhaust();
      } else if (this.isDown('F4')) {
        this._editLevel();
      }
    },

    _toggleShowExhaust: function () {
      this.isShowExhaust = !this.isShowExhaust;
      Game.player.setShowExhaust(this.isShowExhaust);
    },

    _editLevel: function () {
      Game.stopAllSoundsExcept();
      Game.shutdownLevel();
      Game.restoreBrokenGround();
      Game.showMarkers();

      Editor.initEditor();
    }
  });

  Crafty.c('PauseControl', {
    init: function () {
      this.requires('UILayer, 2D, Keyboard, Level');
      this.paused = false;
      this.enabled = true;
      var textColour = "#0061FF";

      this.pauseText = Crafty.e('OutlineText');
      this.pauseText.setName("PauseText");
      this.pauseText.attr({w: 320, z:50})
      this.pauseText.textFont({type: 'normal', weight: 'normal', size: '60px', family: Game.fontFamily})
      this.pauseText.textColor(textColour);

      this.pressAnyKey = Crafty.e('FlashingText');
      this.pressAnyKey.setName("PausePressAnyKeyText");
      this.pressAnyKey.attr({w: 320, z:50})
      this.pressAnyKey.textFont({type: 'normal', weight: 'normal', size: '30px', family: 'ARCADE'})
      this.pressAnyKey.textColor(textColour);

      this._updatePosition();

      this.bind("ViewportChanged", this._updatePosition.bind(this));

      this.bind('KeyDown', this._handleKeyDownOrButtonDown);
      Game.gamePad.bind(Gamepad.Event.BUTTON_DOWN, this._handleKeyDownOrButtonDown.bind(this));
    },

    _updatePosition: function () {
      if (!this.enabled) {
        return;
      }
      let x = Crafty.viewport.width / 2;
      let y = Crafty.viewport.height / 2;

      this.pauseText.attr({x: x - (this.pauseText.w/2), y: y - 100});
      this.pressAnyKey.attr({x: x - (this.pressAnyKey.w/2), y: y + 30});
    },

    _isBackButton: function (e) {
      return (e.control && e.control == 'BACK');
    },

    _handleKeyDownOrButtonDown: function (e) {
      if (!this.enabled) {
        return;
      }
      if (!this.paused && (this.isDown('ESC') || this._isBackButton(e))) {
        this.pause();
      } else if (this.paused) {
        this.unpause();
      }
    },

    enable: function () {
      this.enabled = true;
    },

    disable: function () {
      this.enabled = false;
    },

    pause: function () {
      Debug.logEntitiesAndHandlers("Pause");

      this.paused = true;
      Game.pauseGame();
      Crafty.audio.mute();

      this.pauseText.text("PAUSED");
      this.pressAnyKey.text("PRESS ANY KEY TO CONTINUE");

      this.overlay = Crafty.e("GlassOverlay");
    },

    unpause: function () {
      this.paused = false;
      this.pauseText.text("");
      this.pressAnyKey.text("");
      this.overlay.destroy();

      Crafty.audio.unmute();

      Game.unpauseGame();
    }

  });

  Crafty.c('Solid', {
    init: function () {
      this.requires('Collision');
      this.z = Math.floor(this._y + 64);
      var polygon = new Crafty.polygon([0, 32, 64, 0, 128, 32, 64, 64]);
      polygon.shift(0, 64);
      this.collision(polygon);
    }
  });

  Crafty.c('Ground', {
    init: function () {
      this.requires('Collision');
      this.z = Math.floor(this._y - 64 - 10);
      this.collision(new Crafty.polygon([0, 32, 64, 0, 128, 32, 64, 64]));
    }
  });

  Crafty.c('NormalGround', {
    init: function () {
      this.requires('Ground');
    }
  });

  Crafty.c('IceGround', {
    init: function () {
      this.requires('Ground');
    }
  });

  Crafty.c('MudGround', {
    init: function () {
      this.requires('Ground');
    }
  });

  Crafty.c('BreakingGround', {
    init: function () {
      this.requires('Ground');

      this.TOTAL_BREAKING_FRAMES = 40;
      this.breaking = false;
      this.breakingStartFrame = null;

      this.bind("EnterFrame", this._enterFrame);
    },

    startBreaking: function () {
      if (this.breaking) {
        return;
      }
      this.breaking = true;
      Game.playSoundEffect('disappear', 1, 1.0);
    },

    restoreAsUnbroken: function () {
      this.addComponent("Ground");
      this.removeComponent("WasBreaking");
      this.breaking = false;
      this.breakingStartFrame = null;
      this.visible = true;
      this.alpha = 1.0;
      this.bind("EnterFrame", this._enterFrame);
    },

    _enterFrame: function (data) {
      if (!this.breaking) {
        return;
      }

      this.breakingStartFrame = this.breakingStartFrame || data.frame;
      var animFrame = data.frame - this.breakingStartFrame;

      if (animFrame < this.TOTAL_BREAKING_FRAMES) {
        this._animateBreaking(animFrame);
        return;
      }
      this._changeToBroken();
    },

    _animateBreaking: function (animFrame) {
      if (animFrame % 5 === 0) {
        var newAlpha = this.alpha - (5 / this.TOTAL_BREAKING_FRAMES);
        if (newAlpha < 0) {
          newAlpha = 0;
        }
        this.alpha = newAlpha;
      }
    },

    _changeToBroken: function () {
      this.unbind("EnterFrame", this._enterFrame);
      this.addComponent("WasBreaking");
      this.removeComponent("Ground");
      this.visible = false;
    }
  });

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

  Crafty.c('PlayerMarker', {
    init: function () {
      this.z = Math.floor(this._y);
    },

    getPlayerPosition: function () {
      return {
        x: this._x + 15,
        y: this._y - 17
      }
    }
  });

  Crafty.c('WaypointMarker', {
    init: function () {
      this.z = Math.floor(this._y);
      this.waypointPosition = {
        x: this._x + 32,
        y: this._y - 16
      };
    },

    getWaypointPosition: function () {
      return this.waypointPosition;
    }
  });

  Crafty.c('Oil', {
    init: function () {
      this.addComponent("Collision")
      this.z = Math.floor(this._y - 64 - 10);
      this.collision(new Crafty.polygon([0, 32, 64, 0, 128, 32, 64, 64]));
    }
  });

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
      Game.scrollXYViewport((Crafty.viewport.width / 2 - this.x - this.w / 2), (Crafty.viewport.height / 2 - this.y - this.h / 2));
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

  Crafty.c('AttractModeControl', {
    textWidth: 650,
    textHeight: 60,
    titleColour: "#AD0000",
    pressAnyKeyColour: "#0061FF",

    init: function () {
      this.requires('UILayer, 2D, DOM, Text, Persist');

      this.demo = Crafty.e('FlashingText');
      this.demo.addComponent("Persist");
      this.demo.setName("TitleText");
      this.demo.attr({w: this.textWidth, h: this.textHeight, z:50});
      this.demo.text("DEMO");
      this.demo.textFont({type: 'normal', weight: 'normal', size: '60px', family: 'ARCADE'})
      this.demo.textColor(this.titleColour);
      this.demo.visible = false;

      this.pressAnyKey = Crafty.e('FlashingText');
      this.pressAnyKey.addComponent("Persist");
      this.pressAnyKey.setName("PressAnyKeyText");
      this.pressAnyKey.attr({w: this.textWidth, h: this.textHeight, z:50});
      this.pressAnyKey.text("PRESS ANY KEY");
      this.pressAnyKey.textFont({type: 'normal', weight: 'normal', size: '30px', family: 'ARCADE'})
      this.pressAnyKey.textColor(this.pressAnyKeyColour);
      this.pressAnyKey.visible = false;

      this.bind("ViewportChanged", this._updatePosition.bind(this));
      this.bind("PlaybackStarted", this._playbackStarted);
      this.bind("PlaybackEnded", this._playbackEnded);
      this.bind('KeyDown', this._handleKeyDownOrButtonDown);
      Game.gamePad.bind(Gamepad.Event.BUTTON_DOWN, this._handleKeyDownOrButtonDown.bind(this));

      this._updatePosition()
    },

    stop: function () {
      this.demo.visible = false;
      this.pressAnyKey.visible = false;
      Game.stopAttractMode();
    },

    _updatePosition: function () {
      let x = Crafty.viewport.width / 2 - (this.textWidth / 2);
      let y = Crafty.viewport.height;

      this.demo.attr({x: x, y: y - 150})
      this.pressAnyKey.attr({x: x, y: y - 90})
    },

    _playbackStarted: function () {
      this.demo.visible = true;
      this.pressAnyKey.visible = true;
    },

    _playbackEnded: function () {
      Game.resetAttractMode();
    },

    _handleKeyDownOrButtonDown: function (e) {
      this.stop();
    }
  });

  Crafty.c('Path', {
    init: function () {
      this.requires('2D, Canvas');
      this.z = 7000;
      this.points = {x1: 0, y1: 0, x2: 0, y2: 0};
      this.xOffset = 50;
      this.yOffset = 50;

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
      ctx.stroke();
      ctx.restore();
    }

  });

  Crafty.c('Point', {
    init: function () {
      this.requires('2D, Canvas');
      this.z = 8000;
      this.position = {x: 0, y: 0};
      this.xOffset = 50;
      this.yOffset = 50;
      this.radius = 5;
      this.circleColour = 'green';

      this.bind("Draw", this._drawHandler);

      this.ready = true;
    },

    setPosition: function (x, y) {
      this.position.x = x;
      this.position.y = y;
      this.x = x;
      this.y = y;
      this.w = 100;
      this.h = 100;
    },

    setCircleColour: function (circleColour) {
      this.circleColour = circleColour;
    },

    setRadius: function (radius) {
      this.radius = radius;
    },

    _drawHandler: function (e) {
      this._drawCircle(e.ctx);
    },

    _drawCircle: function (ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.xOffset + this.position.x, this.yOffset + this.position.y, this.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = this.circleColour;
      ctx.fill();
//    ctx.lineWidth = 1;
//    ctx.strokeStyle = '#003300';
//    ctx.stroke();
      ctx.restore();
    }
  });


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

};