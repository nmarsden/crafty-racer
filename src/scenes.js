// Game scene
// -------------
Crafty.scene('Game', function() {
  Debug.logTriggeredEvents();
  Debug.logEntitiesAndHandlers("Before Menu");

  Game.showMainMenu();

  // Show the victory screen once all waypoints are reached
  this.show_victory = function() {
    if (Game.isLevelComplete()) {
      Game.pauseGame();
      Game.disablePauseControl();
      Game.stopAllSoundsExcept('woop');
      Game.playMusic('end_level_music');
      var levelCompleteControl = Crafty.e('LevelCompleteControl');
      levelCompleteControl.setName("LevelCompleteControl");
    } else {
      Game.nextWaypoint();
    }
  }
  Crafty.bind('WaypointReached', this.show_victory);

  // Show the game over screen when time is up
  this.show_game_over_times_up = function() {
    Game.stopAllSoundsExcept();
    Game.pauseGame();
    Game.disablePauseControl();

    var gameOverControl = Crafty.e('GameOverControl');
    gameOverControl.setName("GameOverControlTimesUp");
    gameOverControl.setReason("TIMES UP");
  }
  Crafty.bind('TimesUp', this.show_game_over_times_up);

  // Show the game over screen when off the edge
  this.show_game_over_off_the_edge = function() {
    Game.stopAllSoundsExcept();
    Game.pauseGame();
    Game.disablePauseControl();

    var gameOverControl = Crafty.e('GameOverControl');
    gameOverControl.setName("GameOverControlOffTheEdge");
    gameOverControl.setReason("OFF THE EDGE");
  }
  Crafty.bind('OffTheEdge', this.show_game_over_off_the_edge);

}, function() {
});


// Loading scene
// -------------
Crafty.scene('Loading', function(){

  Crafty.viewport.scroll('_x', 0);
  Crafty.viewport.scroll('_y', 0);

  Crafty.e('FlashingText')
    .setName("LoadingText")
    .text('LOADING')
    .textFont({ type: 'normal', weight: 'normal', size: '30px', family: 'ARCADE' })
    .textColor('#0061FF')
    .attr({ w: 320 })
    .attr({ x: Crafty.viewport.width/2 - Crafty.viewport.x - 160, y: Crafty.viewport.height/2 - Crafty.viewport.y + 60});

  Crafty.load([
    'assets/engine_idle.ogg',
    'assets/engine_rev.ogg',
    'assets/wheel_spin.ogg',
    'assets/woop.ogg',
    'assets/beep_1.mp3',
    'assets/simple_beep_nav.mp3',
    'assets/badminton_racket_fast_movement_swoosh_002.mp3',
    'assets/cartoon_slide_whistle_descend_version_3.mp3',
    'assets/76376__spazzo-1493__game-over.wav',
    'assets/Pling-KevanGC-1485374730.mp3',
    'assets/Happy_Bee.mp3',
    'assets/Enter_the_party.mp3',
    'assets/Show_Your_Moves.mp3',
    'assets/car.png',
    'assets/waypoint_animation.png',
    'assets/navigator.png',
    "assets/Iso_Cubes_01_128x128_Alt_00_003.png",
    "assets/Iso_Cubes_01_128x128_Alt_00_004.png",
    "assets/Iso_Cubes_01_128x128_Alt_00_007.png",
    "assets/ice_block.png",
    "assets/mud_block.png",
    "assets/oil_spill.png",
    "assets/waypoint_indicator.png",
    "assets/Collision_Marker.png",
    "assets/Player_Marker.png",
    "assets/Waypoints_Marker.png",
    "assets/one_way_marker.png",
    "assets/up_arrow_51x48.png",
    "assets/right_arrow_51x48.png",
    "assets/down_arrow_51x48.png",
    "assets/left_arrow_51x48.png",
    "assets/escape_key_51x48.png",
    "assets/enter_key_100x48.png",
    "assets/glass_overlay.png",
    "assets/menu_background.png"
  ], function(){
    Crafty.sprite(98, 'assets/car.png', {
      spr_car:  [6, 1]
    }, 0, 0);
    Crafty.sprite(64, 'assets/waypoint_animation.png', {
      spr_waypoint:  [0, 0]
    }, 0, 0);
    Crafty.sprite(21, 'assets/waypoint_indicator.png', {
      spr_waypoint_indicator:  [0, 0]
    }, 0, 0);
    Crafty.sprite(128, 64, 'assets/one_way_marker.png', {
      spr_one_way:  [0, 0]
    }, 0, 0);
    Crafty.sprite(96, 'assets/navigator.png', {
      spr_navigator:  [0, 0]
    }, 0, 0);
    Crafty.sprite(51, 48, 'assets/up_arrow_51x48.png', {
      spr_up_arrow:  [0, 0]
    }, 0, 0);
    Crafty.sprite(51, 48, 'assets/right_arrow_51x48.png', {
      spr_right_arrow:  [0, 0]
    }, 0, 0);
    Crafty.sprite(51, 48, 'assets/down_arrow_51x48.png', {
      spr_down_arrow:  [0, 0]
    }, 0, 0);
    Crafty.sprite(51, 48, 'assets/left_arrow_51x48.png', {
      spr_left_arrow:  [0, 0]
    }, 0, 0);
    Crafty.sprite(51, 48, 'assets/escape_key_51x48.png', {
      spr_escape_key:  [0, 0]
    }, 0, 0);
    Crafty.sprite(100, 48, 'assets/enter_key_100x48.png', {
      spr_enter_key:  [0, 0]
    }, 0, 0);
    Crafty.sprite(922, 555, 'assets/menu_background.png', {
      spr_menu_background:  [0, 0]
    }, 0, 0);
    Crafty.sprite(700, 450, 'assets/glass_overlay.png', {
      spr_glass_overlay:  [0, 0]
    }, 0, 0);

    // Define our sounds for later use
    Crafty.audio.add({
      engine_idle:        ['assets/engine_idle.ogg'],
      engine_rev:         ['assets/engine_rev.ogg'],
      wheel_spin:         ['assets/wheel_spin.ogg'],
      woop:               ['assets/woop.ogg'],
      low_time:           ['assets/simple_beep_nav.mp3'],
      falling:            ['assets/cartoon_slide_whistle_descend_version_3.mp3'],
      disappear:          ['assets/Pling-KevanGC-1485374730.mp3'],
      menu_nav:           ['assets/beep_1.mp3'],
      menu_change_page:   ['assets/badminton_racket_fast_movement_swoosh_002.mp3'],
      game_over:          ['assets/76376__spazzo-1493__game-over.wav'],
      level_music:        ['assets/Happy_Bee.mp3'],
      menu_music:         ['assets/Enter_the_Party.mp3'],
      end_level_music:    ['assets/Show_Your_Moves.mp3']
    });

    Crafty.scene('Game');
  }, function(e) {
    // Progress
    //console.log("Progress:", e.percent);
  });

});
