Editor = {
  TILE_WIDTH: 128,
  TILE_HEIGHT: 64,
  EDIT_MODES: ['DELETE', 'GROUND', 'MUD', 'ICE', 'BREAKING', 'SOLID'],
  zoomLevel: 1.0,
  tileCursor: null,
  leftMouseButtonDown: false,
  currentEditMode: 'DELETE',

  scaleZoomLevel: function(scale) {
    Editor.zoomLevel *= scale;
    Crafty.trigger("ZoomLevelChanged", Editor.zoomLevel);
    Crafty.trigger("ViewportChanged");
  },

  isScaleZoomLevelPrevented: function(scale) {
    return (scale > 1 && Editor.zoomLevel >= 1) || (scale < 1 && Editor.zoomLevel <= 0.0625);
  },

  addTile: function(row, col, tileName, layerName) {
    var entity = Game.tiledMapBuilder.addTileToLayer(row, col, tileName, layerName);
    if (entity) {
      // place() adds viewport x & y which is not wanted, so undoing here
      entity.x -= Crafty.viewport.x;
      entity.y -= Crafty.viewport.y;
    }
    return entity;
  },

  addTileToGroundLayer: function(row, col, tileName) {
    var ground = Editor.addTile(row, col, tileName, 'Ground_Tops');
    if (ground) {
      //Set z-index for correct view: front, back
      ground.z = Math.floor(ground._y - 64 - 10);
    }
    return ground;
  },

  addTileToSolidLayer: function(row, col, tileName) {
    var solid = Editor.addTile(row, col, tileName, 'Solid_Tops');
    if (solid) {
      // Set correct z-index for a solid entity
      solid.z = Math.floor(solid._y + 64);
    }
  },

  saveChanges: function() {
    // TODO Currently just logs to console. Could this be saved to file?
    console.log(JSON.stringify(Game.tiledMapBuilder.getSource()));
  },

  initEditor: function() {
    Editor.setupMouseEvents();
    Editor.tileCursor = Crafty.e('TileCursor');
    Crafty.e('ScaleIndicator');
    Crafty.e('EditModeControl');
  },

  setupMouseEvents: function() {
    // mousemove event
    Crafty.addEvent(this, Crafty.stage.elem, "mousemove", function(e) {
      // Move Tile Cursor
      Editor.tileCursor.updatePosition(e.clientX, e.clientY);

      if (Editor.leftMouseButtonDown) {
        Editor.performEditOperation(e);
      }
    });

    // mousedown event
    Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
      if(e.button == Crafty.mouseButtons.LEFT) {
        Editor.leftMouseButtonDown = true;
        Editor.performEditOperation(e);

      } else if(e.button == Crafty.mouseButtons.MIDDLE) {
        Editor.scrollOnMouseMove(e);
      }
    });

    // mouseup event
    Crafty.addEvent(this, Crafty.stage.elem, "mouseup", function(e) {
      Editor.leftMouseButtonDown = false;
    });
  },

  scrollOnMouseMove: function(e) {
    var base = {x: e.clientX, y: e.clientY};

    function scroll(e) {
      var dx = base.x - e.clientX,
        dy = base.y - e.clientY;
      base = {x: e.clientX, y: e.clientY};

      // magnify scroll amount
      // Note: This also happens to make dy an even number which fixes an image artifact issue occurring
      // when viewport.y was an odd number and the tile cursor was moved across the stage
      dx *= 4;
      dy *= 4;

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
    var x0 = Editor.TILE_WIDTH/2;
    var y0 = 0;
    return {
      row: Crafty.math.clamp(Math.floor((y - y0)/Editor.TILE_HEIGHT - (x - x0)/Editor.TILE_WIDTH), 0, 99),
      col: Crafty.math.clamp(Math.floor((y - y0)/Editor.TILE_HEIGHT + (x - x0)/Editor.TILE_WIDTH), 0, 99)
    }
  },

  isoToWorld: function(row, column) {
    return {
      x: (column - row) * (Editor.TILE_WIDTH/2),
      y: (column + row) * (Editor.TILE_HEIGHT/2)
    };
  },

  mouseToIso: function(x, y) {
    var world = Editor.mouseToWorld(x, y);
    return Editor.worldToIso(world.x, world.y);
  },

  performEditOperation: function(e) {
    var iso = Editor.mouseToIso(e.clientX, e.clientY);

    if (Editor.currentEditMode === 'DELETE') {
      // TODO should not delete ground tiles if mouse still down after deleting a solid tile and vice-versa
      if (!Game.tiledMapBuilder.removeTileFromLayer(iso.row, iso.col, 'Solid_Tops')) {
        Game.tiledMapBuilder.removeTileFromLayer(iso.row, iso.col, 'Ground_Tops')
      }
    }
    else if (Editor.currentEditMode === 'GROUND') {
      Editor.addTileToGroundLayer(iso.row, iso.col, 'Tile1');
    }
    else if (Editor.currentEditMode === 'ICE') {
      Editor.addTileToGroundLayer(iso.row, iso.col, 'Tile23');
    }
    else if (Editor.currentEditMode === 'BREAKING') {
      Editor.addTileToGroundLayer(iso.row, iso.col, 'Tile17');
    }
    else if (Editor.currentEditMode === 'MUD') {
      Editor.addTileToGroundLayer(iso.row, iso.col, 'Tile25');
    }
    else if (Editor.currentEditMode === 'SOLID') {
      Editor.addTileToSolidLayer(iso.row, iso.col, 'Tile3');
    }
  },

  changeEditMode: function(editMode) {
    Editor.currentEditMode = editMode;
    Crafty.trigger("EditModeChanged", editMode);
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
    else if (this.isDown('DELETE')) {
      Editor.changeEditMode('DELETE');
    }
    else if (this.isDown('1')) {
      Editor.changeEditMode('GROUND');
    }
    else if (this.isDown('2')) {
      Editor.changeEditMode('ICE');
    }
    else if (this.isDown('3')) {
      Editor.changeEditMode('BREAKING');
    }
    else if (this.isDown('4')) {
      Editor.changeEditMode('MUD');
    }
    else if (this.isDown('5')) {
      Editor.changeEditMode('SOLID');
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

Crafty.c('TileCursor', {
  init: function() {
    this.requires('2D, Canvas, Tween');
    this.currentIso = {row:0, col:0};
    this.z = 8000;
    this.SPRITES = {
      'DELETE': 'spr_delete',
      'GROUND': 'Tile1',
      'SOLID': 'Tile3',
      'ICE': 'Tile23',
      'BREAKING': 'Tile17',
      'MUD': 'Tile25'
    };
    this.currentEditMode = 'DELETE';
    this.addComponent(this.SPRITES[this.currentEditMode]);

    this._tweenAlphaTo(0.0);

    this.bind("TweenEnd", function() {
      this._tweenAlphaTo((this.alpha == 0) ? 1.0:0.0);
    });

    this.bind("EditModeChanged", this._handleEditModeChanged.bind(this));
  },

  updatePosition: function(mouseX, mouseY) {
    this._updateTilePosition(Editor.mouseToIso(mouseX, mouseY));
  },

  _updateTilePosition: function(iso) {
    var tileWorldPos = Editor.isoToWorld(iso.row, iso.col);
    this.x = tileWorldPos.x;
    this.y = tileWorldPos.y;
    this.z = this._isDelete() ? 8000 : (this._isSolid() ? Math.floor(tileWorldPos.y + 64 + 1) : Math.floor(tileWorldPos.y - 64 - 10 + 1));
    this.currentIso = iso;
  },

  _isSolid: function() {
    return this.currentEditMode === 'SOLID';
  },

  _isDelete: function() {
    return this.currentEditMode === 'DELETE';
  },

  _handleEditModeChanged: function(editMode) {
    // change sprite
    this.toggleComponent(this.SPRITES[this.currentEditMode], this.SPRITES[editMode]);
    // store new current edit mode
    this.currentEditMode = editMode;
    // update position as edit mode may affect z position
    this._updateTilePosition(this.currentIso);
  },

  _tweenAlphaTo: function(targetAlpha) {
    this.tween({alpha: targetAlpha}, 30);
  }
});