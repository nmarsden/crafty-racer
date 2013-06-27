Editor = {
  TILE_WIDTH: 128,
  TILE_HEIGHT: 64,

  EDIT_MODES: {
    'DELETE': {
      tileName: 'spr_delete',
      layerName: null
    },
    'GROUND': {
      tileName: 'Tile1',
      layerName: 'Ground_Tops',
      component: 'NormalGround'
    },
    'BREAKING': {
      tileName: 'Tile2',
      layerName: 'Ground_Tops',
      component: 'BreakingGround'
    },
    'SOLID': {
      tileName: 'Tile3',
      layerName: 'Solid_Tops',
      component: 'Solid'
    },
    'MUD': {
      tileName: 'Tile4',
      layerName: 'Ground_Tops',
      component: 'MudGround'
    },
    'ICE': {
      tileName: 'Tile5',
      layerName: 'Ground_Tops',
      component: 'IceGround'
    },
    'PLAYER': {
      tileName: 'Tile6',
      layerName: 'Objects',
      component: 'PlayerMarker'
    }
  },

  zoomLevel: 1.0,
  tileCursor: null,
  leftMouseButtonDown: false,
  shiftKeyDown: false,
  currentEditMode: 'DELETE',
  mouseDownDeleteLayer: null,
  mostRecentDeleteLayer: null,

  drawingFillGrid: false,
  fillGridStartTileIso: null,
  fillGridEndTileIso: null,
  fillGridTiles: [],

  layerNameFor: function(editMode) {
    return Editor.EDIT_MODES[editMode].layerName;
  },

  tileNameFor: function(editMode) {
    return Editor.EDIT_MODES[editMode].tileName;
  },

  componentFor: function(editMode) {
    return Editor.EDIT_MODES[editMode].component;
  },

  tilePositionZFor: function(editMode, y) {
    var layerName = Editor.layerNameFor(editMode);
    if (layerName == null) {
      return 8000;
    }
    else if (layerName == 'Solid_Tops') {
      return Math.floor(y + 64);
    }
    else if (layerName == 'Objects') {
      return Math.floor(y);
    }
    else {
      return Math.floor(y - 64 - 10);
    }
  },

  scaleZoomLevel: function(scale) {
    Editor.zoomLevel *= scale;
    Crafty.trigger("ZoomLevelChanged", Editor.zoomLevel);
    Crafty.trigger("ViewportChanged");
  },

  isScaleZoomLevelPrevented: function(scale) {
    return (scale > 1 && Editor.zoomLevel >= 1) || (scale < 1 && Editor.zoomLevel <= 0.0625);
  },

  deleteAllTiles: function(editMode) {
    Crafty(Editor.componentFor(editMode)).each(function() {
      var tileIso = Editor.tilePosToIso(this.x, this.y);
      Editor.deleteTile(tileIso, Editor.layerNameFor(editMode));
    });
  },

  deleteTile: function(iso, layerName) {
    var isDeleteSuccess = Game.tiledMapBuilder.removeTileFromLayer(iso.row, iso.col, layerName);
    // set start position of fill grid
    Editor.fillGridStartTileIso = iso;
    // set most recent delete layer
    Editor.mostRecentDeleteLayer = layerName;
    // set mouse down delete layer
    Editor.mouseDownDeleteLayer = layerName;
    return isDeleteSuccess;
  },

  addTile: function(iso, editMode) {
    var layerName = Editor.layerNameFor(editMode);
    var tileName = Editor.tileNameFor(editMode);
    var entity = Game.tiledMapBuilder.addTileToLayer(iso.row, iso.col, tileName, layerName);
    if (entity) {
      // place() adds viewport x & y which is not wanted, so undoing here
      entity.x -= Crafty.viewport.x;
      entity.y -= Crafty.viewport.y;
      // adjust z position
      entity.z = Editor.tilePositionZFor(editMode, entity.y);
      // add components
      entity.addComponent(Editor.componentFor(editMode));
    }
    return entity;

  },

  saveChanges: function() {
    // TODO Currently just logs to console. Could this be saved to file?
    console.log(JSON.stringify(Game.tiledMapBuilder.getSource()));
  },

  playGame: function() {
    Game.initLevel();
  },

  initEditor: function() {
    Editor.setupMouseEvents();
    Editor.tileCursor = Crafty.e('TileCursor');
    Crafty.e('ScaleIndicator');
    Crafty.e('EditModeControl');
    Editor.showPlayerMarker();
  },

  showPlayerMarker: function() {
    var playerMarker = Game.getPlayerMarker();
    if (playerMarker) {
      playerMarker.visible = true;
    }
  },

  setupMouseEvents: function() {
    // mousemove event
    Crafty.addEvent(this, Crafty.stage.elem, "mousemove", function(e) {
      // Move Tile Cursor
      Editor.tileCursor.updatePosition(e.clientX, e.clientY);
      // Draw fill grid if shift key is down
      var iso = Editor.mouseToIso(e.clientX, e.clientY);
      Editor.drawFillGrid(iso);

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
      // reset mouse down delete layer
      Editor.mouseDownDeleteLayer = null;
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

  tilePosToIso: function(x, y) {
    var tileCenterX = x + Editor.TILE_WIDTH/2;
    var tileCenterY = y + Editor.TILE_HEIGHT/2;
    return Editor.worldToIso(tileCenterX, tileCenterY);
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

  drawFillGrid: function(iso) {
    if (Editor.shiftKeyDown && Editor.fillGridStartTileIso && !Editor.drawingFillGrid) {
      Editor.drawingFillGrid = true;

      // Optimization: don't redraw grid if current position is the same tile pos as when grid was previously drawn
      if (!Editor.fillGridEndTileIso || iso.row !== Editor.fillGridEndTileIso.row || iso.col !== Editor.fillGridEndTileIso.col) {

        // Cleanup previously drawn fill grid
        Editor.cleanupFillGrid();

        // Draw grid covering area from last added tile position to current tile position
        //console.log("last pos=(", Editor.fillGridStartTileIso.row, ",", Editor.fillGridStartTileIso.col, ")", ", curr pos=(", iso.row, ",", iso.col, ")");
        var row, col;
        var minRow = Math.min(Editor.fillGridStartTileIso.row, iso.row);
        var maxRow = Math.max(Editor.fillGridStartTileIso.row, iso.row);
        var minCol = Math.min(Editor.fillGridStartTileIso.col, iso.col);
        var maxCol = Math.max(Editor.fillGridStartTileIso.col, iso.col);
        for (row=minRow; row<=maxRow; row++) {
          for (col=minCol; col<=maxCol; col++) {
            var pos = Editor.isoToWorld(row, col);
            var gridTile = Crafty.e("IsoTileOutline");
            gridTile.x = pos.x;
            gridTile.y = pos.y;

            Editor.fillGridTiles.push(gridTile);
          }
        }
        Editor.fillGridEndTileIso = iso;
      }
      Editor.drawingFillGrid = false;
    }
  },

  cleanupFillGrid: function() {
    Editor.fillGridTiles.forEach(function(fillGridTile) {
      fillGridTile.clearAndDestroy();
    });
    Editor.fillGridTiles = [];
    Editor.fillGridEndTileIso = null;
  },

  performEditOperation: function(e) {
    var iso = Editor.mouseToIso(e.clientX, e.clientY);

    if (Editor.currentEditMode === 'PLAYER') {
      Editor.performAddSingleInstanceOperation(iso);
    }
    else if (Editor.currentEditMode === 'DELETE') {
      // Perform delete area or delete single tile
      if (Editor.shiftKeyDown) {
        Editor.performDeleteAreaOperation(iso);
      } else {
        Editor.performDeleteOperation(iso);
      }
    } else {
      // Perform fill or add
      if (Editor.shiftKeyDown) {
        Editor.performFillOperation(iso);
      } else {
        Editor.performAddOperation(iso);
      }
    }
  },

  performDeleteAreaOperation: function(currentIso) {
    // Delete area covered by fill grid
    Editor.fillGridTiles.forEach(function(fillGridTile) {
      var tileIso = Editor.tilePosToIso(fillGridTile.x, fillGridTile.y);
      Editor.deleteTile(tileIso, Editor.mostRecentDeleteLayer);
    });
    // Cleanup previously drawn fill grid
    Editor.cleanupFillGrid();
    // set start position of fill grid
    Editor.fillGridStartTileIso = currentIso;
  },

  performDeleteOperation: function(iso) {
    if (Editor.mouseDownDeleteLayer) {
      // Restrict deletion to most recent delete layer
      Editor.deleteTile(iso, Editor.mouseDownDeleteLayer);
    } else {
      // Attempt to delete from the Solid layer first, then from the Objects layer, and then finally from the Ground layer
      if (!Editor.deleteTile(iso, 'Solid_Tops')) {
        if (!Editor.deleteTile(iso, 'Objects')) {
          Editor.deleteTile(iso, 'Ground_Tops');
        }
      }
    }
  },

  performFillOperation: function(currentIso) {
    // Fill area covered by fill grid
    Editor.fillGridTiles.forEach(function(fillGridTile) {
      var tileCenterX = fillGridTile.x + Editor.TILE_WIDTH/2;
      var tileCenterY = fillGridTile.y + Editor.TILE_HEIGHT/2;
      var tileIso = Editor.worldToIso(tileCenterX, tileCenterY);
      Editor.addTile(tileIso, Editor.currentEditMode);
    });
    // Cleanup previously drawn fill grid
    Editor.cleanupFillGrid();
    // set start position of fill grid
    Editor.fillGridStartTileIso = currentIso;
  },

  performAddOperation: function(iso) {
    Editor.addTile(iso, Editor.currentEditMode);
    // set start position of fill grid
    Editor.fillGridStartTileIso = iso;
  },

  performAddSingleInstanceOperation: function(iso) {
    Editor.deleteAllTiles(Editor.currentEditMode);
    Editor.addTile(iso, Editor.currentEditMode);
  },

  changeEditMode: function(editMode) {
    // save new edit mode
    Editor.currentEditMode = editMode;
    // clear fill grid start position
    Editor.fillGridStartTileIso = null;
    // clear most recent delete layer
    Editor.mostRecentDeleteLayer = null;
    // trigger edit mode changed
    Crafty.trigger("EditModeChanged", editMode);
  }
};

Crafty.c('EditModeControl', {
  init: function() {
    this.requires('2D, Keyboard');

    this.bind('KeyDown', this._handleKeyDown);
    this.bind('KeyUp', this._handleKeyUp);
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
    else if (this.isDown('P')) {
      // Play game
      Editor.playGame();
    }
    else if (this.isDown('SHIFT')) {
      Editor.shiftKeyDown = true;
      var iso = Editor.tileCursor.getIsoPosition();
      Editor.drawFillGrid(iso);
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
    else if (this.isDown('Q')) {
      Editor.changeEditMode('PLAYER');
    }
  },

  _handleKeyUp: function(e) {
    if(e.key == Crafty.keys['SHIFT']) {
      Editor.shiftKeyDown = false;
      // Cleanup previously drawn fill grid
      Editor.cleanupFillGrid();
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
    this.unselectable();
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
    this.currentEditMode = Editor.currentEditMode;
    this.addComponent(Editor.tileNameFor(this.currentEditMode));

    this._tweenAlphaTo(0.0);

    this.bind("TweenEnd", function() {
      this._tweenAlphaTo((this.alpha == 0) ? 1.0:0.0);
    });

    this.bind("EditModeChanged", this._handleEditModeChanged.bind(this));

    this.tileOutline = Crafty.e("IsoTileOutline");
  },

  updatePosition: function(mouseX, mouseY) {
    this._updateTilePosition(Editor.mouseToIso(mouseX, mouseY));
  },

  getIsoPosition: function() {
    return this.currentIso;
  },

  _updateTilePosition: function(iso) {
    var tileWorldPos = Editor.isoToWorld(iso.row, iso.col);
    this.x = tileWorldPos.x;
    this.y = tileWorldPos.y;
    // Note: Z position for tile cursor is z tile position plus one, so it always appears on top
    this.z = Editor.tilePositionZFor(this.currentEditMode, this.y) + 1;
    this.currentIso = iso;
    // update tile outline position
    this.tileOutline.x = this.x;
    this.tileOutline.y = this.y;
  },

  _handleEditModeChanged: function(editMode) {
    // change sprite
    this.toggleComponent(Editor.tileNameFor(this.currentEditMode), Editor.tileNameFor(editMode));
    // store new current edit mode
    this.currentEditMode = editMode;
    // update position as edit mode may affect z position
    this._updateTilePosition(this.currentIso);
  },

  _tweenAlphaTo: function(targetAlpha) {
    this.tween({alpha: targetAlpha}, 30);
  }
});

Crafty.c('IsoTileOutline', {
  init: function() {
    this.requires('2D, Canvas');
    this.z = 7000;
    this.w = 128;
    this.h = 64;
    this.destroyAfterDraw = false;

    this.bind("Draw", function(e) {
      this._drawHandler(e);
    }.bind(this));

    this.ready = true;
  },

  clearAndDestroy: function() {
    // Move out of view (hopefully)
    this.x = -5000;
    this.y = -5000;
    // Next draw should destroy
    this.destroyAfterDraw = true;
  },

  _drawHandler : function (e) {
    this._drawIsoTileOutline(e.ctx, this.x, this.y);
    if (this.destroyAfterDraw) {
      this.destroy();
    }
  },

  _drawIsoTileOutline : function(ctx, offsetX, offsetY) {
    ctx.save();
    ctx.strokeStyle = "rgba(0,0,0,1.0)";
    ctx.beginPath();
    ctx.moveTo(offsetX + this.w/2,      offsetY + 1);
    ctx.lineTo(offsetX + this.w - 2,    offsetY + this.h/2);
    ctx.lineTo(offsetX + this.w/2,      offsetY + this.h - 1);
    ctx.lineTo(offsetX + 2,             offsetY + this.h/2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

});
