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
  currentWaypointNum:1,
  waypoint:null,
  navigator:null,
  countdown:null,
  levelIndicator:null,
  NUMBER_OF_WAYPOINTS:10,
  waypoints:{},
  attractMode:false,
  editMode:false,
  musicPlaying:'',

  // TODO tweek seek constants
  SEEK_TARGET_RADIUS: 30,
  SEEK_TARGET_FREQUENCY: 1,
  SEEK_ANGLE: 5,
  SEEK_DISTANCE_BEFORE_SLOW_DOWN: 200,
  SEEK_MAX_VELOCITY: 6,
  SEEK_DEBUG_MODE_ON: false,

  CAR_PLAYBACK_DATA: [68,6014,78,5702,-15,5493,-12,5335,-202,5269,-222,5172,-40,5072,-41,4893,-6,4750,23,4603,253,4488,487,4370,443,4223,174,4090,25,4017,-25,3877,5,3952,292,4096,650,4274,878,4341,1039,4238,987,4106,832,4034,783,3948,873,4048,1053,4138,1345,4264,1540,4180,1875,4014,2030,3936,2174,3813,2000,3728,1699,3579,1571,3514,1681,3563,1936,3689,2162,3662,2361,3528,2318,3211,2050,3058,1992,2842,1753,2693,1386,2551,1136,2655,910,2767,753,2837,732,2646,1017,2604,1295,2465,1504,2255,1219,2102,914,1950,636,1811,396,1793,157,1911,117,2077,13,2302,-284,2232,-528,2025,-530,1712,-654,1613,-654,1304,-548,1141,-307,1141,-122,1171,-24,1338,63,1387,62,1100,57,893,53,653,53,443,50,289,-13,162],

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

  playMusic:function (music) {
    if (Game.options.music) {
      Game.stopSound(Game.musicPlaying);
      Game.musicPlaying = music;
      Game.playSound(music, -1, 0.5);
    }
  },

  stopAllMusic:function () {
    Game.stopSound(Game.musicPlaying);
    Game.musicPlaying = '';
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

  playSoundEffect: function (effectName, repeat, volume, startTime) {
    if (Game.options.sfx) {
//      Game.stopAllSoundsExcept(effectName, Game.musicPlaying, "woop", "low_time", "disappear");
      Game.playSound(effectName, repeat, volume, startTime);
    }
  },

  stopSound:function (sound) {
    Crafty.audio.stop(sound);
  },

  playSound: function (soundName, repeat, volume, startTime) {
    Crafty.audio.play(soundName, repeat, volume, startTime);
  },


  stopAllSoundsExcept:function () {
    var excluded = Array.prototype.slice.call(arguments);
    for (var sound in Crafty.audio.sounds) {
      if (excluded.indexOf(sound) == -1) {
        Game.stopSound(sound);
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

  getCurrentWaypointMarker: function() {
    return Crafty("Tile" + (6 + this.currentWaypointNum));
  },

  initOptionsControl: function() {
    Game.optionsControl = Crafty.e('OptionsControl');
    Game.optionsControl.setName("OptionsControl");
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

  getPlayerMarker: function() {
    var markers = Crafty("PlayerMarker");
    return (markers.length === 1) ? markers : null;
  },

  hideMarkers: function() {
    // Hide player marker
    Game.getPlayerMarker().visible = false;
    // Hide waypoint markers
    Crafty("WaypointMarker").each(function() {
      this.visible = false;
    });
  },

  initPlayer: function() {
    Game.player = Crafty.e('Car');
    Game.player.setName("Player");
    var playerPos = Game.getPlayerMarker().getPlayerPosition();
    Game.player.setPosition(playerPos.x, playerPos.y);
  },

  initRecordControl: function() {
    Game.recordControl = Crafty.e('RecordControl');
  },

  initLevel: function () {
    Game.currentWaypointNum = 1;
    Game.hideMarkers();
    Game.initOptionsControl();
    Game.initPauseControl();
    Game.initNavigator();
    Game.initCountdown();
    Game.initMiniMap();
    Game.initLevelIndicator();
    Game.initWaypoint();
    Game.initWaypointsCollectedIndicator();
    Game.initPlayer();
    Game.initRecordControl();
  },

  isLevelComplete: function () {
    return this.NUMBER_OF_WAYPOINTS === (this.currentWaypointNum);
  },

  getLevelNumber: function() {
    return Game.levelIndex + 1;
  },

  getLevelCompleteMessage: function () {
    return 'LEVEL ' + Game.getLevelNumber() + ' COMPLETE!';
  },

  initWaypoint: function () {
    this.waypoint = Crafty.e('Waypoint');
    this.waypoint.setName("Waypoint");
    Game.resetWaypoint();
  },

  nextWaypoint: function () {
    this.currentWaypointNum++;
    Game.resetWaypoint();
  },

  resetWaypoint: function () {
    var waypointPos = Game.getCurrentWaypointMarker().getWaypointPosition();
    this.waypoint.setPosition(waypointPos.x, waypointPos.y);

    //this.countdown.start(1000000);
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
    var ONE_WAY_TILE_FIRST_GID = 17;
    var ONE_WAY_TYPES = ['NE','SE','SW','NW'];
    var GROUND_TILES = [
      { tileName: 'Tile1', component: 'NormalGround' },
      { tileName: 'Tile2', component: 'BreakingGround' },
      { tileName: 'Tile4', component: 'MudGround' },
      { tileName: 'Tile5', component: 'IceGround' }
    ];

    var isOneWayTile = function(entity) {
      return getOneWayType(entity) != 'NONE';
    };

    var getOneWayType = function(entity) {
      for (var index=0; index<4; index++) {
        if (entity.has("Tile" + (ONE_WAY_TILE_FIRST_GID + index))) {
          return ONE_WAY_TYPES[index];
        }
      }
      return 'NONE';
    };

    var addGroundComponentTo = function(entity) {
      var len = GROUND_TILES.length;
      for (var i=0; i<len; i++) {
        if (entity.has(GROUND_TILES[i].tileName)) {
          entity.addComponent(GROUND_TILES[i].component);
          return;
        }
      }
    };

    Game.tiledMapBuilder = Crafty.e("2D, Canvas, TiledMapBuilder")
      .setName("TiledMapBuilder")
      .setMapDataSource( LEVELS[Game.levelIndex] )
      .createWorld( function( tiledmap ){
        var entities, obstacle, entity;

        // Set properties of entities on the 'Ground_Tops' layer
        entities = tiledmap.getEntitiesInLayer('Ground_Tops');
        for (obstacle = 0; obstacle < entities.length; obstacle++){
          entity = entities[obstacle];
          //Set z-index for correct view: front, back
          entity.z = Math.floor(entity._y - 64 - 10);
          // Add component for ground
          addGroundComponentTo(entity);
        }

        // Set properties of entities on the 'Solid_Tops' layer
        entities = tiledmap.getEntitiesInLayer('Solid_Tops');
        for (obstacle = 0; obstacle < entities.length; obstacle++){
          var entity = entities[obstacle];

          //Set z-index for correct view: front, back
          entity.z = Math.floor(entity._y + 64);

          entity.addComponent("Solid");
        }

        // Set properties of entities on the 'Objects' layer
        entities = tiledmap.getEntitiesInLayer('Objects');
        for (obstacle = 0; obstacle < entities.length; obstacle++){
          var entity = entities[obstacle];

          if (entity.has('Tile6')) {
            // Setup player marker entity
            entity.addComponent('PlayerMarker');
          }
          else if (entity.has('Tile21')) {
            // Setup Oil entity
            entity.z = Math.floor(entity._y - 64 - 10);
            entity.addComponent('Oil');
            entity.addComponent("Collision")
            entity.collision( new Crafty.polygon([0,32],[64,0],[128,32],[64,64]) );
          }
          else if (isOneWayTile(entity)) {
            // Setup one way entities
            entity.z = Math.floor(entity._y - 64 - 10);
            entity.addComponent('OneWay');
            entity.setOneWayType(getOneWayType(entity));
            entity.addComponent("Collision")
            entity.collision( new Crafty.polygon([0,32],[64,0],[128,32],[64,64]) );
          }
          else {
            // Setup waypoints markers (Tile7 - Tile16)
            entity.addComponent("WaypointMarker");
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

  startEditMode: function() {
    this.editMode = true;
    this.levelIndex = 3; // Level 4

    Game.destroyAll2DEntities();
    Crafty.viewport.scrollXY(0, 0);
    var loadingText = Crafty.e('LoadingText');

    var startLevelLoading = function() {
      Game.loadLevel();
      loadingText.destroy();
      Game.stopAllMusic();
      Editor.initEditor();
    }

    // Introduce delay to ensure LOADING text is rendered before startLevelLoading
    setTimeout(startLevelLoading, 100);
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

    Crafty.viewport.scrollXY(0, 0);

    var loadingText = Crafty.e('LoadingText');

    var startLevelLoading = function() {

      Game.loadLevel();
      Game.initLevel();

      if (Game.isAttractMode()) {
        if (Game.SEEK_DEBUG_MODE_ON) {
          RecordUtils.drawRecordedPath(Game.CAR_PLAYBACK_DATA);
        }

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

    // Introduce delay to ensure LOADING text is rendered before startLevelLoading
    setTimeout(startLevelLoading, 100);
  },

  pauseGame: function() {
    Crafty.trigger("PauseGame");
  },

  unpauseGame: function() {
    Crafty.trigger("UnpauseGame");
  },

  retryLevel: function() {
    this.currentWaypointNum = 1;
    Game.hideMarkers();
    Game.resetWaypoint();
    var entities = Crafty("WasBreaking");
    entities.each(function() {
      this.restoreAsUnbroken();
    });
    Game.waypointsCollectedIndicator.resetNumberCollected();
    var playerPos = Game.getPlayerMarker().getPlayerPosition();
    Game.player.setPosition(playerPos.x, playerPos.y);
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
    var indexIncrement = Game.SEEK_TARGET_FREQUENCY*2;
    var targetNumber = 1;
    for (var i=2; i<maxIndex; i=i+indexIncrement) {
      //this._drawLine(recordedData[i],recordedData[i+1],recordedData[i+2],recordedData[i+3]);
      //this._drawArrow(recordedData[i],recordedData[i+1],recordedData[i+2],recordedData[i+3]);
      //console.log("#", targetNumber++, ": target index=", i);
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
    point.setRadius(Game.SEEK_TARGET_RADIUS);
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
      if (entity.has("Ground_Tops") || entity.has("Solid_Tops") || entity.has("Objects") ) {
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
    var groundNum = Crafty("Ground_Tops").length;
    var solidNum = Crafty("Solid_Tops").length;
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