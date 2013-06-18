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
  // TODO adjust seek target radius, seek angle of view, and seek distance from target before slow down
  SEEK_TARGET_RADIUS: 50,
  SEEK_ANGLE: 5,
  SEEK_DISTANCE_BEFORE_SLOW_DOWN: 200,

  CAR_PLAYBACK_DATA: [15,6063,68,6014,81,5963,80,5885,80,5802,78,5702,72,5646,21,5615,-11,5569,-15,5493,-16,5461,-18,5417,-21,5376,-62,5335,-93,5320,-131,5302,-169,5284,-202,5269,-240,5251,-273,5217,-251,5186,-222,5172,-188,5155,-128,5125,-86,5104,-40,5072,-39,5035,-39,4996,-41,4951,-41,4893,-43,4857,-39,4825,-20,4796,-6,4750,22,4724,19,4689,15,4645,23,4603,75,4577,112,4558,170,4529,253,4488,342,4444,428,4401,456,4387,487,4370,484,4334,479,4285,472,4236,443,4223,406,4205,343,4174,257,4131,174,4090,132,4069,84,4045,53,4031,25,4017,-2,3992,-8,3955,-10,3919,-25,3877,-79,3871,-104,3898,-50,3925,5,3952,59,3979,129,4014,203,4051,292,4096,382,4140,471,4185,561,4229,650,4274,707,4302,766,4332,819,4358,878,4341,926,4317,952,4298,987,4264,1039,4238,1059,4200,1055,4146,1030,4126,987,4106,939,4084,899,4065,862,4047,832,4034,794,4016,752,3990,747,3952,783,3948,788,3981,797,4010,828,4025,873,4048,935,4079,966,4095,1004,4113,1053,4138,1107,4165,1173,4198,1261,4239,1345,4264,1376,4263,1415,4243,1471,4215,1540,4180,1611,4145,1700,4101,1790,4056,1875,4014,1904,3999,1944,3979,1984,3959,2030,3936,2093,3905,2176,3861,2211,3841,2174,3813,2126,3790,2088,3771,2030,3743,2000,3728,1929,3693,1852,3655,1763,3611,1699,3579,1672,3565,1644,3552,1610,3537,1571,3514,1577,3477,1599,3509,1639,3541,1681,3563,1739,3591,1822,3633,1907,3675,1936,3689,1981,3712,2028,3729,2091,3697,2162,3662,2251,3618,2330,3579,2363,3558,2361,3528,2361,3469,2361,3380,2351,3281,2318,3211,2276,3184,2215,3154,2130,3112,2050,3058,2019,3032,2017,2992,2017,2927,1992,2842,1972,2801,1913,2772,1842,2737,1753,2693,1663,2648,1574,2603,1482,2563,1386,2551,1346,2551,1293,2577,1224,2611,1136,2655,1086,2680,1026,2709,965,2739,910,2767,875,2784,846,2797,801,2820,753,2837,723,2836,685,2824,668,2784,732,2746,803,2711,892,2667,979,2623,1017,2604,1055,2585,1119,2553,1206,2510,1295,2465,1385,2421,1464,2361,1503,2294,1504,2255,1458,2221,1395,2189,1308,2146,1219,2102,1129,2057,1040,2013,952,1969,914,1950,876,1931,812,1899,725,1856,636,1811,545,1771,483,1753,451,1766,396,1793,314,1834,227,1877,190,1895,157,1911,124,1937,118,1987,117,2027,117,2077,115,2110,115,2166,89,2242,13,2302,-72,2323,-134,2306,-197,2275,-284,2232,-373,2187,-461,2140,-519,2088,-528,2025,-528,1951,-528,1853,-528,1761,-530,1712,-589,1682,-617,1668,-640,1648,-654,1613,-654,1572,-654,1501,-654,1404,-654,1304,-654,1216,-646,1154,-606,1141,-548,1141,-459,1141,-382,1141,-348,1141,-307,1141,-248,1141,-205,1141,-165,1141,-122,1141,-62,1161,-55,1220,-57,1272,-24,1308,5,1323,9,1367,43,1385,63,1357,62,1316,62,1244,62,1148,62,1100,60,1032,60,1000,58,949,57,893,55,859,55,800,55,727,53,653,53,607,53,576,53,516,53,443,51,412,51,362,50,330,50,289,49,234,40,205,7,188,-13,162],

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