// TODO Fix memory leak problem

Crafty.c('OutlineText', {
  init: function() {
    this.requires('2D, DOM, Text');
    this.css({'text-shadow': '1px 0 0 #000000, 0 -1px 0 #000000, 0 1px 0 #000000, -1px 0 0 #000000'})
  }
});

Crafty.c('FlashingText', {
  init: function() {
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

Crafty.c('TipText', {
  init: function() {
    this.requires('OutlineText');
    this.delay = 10;
    this.animating = false;
    this.startTime = null;
    this.totalShowDuration = 5000;
    this.attr({ w: 320 })
    this.textFont({ type: 'normal', weight: 'normal', size: '30px', family: 'ARCADE' })
    this.textColor('#0061FF', 1.0);

    var x = Crafty.viewport.width/2 - Crafty.viewport.x - 160;
    var y = Crafty.viewport.height/2 - Crafty.viewport.y;

    this.attr({ x: x, y: y - 100 });
  },

  show: function() {
    this.startTime = Date.now();
    this.css({
      'transition-property': 'opacity, top',
      'transition-duration': '4s, 1s',
      'transition-timing-function': 'ease'
    });
    this.bind("EnterFrame", this._enterFrameHandler.bind(this));
  },

  _enterFrameHandler: function() {
    var timeElapsed = Date.now() - this.startTime;
    if (timeElapsed > this.totalShowDuration) {
      this.destroy();
      return;
    }
    var x = Crafty.viewport.width/2 - Crafty.viewport.x - 160;
    var y = Crafty.viewport.height/2 - Crafty.viewport.y;
    this.attr({ x: x, y: y - 100 });

    if (this.animating) {
      return;
    }
    if (timeElapsed > this.delay) {
      this.animating = true;
      this.css({ 'top': '-50px', 'opacity': '0.0' });
    }
  }
});

Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas');
  }
});

Crafty.c('Waypoint', {
  init: function() {
    this.requires('Actor, spr_waypoint, SpriteAnimation, Collision');
    this.collision( new Crafty.polygon([32,0],[64,16],[64,48],[32,64],[0,48],[0,16]) );

    this.animate('ChangeColour', 4, 0, 5); //setup animation
    this.animate('ChangeColour', 30, -1); // start animation
    this.isReached = false;
  },

  setPosition: function(x, y) {
    this.isReached = false;
    this.x = x;
    this.y = y;
    this.z = Math.floor(y);
    Crafty.trigger("WaypointMoved", {x: this.x, y: this.y});
  },

  reached: function() {
    if (this.isReached) {
      return;
    }
    this.isReached = true;
    Game.playSoundEffect('woop', 1, 1.0);
    var waypointText = Crafty.e('TipText');
    waypointText.setName("WaypointText");
    waypointText.text("WOOHOO!");
    waypointText.show();

    Crafty.trigger('WaypointReached', this);
  }
});

