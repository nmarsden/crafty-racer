Game = {
  // This defines our grid's size and the size of each of its tiles
  map_grid:{
    width: 100, //7 * 4,
    height: 100, //5 * 4,
    tile:{
      width:128,
      height:64
    }
  },

  options:{
    music:true,
    sfx:true
  },

  player:null,
  gamePad:null,
  fontFamily: 'QBO', //'SIMPLETYPE', //'UNICODE0',
  levels:[],
  levelIndex:0,
  waypointIndex:0,
  waypoint:null,
  navigator:null,
  countdown:null,
  levelIndicator:null,
  NUMBER_OF_WAYPOINTS:10,
  waypoints:{},
  initialPlayerPosition:null,
  attractMode:false,
  CAR_PLAYBACK_DATA: [15,6063,100,0,109,0,109,4,121,5,177,0,177,4,192,5,213,1,226,2,244,2,244,4,272,5,273,3,282,0,340,0,340,4,365,5,417,0,417,6,436,1,437,7,462,0,516,0,516,4,543,5,591,0,591,6,621,7,682,0,682,6,698,7,815,0,815,6,831,7,877,0,877,6,895,7,959,1,987,2,1039,2,1039,4,1042,3,1046,5,1086,0,1091,0,1091,4,1101,5,1135,1,1149,2,1204,2,1204,4,1210,3,1212,5,1249,0,1252,0,1252,4,1258,1,1262,5,1284,0,1343,1,1363,2,1422,2,1422,4,1441,5,1442,3,1460,0,1550,0,1550,4,1575,5,1632,1,1642,2,1722,2,1722,6,1742,3,1745,7,1753,0,1786,0,1786,6,1816,7,2014,0,2014,6,2037,7,2136,0,2136,6,2188,7,2237,0,2237,4,2248,5,2308,0,2308,6,2326,7,2443,0,2443,6,2466,7,2509,0,2509,6,2517,7,2601,0,2601,4,2612,5,2625,0,2625,4,2643,5,2666,0,2666,6,2678,1,2682,7,2687,2,2712,2,2712,4,2721,5,2724,3,2731,0,2808,0,2808,4,2828,5,2871,0,2871,4,2891,5,2917,0,2917,4,2929,5,2931,1,2973,0,2976,0,2976,4,2989,1,2991,5,3027,2,3068,2,3068,4,3077,5,3081,3,3125,0,3132,0,3132,4,3145,5,3147,1,3175,0,3177,0,3177,4,3186,1,3188,5,3206,0,3234,0,3234,6,3247,7,3249,1,3278,0,3292,1,3304,2,3342,2,3342,4,3359,3,3361,5,3385,0,3399,0,3399,6,3452,7,3490,0,3490,6,3514,7,3532,0,3532,4,3607,5,3624,0,3624,6,3667,7,3702,0,3702,4,3716,5,3732,1,3745,4,3762,0,3762,4,3772,1,3773,5,3799,0],

  width:function () {
    return this.map_grid.width * this.map_grid.tile.width;
  },

  height:function () {
    return this.map_grid.height * this.map_grid.tile.height;
  },

  viewportWidth:function () {
    return 1024;
  },

  viewportHeight:function () {
    return 640;
  },

  toTilePosition:function (position) {
    return {
      col: Math.round((position.x / 128) + (position.y / 64)),
      row: Math.round((position.y - (position.x/2)) / 64)
    };
  },

  playMusic:function (music) {
    Game.musicPlaying = music;
    if (Game.options.music) {
      Crafty.audio.play(Game.musicPlaying, -1, 1.0);
    }
  },

  unpauseMusic:function () {
    Crafty.audio.unpause(Game.musicPlaying);
  },

  pauseMusic:function () {
    Crafty.audio.pause(Game.musicPlaying);
  },

  toggleMusic:function () {
    Game.options.music = !Game.options.music;
    if (Game.options.music) {
      Game.unpauseMusic();
    } else {
      Game.pauseMusic();
    }
  },

  playSoundEffect:function (effectName, repeat, volume) {
    if (Game.options.sfx) {
      Game.stopAllSoundsExcept(effectName, Game.musicPlaying, "woop", "low_time", "disappear");
      Crafty.audio.play(effectName, repeat, volume);
    }
  },

  stopAllSoundsExcept:function () {
    var excluded = Array.prototype.slice.call(arguments);
    for (var sound in Crafty.audio.sounds) {
      if (excluded.indexOf(sound) == -1) {
        Crafty.audio.stop(sound);
      }
    }
  },

  toggleSoundEffects:function () {
    Game.options.sfx = !Game.options.sfx;
    if (!Game.options.sfx) {
      Game.stopAllSoundsExcept(Game.musicPlaying);
    }
  },

  toggleClass: function (elem, className) {
    if (q(elem).hasClass(className)) {
      q(elem).removeClass(className);
    } else {
      q(elem).addClass(className);
    }
  },

  initOptions:function () {
    document.getElementsByClassName("music")[0].onclick = function() {
      Game.toggleClass(this, 'off');
      Game.toggleMusic();
    }
    document.getElementsByClassName("sfx")[0].onclick = function() {
      Game.toggleClass(this, 'off');
      Game.toggleSoundEffects();
    };
  },

  createGlassOverlay: function() {
    var overlay = Crafty.e('2D, Canvas, spr_glass_overlay');
    x = Crafty.viewport.width/2 - Crafty.viewport.x - (700 / 2);
    y = Crafty.viewport.height/2 - Crafty.viewport.y - (450 / 2);
    overlay.attr({ x: x, y: y, z: 7000, w: 700, h: 450 });
    return overlay;
  },

  showMainMenu: function() {
    Game.playMusic('menu_music');
    Game.mainMenu = Crafty.e('MainMenu');
    Game.mainMenu.setName("MainMenu");
    Game.mainMenu.showMenu();
  },

  destroyMainMenu: function() {
    Game.mainMenu.destroy();
  },

  initWaypoint: function () {
    var waypoint = this.waypoints[this.waypointIndex];
    this.waypoint = Crafty.e('Waypoint');
    this.waypoint.setName("Waypoint");
    this.waypoint.setPosition(waypoint.x, waypoint.y);
  },

  initPauseControl: function() {
    Game.pauseControl = Crafty.e('PauseControl');
    Game.pauseControl.setName("PauseControl");
  },

  disablePauseControl: function() {
    Game.pauseControl.disable();
  },

  enablePauseControl: function() {
    Game.pauseControl.enable();
  },

  initNavigator: function () {
    this.navigator = Crafty.e('Navigator');
    this.navigator.setName("Navigator");
  },

  initCountdown: function () {
    this.countdown = Crafty.e('Countdown');
    this.countdown.setName("Countdown");
  },

  initMiniMap: function () {
    this.miniMap = Crafty.e('MiniMap');
    this.miniMap.setName("MiniMap");
  },

  initLevelIndicator: function () {
    this.levelIndicator = Crafty.e('LevelIndicator');
    this.levelIndicator.setName("LevelIndicator");
  },

  initWaypointsCollectedIndicator: function () {
    Game.waypointsCollectedIndicator = Crafty.e('WaypointsCollectedIndicator');
    Game.waypointsCollectedIndicator.setName("WaypointsCollectedIndicator");
  },

  initPlayer: function() {
    Game.player = Crafty.e('Car');
    Game.player.setName("Player");
    Game.player.setPosition(Game.initialPlayerPosition.x, Game.initialPlayerPosition.y);
  },

  initRecordControl: function() {
    Game.recordControl = Crafty.e('RecordControl');
  },

  initLevel: function () {
    this.waypointIndex = 0;
    Game.initPauseControl();
    Game.initNavigator();
    Game.initCountdown();
    Game.initMiniMap();
    Game.initLevelIndicator();
    Game.resetWaypoint();
    Game.initWaypointsCollectedIndicator();
    Game.initPlayer();
    Game.initRecordControl();
  },

  isLevelComplete: function () {
    return this.NUMBER_OF_WAYPOINTS === (this.waypointIndex + 1);
  },

  getLevelNumber: function() {
    return Game.levelIndex + 1;
  },

  getLevelCompleteMessage: function () {
    return 'LEVEL ' + Game.getLevelNumber() + ' COMPLETE!';
  },

  setInitialPlayerPosition: function(playerX, playerY) {
    Game.initialPlayerPosition = {x: playerX, y: playerY};
  },

  addWaypoint: function (idx, x, y) {
    this.waypoints[idx] = {x: x, y: y};
  },

  nextWaypoint: function () {
    this.waypointIndex++;
    Game.resetWaypoint();
  },

  resetWaypoint: function () {
    this.waypoint && this.waypoint.destroy();
    Game.initWaypoint();

//    this.countdown.start(1000000);
    this.countdown.start(30000);
  },

  isGameComplete: function () {
    return this.numberOfLevels() === (this.levelIndex + 1);
  },

  numberOfLevels: function () {
    return LEVELS.length;
  },

  resetLevels: function() {
    this.levelIndex = 0;
  },

  nextLevel: function() {
    this.levelIndex++;
  },

  destroyAll2DEntities: function() {
    Crafty("2D").each(function () {
      if (!this.has("Persist")) this.destroy();
    });
  },

  selectLevel: function(levelIndex) {
    this.levelIndex = levelIndex;

    Game.startLevel();
  },

  loadLevel: function() {
    var WAYPOINT_TILE_FIRST_GID = 7;
    var ONE_WAY_TILE_FIRST_GID = 19;
    var ONE_WAY_TYPES = ['NE','SE','SW','NW'];

    var getWaypointIndex = function(entity) {
      for (var index=0; index<10; index++) {
        if (entity.has("Tile" + (WAYPOINT_TILE_FIRST_GID + index))) {
          return index;
        }
      }
    };

    var getOneWayType = function(entity) {
      for (var index=0; index<4; index++) {
        if (entity.has("Tile" + (ONE_WAY_TILE_FIRST_GID + index))) {
          return ONE_WAY_TYPES[index];
        }
      }
    };

    Crafty.e("2D, Canvas, TiledMapBuilder")
      .setName("TiledMapBuilder")
      .setMapDataSource( LEVELS[Game.levelIndex] )
      .createWorld( function( tiledmap ){
        var entities, obstacle, entity;

        // Set properties of entities on the 'Ground_Sides' layer
        entities = tiledmap.getEntitiesInLayer('Ground_Sides');
        for (obstacle = 0; obstacle < entities.length; obstacle++){
          entity = entities[obstacle];

          //Set z-index for correct view: front, back
          entity.z = Math.floor(entity._y - (entity._h*2));
        }

        // Set properties of entities on the 'Ground_Tops' layer
        entities = tiledmap.getEntitiesInLayer('Ground_Tops');
        for (obstacle = 0; obstacle < entities.length; obstacle++){
          entity = entities[obstacle];

          //Set z-index for correct view: front, back
          entity.z = Math.floor(entity._y - entity._h - 10);

          if (entity.__image === "assets/images/ice_block.png") {
            // Ice Top
            entity.addComponent("IceGround");
          } else if (entity.__image === "assets/images/mud_block.png") {
            // Mud Top
            entity.addComponent("MudGround");
          } else if (entity.__image === "assets/images/Iso_Cubes_01_128x128_Alt_00_007.png") {
            // Breaking Top
            entity.addComponent("BreakingGround");
            // Set Breaking Side
            var tilePosition = Game.toTilePosition({x:entity._x, y:entity._y});
            var breakingSide = tiledmap.getTile(tilePosition.row+1, tilePosition.col+1, 'Ground_Sides');
            entity.setBreakingSide(breakingSide);
          } else {
            // Ground Top
            entity.addComponent("NormalGround");
          }
          entity.addComponent("Collision")
          entity.collision( new Crafty.polygon([0,32],[64,0],[128,32],[64,64]) );
        }

        // Set properties of entities on the 'Solid_Sides' layer
        entities = tiledmap.getEntitiesInLayer('Solid_Sides');
        for (obstacle = 0; obstacle < entities.length; obstacle++){
          entity = entities[obstacle];

          //Set z-index for correct view: front, back
          entity.z = Math.floor(entity._y );

          // Set collision settings
          entity.addComponent("Collision")
          entity.collision( new Crafty.polygon([0,32],[64,0],[128,32],[64,64]) );

          // Hide collision marker
          if (entity.__image === "assets/images/Collision_Marker.png") {
            entity.addComponent("Hole");
            entity._visible = false;
          } else {
            entity.addComponent("Solid");
          }
        }

        // Set properties of entities on the 'Solid_Tops' layer
        entities = tiledmap.getEntitiesInLayer('Solid_Tops');
        for (obstacle = 0; obstacle < entities.length; obstacle++){
          var entity = entities[obstacle];

          //Set z-index for correct view: front, back
          entity.z = Math.floor(entity._y + entity._h);
        }

        // Set properties of entities on the 'Objects' layer
        entities = tiledmap.getEntitiesInLayer('Objects');
        for (obstacle = 0; obstacle < entities.length; obstacle++){
          var entity = entities[obstacle];

          // Setup player and hide player marker
          if (entity.__image === "assets/images/Player_Marker.png") {
            Game.setInitialPlayerPosition(entity._x + 15, entity._y - 17);
            entity._visible = false;
          }

          // Setup waypoints and hide waypoint markers
          if (entity.__image === "assets/images/Waypoints_Marker.png") {
            var waypointIndex = getWaypointIndex(entity);
            Game.addWaypoint(waypointIndex, entity._x + 32, entity._y - 16);
            entity._visible = false;
          }

          // Setup one way entities
          if (entity.__image === "assets/images/one_way_marker.png") {
            entity.z = Math.floor(entity._y - entity._h - 10);
            entity.addComponent('OneWay');
            entity.setOneWayType(getOneWayType(entity));
            entity.addComponent("Collision")
            entity.collision( new Crafty.polygon([0,32],[64,0],[128,32],[64,64]) );
          }

          // Setup Oil entities
          if (entity.__image === "assets/images/oil_spill.png") {
            entity.z = Math.floor(entity._y - entity._h - 10);
            entity.addComponent('Oil');
            entity.addComponent("Collision")
            entity.collision( new Crafty.polygon([0,32],[64,0],[128,32],[64,64]) );
          }
        }

      });
  },

  isAttractMode: function() {
    return this.attractMode;
  },

  startAttractMode: function() {
    Game.attractModeControl = Crafty.e('AttractModeControl');
    this.attractMode = true;
    Game.selectLevel(1); // Level 2
  },

  stopAttractMode: function() {
    Game.attractModeControl.destroy();
    this.attractMode = false;
    Game.stopAllSoundsExcept();
    Game.destroyAll2DEntities();
    Game.showMainMenu();
  },

  resetAttractMode: function() {
    Game.retryLevel();
    Game.disablePauseControl();
    Game.startPlayerPlayback();
  },

  initPlayerPlaybackControl: function() {
    Game.playerPlaybackControl = Crafty.e('PlayerPlaybackControl');
    Game.startPlayerPlayback();
  },

  startPlayerPlayback: function() {
    Game.playerPlaybackControl.start(Game.player, Game.CAR_PLAYBACK_DATA);
  },

  startLevel: function() {
    Game.destroyAll2DEntities();

    Debug.logEntitiesAndHandlers("startLevel: after destroyAll2DEntities");

    Crafty.viewport.scroll('_x', 0);
    Crafty.viewport.scroll('_y', 0);

    var loadingText = Crafty.e('FlashingText')
      .setName("LoadingText")
      .text('LOADING')
      .textFont({ type: 'normal', weight: 'normal', size: '30px', family: 'ARCADE' })
      .textColor('#0061FF')
      .attr({ w: 320 })
      .attr({ x: Crafty.viewport.width/2 - Crafty.viewport.x - 160, y: Crafty.viewport.height/2 - Crafty.viewport.y + 60});

    var startLevelLoading = false;

    var enableStartLevelLoading = function() {
      startLevelLoading = true;
    };

    var handleEnterFrame = function() {
      if (!startLevelLoading) {
        return;
      }
      startLevelLoading = false;

      Game.loadLevel();

      Game.initLevel();

      if (Game.isAttractMode()) {
        Game.destroyMainMenu();
        Game.disablePauseControl();
        Game.initPlayerPlaybackControl();
      }

      loadingText.destroy();

      // uncomment to show FPS
      //this.showFps = Crafty.e('ShowFPS');
      //this.showFps.setName("ShowFPS");

      Game.playMusic('level_music');
      Debug.logEntitiesAndHandlers("startLevel: after loadLevel");
    }

    Crafty.bind("EnterFrame", handleEnterFrame);

    // Introduce delay to ensure LOADING text is rendered before startLevelLoading
    setTimeout(enableStartLevelLoading, 100);
  },

  pauseGame: function() {
    Crafty.trigger("PauseGame");
  },

  unpauseGame: function() {
    Crafty.trigger("UnpauseGame");
  },

  retryLevel: function() {
    this.waypointIndex = 0;
    Game.resetWaypoint();
    var entities = Crafty("WasBreaking");
    entities.each(function() {
      this.restoreAsUnbroken();
    });
    Game.waypointsCollectedIndicator.resetNumberCollected();
    Game.player.setPosition(Game.initialPlayerPosition.x, Game.initialPlayerPosition.y);
    Game.playMusic('level_music');
    Game.unpauseGame();
    Game.enablePauseControl()
  },

  dispatchKeyDown: function(key) {
    if (key != undefined) {
      Crafty.keyboardDispatch({ keyCode:Crafty.keys[key], type:"keydown" });
    }
  },

  dispatchKeyUp: function(key) {
    if (key != undefined) {
      Crafty.keyboardDispatch({ keyCode:Crafty.keys[key], type:"keyup" });
    }
  },

  start:function () {
    Game.initOptions();

    Game.gamePad = new Gamepad();
    Game.gamePad.init();

    Crafty.init(Game.width(), Game.height());
    Crafty.viewport.init(Game.viewportWidth(), Game.viewportHeight());
    Crafty.viewport.clampToEntities=false;
    Crafty.viewport.bounds = {
      min:{x:0, y:0},
      max:{x:Game.width(), y:Game.height()}
    };
    Crafty.background('rgb(130,192,255)');
    Crafty.scene('Loading');

    // Uncomment to show debug bar
    //Crafty.debugBar.show();
  }

}

