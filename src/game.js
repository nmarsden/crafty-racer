Game = {
  // This defines our grid's size and the size of each of its tiles
  map_grid:{
    width:7 * 4,
    height:5 * 4,
    tile:{
      width:98,
      height:98
    }
  },

  options:{
    music:true,
    sfx:true
  },

  levels:[],
  levelIndex:0,
  waypointIndex:0,
  waypoint:null,
  navigator:null,
  countdown:null,
  levelIndicator:null,

  width:function () {
    return this.map_grid.width * this.map_grid.tile.width;
  },

  height:function () {
    return this.map_grid.height * this.map_grid.tile.height;
  },

  viewportWidth:function () {
    return Game.width() / 4;
  },

  viewportHeight:function () {
    return Game.height() / 4;
  },

  playMusic:function () {
    if (Game.options.music) {
      Crafty.audio.play('music', -1, 1.0);
    }
  },

  unpauseMusic:function () {
    Crafty.audio.unpause('music');
  },

  pauseMusic:function () {
    Crafty.audio.pause('music');
  },

  toggleMusic:function () {
    Game.options.music = !Game.options.music;
    if (Game.options.music) {
      Game.unpauseMusic();
    } else {
      Game.pauseMusic();
    }
  },

  playSoundEffect:function (effectName, volume) {
    if (Game.options.sfx) {
      Game.stopAllSoundsExcept(effectName, "music", "woop");
      Crafty.audio.play(effectName, -1, volume);
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
      Game.stopAllSoundsExcept("music");
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

  initLevels:function () {
    this.levels[0] = {waypoints: [{x:5,y:5},{x:10,y:10},{x:5,y:10},{x:7,y:7},{x:7,y:12}]};
    this.levels[1] = {waypoints: [{x:10,y:10},{x:5,y:10},{x:7,y:7},{x:7,y:12},{x:5,y:5}]};
    this.levels[2] = {waypoints: [{x:5,y:10},{x:7,y:7},{x:7,y:12},{x:5,y:5},{x:10,y:10}]};
    this.levels[3] = {waypoints: [{x:7,y:7},{x:7,y:12},{x:5,y:5},{x:10,y:10},{x:5,y:10}]};
    this.levels[4] = {waypoints: [{x:7,y:12},{x:5,y:5},{x:10,y:10},{x:5,y:10},{x:7,y:7}]};
  },

  initWaypoint: function () {
    var waypoint = this.levels[this.levelIndex].waypoints[this.waypointIndex];
    this.waypoint = Crafty.e('Waypoint').at(waypoint.x, waypoint.y);
    this.waypoint.setName("Waypoint");
  },

  initNavigator: function () {
    this.navigator = Crafty.e('Navigator');
    this.navigator.setName("Navigator");
  },

  initCountdown: function () {
    this.countdown = Crafty.e('Countdown');
    this.countdown.setName("Countdown");
  },

  initLevelIndicator: function () {
    this.levelIndicator = Crafty.e('LevelIndicator');
    this.levelIndicator.setName("LevelIndicator");
  },

  initLevel: function () {
    this.waypointIndex = 0;
    Game.initNavigator();
    Game.initCountdown();
    Game.initLevelIndicator();
    Game.resetWaypoint();
  },

  isLevelComplete: function () {
    return this.levels[this.levelIndex].waypoints.length === (this.waypointIndex + 1);
  },

  getLevelNumber: function() {
    return Game.levelIndex + 1;
  },

  getLevelCompleteMessage: function () {
    return 'LEVEL ' + Game.getLevelNumber() + ' COMPLETE!';
  },

  nextWaypoint: function () {
    this.waypointIndex++;
    Game.resetWaypoint();
  },

  resetWaypoint: function () {
    this.waypoint && this.waypoint.destroy();
    Game.initWaypoint();
    this.navigator.setWaypointPosition(this.waypoint.x, this.waypoint.y);
    this.countdown.start(10000);
  },

  isGameComplete: function () {
    return this.levels.length === (this.levelIndex + 1);
  },

  resetLevels: function() {
    this.levelIndex = 0;
  },

  nextLevel: function() {
    this.levelIndex++;
  },

  start:function () {
    Game.initOptions();
    Game.initLevels();

    Crafty.init(Game.width(), Game.height());
    Crafty.viewport.init(Game.viewportWidth(), Game.viewportHeight());
    Crafty.viewport.bounds = {
      min:{x:0, y:0},
      max:{x:Game.width(), y:Game.height()}
    };
    Crafty.background('rgb(130,192,255)');
    Crafty.scene('Loading');

    Crafty.debugBar.show();
  }

}
