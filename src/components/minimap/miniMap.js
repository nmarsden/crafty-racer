require('../../../lib/crafty_0.9.0');

Crafty.c('MiniMap', {
    init: function () {
        this.requires('2D, Canvas, Level');
        this.z = 7000;
        this.w = 220;
        this.h = 110;
        this.ready = true;

        this.diamond = Crafty.e("Diamond");
        this.diamond.setName("Diamond");

        this.waypointMarker = Crafty.e("MiniMapMarker");
        this.waypointMarker.setName("MiniMapMarker");
        this.waypointMarker.setColour("#568a20");

        this.playerMarker = Crafty.e("MiniMapMarker");
        this.playerMarker.setName("MiniMapMarker");
        this.playerMarker.setColour("#FF0000");

        this.viewportOutline = Crafty.e("MiniMapViewport");
        this.viewportOutline.setName("MiniMapViewport");

        this.bind("PlayerMoved", this._playerMovedHandler.bind(this));

        this.bind("WaypointMoved", this._waypointMovedHandler.bind(this));
    },

    _playerMovedHandler: function (playerPosition) {
        this.x = Crafty.viewport.width - Crafty.viewport.x - this.w + 5;
        this.y = -Crafty.viewport.y;

        var offsetX = this.x + 10;
        var offsetY = this.y + 5;

        this.diamond.x = offsetX;
        this.diamond.y = offsetY;

        this.playerMarker.setPosition(playerPosition);
        this.playerMarker.setOffset(offsetX, offsetY);

        this.waypointMarker.setOffset(offsetX, offsetY);

        this.viewportOutline.setPosition(playerPosition);
        this.viewportOutline.setOffset(offsetX, offsetY);
    },

    _waypointMovedHandler: function (waypointPosition) {
        this.x = Crafty.viewport.width - Crafty.viewport.x - this.w - 5;
        this.y = (-Crafty.viewport.y + 5);

        var offsetX = this.x + 10;
        var offsetY = this.y + 5;

        this.waypointMarker.setPosition(waypointPosition);
        this.waypointMarker.setOffset(offsetX, offsetY);
    }

});
