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
  fontFamily:'Simpletype', //'UNICODE0',
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
  debug:false,

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

  initOptions:function () {
    $(".music").click(function () {
      $(".music").toggleClass("off");
      Game.toggleMusic();
    });
    $(".sfx").click(function () {
      $(".sfx").toggleClass("off");
      Game.toggleSoundEffects();
    });
  },

  initWaypoint: function () {
    var waypoint = this.waypoints[this.waypointIndex];
    this.waypoint = Crafty.e('Waypoint');
    this.waypoint.setName("Waypoint");
    this.waypoint.setPosition(waypoint.x, waypoint.y);
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

  initPlayer: function(playerX, playerY) {
    Game.initialPlayerPosition = {x: playerX, y: playerY};
    Game.player = Crafty.e('Car');
    Game.player.setName("Player");
    Game.player.setPosition(playerX, playerY);
  },

  initLevel: function (playerX, playerY) {
    this.waypointIndex = 0;
    Game.initNavigator();
    Game.initCountdown();
    Game.initMiniMap();
    Game.initLevelIndicator();
    Game.resetWaypoint();
    Game.initWaypointsCollectedIndicator();
    Game.initPlayer(playerX, playerY);
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

  selectLevel: function(levelIndex) {
    this.levelIndex = levelIndex;
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
      if (entity.has("Ground_Sides") || entity.has("Ground_Tops") || entity.has("Solid_Sides") || entity.has("Solid_Tops") || entity.has("Objects") ) {
        // do nothing
      } else {
        if (entity._entityName) {
          otherNames.push(entity._entityName);
        } else {
          otherNames.push(entity);
        }
      }
    };
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

  debugEntitiesAndHandlers: function(message) {
    if (!Game.debug) {
      return;
    }
    var total = Crafty("*").length;
    var groundNum = Crafty("Ground_Sides").length + Crafty("Ground_Tops").length;
    var solidNum = Crafty("Solid_Sides").length + Crafty("Solid_Tops").length;
    var objectNum = Crafty("Objects").length;
    var otherNum = total - (groundNum + solidNum + objectNum);
    console.log(message, " - Entities: ", total, "Total,", groundNum, "Ground,", solidNum, "Solid,", objectNum, "Objects,", otherNum, "Other");
    console.log("Other entities:", Game.allOtherEntityNames());
    console.log("Entity Handlers:", Game.numberOfEntityHandlers());
  },

  debugTriggeredEvents: function() {
    Crafty.bind('EnterFrame', function() { console.log("EnterFrame triggered") });
    Crafty.bind('PauseGame', function() { console.log("PauseGame triggered") });
    Crafty.bind('UnpauseGame', function() { console.log("UnpauseGame triggered") });
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
