require('../../../lib/crafty_0.9.0');

Crafty.c('MiniMap', {
    init: function () {
        this.requires('2D, Canvas, Level');
        this.z = 7000;
        this.w = 200;
        this.h = 100;
        this.miniMapConfig = {w:this.w, h:this.h, paddingTop:5, paddingRight:5};
        this.waypointPosition = {x:0, y:0};
        this.playerPosition = {x:0, y:0};

        this.ready = true;

        this.navigator = Crafty.e('Navigator');
        this.navigator.setName("Navigator");

        this.diamond = Crafty.e("Diamond");
        this.diamond.setName("Diamond");

        this.waypointMarker = Crafty.e("MiniMapMarker");
        this.waypointMarker.setName("MiniMapMarker");
        this.waypointMarker.addComponent("spr_minimap_waypoint");

        this.playerMarker = Crafty.e("MiniMapMarker");
        this.playerMarker.setName("MiniMapMarker");
        this.playerMarker.addComponent("spr_minimap_car");

        Crafty.trigger("MiniMapConfigChanged", this.miniMapConfig);

        this.bind("ViewportChanged", this._updatePosition.bind(this));

        this.bind("PlayerMoved", this._playerMovedHandler.bind(this));

        this.bind("WaypointMoved", this._waypointMovedHandler.bind(this));

        this._updatePosition();
    },

    _updatePosition: function() {
        this.diamond.x = Crafty.viewport.width - this.w - this.miniMapConfig.paddingRight;
        this.diamond.y = this.miniMapConfig.paddingTop;

        this.navigator.x = Crafty.viewport.width - (this.miniMapConfig.w/2) - this.miniMapConfig.paddingRight - (this.navigator.w/2);
        this.navigator.y = this.miniMapConfig.paddingTop + (this.miniMapConfig.h/2) - (this.navigator.h/2);

        this.playerMarker.setOffset(
            Crafty.viewport.width - this.w - this.miniMapConfig.paddingRight - this.playerMarker.w/2,
            this.miniMapConfig.paddingTop - this.playerMarker.h/2
        );
        this.playerMarker.setPosition(this.playerPosition);

        this.waypointMarker.setOffset(
            Crafty.viewport.width - this.w - this.miniMapConfig.paddingRight - this.waypointMarker.w/2,
            this.miniMapConfig.paddingTop - this.waypointMarker.h/2
        );
        this.waypointMarker.setPosition(this.waypointPosition);
    },

    _playerMovedHandler: function (playerPosition) {
        this.playerPosition = playerPosition;
        this.playerMarker.setPosition(playerPosition);
    },

    _waypointMovedHandler: function (waypointPosition) {
        this.waypointPosition = waypointPosition;
        this.waypointMarker.setPosition(waypointPosition);
    }

});
