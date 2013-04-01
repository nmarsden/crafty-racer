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
    Crafty.audio.play('music', -1, 1.0);
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
      Game.stopAllSoundsExcept(effectName, "music");
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

  start:function () {
    Game.initOptions();

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
