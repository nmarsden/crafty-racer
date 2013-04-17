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

Crafty.c('Waypoint', {
  init: function() {
    this.requires('Actor, spr_waypoint, SpriteAnimation, Collision');
    this.collision( new Crafty.polygon([32,0],[64,16],[64,48],[32,64],[0,48],[0,16]) );
    this.z = 1000;

    this.animate('ChangeColour', 0, 0, 10); //setup animation
    this.animate('ChangeColour', 15, -1); // start animation
  },

  reached: function() {
    Game.playSoundEffect('woop', 1, 1.0);
    Crafty.e('TipText').setName("TipText");

    Crafty.trigger('WaypointReached', this);
  }

});

Crafty.c('Navigator', {
  init: function() {
    this.requires('Actor, spr_navigator');
    this.z = 5000;
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

Crafty.c('MainMenu', {
  init: function() {
    this.requires('Menu');

    this.addMenuItem("Play", this.showLevelMenu.bind(this), "P");
    this.addMenuItem("Instructions", this.comingSoonHandler("Instructions").bind(this), "I");
    this.addMenuItem("Settings", this.comingSoonHandler("Settings").bind(this), "S");
    this.addMenuItem("Credits", this.comingSoonHandler("Credits").bind(this), "C");
  },

  showLevelMenu: function() {
    this.hideMenu()
    this.levelSelectMenu = Crafty.e('LevelSelectMenu');
    this.levelSelectMenu.setName("LevelSelectMenu");
    this.levelSelectMenu.setMenuOptions({
      parentMenu: this
    });
    this.levelSelectMenu.showMenu();
  },

  comingSoonHandler: function(name) {
    return function() {
      this.hideMenu()

      Crafty.e('Menu')
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
      Crafty.scene('Game');
    }
  }
});

Crafty.c('Menu', {
  init: function() {
    this.requires('2D, DOM, Text, Keyboard');
    this.z = 2000;
    this.menuItems = [];
    this.selectedMenuIndex = 0;
    this.colour = '#0061FF';
    this.selectedColour = '#FFFF00';
    this.backgroundDrawn = false;

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

    oldItem.textColor(this.colour);
    oldItem.tween({alpha: 0.5}, 60);
    oldItem.css({
      '-moz-animation-duration': '',
      '-moz-animation-name': '',
      '-moz-animation-iteration-count': '',
      '-webkit-animation-duration': '',
      '-webkit-animation-name': '',
      '-webkit-animation-iteration-count': ''
    });

    newItem.textColor(this.selectedColour);
    newItem.tween({alpha: 1.0}, 5);
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
    var width = 380;
    var height = 60;
    var alpha = 0.6;
    var totalHeight = 80 * this.menuItems.length;
    var x = 51 - Crafty.viewport.x;
    var y = 51 - Crafty.viewport.y;

    this.selectedMenuIndex = 0;

    this.bind('KeyDown', this.handleKeyDown);
    this.bind('SelectionChanged', this.handleSelectionChanged);

    if (this.options.parentMenu === null && !this.backgroundDrawn) {
      // display overlay
      this.backgroundDrawn = true;

      var overlay = Crafty.e('2D, DOM');
      overlay.attr({ x: x, y: y, w: Crafty.viewport.width-102, h: Crafty.viewport.height-102 });
      overlay.css({
        'border-style': 'solid',
        'border-color': this.colour,
        'background-color': '#101010',
        'background-image': 'url(assets/menu_background.png)'
      });
      // display menu instructions bottom right
      this.displayMenuInstructions();
    }

    // display menu items
    x = Crafty.viewport.width/2 - Crafty.viewport.x - (width / 2) - 10;
    y = Crafty.viewport.height/2 - Crafty.viewport.y - (totalHeight / 2); //150;
    for (var i=0; i<this.menuItems.length; i++) {
      var item = this.menuItems[i];
      var menuItem = Crafty.e('2D, DOM, Text, Tween');
      var textColor = (i === 0) ? this.selectedColour : this.colour;
      var alpha = (i === 0) ? 1.0 : 0.5;
      menuItem.text(item.displayName);
      menuItem.attr({ x: x, y: y, w: width, h: height, alpha: alpha });
      menuItem.textFont({ type: 'normal', weight: 'bold', size: '50px', family: 'Arial' });
      menuItem.textColor(textColor);
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
        'padding': '5px',
        'text-shadow': 'rgb(179,218,255) 4px 4px 4px',
        'text-transform': 'uppercase'
      });
      item.entity = menuItem;
      y += 80;
    }

  },

  displayMenuInstructions: function() {
    var x = Game.viewportWidth() - 270 - Crafty.viewport.x;
    var y = Game.viewportHeight() - 162 - Crafty.viewport.y;
    var alpha = 0.5

    // - up arrow / down arrow: navigate
    var upArrow = Crafty.e('2D, DOM, spr_up_arrow');
    upArrow.attr({ x: x, y: y,  w: 51, h: 48 });
    upArrow.alpha = alpha;
    var downArrow = Crafty.e('2D, DOM, spr_down_arrow');
    downArrow.attr({ x: x+56, y: y, w: 51, h: 48 });
    downArrow.alpha = alpha;
    var navigate = Crafty.e('2D, DOM, Text');
    navigate.text("navigate");
    navigate.attr({ x: x+110, y: y, w: 100, h: 48 });
    navigate.textFont({ type: 'normal', weight: 'normal', size: '25px', family: 'Arial' });
    navigate.css({
      'padding': '5px',
      'text-align': 'left'
    });
    navigate.textColor(this.colour);
    navigate.alpha = alpha;

    // - enter: select
    var enterKey = Crafty.e('2D, DOM, spr_enter_key');
    enterKey.attr({ x: x, y: y+53, w: 100, h: 48 });
    enterKey.alpha = alpha;
    var select = Crafty.e('2D, DOM, Text');
    select.text("select");
    select.attr({ x: x+110, y: y+53, w: 100, h: 48 });
    select.textFont({ type: 'normal', weight: 'normal', size: '25px', family: 'Arial' });
    select.css({
      'padding': '5px',
      'text-align': 'left'
    });
    select.textColor(this.colour);
    select.alpha = alpha;
  },

  hideMenu: function() {
    // unbind event handlers
    this.unbind('KeyDown', this.handleKeyDown);
    this.unbind('SelectionChanged', this.handleSelectionChanged);
    // hide menu items
    for(var i=0; i<this.menuItems.length; i++) {
      var entity = this.menuItems[i].entity;
      entity._visible = false;
      entity.css({
        '-moz-animation-duration': '',
        '-moz-animation-name': '',
        '-moz-animation-iteration-count': '',
        '-webkit-animation-duration': '',
        '-webkit-animation-name': '',
        '-webkit-animation-iteration-count': ''
      });

    }
  },

  menuItemSelectedViaHotKey: function() {

  },

  handleKeyDown: function() {
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
      selectedMenuItem = this.menuItems[this.selectedMenuIndex];
      selectedMenuItem.menuItemFunction();
      this.hideMenu();

    } else if ((selectedMenuItem = this.menuItemSelectedViaHotKey()) != null) {
      selectedMenuItem.menuItemFunction();
      this.hideMenu();

    } else if (this.options.escapeKeyHidesMenu && this.isDown('ESC')) {
      this.hideMenu();
      if (this.options.parentMenu) {
        this.options.parentMenu.showMenu();
      }
    }

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

    this.LOW_SPEED = 4;
    this.HIGH_SPEED = 10;
    this.TURN_DELAY = 40;
    this.turningStartTime = 0;
    this.speed = this.LOW_SPEED;
    this.direction = -26.6;
    this.directionIncrement = 0;
    this.moving = false;
    this.movingStartTime = 0;
    this.movement = {};

    this.requires('Actor, Keyboard, Collision, spr_car, SpriteAnimation')
      .stopOnSolids()

    this.attr({z:1000});
    this.collision( new Crafty.polygon([35,15],[63,15],[63,68],[35,68]) );

    this.onHit('Waypoint', this.waypointReached);

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
        this.directionIncrement = -1;
        this.turningStartTime = Date.now();
      } else if (this.isDown('RIGHT_ARROW')) {
        this.directionIncrement = +1;
        this.turningStartTime = Date.now();
      }
      if (!this.moving && this.isDown('UP_ARROW')) {
        this.moving = true;
        this.movingStartTime = Date.now();
      }
  },

  _keyUp: function(e) {
    if(e.key == Crafty.keys['LEFT_ARROW']) {
      this.snappedDirectionIndex = this.DIRECTIONS[this.directionIndex].snapLeftIndex;
      this.directionIncrement = 0;
    } else if (e.key == Crafty.keys['RIGHT_ARROW']) {
      this.snappedDirectionIndex = this.DIRECTIONS[this.directionIndex].snapRightIndex;
      this.directionIncrement = 0;
    } else if (e.key == Crafty.keys['UP_ARROW']) {
      this.moving = false;
    } else if (e.key == Crafty.keys['DOWN_ARROW']) {
    }
  },

  _changeSprite: function () {
    var spriteNumber = this.DIRECTIONS[this.directionIndex].spriteNum;
    if (this.directionIncrement == 0) {
      this.animate('Straight_' + spriteNumber, 1, -1);
    } else if (this.directionIncrement > 0) {
      this.animate('TurnRight_' + spriteNumber, 1, -1);
    } else if (this.directionIncrement < 0) {
      this.animate('TurnLeft_' + spriteNumber, 1, -1);
    }
  },

  _adjustDirectionIndexForSnapToDirection: function () {
    if (this.directionIncrement === 0 && this.directionIndex != this.snappedDirectionIndex) {
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
    }
  },

  _adjustSpeedAndChangeSoundEffect: function () {
    if (this.moving) {
      this.speed = this.LOW_SPEED;
      if (this.directionIncrement == 0) {
        var timeMoving = Date.now() - this.movingStartTime;
        if (timeMoving < 500) {
          Game.playSoundEffect('engine_rev', -1, 1.0);
        } else {
          Game.playSoundEffect('engine_rev_faster', -1, 1.0);
          this.speed = this.HIGH_SPEED;
        }
      } else {
        Game.playSoundEffect('wheel_spin', -1, 1.0);
      }
    } else {
      Game.playSoundEffect('engine_idle', -1, 0.3);
    }
  },

  _updateDirection: function () {
    var timeTurning = Date.now() - this.turningStartTime;
    if (timeTurning > this.TURN_DELAY) {
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
  },

  _updateMovement: function () {
    this.movement.x = Math.round(Math.cos(this.direction * (Math.PI / 180)) * 1000 * this.speed) / 1000;
    this.movement.y = Math.round(Math.sin(this.direction * (Math.PI / 180)) * 1000 * this.speed) / 1000;
  },

  _updatePosition: function () {
    this.x += this.movement.x;
    this.y += this.movement.y;

    //set z-index
    var z = this._y;
    //console.log("Car:", "z", z);
    this.z = Math.floor(z);
  },

  _updateCollisionBoundingBox: function () {
    // TODO Use pre-calculated bounding box based on direction
    var boundingBox = this.boundingPolygon(this.direction, this.w, this.h);
    this.collision(boundingBox);
  },

  _updateViewportWithPlayerInCenter: function () {
    Crafty.viewport.scrollXY((Crafty.viewport.width / 2 - this.x - this.w / 2),(Crafty.viewport.height / 2 - this.y - this.h / 2));
  },

  _triggerPlayerMoved: function () {
    Crafty.trigger("PlayerMoved", {x: this.x, y: this.y});
  },

  _enterFrame: function() {
    this._changeSprite();
    this._adjustDirectionIndexForSnapToDirection();
    this._adjustSpeedAndChangeSoundEffect();

    if (this.moving) {
      this._updateDirection();
      this._updateMovement();
      this._updatePosition();
      this._updateCollisionBoundingBox();
      //console.log("Player:", "x", this.x, "y", this.y);
      this._updateViewportWithPlayerInCenter();
      this._triggerPlayerMoved();
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

  // Registers a stop-movement function to be called when
  //  this entity hits an entity with the "Solid" component
  stopOnSolids: function() {
    this.onHit('Solid', this.stopMovement);

    return this;
  },

  // Stops the movement
  stopMovement: function(hitData) {
    // undo previous movement
    if (this.moving) {
      this.x -= this.movement.x;
      this.y -= this.movement.y;
    }
    // move away from obstacle
    // Note: not exactly sure what 'normal' is, but adding it x and y seems to avoid the car getting stuck :-)
    var hd = hitData[0];
    this.x += hd.normal.x;
    this.y += hd.normal.y;
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