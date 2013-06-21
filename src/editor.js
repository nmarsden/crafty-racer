Crafty.c('EditModeControl', {
  init: function() {
    this.requires('2D, Keyboard');

    this.bind('KeyDown', this._handleKeyDown);
  },

  _handleKeyDown: function(e) {
    if (this.isDown('PLUS')) {
      // Zoom In
      this._zoom(2);

    } else if (this.isDown('MINUS')) {
      // Zoom Out
      this._zoom(0.5);
    }
  },

  _zoom: function(scale) {
    var centerX = Crafty.viewport.width/2 - Crafty.viewport.x;
    var centerY = Crafty.viewport.height/2 - Crafty.viewport.y;
    Crafty.viewport.scrollXY(0,0);
    Crafty.viewport.width = Crafty.viewport.width / scale;
    Crafty.viewport.height = Crafty.viewport.height / scale;
    Crafty.viewport.scale(scale);
    Crafty.viewport.scrollXY((Crafty.viewport.width/2) - centerX, (Crafty.viewport.height/2) - centerY);
  }
});
