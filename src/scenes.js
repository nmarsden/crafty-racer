// Menu scene
// ----------
Crafty.scene('Menu', function() {

  this.mainMenu = Crafty.e('MainMenu');
  this.mainMenu.setName("MainMenu");
  this.mainMenu.setMenuOptions({
    escapeKeyHidesMenu: false
  });
  this.mainMenu.showMenu();

});

// Game scene
// -------------
Crafty.scene('Game', function() {
  var playerPos = {x:0, y:0};
  var WAYPOINT_TILE_FIRST_GID = 7;
  this.pauseControl = Crafty.e('PauseControl');
  this.pauseControl.setName("PauseControl");

  Crafty.viewport.scroll('_x', 0);
  Crafty.viewport.scroll('_y', 0);

  Crafty.e("2D, Canvas, TiledMapBuilder").setMapDataSource( LEVELS[Game.levelIndex] )
    .createWorld( function( tiledmap ){

      // Set properties of entities on the 'Solid_Sides' layer
      for (var obstacle = 0; obstacle < tiledmap.getEntitiesInLayer('Solid_Sides').length; obstacle++){
        var entity = tiledmap.getEntitiesInLayer('Solid_Sides')[obstacle];

        //Set z-index for correct view: front, back
        entity.z = Math.floor(entity._y );

        // Set collision settings
        entity.addComponent("Collision, Solid")
        entity.collision( new Crafty.polygon([0,32],[64,0],[128,32],[64,64]) );

        // Hide collision marker
        if (entity.__image === "assets/Collision_Marker.png") {
          entity._visible = false;
        }
      }

      // Set properties of entities on the 'Solid_Tops' layer
      for (var obstacle = 0; obstacle < tiledmap.getEntitiesInLayer('Solid_Tops').length; obstacle++){

        //Set z-index for correct view: front, back
        var solidTop = tiledmap.getEntitiesInLayer('Solid_Tops')[obstacle];
        solidTop.z = Math.floor(solidTop._y + solidTop._h);
      }

      // Set properties of entities on the 'Objects' layer
      for (var obstacle = 0; obstacle < tiledmap.getEntitiesInLayer('Objects').length; obstacle++){
        var entity = tiledmap.getEntitiesInLayer('Objects')[obstacle];

        // Setup player and hide player marker
        if (entity.__image === "assets/Player_Marker.png") {
          playerPos.x = entity._x + 15;
          playerPos.y = entity._y - 17;

          entity._visible = false;
        }

        var getWaypointIndex = function(entity) {
          for (var index=0; index<10; index++) {
            if (entity.has("Tile" + (WAYPOINT_TILE_FIRST_GID + index))) {
              return index;
            }
          }
        };

        // Setup waypoints and hide waypoint markers
        if (entity.__image === "assets/Waypoints_Marker.png") {
          var waypointIndex = getWaypointIndex(entity);
          Game.addWaypoint(waypointIndex, entity._x + 32, entity._y - 16);
          entity._visible = false;
        }
      }

    });

  this.player = Crafty.e('Car');
  this.player.x = playerPos.x;
  this.player.y = playerPos.y;
  this.player.setName("Player");

  //console.log("player: x", this.player.x, "y", this.player.y, "z", this.player.z, "w", this.player.w, "h", this.player.h);
  Crafty.viewport.scroll('_x', Crafty.viewport.width/2 - this.player.x - this.player.w/2);
  Crafty.viewport.scroll('_y', Crafty.viewport.height/2 - this.player.y - this.player.h/2);

  Game.initLevel();

  // uncomment to show FPS
//  this.showFps = Crafty.e('ShowFPS');
//  this.showFps.setName("ShowFPS");

  // Show the victory screen once all waypoints are reached
  this.show_victory = function() {
    if (Game.isLevelComplete()) {
      Game.stopAllSoundsExcept('woop');
      Crafty.scene('Victory');
    } else {
      Game.nextWaypoint();
    }
  }
  this.bind('WaypointReached', this.show_victory);

  // Show the game over screen when time is up
  this.show_game_over = function() {
    Game.stopAllSoundsExcept();
    Crafty.scene('GameOver');
  }
  this.bind('TimesUp', this.show_game_over);

  //console.log("Crafty.DrawManager.total2D:", Crafty.DrawManager.total2D);

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

  Crafty.viewport.scroll('_x', 0);
  Crafty.viewport.scroll('_y', 0);

  Crafty.e('2D, DOM, FlashingText')
    .text('LOADING')
    .textFont({ type: 'normal', weight: 'normal', size: '20px', family: 'Arial' })
    .textColor('#0061FF')
    .attr({ w: 320 })
    .attr({ x: Crafty.viewport.width/2 - Crafty.viewport.x - 160, y: Crafty.viewport.height/2 - Crafty.viewport.y + 60});

  Crafty.load([
    'assets/engine_idle.ogg',
    'assets/engine_rev.ogg',
    'assets/engine_rev_faster.ogg',
    'assets/wheel_spin.ogg',
    'assets/woop.ogg',
    'assets/beep_1.mp3',
    'assets/Happy Bee.mp3',
    'assets/car.png',
    'assets/block.png',
    'assets/waypoint_animation.png',
    'assets/navigator.png',
    "assets/Iso_Cubes_01_128x128_Alt_00_003.png",
    "assets/Iso_Cubes_01_128x128_Alt_00_004.png",
    "assets/up_arrow_51x48.png",
    "assets/right_arrow_51x48.png",
    "assets/down_arrow_51x48.png",
    "assets/left_arrow_51x48.png",
    "assets/escape_key_51x48.png",
    "assets/enter_key_100x48.png"
  ], function(){
    Crafty.sprite(98, 'assets/car.png', {
      spr_car:  [6, 1]
    }, 0, 0);
    Crafty.sprite(96, 'assets/block.png', {
      spr_block:  [0, 0]
    }, 0, 0);
    Crafty.sprite(64, 'assets/waypoint_animation.png', {
      spr_waypoint:  [0, 0]
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
    Crafty.sprite(51, 48, 'assets/enter_key_100x48.png', {
      spr_enter_key:  [0, 0]
    }, 0, 0);

    // Define our sounds for later use
    Crafty.audio.add({
      engine_idle:        ['assets/engine_idle.ogg'],
      engine_rev:         ['assets/engine_rev.ogg'],
      engine_rev_faster:  ['assets/engine_rev_faster.ogg'],
      wheel_spin:         ['assets/wheel_spin.ogg'],
      woop:               ['assets/woop.ogg'],
      menu_nav:           ['assets/beep_1.mp3'],
      music:              ['assets/Happy Bee.mp3']
    });

    Crafty.scene('Menu');
  }, function(e) {
    // Progress
    //console.log("Progress:", e.percent);
  });


});

// Victory scene
// -------------
Crafty.scene('Victory', function() {

  this.levelCompleteControl = Crafty.e('LevelCompleteControl');
  this.levelCompleteControl.setName("LevelCompleteControl");

}, function() {
});

// GameOver scene
// -------------
Crafty.scene('GameOver', function() {

  this.gameOverControl = Crafty.e('GameOverControl');
  this.gameOverControl.setName("GameOverControl");

}, function() {
});
