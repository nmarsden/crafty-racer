require('../../../lib/crafty_0.9.0');

import {Game} from "../../game";

Crafty.c('MiniMap', {
    init: function () {
        this.requires('UILayer, 2D, DOM, Level');
        this.w = 200;
        this.h = 100;
        this.miniMapPos = {x:0, y:0};
        this.miniMapPadding = {right:5, top:5};
        this.waypointPosition = {x:0, y:0};
        this.playerPosition = {x:0, y:0};

        this.arrow = Crafty.e('MiniMapArrow');
        this.arrow.setName("MiniMapArrow");

        this.diamond = Crafty.e("MiniMapDiamond");
        this.diamond.setName("MiniMapDiamond");
        this.diamond.attr({w:this.w, h:this.h});

        this.waypointMarker = Crafty.e("MiniMapMarker");
        this.waypointMarker.setName("MiniMapMarker");
        this.waypointMarker.addComponent("spr_minimap_waypoint");

        this.playerMarker = Crafty.e("MiniMapMarker");
        this.playerMarker.setName("MiniMapMarker");
        this.playerMarker.addComponent("spr_minimap_car");

        this.bind("ViewportChanged", this._updatePosition.bind(this));

        this.bind("PlayerMoved", this._playerMovedHandler.bind(this));

        this.bind("WaypointMoved", this._waypointMovedHandler.bind(this));

        this._updatePosition();
    },

    _updatePosition: function() {
        this.miniMapPos = {
            x: Crafty.viewport.width - this.w - this.miniMapPadding.right,
            y: this.miniMapPadding.top
        };

        this.diamond.x = this.miniMapPos.x - this.diamond.borderWidth;
        this.diamond.y = this.miniMapPos.y - this.diamond.borderWidth;

        this.arrow.x = this.miniMapPos.x + (this.w/2) - (this.arrow.w/2);
        this.arrow.y = this.miniMapPos.y + (this.h/2) - (this.arrow.h/2);

        this._updateMiniMapMarkerPosition(this.playerMarker, this.playerPosition);
        this._updateMiniMapMarkerPosition(this.waypointMarker, this.waypointPosition);
    },

    _playerMovedHandler: function (playerPosition) {
        this.playerPosition = playerPosition;
        this._updateMiniMapMarkerPosition(this.playerMarker, this.playerPosition);
    },

    _waypointMovedHandler: function (waypointPosition) {
        this.waypointPosition = waypointPosition;
        this._updateMiniMapMarkerPosition(this.waypointMarker, this.waypointPosition);
    },

    _updateMiniMapMarkerPosition: function (miniMapMarker, position) {
        let miniPos = this._gamePos2MiniPos(position);
        miniMapMarker.x = this.miniMapPos.x - miniMapMarker.w/2 + miniPos.x;
        miniMapMarker.y = this.miniMapPos.y - miniMapMarker.h/2 + miniPos.y;
    },

    _gamePos2MiniPos: function (gamePos) {
        return {
            x : (gamePos ? Math.round(((6200 + gamePos.x) / Game.width()) * this.w) : 0),
            y : (gamePos ? Math.round((gamePos.y / Game.height()) * this.h) : 0)
        }
    }
});
