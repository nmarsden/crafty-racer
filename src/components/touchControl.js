require('../../lib/crafty_0.9.0');

import {Game} from "../game";

Crafty.c('TouchControl', {
    buttonConfigs: [
        {
            key: 'ESC',
            sprite: 'spr_menu_icon',
            rotation: 0,
            imageSize: 32,
            updatePosFn: (b) => {
                b.x = (Crafty.viewport.width / 2) - (b.w / 2);
                b.y = Crafty.viewport.height - b.w
            }
        },
        {
            key: 'LEFT_ARROW',
            sprite: 'spr_navigator',
            rotation: -90,
            imageSize: 96,
            updatePosFn: (b) => {
                b.x = - 10;
                b.y = Crafty.viewport.height - b.w
            }
        },
        {
            key: 'RIGHT_ARROW',
            sprite: 'spr_navigator',
            rotation: 90,
            imageSize: 96,
            updatePosFn: (b) => {
                b.x = b.w - 30;
                b.y = Crafty.viewport.height - b.w
            }
        },
        {
            key: 'UP_ARROW',
            sprite: 'spr_navigator',
            rotation: 0,
            imageSize: 96,
            updatePosFn: (b) => {
                b.x = Crafty.viewport.width - b.w + 5;
                b.y = Crafty.viewport.height - b.w
            }
        },
        {
            key: 'DOWN_ARROW',
            sprite: 'spr_navigator',
            rotation: 180,
            imageSize: 96,
            updatePosFn: (b) => {
                b.x = Crafty.viewport.width - (2 * b.w) + 30;
                b.y = Crafty.viewport.height - b.w
            }
        }
    ],
    buttons: [],
    buttonSize: 80,

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
        button.img.width = config.imageSize;
        button.img.height = config.imageSize;
        button.w = this.buttonSize;
        button.h = this.buttonSize;
        button.z = 7000;
        button.origin(this.buttonSize / 2, this.buttonSize / 2);
        button.rotation = config.rotation;

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