Crafty.c('Diamond', {
  init: function() {
    this.requires('2D, Canvas');
    this.z = 7000;
    this.w = 200;
    this.h = 100;

    this.bind("Draw", function(e) {
      this.drawHandler(e);
    }.bind(this));

    this.ready = true;
  },

  drawHandler : function (e) {
    this.drawDiamond(e.ctx, this.x, this.y);
  },

  drawDiamond : function(ctx, offsetX, offsetY) {
    ctx.save();
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.moveTo(offsetX + this.w/2 - 1,  offsetY - 1);
    ctx.lineTo(offsetX + this.w,        offsetY + this.h/2 - 1);
    ctx.lineTo(offsetX + this.w/2 - 1,  offsetY + this.h);
    ctx.lineTo(offsetX - 1,             offsetY + this.h/2 - 1);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

});

Crafty.c('MiniMapMarker', {
  init: function() {
    this.requires('2D, Canvas');
    this.z = 7000;
    this.w = 200;
    this.h = 100;
    this.miniMapPosition = {x:0, y:0};
    this.colour = "#000000";

    this.bind("Draw", function(e) {
      this.drawHandler(e);
    }.bind(this));

    this.ready = true;
  },

  setColour: function(colour) {
    this.colour = colour;
  },

  setOffset: function(offsetX, offsetY) {
    this.attr({ x: offsetX, y: offsetY });
  },

  setPosition: function(position) {
    this.miniMapPosition = this.toMiniMapPosition(position || {x:0, y:0});
  },

  toMiniMapPosition: function(position) {
    var miniPosition = {
      x: Math.round(((6200 + position.x) / Game.width()) * 200),
      y: Math.round((position.y / Game.height()) * 100)
    };
    return miniPosition;
  },

  drawHandler: function (e) {
    this.drawMarker(e.ctx);
  },

  drawMarker: function(ctx) {
    ctx.save();
    ctx.strokeStyle = this.colour;
    ctx.beginPath();
    ctx.moveTo(this.miniMapPosition.x + this.x - 1,   this.miniMapPosition.y + this.y);
    ctx.lineTo(this.miniMapPosition.x + this.x + 2,   this.miniMapPosition.y + this.y);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

});

Crafty.c('MiniMapViewport', {
  init: function() {
    this.requires('2D, Canvas');
    this.z = 7000;
    this.w = 200;
    this.h = 100;
    this.miniMapPosition = {x:0, y:0};

    this.bind("Draw", function(e) {
      this.drawHandler(e);
    }.bind(this));

    this.ready = true;
  },

  setOffset : function(offsetX, offsetY) {
    this.attr({ x: offsetX, y: offsetY });
  },

  setPosition : function(position) {
    this.miniMapPosition = this.toMiniMapPosition(position || {x:0, y:0});
  },

  toMiniMapPosition : function(position) {
    var miniPosition = {
      x: Math.round(((6200 + position.x) / Game.width()) * 200),
      y: Math.round((position.y / Game.height()) * 100)
    };
    return miniPosition;
  },

  drawHandler : function (e) {
    this.drawViewport(e.ctx);
  },

  drawViewport : function(ctx) {
    ctx.save();
    ctx.strokeStyle = "rgba(255,0,0,0.2)";
    ctx.stroke
    ctx.beginPath();
    ctx.moveTo(this.miniMapPosition.x + this.x - 8,   this.miniMapPosition.y + this.y - 5);
    ctx.lineTo(this.miniMapPosition.x + this.x + 8,   this.miniMapPosition.y + this.y - 5);
    ctx.lineTo(this.miniMapPosition.x + this.x + 8,   this.miniMapPosition.y + this.y + 5);
    ctx.lineTo(this.miniMapPosition.x + this.x - 8,   this.miniMapPosition.y + this.y + 5);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

});

Crafty.c('MiniMap', {
  init: function() {
    this.requires('2D, Canvas');
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

    this.viewportOutline= Crafty.e("MiniMapViewport");
    this.viewportOutline.setName("MiniMapViewport");

    this.bind("PlayerMoved", this._playerMovedHandler.bind(this));

    this.bind("WaypointMoved", this._waypointMovedHandler.bind(this));
  },

  _miniMapPosition: function() {
    return {
      x: Crafty.viewport.width - Crafty.viewport.x - this.w - 5,
      y: (- Crafty.viewport.y + 5)
    };
  },

  _playerMovedHandler: function(playerPosition) {
    var miniMapPos = this._miniMapPosition();
    this.x = miniMapPos.x;
    this.y = miniMapPos.y;

    var offsetX = miniMapPos.x + 10;
    var offsetY = miniMapPos.y + 5;

    this.diamond.x = offsetX;
    this.diamond.y = offsetY;

    this.playerMarker.setPosition(playerPosition);
    this.playerMarker.setOffset(offsetX, offsetY);

    this.waypointMarker.setOffset(offsetX, offsetY);

    this.viewportOutline.setPosition(playerPosition);
    this.viewportOutline.setOffset(offsetX, offsetY);
  },

  _waypointMovedHandler: function(waypointPosition) {
    var miniMapPos = this._miniMapPosition();
    this.x = miniMapPos.x;
    this.y = miniMapPos.y;

    var offsetX = miniMapPos.x + 10;
    var offsetY = miniMapPos.y + 5;

    this.waypointMarker.setPosition(waypointPosition);
    this.waypointMarker.setOffset(offsetX, offsetY);
  }

});

Crafty.c('WaypointIndicator', {
  init: function() {
    this.requires('Actor, spr_waypoint_indicator, SpriteAnimation');
    this.w = 21;
    this.h = 21;
    this.z = 7000;
    this.animate('Collected', 0, 0, 0); //setup animation
    this.animate('NotFound', 1, 0, 1);  //setup animation

    this.notFound();
  },

  collected: function() {
    this.animate('Collected', 1, 1);
  },

  notFound: function() {
    this.animate('NotFound', 1, 1);
  }

});

Crafty.c('WaypointsCollectedIndicator', {
  init: function() {
    this.requires('Actor');
    this.w = 10 * (21 + 5);
    this.h = 21;
    this.z = 7000;
    this.numberCollected = 0;

    this.waypointIndicators = this._createWaypointIndicators();

    this.bind("PlayerMoved", function() {
      this.x = (Crafty.viewport.width/2) - Crafty.viewport.x - (this.w/2);
      this.y = Game.viewportHeight() - this.h - Crafty.viewport.y - 10;
    });

    this.bind('WaypointReached', function() {
      this.waypointIndicators[this.numberCollected].collected();
      this.numberCollected++;
    });
  },

  resetNumberCollected: function() {
    this.numberCollected = 0;
    for (var i=0; i<10; i++) {
      this.waypointIndicators[i].notFound();
    }
  },

  _createWaypointIndicators: function() {
    var wps = [], i= 0, wp, x=0;
    for (; i<10; i++) {
      wp = Crafty.e('WaypointIndicator');
      wp.setName('WaypointIndicator');
      wp.attr({ x: x, y: 0});
      wps.push(wp);

      this.attach(wp);
      x += (21 + 5);
    }
    return wps;
  }

});

Crafty.c('Navigator', {
  init: function() {
    this.requires('Actor, spr_navigator');
    this.z = 7000;
    this.origin(96/2, 96/2);

    this.bind("WaypointMoved", function(waypointPosition) {
      this.waypointPosition = waypointPosition;
    });

    this.bind("PlayerMoved", function(playerPosition) {
      this.x = Game.viewportWidth() - this.w - Crafty.viewport.x + 5;
      this.y = Game.viewportHeight() - this.h - Crafty.viewport.y + 5;

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
  }
});

Crafty.c('ShowFPS', {
  init: function() {
    this.requires('2D, DOM, FPS, Text');
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
    this.requires('2D');
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

    this.minutes = Crafty.e('2D, DOM, Text');
    this.minutes.setName("Minutes");
    this.minutes.textFont({ type: 'normal', weight: 'normal', size: '60px', family: 'ARCADE' });
    this.minutes.textColor('#000000', 1.0);
    this.minutes.attr({ w: 70 });

    this.seconds = Crafty.e('2D, DOM, Text');
    this.seconds.setName("Seconds");
    this.seconds.textFont({ type: 'normal', weight: 'normal', size: '60px', family: 'ARCADE' });
    this.seconds.textColor('#000000', 1.0);
    this.seconds.attr({ w: 70 });

    this._updatePosition();

    this.complete = false;
    this.paused = false;

    this.startTime = 0;
    this.totalTime = 0;

    this.bind("PlayerMoved", this._updatePosition);
    this.bind("EnterFrame", this._enterFrame);
    this.bind("PauseGame", this._pauseGame);
    this.bind("UnpauseGame", this._unpauseGame);
  },

  _updatePosition:function () {
    var x = (Crafty.viewport.width/2) - Crafty.viewport.x - 70;
    var y = - Crafty.viewport.y + 105;
    this.minutes.attr({ x: x, y: y - 100 });
    this.seconds.attr({ x: x + 70, y: y - 100 });
  },

  _enterFrame: function() {
    if (this.complete || this.paused) {
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

  _pauseGame: function() {
    this.paused = true;
    this.totalTime -= (Date.now() - this.startTime);
  },

  _unpauseGame: function() {
    this.startTime = Date.now();
    this.paused = false;
  },

  _updateDisplay:function(timeLeft) {
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
      Game.playSoundEffect('low_time', 1, 1.0);
    }
    this.minutes.text(secsPadding + secs + ":");
    this.seconds.text(msecsPadding + msecs);
  },

  start:function(duration) {
    this.totalTime = duration;
    this.startTime = Date.now();
    this.playWarningSound = false;
    this.lowTime = false;
    this.minutes.css(this.noAnimation);
    this.seconds.css(this.noAnimation);
    this.complete = false;
  }
});

Crafty.c('LevelIndicator', {
  init: function() {
    this.requires('2D, DOM, Text');
    this.h = 45;
    this.w = 300;
    this.textFont({ type: 'normal', weight: 'normal', size: '40px', family: Game.fontFamily });
    this.css('text-align', 'left');
    this.textColor('#0061FF', 0.6);
    this.text("LEVEL " + Game.getLevelNumber());
    this.updatePosition();

    this.bind("PlayerMoved", this.updatePosition);
  },

  updatePosition: function() {
    this.x = 10 - Crafty.viewport.x;
    this.y = Game.viewportHeight() - this.h - Crafty.viewport.y;
  }
});

Crafty.c('MainMenu', {
  init: function() {
    this.requires('Menu');

    this.addMenuItem("Play", this.showLevelMenu.bind(this), "P");
    this.addMenuItem("Instructions", this.comingSoonHandler("Instructions").bind(this), "I");
    this.addMenuItem("Settings", this.comingSoonHandler("Settings").bind(this), "S");
    this.addMenuItem("Credits", this.comingSoonHandler("Credits").bind(this), "C");
  },

  showLevelMenu: function() {
    this.levelSelectMenu = Crafty.e('LevelSelectMenu');
    this.levelSelectMenu.setName("LevelSelectMenu");
    this.levelSelectMenu.setMenuOptions({
      parentMenu: this
    });
    this.levelSelectMenu.showMenu();
  },

  comingSoonHandler: function(name) {
    return function() {
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
  init: function() {
    this.requires('Menu');

    var numberOfLevels = Game.numberOfLevels();
    for (var i=0; i< numberOfLevels; i++) {
      this.addMenuItem("Level " + (i+1), this.getLevelSelectHandler(i))
    }

  },

  getLevelSelectHandler: function(levelIndex) {
    return function() {
      Game.selectLevel(levelIndex);
    }
  }
});

Crafty.c('Menu', {
  init: function() {
    this.requires('2D, Canvas, Text, Keyboard');
    this.z = 2000;
    this.menuItems = [];
    this.selectedMenuIndex = 0;
    this.colour = '#0061FF';
    this.selectedColour = '#FFFF00';
    this.timeIdle = 0;
    this.MAX_IDLE_FRAMES = 60 * 30; // approx. 30 seconds
    this.gamePadMapping = {
      'DPAD_UP':    'UP_ARROW',
      'DPAD_DOWN':  'DOWN_ARROW',
      'B':          'ENTER',
      'X':          'ESC'
    };

    this.overlay = Crafty.e('2D, Canvas, spr_menu_background, Tween');
    this.overlay.setName("MenuBackground")
    var x = 51 - Crafty.viewport.x;
    var y = Crafty.viewport.y - 555;
    this.overlay.attr({ x: x, y: y, w: Crafty.viewport.width-102, h: Crafty.viewport.height-102 });

    this.displayMenuInstructions();

    this.bind('EnterFrame', this._enterFrame);

    this.options = {
      parentMenu: null,
      escapeKeyHidesMenu: true
    }
  },

  setMenuOptions: function(options) {
    if (options.parentMenu != undefined) {
      this.options.parentMenu = options.parentMenu;
    }
    if (options.escapeKeyHidesMenu != undefined) {
      this.options.escapeKeyHidesMenu = options.escapeKeyHidesMenu;
    }
    return this;
  },

  addMenuItem: function(displayName, menuItemFunction, hotKey) {
    this.menuItems.push({
      displayName: displayName,
      menuItemFunction: menuItemFunction,
      hotKey: hotKey
    });
    return this;
  },

  handleSelectionChanged: function(obj) {
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

  showMenu: function() {
    var width = 800;
    var height = 100;
    var alpha = 1.0;
    var totalHeight = 100 * this.menuItems.length;

    this.selectedMenuIndex = 0;

    this.bind('KeyDown', this.handleKeyDown);
    Game.gamePad.bind(Gamepad.Event.BUTTON_DOWN, this._gamePadButtonDown.bind(this));
    Game.gamePad.bind(Gamepad.Event.BUTTON_UP, this._gamePadButtonUp.bind(this));
    this.bind('SelectionChanged', this.handleSelectionChanged);

    // display menu items
    var x = Crafty.viewport.width/2 - Crafty.viewport.x - (width / 2) - 10;
    var y = this.overlay.y + Crafty.viewport.height/2 - (totalHeight / 2) - 55;

    for (var i=0; i<this.menuItems.length; i++) {
      var item = this.menuItems[i];
      var menuItem = Crafty.e('OutlineText, Tween');
      menuItem.setName("MenuItem");
      var textColor = (i === 0) ? this.selectedColour : this.colour;
      menuItem.text(item.displayName);
      menuItem.attr({ x: x, y: y, w: width, h: height, alpha: alpha });
      menuItem.textFont({ type: 'normal', weight: 'normal', size: '80px', family: Game.fontFamily });
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
      menuItem.css({
        'padding': '5px'
      });
      item.entity = menuItem;

      this.overlay.attach(menuItem);

      y += 100;
    }

    this.overlay.attr({y: (Crafty.viewport.y - 555) });
    this.overlay.tween({ y: (51 - Crafty.viewport.y) }, 15);

    Game.playSoundEffect('menu_change_page', 1, 1.0);

  },

  displayMenuInstructions: function() {
    var x = this.overlay.x + this.overlay._w - 240;
    var y = this.overlay.y + 555 - 130;
    var alpha = 0.5
    var textColour = '#0061FF';

    // - up arrow / down arrow: navigate
    var upArrow = Crafty.e('2D, Canvas, spr_up_arrow');
    upArrow.setName("UpArrow");
    upArrow.attr({ x: x, y: y,  w: 51, h: 48 });
    upArrow.alpha = alpha;
    var downArrow = Crafty.e('2D, Canvas, spr_down_arrow');
    downArrow.setName("DownArrow");
    downArrow.attr({ x: x+56, y: y, w: 51, h: 48 });
    downArrow.alpha = alpha;
    var navigate = Crafty.e('2D, DOM, Text');
    navigate.setName("NavigateText");
    navigate.text("navigate");
    navigate.attr({ x: x+110, y: y, w: 100, h: 48 });
    navigate.textFont({ type: 'normal', weight: 'normal', size: '32px', family: 'ARCADE' });
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
    enterKey.attr({ x: x, y: y+53, w: 100, h: 48 });
    enterKey.alpha = alpha;
    var select = Crafty.e('2D, DOM, Text');
    select.setName("SelectText");
    select.text("select");
    select.attr({ x: x+110, y: y+53, w: 100, h: 48 });
    select.textFont({ type: 'normal', weight: 'normal', size: '32px', family: 'ARCADE' });
    select.css({
      'padding': '5px',
      'text-align': 'left'
    });
    select.textColor(textColour, 1.0);
    select.alpha = alpha;

    this.overlay.attach(enterKey);
    this.overlay.attach(select);
  },

  hideMenu: function() {
    // unbind event handlers
    this.unbind('KeyDown', this.handleKeyDown);
    this.unbind('EnterFrame', this._enterFrame);
    Game.gamePad.unbind(Gamepad.Event.BUTTON_DOWN);
    Game.gamePad.unbind(Gamepad.Event.BUTTON_UP);
    this.unbind('SelectionChanged', this.handleSelectionChanged);
    // hide menu items
    for(var i=0; i<this.menuItems.length; i++) {
      this.menuItems[i].entity.destroy();
    }
    this.overlay.tween({ y: (Crafty.viewport.y + Crafty.viewport.height) }, 15);
  },

  menuItemSelectedViaHotKey: function() {

  },

  _gamePadButtonDown: function(e) {
    Game.dispatchKeyDown(this.gamePadMapping[e.control]);
  },

  _gamePadButtonUp: function(e) {
    Game.dispatchKeyUp(this.gamePadMapping[e.control]);
  },

  _enterFrame: function() {
    this.timeIdle++;
    if (this.timeIdle > this.MAX_IDLE_FRAMES) {
      this.timeIdle = 0;
      Game.startAttractMode();
    }
  },

  handleKeyDown: function() {
    this.timeIdle = 0;
    var selectedMenuItem = null;
    var previousIndex = this.selectedMenuIndex;

    if (this.isDown('UP_ARROW')) {
      this.selectedMenuIndex--;
      if (this.selectedMenuIndex < 0) {
        this.selectedMenuIndex = this.menuItems.length - 1;
      }
      Crafty.trigger("SelectionChanged",{oldIndex:previousIndex, newIndex:this.selectedMenuIndex});

    } else if (this.isDown('DOWN_ARROW')) {
      this.selectedMenuIndex++;
      if (this.selectedMenuIndex > this.menuItems.length - 1) {
        this.selectedMenuIndex = 0;
      }
      Crafty.trigger("SelectionChanged",{oldIndex:previousIndex, newIndex:this.selectedMenuIndex});

    } else if (this.isDown('ENTER')) {
      this.hideMenu();
      selectedMenuItem = this.menuItems[this.selectedMenuIndex];
      selectedMenuItem.menuItemFunction();

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
    }

  }

});

Crafty.c('LevelCompleteControl', {
  init: function() {
    this.requires('2D, DOM, Text');
    var width = 650;
    var height = 100;
    var textColour = "#0061FF";

    this.showLoadingMessage = false;
    this.keyPressDelay = true;

    this.levelComplete = Crafty.e('OutlineText');
    this.levelComplete.setName("LevelCompleteText");
    this.levelComplete.text(Game.getLevelCompleteMessage)
    var x = Crafty.viewport.width/2 - Crafty.viewport.x - (width/2);
    var y = Crafty.viewport.height/2 - Crafty.viewport.y - 140;
    this.levelComplete.attr({ x: x, y: y, w: width, h:height })
    this.levelComplete.textFont({ type: 'normal', weight: 'normal', size: '80px', family: Game.fontFamily })
    this.levelComplete.textColor(textColour);

    this.pressAnyKey = Crafty.e('FlashingText');
    this.pressAnyKey.setName("PressAnyKeyText");
    this.pressAnyKey.attr({ x: x, y: y + 260, w: width, h:height })
    this.pressAnyKey.text("PRESS ANY KEY TO CONTINUE");
    this.pressAnyKey.textFont({ type: 'normal', weight: 'normal', size: '30px', family: 'ARCADE' })
    this.pressAnyKey.textColor(textColour);

    this.overlay = Game.createGlassOverlay();

    // After a short delay, watch for the player to press a key, then restart
    // the game when a key is pressed
    setTimeout(this.enableKeyPress.bind(this), 1000);

    this.bind('KeyDown', this.showLoading);
    Game.gamePad.bind(Gamepad.Event.BUTTON_DOWN, this.showLoading.bind(this));

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
      this.overlay.destroy();
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
      Game.startLevel();
    }
  }

});

Crafty.c('GameOverControl', {
  init: function() {
    this.requires('2D, DOM, Text');
    var width = 600;
    var height = 100;
    this.showLoadingMessage = false;
    this.keyPressDelay = true;
    var textColour = '#0061FF';

    this.reasonText = Crafty.e('OutlineText');
    this.reasonText.setName("GameOverReason");
    var x = Crafty.viewport.width/2 - Crafty.viewport.x - (width / 2);
    var y = Crafty.viewport.height/2 - Crafty.viewport.y - 180;
    this.reasonText.attr({ x: x, y: y, w: width, height: height })
    this.reasonText.textFont({ type: 'normal', weight: 'normal', size: '60px', family: 'ARCADE' })
    this.reasonText.textColor(textColour,1.0);

    this.gameOverText = Crafty.e('OutlineText');
    this.gameOverText.setName("GameOver");
    this.gameOverText.text('GAME OVER!')
    this.gameOverText.attr({ x: x, y: y + 70, w: width, height: height })
    this.gameOverText.textFont({ type: 'normal', weight: 'normal', size: '100px', family: Game.fontFamily })
    this.gameOverText.textColor(textColour);

    this.pressAnyKey = Crafty.e('FlashingText');
    this.pressAnyKey.setName("GameOverPressAnyKey");
    this.pressAnyKey.attr({ x: x, y: y + 290, w: width, height: height })
    this.pressAnyKey.text("PRESS ANY KEY TO CONTINUE");
    this.pressAnyKey.textFont({ type: 'normal', weight: 'normal', size: '30px', family: 'ARCADE' })
    this.pressAnyKey.textColor(textColour);

    Game.playSoundEffect('game_over', 1, 1.0);

    this.overlay = Game.createGlassOverlay();

    // After a short delay, watch for the player to press a key, then restart
    // the game when a key is pressed
    setTimeout(this.enableKeyPress.bind(this), 1000);

    this.bind('KeyDown', this.showLoading);
    Game.gamePad.bind(Gamepad.Event.BUTTON_DOWN, this.showLoading.bind(this));

    this.bind('EnterFrame', this.restartGame);
  },

  setReason: function(reason) {
    this.reasonText.text(reason);
  },

  enableKeyPress: function() {
    this.keyPressDelay = false;
  },

  enableRestart: function() {
    this.showLoadingMessage = true;
  },

  showLoading: function() {
    if (!this.keyPressDelay) {
      this.reasonText.text("");
      this.gameOverText.text("");
      this.pressAnyKey.text("LOADING");
      // Introduce delay to ensure Loading... text is rendered before next level or restart
      setTimeout(this.enableRestart.bind(this), 100);
    }
  },

  restartGame: function() {
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

Crafty.c('PauseControl', {
  init: function() {
    this.requires('2D, Keyboard');
    this.paused = false;
    this.enabled = true;
    var textColour = "#0061FF";

    this.pauseText = Crafty.e('OutlineText');
    this.pauseText.setName("PauseText");
    this.pauseText.attr({ w: 320 })
    this.pauseText.textFont({ type: 'normal', weight: 'normal', size: '60px', family: Game.fontFamily })
    this.pauseText.textColor(textColour);

    this.pressAnyKey = Crafty.e('FlashingText');
    this.pressAnyKey.setName("PausePressAnyKeyText");
    this.pressAnyKey.attr({ w: 320 })
    this.pressAnyKey.textFont({ type: 'normal', weight: 'normal', size: '30px', family: 'ARCADE' })
    this.pressAnyKey.textColor(textColour);

    this.bind('KeyDown', this._handleKeyDownOrButtonDown);
    Game.gamePad.bind(Gamepad.Event.BUTTON_DOWN, this._handleKeyDownOrButtonDown.bind(this));
  },

  _isBackButton: function(e) {
    return (e.control && e.control == 'BACK');
  },

  _handleKeyDownOrButtonDown: function(e) {
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

    var x = Crafty.viewport.width / 2 - Crafty.viewport.x - 160;
    var y = Crafty.viewport.height / 2 - Crafty.viewport.y;

    this.pauseText.attr({ x: x, y: y - 100 });
    this.pauseText.text("PAUSED");

    this.pressAnyKey.attr({ x: x, y: y + 30 });
    this.pressAnyKey.text("PRESS ANY KEY TO CONTINUE");

    this.overlay = Game.createGlassOverlay();
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

Crafty.c('BreakingGround', {
  init: function() {
    this.TOTAL_BREAKING_FRAMES = 40;
    this.breakingSide = null;
    this.breaking = false;
    this.breakingStartFrame = null;

    this.bind("EnterFrame", this._enterFrame);
  },

  setBreakingSide: function(entity) {
    this.breakingSide = entity;
  },

  startBreaking: function() {
    if (this.breaking) {
      return;
    }
    this.breaking = true;
    Game.playSoundEffect('disappear', 1, 1.0);
  },

  restoreAsUnbroken: function() {
    this.removeComponent("WasBreaking");
    this.removeComponent("Hole");
    this.breaking = false;
    this.breakingStartFrame = null;
    this.visible = true;
    this.alpha = 1.0;
    if (this.breakingSide) {
      this.breakingSide.visible = true;
      this.breakingSide.alpha = 1.0;
    }
    this.bind("EnterFrame", this._enterFrame);
  },

  _enterFrame: function(data) {
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

  _animateBreaking: function(animFrame) {
    if (animFrame % 5 === 0) {
      var newAlpha = this.alpha - (5 / this.TOTAL_BREAKING_FRAMES);
      if (newAlpha < 0) {
        newAlpha = 0;
      }
      this.alpha = newAlpha;
      if (this.breakingSide) {
        this.breakingSide.alpha = newAlpha;
      }
    }
  },

  _changeToBroken: function() {
    this.unbind("EnterFrame", this._enterFrame);
    this.addComponent("WasBreaking");
    this.addComponent("Hole");
    this.visible = false;
    if (this.breakingSide) {
      this.breakingSide.visible = false;
    }
  }
});

Crafty.c('OneWay', {
  init: function() {
    this.oneWayDirections = {
      'NE':  -26.6,
      'SE':   26.6,
      'SW':  153.4,
      'NW': -153.4
    };
    this.allowedDirection = null;
  },

  setOneWayType: function(type) {
    this.allowedDirection = this.oneWayDirections[type];
  },

  isDirectionAllowed: function(carDirection, isReversing) {
    if (isReversing) {
      return this.oppositeCarDirection(carDirection) == this.allowedDirection;
    } else {
      return carDirection == this.allowedDirection;
    }
  },

  oppositeCarDirection: function(carDirection) {
    // Note: carDirection: 0 is East, -90 is North, +90 is South, and -180/+180 is West
    return Math.round((((carDirection + 360) % 360 - 180)) * 10) / 10;
  }
});

// TODO Use this to have no exhaust
//Crafty.c('Exhaust', {
//  init: function() {
//    this.requires('Actor');
//  },
//  updatePosition: function(carX, carY, carAngle) {},
//  updateAngle: function(carAngle) {},
//  stop: function() {}
//});

Crafty.c('Exhaust', {

  init: function() {
    this.requires('Actor,Particles');

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
      gravity: { x: 0, y: -0.01 },
      // sensible values are 0-3
      jitter: 1 //0
    }

    this.particles(options);
  },

  updatePosition: function(carX, carY, carAngle) {
    var directionVector = new Crafty.math.Vector2D(
      Math.cos(carAngle * (Math.PI / 180)),
      Math.sin(carAngle * (Math.PI / 180))
    );
    directionVector.scaleToMagnitude(44);
    directionVector.negate();

    var exhaustPosition = new Crafty.math.Vector2D(carX, carY);
    exhaustPosition.translate(46, 36);
    exhaustPosition.add(directionVector);

    this.x = exhaustPosition.x;
    this.y = exhaustPosition.y;
  },

  updateAngle: function(carAngle) {
    this._Particles.angle = (carAngle + 270.0) % 360.0;
  },

  stop: function() {
    this._Particles.duration = 0;
  }
});

Crafty.c('Car', {
  init: function() {
    this.directionIndex = 27;  // NE
    this.snappedDirectionIndex = this.directionIndex;
    this.DIRECTIONS = [
      { angle:-90.0,  spriteNum:16, snapLeftIndex: 0,  snapRightIndex: 0 },   // N (0)
      { angle:-102.7, spriteNum:15, snapLeftIndex: 5,  snapRightIndex: 0 },
      { angle:-115.4, spriteNum:14, snapLeftIndex: 5,  snapRightIndex: 0 },
      { angle:-128.1, spriteNum:13, snapLeftIndex: 5,  snapRightIndex: 0 },
      { angle:-140.8, spriteNum:12, snapLeftIndex: 5,  snapRightIndex: 0 },
      { angle:-153.4, spriteNum:11, snapLeftIndex: 5,  snapRightIndex: 5 },   // NW (5)
      { angle:-162.3, spriteNum:10, snapLeftIndex: 8,  snapRightIndex: 5 },
      { angle:-171.2, spriteNum:9,  snapLeftIndex: 8,  snapRightIndex: 5 },
      { angle:180.0,  spriteNum:8,  snapLeftIndex: 8,  snapRightIndex: 8 },   // W (8)
      { angle:173.4,  spriteNum:7,  snapLeftIndex: 12, snapRightIndex: 8 },
      { angle:166.7,  spriteNum:6,  snapLeftIndex: 12, snapRightIndex: 8 },
      { angle:160.1,  spriteNum:5,  snapLeftIndex: 12, snapRightIndex: 8 },
      { angle:153.4,  spriteNum:4,  snapLeftIndex: 12, snapRightIndex: 12 },  // SW (12)
      { angle:137.5,  spriteNum:3,  snapLeftIndex: 16, snapRightIndex: 12 },
      { angle:121.6,  spriteNum:2,  snapLeftIndex: 16, snapRightIndex: 12 },
      { angle:105.7,  spriteNum:1,  snapLeftIndex: 16, snapRightIndex: 12 },
      { angle:90.0,   spriteNum:0,  snapLeftIndex: 16, snapRightIndex: 16 },  // S (16)
      { angle:74.1,   spriteNum:31, snapLeftIndex: 20, snapRightIndex: 16 },
      { angle:58.2,   spriteNum:30, snapLeftIndex: 20, snapRightIndex: 16 },
      { angle:42.3,   spriteNum:29, snapLeftIndex: 20, snapRightIndex: 16 },
      { angle:26.6,   spriteNum:28, snapLeftIndex: 20, snapRightIndex: 20 },  // SE (20)
      { angle:19.9,   spriteNum:27, snapLeftIndex: 24, snapRightIndex: 20 },
      { angle:13.2,   spriteNum:26, snapLeftIndex: 24, snapRightIndex: 20 },
      { angle:6.5,    spriteNum:25, snapLeftIndex: 24, snapRightIndex: 20 },
      { angle:0.0,    spriteNum:24, snapLeftIndex: 24, snapRightIndex: 24 },  // E (24)
      { angle:-8.9,   spriteNum:23, snapLeftIndex: 27, snapRightIndex: 24 },
      { angle:-17.8,  spriteNum:22, snapLeftIndex: 27, snapRightIndex: 24 },
      { angle:-26.6,  spriteNum:21, snapLeftIndex: 27, snapRightIndex: 27 },  // NE (27)
      { angle:-39.3,  spriteNum:20, snapLeftIndex: 0,  snapRightIndex: 27 },
      { angle:-52.0,  spriteNum:19, snapLeftIndex: 0,  snapRightIndex: 27 },
      { angle:-64.7,  spriteNum:18, snapLeftIndex: 0,  snapRightIndex: 27 },
      { angle:-77.4,  spriteNum:17, snapLeftIndex: 0,  snapRightIndex: 27 }
    ];

    this.BOUNDING_BOXES = [
      [[35, 15], [63, 15], [63, 68], [35, 68]],
      [[30, 19], [57, 13], [68, 64], [41, 70]],
      [[25, 24], [50, 12], [73, 59], [48, 71]],
      [[22, 29], [44, 12], [76, 54], [54, 71]],
      [[20, 36], [37, 14], [78, 47], [61, 69]],
      [[19, 42], [32, 17], [79, 41], [66, 66]],
      [[19, 47], [28, 20], [79, 36], [70, 63]],
      [[21, 51], [25, 24], [77, 32], [73, 59]],
      [[23, 56], [23, 28], [76, 28], [76, 56]],
      [[24, 58], [21, 31], [74, 25], [77, 52]],
      [[26, 61], [20, 34], [72, 22], [78, 49]],
      [[29, 64], [19, 37], [69, 19], [79, 46]],
      [[32, 66], [19, 41], [66, 17], [79, 42]],
      [[39, 70], [20, 49], [59, 13], [78, 34]],
      [[47, 71], [23, 57], [51, 12], [75, 26]],
      [[55, 71], [28, 63], [43, 12], [70, 20]],
      [[63, 68], [35, 68], [35, 15], [63, 15]],
      [[70, 63], [43, 71], [28, 20], [55, 12]],
      [[75, 57], [51, 71], [23, 26], [47, 12]],
      [[78, 49], [59, 70], [20, 34], [39, 13]],
      [[79, 41], [66, 66], [19, 42], [32, 17]],
      [[79, 37], [69, 64], [19, 46], [29, 19]],
      [[78, 34], [72, 61], [20, 49], [26, 22]],
      [[77, 31], [74, 58], [21, 52], [24, 25]],
      [[76, 28], [76, 56], [23, 55], [23, 27]],
      [[73, 24], [77, 51], [25, 59], [21, 32]],
      [[70, 20], [79, 47], [28, 63], [19, 36]],
      [[66, 17], [79, 42], [32, 66], [19, 41]],
      [[61, 14], [78, 36], [37, 69], [20, 47]],
      [[54, 12], [76, 29], [44, 71], [22, 54]],
      [[48, 12], [73, 24], [50, 71], [25, 59]],
      [[41, 13], [68, 19], [57, 70], [30, 64]]
    ];

    this.gamePadMapping = {
      'B':  'UP_ARROW',
      'A':  'DOWN_ARROW',
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
    this.fallingTarget = null;
    this.fallingTargetSteps = 0;
    this.fallStepsDropping = 0;
    this.reversing = false;
    this.rightArrowDown = false;
    this.leftArrowDown = false;
    this.paused = false;
    this.playback = false;
    this.goingOneWay = false;
    this.velocity = new Crafty.math.Vector2D(0,0);
    this.MAX_VELOCITY = 10;
    this.currentReelId = "";
    this.lastRecordedFrame = 0;
    this.seekTarget = {x:0, y:0};
    this.seekMode = false;
    this.seekEnginePower = this.engineMagnitude;

    this.RECORDABLE_METHODS =  [
      this._upArrowPressed,
      this._upArrowReleased,
      this._downArrowPressed,
      this._downArrowReleased,
      this._leftArrowPressed,
      this._leftArrowReleased,
      this._rightArrowPressed,
      this._rightArrowReleased
    ];

    this.requires('Actor, Keyboard, Collision, spr_car, SpriteAnimation');

    this.attr({z:1000});
    this.collision( new Crafty.polygon([35,15],[63,15],[63,68],[35,68]) );

    this.onHit('Solid', this.stopMovement);
    this.onHit('Hole', this.holeHit);
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
    for (pos = 0; pos< 32; pos++) {
      spriteSheet = this.spriteSheetXY(pos);
      this.animate('Straight_'+pos,  spriteSheet.x, spriteSheet.y, spriteSheet.x)
      spriteSheet = this.spriteSheetXY(32 + pos);
      this.animate('TurnLeft_'+pos,  spriteSheet.x, spriteSheet.y, spriteSheet.x)
      spriteSheet = this.spriteSheetXY(64 + pos);
      this.animate('TurnRight_'+pos,  spriteSheet.x, spriteSheet.y, spriteSheet.x)
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

  _polygonString: function(polygon) {
      var polyString = "[";
      for (var i=0; i<polygon.points.length; i++) {
        polyString += "[" + Math.round(polygon.points[i][0]) + ", " + Math.round(polygon.points[i][1]) + "]"
        if (i < polygon.points.length-1) {
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

  _keyDown: function() {
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

  _keyUp: function(e) {
    if (this.paused || this.playback) {
      return;
    }
    if(e.key == Crafty.keys['LEFT_ARROW']) {
      this._leftArrowReleased();
    } else if (e.key == Crafty.keys['RIGHT_ARROW']) {
      this._rightArrowReleased();
    } else if (e.key == Crafty.keys['UP_ARROW']) {
      this._upArrowReleased();
    } else if (e.key == Crafty.keys['DOWN_ARROW']) {
      this._downArrowReleased();
    }
  },

  _bindKeyControls: function() {
    this.bind('KeyDown', this._keyDown);
    this.bind('KeyUp', this._keyUp);
  },

  _bindGamePadControls: function() {
    Game.gamePad.bind(Gamepad.Event.BUTTON_DOWN, this._gamePadButtonDown.bind(this));
    Game.gamePad.bind(Gamepad.Event.BUTTON_UP, this._gamePadButtonUp.bind(this));
    Game.gamePad.bind(Gamepad.Event.AXIS_CHANGED, this._gamePadAxisChanged.bind(this));
  },

  _gamePadButtonDown: function(e) {
    if (this.paused || this.playback) {
      return;
    }
    Game.dispatchKeyDown(this.gamePadMapping[e.control]);
  },

  _gamePadButtonUp: function(e) {
    if (this.paused || this.playback) {
      return;
    }
    Game.dispatchKeyUp(this.gamePadMapping[e.control]);
  },

  _gamePadAxisChanged: function(e) {
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
    this.animate(reelId, 1, 1);
  },

  _adjustDirectionIndexForSnapToDirection: function () {
    if (this.falling || this.goingOneWay || this.spinning) {
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
    if (this.engineOn) {
      this.enginePower = this.reversing ? -this.engineMagnitude : this.engineMagnitude;
      if (this.directionIncrement == 0) {
        Game.playSoundEffect('engine_rev', -1, 1.0);
      } else {
        Game.playSoundEffect('wheel_spin', -1, 1.0);
      }
    } else {
      this.enginePower = 0.0;
      Game.playSoundEffect('engine_idle', -1, 0.3);
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
    this.exhaust.updateAngle(this.DIRECTIONS[this.directionIndex].angle);
  },

  _updateMovementToSeek: function(targetX, targetY) {
    var target = new Crafty.math.Vector2D(targetX, targetY);
    var position = new Crafty.math.Vector2D(this.x, this.y);
    var desiredVelocity = target.subtract(position);
    desiredVelocity.normalize();
    // Calculating the desired velocity to target at max speed
    desiredVelocity.scale(this.MAX_VELOCITY);

    // Steering force = desired velocity - current velocity
    var steeringForce = desiredVelocity.clone();
    steeringForce.subtract(this.velocity);

    // Apply the force to the car’s velocity
    this.velocity.add(steeringForce);

    this.movement.x = this.velocity.x;
    this.movement.y = this.velocity.y;
  },

  _updateMovementToArrive: function(targetX, targetY) {
    var target = new Crafty.math.Vector2D(targetX, targetY);
    var position = new Crafty.math.Vector2D(this.x, this.y);
    var desiredVelocity = target.subtract(position);

    // The distance is the magnitude of the vector pointing from location to target.
    var distance = desiredVelocity.magnitude();
    desiredVelocity.normalize();
    // If we are closer than 100 pixels...
    if (distance < 100) {
      // Set the magnitude according to how close we are.
      var m = (distance / 100) * (this.MAX_VELOCITY*2);
      desiredVelocity.scale(m);
    } else {
      // Otherwise, proceed at maximum speed.
      desiredVelocity.scale(this.MAX_VELOCITY*2);
    }
    // Steering force = desired velocity - current velocity
    var steeringForce = desiredVelocity.clone();
    steeringForce.subtract(this.velocity);

    // Apply the force to the car’s velocity
    this.velocity.add(steeringForce);

    this.movement.x = this.velocity.x;
    this.movement.y = this.velocity.y;
  },

  _adjustDirectionIncrementForSeekTarget: function() {
    var target = new Crafty.math.Vector2D(this.seekTarget.x, this.seekTarget.y);
    var position = new Crafty.math.Vector2D(this.x, this.y);
    var desiredVelocity = target.subtract(position);

    // The distance is the magnitude of the vector pointing from location to target.
    var distance = desiredVelocity.magnitude();
    desiredVelocity.normalize();
    // If we are closer than 100 pixels...
    // TODO adjust distance threshold for slowing car
    if (distance < 50) {
      // Set the magnitude according to how close we are.
      var m = (distance / 100) * (this.MAX_VELOCITY);
      desiredVelocity.scale(m);
    } else {
      // Otherwise, proceed at maximum speed.
      desiredVelocity.scale(this.MAX_VELOCITY);
    }

    // Steering force = desired velocity - current velocity
    var steeringForce = desiredVelocity.clone();
    steeringForce.subtract(this.velocity);

    // New velocity = current velocity + steering force
    var newVelocity = this.velocity.clone();
    newVelocity.add(steeringForce);

    // Determine angle between current and new velocity
    var angleBetween = Crafty.math.radToDeg(this.velocity.angleBetween(newVelocity));

    // TODO change seek angle
    var SEEK_ANGLE = 30;
    if (angleBetween > SEEK_ANGLE) {
      this.directionIncrement = +1;
    } else if (angleBetween < -SEEK_ANGLE) {
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

  _isSeekTargetReached: function() {
    var target = new Crafty.math.Vector2D(this.seekTarget.x, this.seekTarget.y);
    var position = new Crafty.math.Vector2D(this.x, this.y);
    var distanceVector = target.subtract(position);
    var distance = distanceVector.magnitude();
    // TODO adjust target distance threshold which triggers target reached
    return (distance < Game.SEEK_TARGET_RADIUS);
  },

  _handleFalling: function() {
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

    // Keep moving towards falling target
    if (this.fallingTargetSteps < 0 && Math.round(this.x) === this.fallingTarget.x && Math.round(this.y) === this.fallingTarget.y) {
      // Arrived at falling target, so start dropping
      // -play falling sound
      Game.playSoundEffect('falling', 1, 1.0);
      // -adjust z otherwise the car sometimes drops through the floor
      this.z -= 50;
      // -stop exhaust
      this.exhaust.stop();
      // -setup dropping movement
      this.fallStepsDropping = 40;
    } else {
      // Move towards falling target
      this.fallingTargetSteps--;
      this._updateMovementToArrive(this.fallingTarget.x, this.fallingTarget.y);
      this._updatePosition();
      this._updateViewportWithPlayerInCenter();
      this._triggerPlayerMoved();
    }
  },

  _updateMovement: function () {
    // going one-way or spinning means enginePower cannot be zero

    var enginePower = this.goingOneWay ? (this.reversing ? -this.engineMagnitude : this.engineMagnitude) : this.enginePower;
    enginePower = this.spinning ? this.spinningEnginePower : enginePower;
    enginePower = this.seekMode ? this.seekEnginePower : enginePower;

    var directionIndex = this.spinning ? this.spinningDirectionIndex : this.directionIndex;

    var carAngleInRadians = this.DIRECTIONS[directionIndex].angle * (Math.PI / 180);

    var engineForce = new Crafty.math.Vector2D(
      Math.cos(carAngleInRadians) * enginePower,
      Math.sin(carAngleInRadians) * enginePower
    );

    if (enginePower == 0.0 && this.velocity.magnitude() < 0.5) {
      // force car to stop
      this.velocity = new Crafty.math.Vector2D(0.0, 0.0);
    } else {
      var friction = this.velocity.clone();
      friction.normalize();
      friction.negate();
      friction.x = (isNaN(friction.x) ? 0.0 : Math.round(friction.x * 100)/100);
      friction.y = (isNaN(friction.y) ? 0.0 : Math.round(friction.y * 100)/100);
      friction.scale(this.frictionMagnitude);

      var acceleration = new Crafty.math.Vector2D(0.0, 0.0);
      acceleration.add(engineForce);
      acceleration.add(friction);

      this.velocity.add(acceleration);
    }

    // Limit max velocity
    if (this.velocity.magnitude() > this.MAX_VELOCITY) {
      this.velocity.scaleToMagnitude(this.MAX_VELOCITY);
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
    this.exhaust.updatePosition(this.x, this.y, this.DIRECTIONS[this.directionIndex].angle);
  },

  _clonePoints: function (points) {
    var clonedPoints = [];
    for (var i=0; i<points.length; i++) {
      clonedPoints.push(points[i].slice(0));
    }
    return clonedPoints;
  },

  _updateCollisionBoundingBox: function () {
    var clonedPoints = this._clonePoints(this.BOUNDING_BOXES[this.directionIndex]);
    this.collision(new Crafty.polygon(clonedPoints));
  },

  _updateViewportWithPlayerInCenter: function () {
    Crafty.viewport.scrollXY((Crafty.viewport.width / 2 - this.x - this.w / 2),(Crafty.viewport.height / 2 - this.y - this.h / 2));
  },

  _triggerPlayerMoved: function () {
    Crafty.trigger("PlayerMoved", {x: this.x, y: this.y});
  },

  _enterFrame: function() {
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

  _pause: function() {
    this.paused = true;
    // destroy exhaust
    this.exhaust.destroy();
  },

  _unpause: function() {
    this.paused = false;
    // recreate exhaust
    this.exhaust = Crafty.e('Exhaust');
    this.exhaust.updateAngle(this.DIRECTIONS[this.directionIndex].angle);
    this.exhaust.updatePosition(this.x, this.y, this.DIRECTIONS[this.directionIndex].angle);
  },

  setPosition: function(x, y) {
    this.falling = false;
    this.spinning = false;
    this.seekMode = false;
    this.goingOneWay = false;
    this.engineOn = false;
    this.enginePower = 0.0;
    this.velocity = new Crafty.math.Vector2D(0,0);
    this.directionIncrement = 0;
    this.directionIndex = 27;  // NE
    this.snappedDirectionIndex = this.directionIndex;
    this.lastRecordedFrame = 0;
    this.x = x;
    this.y = y;
    this.z = Math.floor(y);
    this._updateViewportWithPlayerInCenter();
    this._triggerPlayerMoved();
    // set exhaust
    this.exhaust.updateAngle(this.DIRECTIONS[this.directionIndex].angle);
    this.exhaust.updatePosition(this.x, this.y, this.DIRECTIONS[this.directionIndex].angle);
  },

  seek: function(targetX, targetY) {
    this.seekTarget.x = targetX;
    this.seekTarget.y = targetY;
    this.engineOn = true;
    this.seekMode = true;
  },

  setPlaybackMode: function() {
    this.playback = true;
  },

  playbackStoredValue: function(storedValue) {
    this.RECORDABLE_METHODS[storedValue].call(this);
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

  stopMovement: function(hitData) {
    if (this.falling) {
      return;
    }
    // undo previous movement
    if (this.engineOn) {
      this.x -= this.movement.x;
      this.y -= this.movement.y;
    }
    // set velocity to zero
    this.velocity = new Crafty.math.Vector2D(0.0, 0.0);

    // move away from obstacle
    // Note: not exactly sure what 'normal' is, but adding it x and y seems to avoid the car getting stuck :-)
    var hd = hitData[0];
    this.x += hd.normal.x;
    this.y += hd.normal.y;
  },

  // TODO improve detection of fall by improving bounding boxes of car
  holeHit: function(hitData) {
    if (this.falling) {
      return;
    }
    var totalOverlap = 0;
    hitData.forEach(function(hd) {
      totalOverlap += Math.abs(hd.overlap);
    });
    if (totalOverlap > 25) {
      // play car horn sound
      Game.playSoundEffect('car_horn', 1, 1.0);
      // show falling text
      var fallingText = Crafty.e('TipText');
      fallingText.setName("FallingText");
      fallingText.text("UH OH!");
      fallingText.show();
      // start falling mode
      this.fallingTarget = this._calculateFallingTarget(hitData);
      this.fallingTargetSteps = 40;
      this.falling = true;
    }
  },

  _calculateFallingTarget: function(hitData) {
    if (hitData.length == 1) {
      // overlapping 1 hole:  fall from center of hole
      return { x: Math.round(hitData[0].obj.x) + 15, y: Math.round(hitData[0].obj.y - 23) };
    } else if (hitData.length == 2) {
      // overlapping 2 holes:  fall from closest point from the car to a line drawn from one hole to the other hole
      var holeOnePosition = new Crafty.math.Vector2D(hitData[0].obj.x + 15, hitData[0].obj.y - 23);
      var holeTwoPosition = new Crafty.math.Vector2D(hitData[1].obj.x + 15, hitData[1].obj.y - 23);
      var carPosition = new Crafty.math.Vector2D(this.x, this.y);
      var target = VectorUtils.getNormalPoint(carPosition, holeOnePosition, holeTwoPosition);
      return { x: Math.round(target.x), y: Math.round(target.y) };
    } else {
      // overlapping 3 or more holes:  fall in place
      return { x: Math.round(this.x), y: Math.round(this.y) };
    }
  },

  oilHit: function(hitData) {
    if (this.falling || this.spinning) {
      return;
    }
    this.spinning = true;
    this.spinningEnginePower = (this.reversing ? -this.engineMagnitude : this.engineMagnitude);
    this.spinningDirectionIndex = this.directionIndex;
    this.spinningSteps = 100;
  },

  normalGroundHit: function(hitData) {
    if (this.falling) {
      return;
    }
    this.frictionMagnitude = 0.8;
    this.engineMagnitude = 1.1;
  },

  iceGroundHit: function(hitData) {
    if (this.falling) {
      return;
    }
    this.frictionMagnitude = 0.05;
    this.engineMagnitude = 0.2;
  },

  mudGroundHit: function(hitData) {
    if (this.falling) {
      return;
    }
    this.frictionMagnitude = 0.9;
    this.engineMagnitude = 0.5;
  },

  breakingGroundHit: function(hitData) {
    if (this.falling) {
      return;
    }
    this.frictionMagnitude = 0.8;
    this.engineMagnitude = 1.1;
    hitData.forEach(function(hd) {
      var breakingGround = hd.obj;
      breakingGround.startBreaking();
    });
  },

  oneWayHit: function(hitData) {
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

  oneWayFinished: function() {
    if (this.goingOneWay) {
      this.goingOneWay = false;
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

Crafty.c('RecordControl', {
  init: function() {
    this.requires('2D, DOM, Keyboard');
    this.playerX = 0;
    this.playerY = 0;

    this.bind('KeyDown', this._keyDown);
    this.bind("PlayerMoved", this._updatePosition);
  },

  _updatePosition: function(playerPos) {
    this.playerX = playerPos.x;
    this.playerY = playerPos.y;
    if (RecordUtils.isRecording()) {
      this.recordingMessage.x = 10 - Crafty.viewport.x;
      this.recordingMessage.y = 10 - Crafty.viewport.y;
    }
  },

  _keyDown: function() {
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

  _showRecordingMessage: function() {
    this.recordingMessage = Crafty.e('FlashingText');
    this.recordingMessage.setName("Recording");
    this.recordingMessage.attr({ w: 150, h:100 })
    this.recordingMessage.text("RECORDING");
    this.recordingMessage.textFont({ type: 'normal', weight: 'normal', size: '30px', family: 'ARCADE' })
    this.recordingMessage.textColor("#0061FF");
  },

  _hideRecordingMessage: function() {
    this.recordingMessage.destroy()
  }
});

Crafty.c('PlayerPlaybackControl', {
  init: function() {
    this.requires('2D, DOM, Text');
    this.playbackIndex = 0;
    this.recordedData = [];
    this.player = null;
    this.seekTarget = null;
    this.debugMode = false;

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
  start: function(player, recordedData) {
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

  _seekTargetReached: function() {
    if (this.playbackIndex >= this.recordedData.length) {
      if (this.debugMode) {
        this.seekTarget.setPosition(0, 0);
      }
      Crafty.trigger("PlaybackEnded");
      return;
    }
    this._setupNextSeekTarget();
  },

  _setupNextSeekTarget: function() {
    var target = {x: this.recordedData[this.playbackIndex], y: this.recordedData[this.playbackIndex+1]};
    if (this.debugMode) {
      this.seekTarget.setPosition(target.x, target.y);
    }
    this.player.seek(target.x, target.y);
    // TODO skipping 4 targets seems to improve the smoothness of the car's path (ie. less changing of direction)
    this.playbackIndex += 10;
    //this.playbackIndex += 2;
  }
});

Crafty.c('AttractModeControl', {
  init: function() {
    this.requires('2D, DOM, Text, Persist');
    var width = 650;
    var height = 60;
    var titleColour = "#AD0000";
    var pressAnyKeyColour = "#0061FF";

    var x = Crafty.viewport.width/2 - Crafty.viewport.x - (width/2);
    var y = Crafty.viewport.height/2 - Crafty.viewport.y - 140;

    this.title = Crafty.e('OutlineText');
    this.title.addComponent("Persist");
    this.title.setName("TitleText");
    this.title.attr({ x: x, y: y - 130, w: width, h:height })
    this.title.text("CRAFTY RACER");
    this.title.textFont({ type: 'normal', weight: 'normal', size: '60px', family: 'ARCADE' })
    this.title.textColor(titleColour);
    this.title.visible = false;
    
    this.demo = Crafty.e('FlashingText');
    this.demo.addComponent("Persist");
    this.demo.setName("TitleText");
    this.demo.attr({ x: x, y: y + 300, w: width, h:height })
    this.demo.text("DEMO");
    this.demo.textFont({ type: 'normal', weight: 'normal', size: '60px', family: 'ARCADE' })
    this.demo.textColor(titleColour);
    this.demo.visible = false;

    this.pressAnyKey = Crafty.e('FlashingText');
    this.pressAnyKey.addComponent("Persist");
    this.pressAnyKey.setName("PressAnyKeyText");
    this.pressAnyKey.attr({ x: x, y: y + 360, w: width, h:height })
    this.pressAnyKey.text("PRESS ANY KEY");
    this.pressAnyKey.textFont({ type: 'normal', weight: 'normal', size: '30px', family: 'ARCADE' })
    this.pressAnyKey.textColor(pressAnyKeyColour);
    this.pressAnyKey.visible = false;

    this.bind("PlaybackStarted", this._playbackStarted);
    this.bind("PlaybackEnded", this._playbackEnded);
    this.bind("PlayerMoved", this._updatePosition);
    this.bind('KeyDown', this._handleKeyDownOrButtonDown);
    Game.gamePad.bind(Gamepad.Event.BUTTON_DOWN, this._handleKeyDownOrButtonDown.bind(this));
  },

  stop: function() {
    this.title.visible = false;
    this.demo.visible = false;
    this.pressAnyKey.visible = false;
    Game.stopAttractMode();
  },

  _updatePosition:function () {
    var x = Crafty.viewport.width/2 - Crafty.viewport.x - (650/2);
    var y = Crafty.viewport.height/2 - Crafty.viewport.y - 140;

    this.title.attr({ x: x, y: y - 130 })
    this.demo.attr({ x: x, y: y + 300 })
    this.pressAnyKey.attr({ x: x, y: y + 360 })
  },

  _playbackStarted: function() {
    this.title.visible = true;
    this.demo.visible = true;
    this.pressAnyKey.visible = true;
  },

  _playbackEnded: function() {
    Game.resetAttractMode();
  },

  _handleKeyDownOrButtonDown: function(e) {
    this.stop();
  }
});

Crafty.c('Path', {
  init: function() {
    this.requires('2D, Canvas');
    this.z = 7000;
    this.points = { x1:0, y1:0, x2:0, y2:0 };
    this.xOffset = 50;
    this.yOffset = 50;

    this.bind("Draw", this._drawHandler);

    this.ready = true;
  },

  setPoints: function(x1, y1, x2, y2) {
    this.points.x1 = x1;
    this.points.y1 = y1;
    this.points.x2 = x2;
    this.points.y2 = y2;
    this.x = Math.min(x1, x2);
    this.y = Math.min(y1, y2);
    this.w = Math.abs(x1 - x2);
    this.h = Math.abs(y1 - y2);
  },

  _drawHandler : function (e) {
    this._drawLine(e.ctx);
  },

  _drawLine : function(ctx) {
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
  init: function() {
    this.requires('2D, Canvas');
    this.z = 8000;
    this.position = { x:0, y:0 };
    this.xOffset = 50;
    this.yOffset = 50;
    this.radius = 5;
    this.circleColour = 'green';

    this.bind("Draw", this._drawHandler);

    this.ready = true;
  },

  setPosition: function(x, y) {
    this.position.x = x;
    this.position.y = y;
    this.x = x;
    this.y = y;
    this.w = 100;
    this.h = 100;
  },

  setCircleColour: function(circleColour) {
      this.circleColour = circleColour;
  },

  setRadius: function(radius) {
    this.radius = radius;
  },

  _drawHandler : function (e) {
    this._drawCircle(e.ctx);
  },

  _drawCircle : function(ctx) {
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
  init: function() {
    this.requires('2D, Canvas');
    this.z = 7000;
    this.points = { x1:0, y1:0, x2:0, y2:0 };
    this.xOffset = 50;
    this.yOffset = 50;
    this.arrowPoints = [{x:0, y:0}, {x:0, y:0}];

    this.bind("Draw", this._drawHandler);

    this.ready = true;
  },

  setPoints: function(x1, y1, x2, y2) {
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

  _calcArrowPoints: function(linePoints) {
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

  _drawHandler : function (e) {
    this._drawLine(e.ctx);
  },

  _drawLine : function(ctx) {
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
