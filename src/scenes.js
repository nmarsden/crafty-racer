// Game scene
// -------------
Crafty.scene('Game', function() {
  Debug.logTriggeredEvents();
  Debug.logEntitiesAndHandlers("Before Menu");

  Game.showMainMenu();

  // Show the victory screen once all waypoints are reached
  this.show_victory = function() {
    if (Game.isLevelComplete()) {
      if (Game.isAttractMode()) {
        Crafty.trigger("PlaybackEnded");
        return;
      }
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
    if (Game.isAttractMode()) {
      Crafty.trigger("PlaybackEnded");
      return;
    }
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
    if (Game.isAttractMode()) {
      Crafty.trigger("PlaybackEnded");
      return;
    }
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
    'assets/audio/engine_idle.ogg',
    'assets/audio/engine_rev.ogg',
    'assets/audio/wheel_spin.ogg',
    'assets/audio/woop.ogg',
    'assets/audio/car_horn.ogg',
    'assets/audio/beep_1.mp3',
    'assets/audio/simple_beep_nav.mp3',
    'assets/audio/badminton_racket_fast_movement_swoosh_002.mp3',
    'assets/audio/cartoon_slide_whistle_descend_version_3.mp3',
    'assets/audio/game_over.wav',
    'assets/audio/Pling-KevanGC-1485374730.mp3',
    'assets/audio/Happy_Bee.mp3',
    'assets/audio/Enter_the_party.mp3',
    'assets/audio/Show_Your_Moves.mp3',
    'assets/images/car.png',
    'assets/images/waypoint_animation.png',
    'assets/images/navigator.png',
    "assets/images/Iso_Cubes_01_128x128_Alt_00_003.png",
    "assets/images/Iso_Cubes_01_128x128_Alt_00_004.png",
    "assets/images/Iso_Cubes_01_128x128_Alt_00_007.png",
    "assets/images/ice_block.png",
    "assets/images/mud_block.png",
    "assets/images/oil_spill.png",
    "assets/images/waypoint_indicator.png",
    "assets/images/Collision_Marker.png",
    "assets/images/Player_Marker.png",
    "assets/images/Waypoints_Marker.png",
    "assets/images/one_way_marker.png",
    "assets/images/up_arrow_51x48.png",
    "assets/images/right_arrow_51x48.png",
    "assets/images/down_arrow_51x48.png",
    "assets/images/left_arrow_51x48.png",
    "assets/images/escape_key_51x48.png",
    "assets/images/enter_key_100x48.png",
    "assets/images/glass_overlay.png",
    "assets/images/menu_background.png"
  ], function(){
    Crafty.sprite(98, 'assets/images/car.png', {
      spr_car:  [6, 1]
    }, 0, 0);
    Crafty.sprite(64, 'assets/images/waypoint_animation.png', {
      spr_waypoint:  [0, 0]
    }, 0, 0);
    Crafty.sprite(21, 'assets/images/waypoint_indicator.png', {
      spr_waypoint_indicator:  [0, 0]
    }, 0, 0);
    Crafty.sprite(128, 64, 'assets/images/one_way_marker.png', {
      spr_one_way:  [0, 0]
    }, 0, 0);
    Crafty.sprite(96, 'assets/images/navigator.png', {
      spr_navigator:  [0, 0]
    }, 0, 0);
    Crafty.sprite(51, 48, 'assets/images/up_arrow_51x48.png', {
      spr_up_arrow:  [0, 0]
    }, 0, 0);
    Crafty.sprite(51, 48, 'assets/images/right_arrow_51x48.png', {
      spr_right_arrow:  [0, 0]
    }, 0, 0);
    Crafty.sprite(51, 48, 'assets/images/down_arrow_51x48.png', {
      spr_down_arrow:  [0, 0]
    }, 0, 0);
    Crafty.sprite(51, 48, 'assets/images/left_arrow_51x48.png', {
      spr_left_arrow:  [0, 0]
    }, 0, 0);
    Crafty.sprite(51, 48, 'assets/images/escape_key_51x48.png', {
      spr_escape_key:  [0, 0]
    }, 0, 0);
    Crafty.sprite(100, 48, 'assets/images/enter_key_100x48.png', {
      spr_enter_key:  [0, 0]
    }, 0, 0);
    Crafty.sprite(922, 555, 'assets/images/menu_background.png', {
      spr_menu_background:  [0, 0]
    }, 0, 0);
    Crafty.sprite(700, 450, 'assets/images/glass_overlay.png', {
      spr_glass_overlay:  [0, 0]
    }, 0, 0);

    // Define our sounds for later use
    Crafty.audio.add({
      engine_idle:        ['assets/audio/engine_idle.ogg'],
      engine_rev:         ['assets/audio/engine_rev.ogg'],
      wheel_spin:         ['assets/audio/wheel_spin.ogg'],
      woop:               ['assets/audio/woop.ogg'],
      car_horn:           ['assets/audio/car_horn.ogg'],
      low_time:           ['assets/audio/simple_beep_nav.mp3'],
      falling:            ['assets/audio/cartoon_slide_whistle_descend_version_3.mp3'],
      disappear:          ['assets/audio/Pling-KevanGC-1485374730.mp3'],
      menu_nav:           ['assets/audio/beep_1.mp3'],
      menu_change_page:   ['assets/audio/badminton_racket_fast_movement_swoosh_002.mp3'],
      game_over:          ['assets/audio/game_over.wav'],
      level_music:        ['assets/audio/Happy_Bee.mp3'],
      menu_music:         ['assets/audio/Enter_the_Party.mp3'],
      end_level_music:    ['assets/audio/Show_Your_Moves.mp3']
    });

    Crafty.scene('Game');
  }, function(e) {
    // Progress
    //console.log("Progress:", e.percent);
  });

});