RecordUtils = {
  recording : false,
  recordedData : [],

  isRecording: function() {
    return this.recording;
  },

  startRecording: function(playerX, playerY) {
    this.recording = true;
    this.recordedData = [playerX, playerY];
  },

  stopRecording: function() {
    this.recording = false;
    console.log("recordedData: [" + this._normalizeFrameValues(this.recordedData).join(",") + "]");
  },

  recordValue: function(storedValue) {
    if (!this.recording) {
      return;
    }
    this.recordedData.push(Crafty.frame());
    this.recordedData.push(storedValue);
  },

  _normalizeFrameValues: function(recordedData) {
    if (recordedData.length === 0) {
      return [];
    }
    // adjust frame values to start from frame 100
    var normalizedRecordedData = [];
    normalizedRecordedData.push(recordedData[0]); // player x start pos
    normalizedRecordedData.push(recordedData[1]); // player y start pos
    var startFrame = recordedData[2];
    for (var i=2; i<recordedData.length; i++) {
      normalizedRecordedData.push(recordedData[i++] - startFrame + 100);
      normalizedRecordedData.push(recordedData[i]);
    }
    return normalizedRecordedData;
  }
};

Debug = {
  isEnabled:false,

  findEntitiesWithName: function(entityName) {
    var foundEntities = [];
    var entities = Crafty("*");
    if (entities.length === 0) {
      return foundEntities;
    }
    for (var id in entities) {
      if (!entities.hasOwnProperty(id) || id == "length") continue; //skip
      var entity = Crafty(parseInt(id, 10));
      if (entity._entityName === entityName) {
        foundEntities.push(entity);
      }
    }
    return foundEntities;
  },

  allOtherEntityNames: function() {
    var otherNames = [];
    var entities = Crafty("*");
    if (entities.length === 0) {
      return otherNames;
    }
    for (var id in entities) {
      if (!entities.hasOwnProperty(id) || id == "length") continue; //skip
      var entity = Crafty(parseInt(id, 10));
      if (entity.length == 0) continue; //skip
      if (entity.has("Ground_Sides") || entity.has("Ground_Tops") || entity.has("Solid_Sides") || entity.has("Solid_Tops") || entity.has("Objects") ) {
        // do nothing
      } else {
        if (entity._entityName) {
          otherNames.push(entity._entityName);
        } else {
          otherNames.push(entity);
        }
      }
    }
    return otherNames;
  },

  numberOfEntityHandlers: function() {
    var entityHandlers = [], totalHandlers = 0;
    Object.keys(Crafty.handlers()).forEach(
      function(eventName) {
        var numEventHandlers = Object.keys(Crafty.handlers()[eventName]).length;
        totalHandlers += numEventHandlers;
        entityHandlers.push(numEventHandlers + " " + eventName);
      });
    entityHandlers.push(totalHandlers + " Total");
    return entityHandlers
  },

  logEntitiesAndHandlers: function(message) {
    if (!Debug.isEnabled) {
      return;
    }
    var total = Crafty("*").length;
    var groundNum = Crafty("Ground_Sides").length + Crafty("Ground_Tops").length;
    var solidNum = Crafty("Solid_Sides").length + Crafty("Solid_Tops").length;
    var objectNum = Crafty("Objects").length;
    var otherNum = total - (groundNum + solidNum + objectNum);
    console.log(message, " - Entities: ", total, "Total,", groundNum, "Ground,", solidNum, "Solid,", objectNum, "Objects,", otherNum, "Other");
    console.log("Other entities:", Debug.allOtherEntityNames());
    console.log("Entity Handlers:", Debug.numberOfEntityHandlers());
  },

  logTriggeredEvents: function() {
    if (!Debug.isEnabled) {
      return;
    }
    Crafty.bind('WaypointReached', function() { console.log("WaypointReached triggered") });
    Crafty.bind('TimesUp', function() { console.log("TimesUp triggered") });
    Crafty.bind('OffTheEdge', function() { console.log("OffTheEdge triggered") });
    Crafty.bind('EnterFrame', function() { console.log("EnterFrame triggered") });
    Crafty.bind('PauseGame', function() { console.log("PauseGame triggered") });
    Crafty.bind('UnpauseGame', function() { console.log("UnpauseGame triggered") });
  }
}