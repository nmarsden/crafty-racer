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
  SEEK_TARGET_RADIUS:50,

  CAR_PLAYBACK_DATA: [15,6063,82,6029,156,5993,245,5948,335,5903,424,5859,514,5814,603,5770,693,5725,769,5662,793,5567,748,5480,670,5418,583,5368,489,5336,390,5342,296,5375,203,5412,104,5428,7,5407,-86,5370,-175,5324,-236,5247,-231,5150,-167,5074,-85,5018,3,4969,91,4923,180,4876,247,4804,253,4707,193,4628,112,4571,25,4521,-64,4475,-153,4430,-250,4405,-347,4421,-407,4495,-384,4576,-310,4639,-225,4691,-137,4738,-48,4784,42,4829,131,4874,220,4918,310,4963,399,5007,489,5052,578,5097,668,5141,753,5193,795,5280,757,5364,680,5427,594,5477,497,5501,399,5486,305,5451,215,5409,125,5365,35,5320,-49,5267,-96,5181,-72,5086,-1,5017,80,4958,130,4873,112,4777,43,4706,-41,4652,-129,4604,-217,4558,-307,4513,-396,4468,-486,4423,-575,4379,-665,4334,-754,4290,-844,4245,-933,4200,-1023,4156,-1112,4111,-1202,4067,-1281,4007,-1312,3914,-1272,3825,-1196,3761,-1106,3718,-1007,3713,-911,3740,-818,3779,-728,3822,-638,3866,-549,3910,-459,3955,-370,4000,-280,4044,-186,4075,-87,4071,8,4039,100,3999,190,3955,276,3905,329,3822,312,3727,234,3668,136,3667,65,3731,36,3827,27,3926,24,4026,53,4120,125,4189,210,4242,298,4290,387,4335,476,4380,565,4425,655,4470,744,4514,838,4549,937,4549,1032,4519,1124,4478,1212,4432,1273,4354,1268,4257,1204,4181,1121,4125,1034,4077,945,4031,856,3985,777,3946,715,3924,676,3921,712,3903,770,3875,833,3843,870,3825,838,3843,815,3889,811,3922,811,3962,834,4023,878,4053,928,4078,1004,4115,1094,4160,1184,4204,1280,4228,1379,4215,1472,4180,1563,4138,1653,4094,1743,4050,1832,4005,1916,3952,1963,3865,1939,3771,1868,3702,1783,3648,1695,3600,1606,3555,1517,3510,1453,3478,1493,3498,1556,3529,1642,3572,1732,3617,1821,3661,1907,3712,1959,3796,1960,3879,2039,3853,2118,3814,2207,3769,2293,3719,2348,3637,2368,3539,2374,3439,2377,3339,2377,3239,2378,3139,2377,3039,2348,2945,2277,2875,2192,2822,2105,2774,2016,2728,1926,2683,1837,2638,1747,2594,1658,2549,1567,2507,1469,2491,1372,2511,1288,2564,1247,2654,1233,2753,1200,2846,1122,2907,1025,2930,925,2938,826,2938,732,2906,679,2824,696,2729,774,2669,871,2647,971,2640,1071,2637,1171,2637,1271,2636,1371,2636,1471,2636,1570,2629,1658,2583,1694,2493,1657,2404,1579,2342,1483,2318,1389,2345,1337,2428,1313,2525,1259,2608,1179,2668,1093,2718,1004,2764,915,2809,826,2854,736,2899,647,2944,557,2988,468,3033,378,3077,289,3122,199,3167,110,3211,18,3251,-81,3263,-177,3239,-270,3201,-360,3158,-450,3114,-539,3068,-610,3000,-629,2904,-580,2819,-503,2755,-531,2724,-584,2698,-663,2658,-752,2614,-840,2567,-905,2493,-908,2396,-842,2324,-747,2295,-648,2286,-548,2283,-448,2282,-348,2274,-253,2244,-161,2203,-66,2174,33,2179,128,2210,221,2248,318,2268,416,2253,492,2190,509,2094,429,2074,345,2069,252,2033,201,1951,222,1856,293,1787,377,1733,465,1685,554,1640,643,1595,733,1550,822,1505,911,1459,982,1390,1012,1295,1022,1196,1023,1096,986,1004,903,952,804,951,709,981,618,1021,530,1069,474,1150,432,1240,359,1308,274,1360,185,1406,88,1429,-10,1414,-79,1346,-107,1250,-116,1150,-119,1051,-120,951,-117,851,-74,762,12,713,111,712,207,741,298,781,388,824,478,869,554,932,568,1024,507,1091,412,1120,312,1130,213,1125,125,1080,80,992,65,893,60,793,58,694,58,594,58,494,57,394,57,294,57,194],

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
      Crafty.audio.play(Game.musicPlaying, -1, 0.7);
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
        // TODO Remove this once finished debugging recorded path
