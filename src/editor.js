Crafty.c('EditModeControl', {
  init: function() {
    this.requires('2D, Keyboard');
    this.scale = 1;

    this.bind('KeyDown', this._handleKeyDown);
  },

  _handleKeyDown: function(e) {
    if (this.isDown('PLUS')) {
      // Zoom In
      this.scale *= 2;
      var centerX = Crafty.viewport.width/2 - Crafty.viewport.x;
      var centerY = Crafty.viewport.height/2 - Crafty.viewport.y;
      Crafty.viewport.scrollXY(0,0);
      Crafty.viewport.width /= 2;
      Crafty.viewport.height /= 2;
      Crafty.viewport.scale(2);
      Crafty.viewport.scrollXY((Crafty.viewport.width/2) - centerX, (Crafty.viewport.height/2) - centerY);
      return;
    }
    if (this.isDown('MINUS')) {
      // Zoom Out
      this.scale /= 2;
      var centerX = Crafty.viewport.width/2 - Crafty.viewport.x;
      var centerY = Crafty.viewport.height/2 - Crafty.viewport.y;
      Crafty.viewport.scrollXY(0,0);
      Crafty.viewport.width *= 2;
      Crafty.viewport.height *= 2;
      Crafty.viewport.scale(0.5);
      Crafty.viewport.scrollXY((Crafty.viewport.width/2) - centerX, (Crafty.viewport.height/2) - centerY);
      return;
    }
  }
});
