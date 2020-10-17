import {LEVELS} from './levels';
import './components/index';
import './scenes/index';
import {Editor} from './editor';
import {Debug} from './utils';
let bodyTemplate = require("./bodyTemplate.handlebars");

export let Game = {
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
    music:false,
    sfx:true
  },

  player:null,
  gamePad:null,
  fontFamily: 'QBO',
  levels:[],
  levelIndex:0,
  currentWaypointNum:1,
  waypoint:null,
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

  playSoundEffect: function (effectName, repeat, volume) {
    if (Game.options.sfx) {
//      Game.stopAllSoundsExcept(effectName, Game.musicPlaying, "woop", "low_time", "disappear");
      Game.playSound(effectName, repeat, volume);
    }
  },

  stopSound:function (sound) {
    Crafty.audio.stop(sound);
  },

  playSound: function (soundName, repeat, volume) {
    Crafty.audio.play(soundName, repeat, volume);
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
    // TODO provide options for music & effects
    // document.getElementsByClassName("music")[0].onclick = function() {
    //   Game.toggleClass(this, 'off');
    //   Game.toggleMusic();
    // }
    // document.getElementsByClassName("sfx")[0].onclick = function() {
    //   Game.toggleClass(this, 'off');
    //   Game.toggleSoundEffects();
    // };
  },

  initFullscreenButton: function() {
    if (Crafty.mobile) {
      Game.fullscreenButton = Crafty.e("FullscreenButton");
      Game.fullscreenButton.setName('FullscreenButton');
    }
  },

  showMainMenu: function() {
    Crafty.viewport.scroll('_x', 0);
    Crafty.viewport.scroll('_y', 0);

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

  showMarkers: function() {
    // Show player marker
    Game.getPlayerMarker().visible = true;
    // Show waypoint markers
    Crafty("WaypointMarker").each(function() {
      this.visible = true;
    });
  },

  initPlayer: function() {
    Game.player = Crafty.e('Car');
    Game.player.setName("Player");
    var playerPos = Game.getPlayerMarker().getPlayerPosition();
    Game.player.setPosition(playerPos.x, playerPos.y);
  },

  initTouchControl: function() {
    if (Crafty.mobile) {
      Game.touchControl = Crafty.e('TouchControl');
      Game.touchControl.setName("TouchControl");
    }
  },

  initRecordControl: function() {
    Game.recordControl = Crafty.e('RecordControl');
  },

  initLevel: function () {
    Game.currentWaypointNum = 1;
    Game.hideMarkers();
    Game.initOptionsControl();
    Game.initPauseControl();
    Game.initCountdown();
    Game.initMiniMap();
    Game.initLevelIndicator();
    Game.initWaypoint();
    Game.initWaypointsCollectedIndicator();
    Game.initPlayer();
    Game.initTouchControl();
    Game.initRecordControl();
  },

  shutdownLevel: function () {
    this.countdown.stop();
    Crafty('Level').each(function() {
      this.destroy();
    })
  },

  isLevelComplete: function () {
    return this.NUMBER_OF_WAYPOINTS === (this.currentWaypointNum);
  },

  getLevelNumber: function() {
    return Game.levelIndex + 1;
  },

  getLevelCompleteMessage: function () {
    return 'LEVEL ' + Game.getLevelNumber() + ' DONE!';
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
    var ONE_WAY_TILE_FIRST_GID = 17;
    var ONE_WAY_TYPES = ['NE','SE','SW','NW'];
    var GROUND_TILES = [
      { tileName: 'Tile1', component: 'NormalGround' },
      { tileName: 'Tile2', component: 'BreakingGround' },
      { tileName: 'Tile4', component: 'MudGround' },
      { tileName: 'Tile5', component: 'IceGround' }
    ];

    var ONEWAY_TILES = [
      { tileName: 'Tile17', component: 'OneWayNE' },
      { tileName: 'Tile18', component: 'OneWaySE' },
      { tileName: 'Tile19', component: 'OneWaySW' },
      { tileName: 'Tile20', component: 'OneWayNW' }
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

    var addOneWayComponentTo = function(entity) {
      var len = ONEWAY_TILES.length;
      for (var i=0; i<len; i++) {
        if (entity.has(ONEWAY_TILES[i].tileName)) {
          entity.addComponent(ONEWAY_TILES[i].component);
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
          addGroundComponentTo(entity);
        }

        // Set properties of entities on the 'Solid_Tops' layer
        entities = tiledmap.getEntitiesInLayer('Solid_Tops');
        for (obstacle = 0; obstacle < entities.length; obstacle++){
          var entity = entities[obstacle];
          entity.addComponent("Solid");
        }

        // Set properties of entities on the 'Objects' layer
        entities = tiledmap.getEntitiesInLayer('Objects');
        for (obstacle = 0; obstacle < entities.length; obstacle++){
          var entity = entities[obstacle];

          if (entity.has('Tile6')) {
            entity.addComponent('PlayerMarker');
          }
          else if (entity.has('Tile21')) {
            entity.addComponent('Oil');
          }
          else if (isOneWayTile(entity)) {
            addOneWayComponentTo(entity);
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

  loadAndEditLevel: function(levelIndex) {
    this.editMode = true;
    this.levelIndex = levelIndex;

    Game.destroyAll2DEntities();
    Game.scrollXYViewport(0, 0);
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

    Game.scrollXYViewport(0, 0);

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
    Game.restoreBrokenGround();
    Game.waypointsCollectedIndicator.resetNumberCollected();
    var playerPos = Game.getPlayerMarker().getPlayerPosition();
    Game.player.setPosition(playerPos.x, playerPos.y);
    Game.playMusic('level_music');
    Game.unpauseGame();
    Game.enablePauseControl()
  },

  restoreBrokenGround: function() {
    var entities = Crafty("WasBreaking");
    entities.each(function() {
      this.restoreAsUnbroken();
    });
  },

  dispatchKeyDown: function(key) {
    if (key != undefined) {
      Crafty.s('Keyboard').processEvent({ keyCode:Crafty.keys[key], type:"keydown" });
    }
  },

  dispatchKeyUp: function(key) {
    if (key != undefined) {
      Crafty.s('Keyboard').processEvent({ keyCode:Crafty.keys[key], type:"keyup" });
    }
  },

  initHtmlBody: function() {
    var context = {
      toolbarItems: [
        {type: 'button', id: 'btnSolidWall', hotKey:'1', tooltip:'Wall'},
        {type: 'emptyButton'},
        {type: 'separator'},
        {type: 'button', id: 'btnNormalGround', hotKey:'2', tooltip:'Ground'},
        {type: 'button', id: 'btnBreakingGround', hotKey:'3', tooltip:'Breaking Ground'},
        {type: 'button', id: 'btnMudGround', hotKey:'4', tooltip:'Mud'},
        {type: 'button', id: 'btnIceGround', hotKey:'5', tooltip:'Ice'},
        {type: 'separator'},
        {type: 'button', id: 'btnCar', hotKey:'Q', tooltip:'Car'},
        {type: 'button', id: 'btnWaypoint', hotKey:'W', tooltip:'Waypoint'},
        {type: 'button', id: 'btnOneWay', hotKey:'E', tooltip:'One Way'},
        {type: 'button', id: 'btnOil', hotKey:'R', tooltip:'Oil'},
        {type: 'separator'},
        {type: 'button', id: 'btnDelete', hotKey:'Delete', tooltip:'Delete Tool'}
      ]
    };

    let bodyElem = document.getElementsByTagName('body')[0];
    let div = document.createElement('div');
    div.innerHTML = bodyTemplate(context);
    bodyElem.appendChild(div);
  },

  updateCraftyMobile: function() {
    let ua = navigator.userAgent.toLowerCase(),
        match = /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(o)pera(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||
            /(ms)ie ([\w.]+)/.exec(ua) ||
            /(moz)illa(?:.*? rv:([\w.]+))?/.exec(ua) || [],
        mobile = /iPad|iPod|iPhone|Android|webOS|IEMobile/i.exec(ua);
    if (mobile) {
      Crafty.mobile = mobile[0];
    } else {
      Crafty.mobile = undefined;
    }
  },

  calcViewportRect: function() {
    const width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth);
    const height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);

    if (Crafty.mobile) {
      return {width, height};
    } else {
      const viewportWidth = (width > Game.viewportWidth() ? Game.viewportWidth() : width);
      const viewportHeight = (height > Game.viewportHeight() ? Game.viewportHeight() : height);
      return {width: viewportWidth, height: viewportHeight};
    }
  },

  scrollXYViewport: function (x, y) {
    Crafty.viewport.scroll('_x', x);
    Crafty.viewport.scroll('_y', y);
  },

  sizeViewport: function() {

    Game.updateCraftyMobile();

    const viewportRect = Game.calcViewportRect();
    Crafty.viewport.width = viewportRect.width;
    Crafty.viewport.height = viewportRect.height;
    const elem = Crafty.stage.elem.style
    elem.width = viewportRect.width + "px";
    elem.height = viewportRect.height + "px";
    elem.position = Crafty.mobile ? "absolute" : "relative";

    const offset = Crafty.domHelper.innerPosition(Crafty.stage.elem);
    Crafty.stage.x = offset.x;
    Crafty.stage.y = offset.y;

    Crafty.trigger("ViewportChanged");
  },

  start:function () {
    Game.initHtmlBody();

    Game.initOptions();

    Game.gamePad = new Gamepad();
    Game.gamePad.init();

    Crafty.init(Game.width(), Game.height());

    const viewportRect = Game.calcViewportRect();
    Crafty.viewport.init(viewportRect.width, viewportRect.height);

    Crafty.removeEvent(Crafty, window, "resize", Crafty.viewport.reload);

    Crafty.viewport.clampToEntities=false;
    Crafty.viewport.bounds = {
      min:{x:0, y:0},
      max:{x:Game.width(), y:Game.height()}
    };
    Game.sizeViewport();

    Crafty.addEvent(Game, window, "resize", Game.sizeViewport);

    Crafty.background('rgb(0,0,0)');

    Crafty.createLayer("UILayer", "DOM", {scaleResponse: 0, xResponse: 0, yResponse: 0, z:40})

    if (Crafty.mobile) {
      Crafty.multitouch(true);
    }

    Crafty.scene('Loading');
  }

}
