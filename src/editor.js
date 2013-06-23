Editor = {
  zoomLevel: 1.0,

  scaleZoomLevel: function(scale) {
    Editor.zoomLevel *= scale;
    Crafty.trigger("ZoomLevelChanged", Editor.zoomLevel);
    Crafty.trigger("ViewportChanged");
  },

  isScaleZoomLevelPrevented: function(scale) {
    return (scale > 1 && Editor.zoomLevel >= 1) || (scale < 1 && Editor.zoomLevel <= 0.0625);
  },

  addSolidTile: function(row, col) {
    var solidEntity = Game.tiledMapBuilder.addTileToLayer(row, col, 'Tile3', 'Solid_Tops');
    // place() adds viewport x & y which is not wanted, so undoing here
    solidEntity.x -= Crafty.viewport.x;
    solidEntity.y -= Crafty.viewport.y;
    // Set correct z-index for a solid entity
    solidEntity.z = Math.floor(solidEntity._y + 64);
    return solidEntity;
  },

  saveChanges: function() {
    // TODO Currently just logs to console. Could this be saved to file?
    console.log(JSON.stringify(Game.tiledMapBuilder.getSource()));
  },

  initEditor: function() {
    Editor.setupMouseEvents();
    Crafty.e('ScaleIndicator');
    Crafty.e('EditModeControl');
  },

  setupMouseEvents: function() {
    // mousedown event
    Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
      if(e.button == 1) {
        // Middle-mouse button down begins scrolling on mouse move
        Editor.scrollOnMouseMove(e);
      }
    });
    // click event
    Crafty.addEvent(this, Crafty.stage.elem, "click", function(e) {
      if(e.button == 0) {
        // Left-mouse button click
        Editor.deleteSelectedEntity(e);
      }
    });

  },

  scrollOnMouseMove: function(e) {
    var base = {x: e.clientX, y: e.clientY};

    function scroll(e) {
      var dx = base.x - e.clientX,
        dy = base.y - e.clientY;
      base = {x: e.clientX, y: e.clientY};
      Crafty.viewport.x -= dx;
      Crafty.viewport.y -= dy;
      Crafty.trigger("ViewportChanged");
    };

    Crafty.addEvent(this, Crafty.stage.elem, "mousemove", scroll);
    Crafty.addEvent(this, Crafty.stage.elem, "mouseup", function() {
      Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", scroll);
    });
  },

  // Note: this is a copy of Crafty.DOM.translate, the only difference is that viewport x and y are multiplied by the zoom factor (might be a bug in Crafty that it doesn't do that?)
  mouseToWorld: function (x, y) {
    return {
      x: (x - Crafty.stage.x + document.body.scrollLeft + document.documentElement.scrollLeft - (Crafty.viewport._x*Crafty.viewport._zoom))/Crafty.viewport._zoom,
      y: (y - Crafty.stage.y + document.body.scrollTop + document.documentElement.scrollTop - (Crafty.viewport._y*Crafty.viewport._zoom))/Crafty.viewport._zoom
    }
  },

  worldToIso: function(x, y) {
    var source = Game.tiledMapBuilder.getSource();
    var tileWidth = source.tilewidth;
    var tileHeight = source.tileheight;
    var x0 = tileWidth/2;
    var y0 = 0;
    return {
      row: Math.floor((y - y0)/tileHeight - (x - x0)/tileWidth),
      col: Math.floor((y - y0)/tileHeight + (x - x0)/tileWidth)
    }
  },

  mouseToIso: function(x, y) {
    var world = Editor.mouseToWorld(x, y);
    return Editor.worldToIso(world.x, world.y);
  },

  deleteSelectedEntity: function(e) {
    var iso = Editor.mouseToIso(e.clientX, e.clientY);

    // TODO Remove! - used for testing add solid tile
    //Editor.addSolidTile(iso.row, iso.col);

    // remove tile from 'Ground Tops' layer
    Game.tiledMapBuilder.removeTileFromLayer(iso.row, iso.col, 'Ground_Tops');
  }
};

Crafty.c('EditModeControl', {
  init: function() {
    this.requires('2D, Keyboard');

    this.bind('KeyDown', this._handleKeyDown);
  },

  _handleKeyDown: function(e) {
    if (this.isDown('PLUS')) {
      // Zoom In
      this._zoom(2);
    }
    else if (this.isDown('MINUS')) {
      // Zoom Out
      this._zoom(0.5);
    }
    else if (this.isDown('0')) {
      // Scroll (0,0)
      Crafty.viewport.scrollXY(0,0);
      Crafty.trigger("ViewportChanged");
    }
    else if (this.isDown('UP_ARROW')) {
      // Pan Up one tile
      Crafty.viewport.y = Crafty.viewport.y + 64;
      Crafty.trigger("ViewportChanged");
    }
    else if (this.isDown('DOWN_ARROW')) {
      // Pan Down one tile
      Crafty.viewport.y = Crafty.viewport.y - 64;
      Crafty.trigger("ViewportChanged");
    }
    else if (this.isDown('LEFT_ARROW')) {
      // Pan Left one tile
      Crafty.viewport.x = Crafty.viewport.x + 128;
      Crafty.trigger("ViewportChanged");
    }
    else if (this.isDown('RIGHT_ARROW')) {
      // Pan Right one tile
      Crafty.viewport.x = Crafty.viewport.x - 128;
      Crafty.trigger("ViewportChanged");
    }
    else if (this.isDown('S')) {
      // Save
      Editor.saveChanges();
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
