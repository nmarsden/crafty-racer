import {Game} from "../game";

require('../../lib/crafty_0.9.0');

Crafty.c('Waypoint', {
    init: function () {
        this.requires('Actor, spr_waypoint, SpriteAnimation, Collision, Level');
        this.collision(new Crafty.polygon([32, 0, 64, 16, 64, 48, 32, 64, 0, 48, 0, 16]));

        this.waypointPosition = {x: 0, y: 0};

        this.reel('ChangeColour', 1000, 4, 0, 2);
        this.animate('ChangeColour', -1);
        this.isReached = false;

        this.waypointReachedText = Crafty.e('TipText');
        this.waypointReachedText.setName("WaypointReachedText");
        this.waypointReachedText.text("WOOHOO!");
    },

    setPosition: function (x, y) {
        this.isReached = false;
        this.x = x;
        this.y = y;
        this.z = Math.floor(y);

        this.waypointPosition.x = this.x;
        this.waypointPosition.y = this.y;

        Crafty.trigger("WaypointMoved", this.waypointPosition);
    },

    reached: function () {
        if (this.isReached) {
            return;
        }
        this.isReached = true;
        Game.playSoundEffect('woop', 1, 1.0);
        this.waypointReachedText.show();

        Crafty.trigger('WaypointReached', this);
    }
});
