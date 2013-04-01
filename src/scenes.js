// Game scene
// -------------
Crafty.scene('Game', function() {
  this.pauseControl = Crafty.e('PauseControl');
  this.pauseControl.setName("PauseControl");

  this.player = Crafty.e('Car').at(3, 18);
  this.player.setName("Player");

  this.waypoint = Crafty.e('Waypoint').at(5, 5);
  this.waypoint.setName("Waypoint");

  this.countdown = Crafty.e('Countdown');
  this.countdown.setName("Countdown");
  this.countdown.start(10000);

  this.navigator = Crafty.e('Navigator');
  this.navigator.setName("Navigator");
  this.navigator.setWaypointPosition(this.waypoint.x, this.waypoint.y);

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
    Crafty.scene('Victory');
  }

  this.bind('WaypointReached', this.show_victory);

  Game.playMusic();

}, function() {
  // Remove our event binding from above so that we don't
  //  end up having multiple redundant event watchers after
  //  multiple restarts of the game
  this.unbind('WaypointReached', this.show_victory);
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
  var victoryText = Crafty.e('2D, DOM, Text');
  victoryText.text('Goal Reached!')
  var x = Crafty.viewport.width/2 - Crafty.viewport.x - 30;
  var y = Crafty.viewport.height/2 - Crafty.viewport.y - 30;
  victoryText.attr({ x: x, y: y })

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
