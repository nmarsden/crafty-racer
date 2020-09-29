require('../../../lib/crafty_0.9.0');

Crafty.c('MiniMap', {
    init: function () {
        this.requires('2D, Canvas, Level');
        this.z = 7000;
        this.w = 200;
        this.h = 100;
        this.miniMapConfig = {w:this.w, h:this.h, paddingTop:5, paddingRight:5};

        this.ready = true;

        this.navigator = Crafty.e('Navigator');
        this.navigator.setName("Navigator");

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

        Crafty.trigger("MiniMapConfigChanged", this.miniMapConfig);

        this.bind("PlayerMoved", this._playerMovedHandler.bind(this));

        this.bind("WaypointMoved", this._waypointMovedHandler.bind(this));
    },

    _playerMovedHandler: function (playerPosition) {
        let offsetX = Crafty.viewport.width - Crafty.viewport.x - this.w;
        let offsetY = -Crafty.viewport.y;

        this.diamond.x = offsetX;
        this.diamond.y = offsetY;

        this.playerMarker.setPosition(playerPosition);
        this.playerMarker.setOffset(offsetX, offsetY);

        this.waypointMarker.setOffset(offsetX, offsetY);

        this.viewportOutline.setPosition(playerPosition);
        this.viewportOutline.setOffset(offsetX, offsetY);
    },

    _waypointMovedHandler: function (waypointPosition) {
        let offsetX = Crafty.viewport.width - Crafty.viewport.x - this.w;
        let offsetY = -Crafty.viewport.y;

        this.waypointMarker.setPosition(waypointPosition);
        this.waypointMarker.setOffset(offsetX, offsetY);
    }

});
