require('../../lib/crafty_0.9.0');

import {Game} from "../game";

Crafty.c('TouchControl', {
    buttonConfigs: [
        {
            key: 'ESC',
            sprite: 'spr_menu_icon',
            rotation: 0,
            updatePosFn: (b) => {
                b.x = (Crafty.viewport.width / 2) - (b.w / 2);
                b.y = Crafty.viewport.height - (b.padding + b.w)
            }
        },
        {
            key: 'LEFT_ARROW',
            sprite: 'spr_arrow',
            rotation: -90,
            updatePosFn: (b) => {
                b.x = b.padding;
                b.y = Crafty.viewport.height - (b.padding + b.w)
            }
        },
        {
            key: 'RIGHT_ARROW',
            sprite: 'spr_arrow',
            rotation: 90,
            updatePosFn: (b) => {
                b.x = b.padding + b.w + b.padding/2;
                b.y = Crafty.viewport.height - (b.padding + b.w)
            }
        },
        {
            key: 'UP_ARROW',
            sprite: 'spr_arrow',
            rotation: 0,
            updatePosFn: (b) => {
                b.x = Crafty.viewport.width - (b.padding + b.w);
                b.y = Crafty.viewport.height - (b.padding + b.w)
            }
        },
        {
            key: 'DOWN_ARROW',
            sprite: 'spr_arrow',
            rotation: 180,
            updatePosFn: (b) => {
                b.x = Crafty.viewport.width - (b.padding + b.w + b.padding/2 + b.w);
                b.y = Crafty.viewport.height - (b.padding + b.w)
            }
        }
    ],
    buttons: [],
    buttonSize: 62,
    padding: 8,

    init: function () {
        this.requires('Actor, Level');

        this.buttons = this.buttonConfigs.map(config => this.createButton(config));

        this.updatePosition();

        this.bind("ViewportChanged", () => this.updatePosition());
        this.bind("PauseGame", () => this._pauseGame());
        this.bind("UnpauseGame", () => this._unpauseGame());
    },

    createButton: function(config) {
        let button = Crafty.e('UILayer, 2D, DOM, Level, Button');
        button.requires(config.sprite);
        button.w = this.buttonSize;
        button.h = this.buttonSize;
        button.z = 7000;
        button.origin(this.buttonSize / 2, this.buttonSize / 2);
        button.rotation = config.rotation;
        button.padding = this.padding;

        button.updatePosition = () => config.updatePosFn(button);
        button.bind('MouseDown', () => this.mouseDownHandler(config.key));
        button.bind('MouseUp', () => this.mouseUpHandler(config.key));
        button.bind('TouchStart', () => this.mouseDownHandler(config.key));
        button.bind('TouchEnd', () => this.mouseUpHandler(config.key));
        return button;
    },

    mouseDownHandler: function(key) {
        if (this.paused) {
            return;
        }
        Game.dispatchKeyDown(key);
    },

    mouseUpHandler: function(key) {
        if (this.paused) {
            return;
        }
        Game.dispatchKeyUp(key);
    },

    _pauseGame: function () {
        this.paused = true;
        this.buttons.forEach(b => b.css({'display': 'none'}));
    },

    _unpauseGame: function () {
        this.paused = false;
        this.buttons.forEach(b => b.css({'display': 'block'}));
    },

    updatePosition: function() {
        this.buttons.forEach((button) => button.updatePosition());
    }
});
