require('../../../lib/crafty_0.9.0');

import {Editor} from '../../editor';

Crafty.c('TileCursor', {
    init: function() {
        this.requires('2D, Canvas, Tween, Editor');
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
        this.tween({alpha: targetAlpha}, 500);
    }
});
