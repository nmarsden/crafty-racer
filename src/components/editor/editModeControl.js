require('../../../lib/crafty_0.9.0');

import {Game} from "../../game";
import {Editor} from '../../editor';

Crafty.c('EditModeControl', {
    init: function() {
        this.requires('2D, Keyboard, Editor');

        this.bind('KeyDown', this._handleKeyDown);
        this.bind('KeyUp', this._handleKeyUp);
    },

    _handleKeyDown: function(e) {
        if (this.isDown('PLUS')) {
            // Zoom In
            Editor.zoom(2);
        }
        else if (this.isDown('MINUS')) {
            // Zoom Out
            Editor.zoom(0.5);
        }
        else if (this.isDown('0')) {
            // Scroll (0,0)
            Game.scrollXYViewport(0,0);
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
        else if (this.isDown('F4')) {
            // Play game
            Editor.playGame();
        }
        else if (this.isDown('SHIFT')) {
            Editor.shiftKeyDown = true;
            var iso = Editor.tileCursor.getIsoPosition();
            Editor.drawFillGrid(iso);
        }
        else if (this.isDown('1')) {
            Editor.changeEditMode('SOLID');
        }
        else if (this.isDown('2')) {
            Editor.changeEditMode('GROUND');
        }
        else if (this.isDown('3')) {
            Editor.changeEditMode('BREAKING');
        }
        else if (this.isDown('4')) {
            Editor.changeEditMode('MUD');
        }
        else if (this.isDown('5')) {
            Editor.changeEditMode('ICE');
        }
        else if (this.isDown('Q')) {
            Editor.changeEditMode('PLAYER');
        }
        else if (this.isDown('W')) {
            if (Editor.isWaypointEditMode()) {
                // Cycle to next waypoint edit mode
                Editor.changeEditMode(Editor.nextWaypointEditMode());
            } else {
                // TODO perhaps should set to first unused waypoint?
                Editor.changeEditMode('WAYPOINT1');
            }
        }
        else if (this.isDown('E')) {
            if (Editor.isOneWayEditMode()) {
                // Cycle to next one-way edit mode
                Editor.changeEditMode(Editor.nextOneWayEditMode());
            } else {
                Editor.changeEditMode('ONEWAY1');
            }
        }
        else if (this.isDown('R')) {
            Editor.changeEditMode('OIL');
        }
        else if (this.isDown('DELETE')) {
            Editor.changeEditMode('DELETE');
        }
    },

    _handleKeyUp: function(e) {
        if(e.key == Crafty.keys['SHIFT']) {
            Editor.shiftKeyDown = false;
            // Cleanup previously drawn fill grid
            Editor.cleanupFillGrid();
        }
    }

});
