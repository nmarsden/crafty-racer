Editor = {
  zoomLevel: 1.0,

  scaleZoomLevel: function(scale) {
    Editor.zoomLevel *= scale;
    Crafty.trigger("ZoomLevelChanged", Editor.zoomLevel);
    Crafty.trigger("ViewportChanged");
  },

  isScaleZoomLevelPrevented: function(scale) {
    return (scale > 1 && Editor.zoomLevel >= 1) || (scale < 1 && Editor.zoomLevel <= 0.0625);
  }
};

Crafty.c('EditModeControl', {
  init: function() {
    this.requires('2D, Keyboard');

    this._createScaleIndicator();

    this.bind('KeyDown', this._handleKeyDown);
  },

  _createScaleIndicator: function() {
    var scaleIndicator = Crafty.e('ScaleIndicator');
    scaleIndicator.setName('ScaleIndicator');
    return scaleIndicator;
  },

  _handleKeyDown: function(e) {
    if (this.isDown('PLUS')) {
      // Zoom In
      this._zoom(2);

    } else if (this.isDown('MINUS')) {
      // Zoom Out
      this._zoom(0.5);

    } else if (this.isDown('0')) {
      // Scroll (0,0)
      Crafty.viewport.scrollXY(0,0);
      Crafty.trigger("ViewportChanged");

    } else if (this.isDown('UP_ARROW')) {
      Crafty.viewport.y = Crafty.viewport.y - 64;
      Crafty.trigger("ViewportChanged");

    } else if (this.isDown('DOWN_ARROW')) {
      Crafty.viewport.y = Crafty.viewport.y + 64;
      Crafty.trigger("ViewportChanged");

    } else if (this.isDown('LEFT_ARROW')) {
      Crafty.viewport.x = Crafty.viewport.x - 64;
      Crafty.trigger("ViewportChanged");

    } else if (this.isDown('RIGHT_ARROW')) {
      Crafty.viewport.x = Crafty.viewport.x + 64;
      Crafty.trigger("ViewportChanged");
    }
  },

  _zoom: function(scale) {
    if (Editor.isScaleZoomLevelPrevented(scale)) {
      return;
    }
    var centerX = Crafty.viewport.width/2 - Crafty.viewport.x;
    var centerY = Crafty.viewport.height/2 - Crafty.viewport.y;
    Crafty.viewport.scrollXY(0,0);
    Crafty.viewport.width = Crafty.viewport.width / scale;
    Crafty.viewport.height = Crafty.viewport.height / scale;
    Crafty.viewport.scale(scale);
    Crafty.viewport.scrollXY((Crafty.viewport.width/2) - centerX, (Crafty.viewport.height/2) - centerY);

    Editor.scaleZoomLevel(scale);
  }
});

Crafty.c('ScaleIndicator', {
  init: function() {
    this.requires('2D, DOM, Text, Keyboard');
    this.scalePercentage = 100.0;
    this.fontSize = 16;
    this.margin = 10;
    this.h = 5;
    this.w = 4800;
    this.textFont({ type: 'normal', weight: 'normal', size: this.fontSize + 'px', family: 'Consolas' });
    this.css('text-align', 'left');
    this.textColor('#00000', 1.0);
    this.text("Scale: " + this.scalePercentage + "%");
    this._updatePosition();

    this.bind("ViewportChanged", this._updatePosition.bind(this));
    this.bind("ZoomLevelChanged", this._updateScalePercentage.bind(this));
    this.bind('KeyDown', this._handleKeyDown);
  },

  _updatePosition: function() {
    // Update position to be in bottom-left corner of viewport
    // Note: Dividing by zoomLevel to undo the effects of Crafty applying a scale transform to the stage when the viewport is scaled
    this.x = (this.margin - Crafty.viewport.x) / Editor.zoomLevel;
    this.y = (640 - (this.fontSize + this.margin) - Crafty.viewport.y) / Editor.zoomLevel;
  },

  _updateScalePercentage: function(zoomLevel) {
    this.scalePercentage = zoomLevel * 100.0;
    this.text("Scale: " + this.scalePercentage + "%");

    // Note: Adjusting fontSize to undo the effects of Crafty applying a scale transform to the stage when the viewport is scaled
    this.textFont({ size: (this.fontSize / zoomLevel) + 'px'});
  }

});
