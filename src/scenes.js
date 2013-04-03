// Game scene
// -------------
Crafty.scene('Game', function() {
  this.pauseControl = Crafty.e('PauseControl');
  this.pauseControl.setName("PauseControl");

  this.player = Crafty.e('Car').at(3, 18);
  this.player.setName("Player");

  Game.initLevel();

//  this.block = Crafty.e('Block').at(1, 1);

  // uncomment to show FPS
//  this.showFps = Crafty.e('ShowFPS');
//  this.showFps.setName("ShowFPS");

  Crafty.viewport.scroll('_x', Crafty.viewport.width/2 - this.player.x - this.player.w/2);
  Crafty.viewport.scroll('_y', Crafty.viewport.height/2 - this.player.y - this.player.h/2);

//  for(var x=0; x<=Game.map_grid.width; x++) {
//    Crafty.e('Block').at(x, 0);
//    Crafty.e('Block').at(x, Game.map_grid.height);
//  }
//  for(var y=1; y<Game.map_grid.height; y++) {
//    Crafty.e('Block').at(0, y);
//    Crafty.e('Block').at(Game.map_grid.width, y);
//  }

  // Show the victory screen once all waypoints are reached
  this.show_victory = function() {
    if (Game.isLevelComplete()) {
      Crafty.trigger('SceneEnding', this);
      Crafty.scene('Victory');
    } else {
      Game.nextWaypoint();
    }
  }
  this.bind('WaypointReached', this.show_victory);

  // Show the game over screen when time is up
  this.show_game_over = function() {
    Crafty.trigger('SceneEnding', this);
    Crafty.scene('GameOver');
  }
  this.bind('TimesUp', this.show_game_over);

  Game.playMusic();

}, function() {
  // Remove our event binding from above so that we don't
  //  end up having multiple redundant event watchers after
  //  multiple restarts of the game
  this.unbind('WaypointReached', this.show_victory);
  this.unbind('TimesUp', this.show_game_over);
});


// Loading scene
// -------------
Crafty.scene('Loading', function(){
  Crafty.e('2D, DOM, Text')
    .text('Loading; please wait...')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() });

  Crafty.load([
    'assets/car.png',
    'assets/block.png'
  ], function(){
    Crafty.sprite(98, 'assets/car.png', {
      spr_car:  [6, 1]
    }, 0, 0);
    Crafty.sprite(96, 'assets/block.png', {
      spr_block:  [0, 0]
    }, 0, 0);
    Crafty.sprite(96, 'assets/waypoint.png', {
      spr_waypoint:  [0, 0]
    }, 0, 0);
    Crafty.sprite(96, 'assets/navigator.png', {
      spr_navigator:  [0, 0]
    }, 0, 0);
    Crafty.scene('Game');
  })

  // Define our sounds for later use
  Crafty.audio.add({
    engine_idle:        ['assets/engine_idle.ogg'],
    engine_rev:         ['assets/engine_rev.ogg'],
    engine_rev_faster:  ['assets/engine_rev_faster.ogg'],
    wheel_spin:         ['assets/wheel_spin.ogg'],
    music:              ['assets/Happy Bee.mp3']
  });

});

// Victory scene
// -------------
Crafty.scene('Victory', function() {
  var levelComplete = Crafty.e('2D, DOM, Text');
  levelComplete.text(Game.getLevelCompleteMessage)
  var x = Crafty.viewport.width/2 - Crafty.viewport.x - 160;
  var y = Crafty.viewport.height/2 - Crafty.viewport.y - 60;
  levelComplete.attr({ x: x, y: y, w: 320 })
  levelComplete.textFont({ type: 'normal', weight: 'bold', size: '50px', family: 'Arial' })
  levelComplete.textColor('#0061FF');

  var pressAnyKey = Crafty.e('2D, DOM, FlashingText');
  pressAnyKey.attr({ x: x, y: y + 120, w: 320 })
  pressAnyKey.text("PRESS ANY KEY TO CONTINUE");
  pressAnyKey.textFont({ type: 'normal', weight: 'normal', size: '20px', family: 'Arial' })
  pressAnyKey.textColor('#0061FF');

  // After a short delay, watch for the player to press a key, then restart
  // the game when a key is pressed
  var delay = true;
  setTimeout(function() { delay = false; }, 1000);

  this.restart_game = function() {
    if (!delay) {
      if (Game.isGameComplete()) {
        Game.resetLevels();
      } else {
        Game.nextLevel();
      }
      Crafty.scene('Game');
    }
  };
  Crafty.bind('KeyDown', this.restart_game);

  Game.stopAllSoundsExcept();

}, function() {
  // Remove our event binding from above so that we don't
  //  end up having multiple redundant event watchers after
  //  multiple restarts of the game
  this.unbind('KeyDown', this.restart_game);
});

// GameOver scene
// -------------
Crafty.scene('GameOver', function() {
  var timesUpText = Crafty.e('2D, DOM, Text');
  timesUpText.text('Times Up')
  var x = Crafty.viewport.width/2 - Crafty.viewport.x - 160;
  var y = Crafty.viewport.height/2 - Crafty.viewport.y - 60;
  timesUpText.attr({ x: x, y: y, w: 320 })
  timesUpText.textFont({ type: 'normal', weight: 'bold', size: '40px', family: 'Arial' })
  timesUpText.textColor('#0061FF');

  var gameOverText = Crafty.e('2D, DOM, Text');
  gameOverText.text('GAME OVER!')
  x = Crafty.viewport.width/2 - Crafty.viewport.x - 160;
  y = Crafty.viewport.height/2 - Crafty.viewport.y - 20;
  gameOverText.attr({ x: x, y: y, w: 320 })
  gameOverText.textFont({ type: 'normal', weight: 'bold', size: '50px', family: 'Arial' })
  gameOverText.textColor('#0061FF');

  var pressAnyKey = Crafty.e('2D, DOM, FlashingText');
  pressAnyKey.attr({ x: x, y: y + 60, w: 320 })
  pressAnyKey.text("PRESS ANY KEY TO CONTINUE");
  pressAnyKey.textFont({ type: 'normal', weight: 'normal', size: '20px', family: 'Arial' })
  pressAnyKey.textColor('#0061FF');

  // After a short delay, watch for the player to press a key, then restart
  // the game when a key is pressed
  var delay = true;
  setTimeout(function() { delay = false; }, 1000);

  this.restart_game = function() {
    if (!delay) {
      Crafty.scene('Game');
    }
  };
  Crafty.bind('KeyDown', this.restart_game);

  Game.stopAllSoundsExcept();

}, function() {
  // Remove our event binding from above so that we don't
  //  end up having multiple redundant event watchers after
  //  multiple restarts of the game
  this.unbind('KeyDown', this.restart_game);
});