//        RecordUtils.drawRecordedPath(Game.CAR_PLAYBACK_DATA);

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
    console.log("recordedData: [" + this._cleanData(this.recordedData).join(",") + "]");
  },

  recordValue: function(storedValue) {
    if (!this.recording) {
      return;
    }
    this.recordedData.push(Crafty.frame());
    this.recordedData.push(storedValue);
  },

  recordPosition: function(playerX, playerY) {
    if (!this.recording) {
      return;
    }
    this.recordedData.push(playerX);
    this.recordedData.push(playerY);

    // TODO Debug - draw recorded line
//    var i = this.recordedData.length - 4;
//    this._drawLine(this.recordedData[i],this.recordedData[i+1],this.recordedData[i+2],this.recordedData[i+3]);
  },

  drawRecordedPath: function(recordedData) {
    var maxIndex = recordedData.length - 2;
    for (var i=0; i<maxIndex; i=i+2) {
      //this._drawLine(recordedData[i],recordedData[i+1],recordedData[i+2],recordedData[i+3]);
      this._drawArrow(recordedData[i],recordedData[i+1],recordedData[i+2],recordedData[i+3]);
      this._drawPoint(recordedData[i],recordedData[i+1]);
    }
  },

  _drawLine: function(x1, y1, x2, y2) {
    var path = Crafty.e('Path');
    path.setPoints(x1, y1, x2, y2);
  },

  _drawArrow: function(x1, y1, x2, y2) {
    var path = Crafty.e('Arrow');
    path.setPoints(x1, y1, x2, y2);
  },

  _drawPoint: function(x, y) {
    var point = Crafty.e('Point');
    point.setPosition(x, y);
  },

  _cleanData: function(recordedData) {
    if (recordedData.length === 0) {
      return [];
    }
    var cleanedData = [];
    var recordedPoint = new Crafty.math.Vector2D(recordedData[0], recordedData[1]);
    var latestCleanPoint = recordedPoint.clone();
    cleanedData.push(recordedPoint.x); // player x start pos
    cleanedData.push(recordedPoint.y); // player y start pos
    for (var i=2; i<recordedData.length; i=i+2) {
      recordedPoint.setValues(recordedData[i], recordedData[i+1]);
      if (latestCleanPoint.distance(recordedPoint) > 30) {
        latestCleanPoint.setValues(recordedPoint);
        cleanedData.push(recordedPoint.x);
        cleanedData.push(recordedPoint.y);
      }
    }
    return cleanedData;
  }
};

VectorUtils = {
  // Finds the normal point from p to a line segment defined by points a and b
  getNormalPoint: function(p, a, b) {
    var ap = p.clone().subtract(a);
    var ab = b.clone().subtract(a);
    ab.normalize();
    ab.scale(ap.dotProduct(ab));
    return a.clone().add(ab);
  },

  // Rotates the point about the given pivot point
  rotate: function(point, pivot, angle) {
    var translatedToPivot = point.clone().subtract(pivot);
    return (new Matrix2D()).rotate(angle * (Math.PI / 180)).apply(translatedToPivot).add(pivot);
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