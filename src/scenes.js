// Game scene
// -------------
Crafty.scene('Game', function() {
  this.pauseControl = Crafty.e('PauseControl');
  this.pauseControl.setName("PauseControl");

  this.player = Crafty.e('Car').at(3, 18);
  this.player.setName("Player");

  this.block = Crafty.e('Block').at(1, 1);

  this.showFps = Crafty.e('ShowFPS');
  this.showFps.setName("ShowFPS");

  Crafty.viewport.scroll('_x', Crafty.viewport.width/2 - this.player.x - this.player.w/2);
  Crafty.viewport.scroll('_y', Crafty.viewport.height/2 - this.player.y - this.player.h/2);

  for(var x=0; x<=Game.map_grid.width; x++) {
    Crafty.e('Block').at(x, 0);
    Crafty.e('Block').at(x, Game.map_grid.height);
  }
  for(var y=1; y<Game.map_grid.height; y++) {
    Crafty.e('Block').at(0, y);
    Crafty.e('Block').at(Game.map_grid.width, y);
  }

  Game.playMusic();

}, function() {
});


// Loading scene
// -------------
Crafty.scene('Loading', function(){
  Crafty.e('2D, DOM, Text')
    .text('Loading; please wait...')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() });

  Crafty.load([
    'assets/car.png',
    'assets/block.png'
  ], function(){
    Crafty.sprite(98, 'assets/car.png', {
      spr_car:  [6, 1]
    }, 0, 0);
    Crafty.sprite(96, 'assets/block.png', {
      spr_block:  [0, 0]
    }, 0, 0);
    Crafty.scene('Game');
  })

  // Define our sounds for later use
  Crafty.audio.add({
    engine_idle:        ['assets/engine_idle2.ogg'],
    engine_rev:         ['assets/engine_rev.ogg'],
    engine_rev_faster:  ['assets/engine_rev_faster2.ogg'],
    wheel_spin:         ['assets/wheel_spin.ogg'],
    music:              ['assets/Happy Bee.mp3']
  });

});