require('../../lib/crafty_0.9.0');

import {Game} from "../game";

Crafty.c('Menu', {
    init: function () {
        this.requires('UILayer, 2D, DOM, Text, Keyboard');
        this.menuTitle = null;
        this.menuTitleText = "";
        this.menuTitleHeight = 120;
        this.menuTitleCar = null;
        this.menuItems = [];
        this.selectedMenuIndex = 0;
        this.colour = '#0061FF';
        this.selectedColour = '#FFFF00';
        this.timeIdle = 0;
        this.MAX_IDLE_FRAMES = 60 * 30; // approx. 30 seconds
        this.gamePadMapping = {
            'DPAD_UP': 'UP_ARROW',
            'DPAD_DOWN': 'DOWN_ARROW',
            'B': 'ENTER',
            'X': 'ESC'
        };
        this.buttonHeight = 60;

        this._resizeMenu();

        Crafty.addEvent(this, window, "resize", this._resizeMenu.bind(this));
        this.bind('EnterFrame', this._enterFrame);

        this.options = {
            parentMenu: null,
            escapeKeyHidesMenu: true
        }
    },

    _resizeMenu: function() {
        this.w = Crafty.viewport.width;
        this.h = Crafty.viewport.height;

        this._resizeMenuItems();
    },

    setMenuOptions: function (options) {
        if (options.parentMenu != undefined) {
            this.options.parentMenu = options.parentMenu;
        }
        if (options.escapeKeyHidesMenu != undefined) {
            this.options.escapeKeyHidesMenu = options.escapeKeyHidesMenu;
        }
        return this;
    },

    addMenuTitle: function(titleText) {
        this.menuTitleText = titleText;    
    },
    
    addMenuItem: function (displayName, menuItemFunction, hotKey) {
        this.menuItems.push({
            displayName: displayName,
            menuItemFunction: menuItemFunction,
            hotKey: hotKey
        });
        return this;
    },

    handleSelectionChanged: function (obj) {
        Game.playSoundEffect('menu_nav', 1, 1.0);
        var oldItem = this.menuItems[obj.oldIndex].entity;
        var newItem = this.menuItems[obj.newIndex].entity;

        oldItem.textColor(this.colour, 1.0);
        oldItem.css({
            '-moz-animation-duration': '',
            '-moz-animation-name': '',
            '-moz-animation-iteration-count': '',
            '-webkit-animation-duration': '',
            '-webkit-animation-name': '',
            '-webkit-animation-iteration-count': ''
        });

        newItem.textColor(this.selectedColour, 1.0);
        newItem.css({
            '-moz-animation-duration': '1s',
            '-moz-animation-name': 'selected_menu_item',
            '-moz-animation-iteration-count': 'infinite',
            '-webkit-animation-duration': '1s',
            '-webkit-animation-name': 'selected_menu_item',
            '-webkit-animation-iteration-count': 'infinite'
        });
    },

    _resizeMenuItems: function () {
        let margin = 5;
        let titleHeight = (this.menuTitleText !== "") ? (this.menuTitleHeight + this.menuTitleCar.h + margin*2): 0;
        var totalHeight = titleHeight + (this.buttonHeight + (2 * margin)) * this.menuItems.length;
        var y = Crafty.viewport.height / 2 - (totalHeight / 2);

        if (this.menuTitleText !== "") {
            let titleX = Crafty.viewport.width / 2 - (this.menuTitle.w / 2);
            this.menuTitle.attr({x: titleX, y: y});
            y += this.menuTitleHeight + margin;

            let titleCarX = Crafty.viewport.width / 2 - (this.menuTitleCar.w / 2);
            this.menuTitleCar.attr({x: titleCarX, y: y});
            y += this.menuTitleCar.h + margin;
        }

        for (var i = 0; i < this.menuItems.length; i++) {
            let item = this.menuItems[i].entity;
            let x = Crafty.viewport.width / 2 - (item.w / 2);
            item.attr({x: x, y: y});
            y += this.buttonHeight + (2 * margin);
        }
    },

    showMenu: function () {
        var width = 300;
        var alpha = 1.0;

        this.selectedMenuIndex = 0;

        this.bind('KeyDown', this.handleKeyDown);
        Game.gamePad.bind(Gamepad.Event.BUTTON_DOWN, this._gamePadButtonDown.bind(this));
        Game.gamePad.bind(Gamepad.Event.BUTTON_UP, this._gamePadButtonUp.bind(this));
        this.bind('SelectionChanged', this.handleSelectionChanged);

        // display menu title
        if (this.menuTitleText !== "") {
            this.menuTitle = Crafty.e('OutlineText');
            this.menuTitle.setName("PauseText");
            this.menuTitle.attr({w: 320, z:50})
            this.menuTitle.text(this.menuTitleText);
            this.menuTitle.textFont({type: 'normal', weight: 'normal', size: '60px', family: Game.fontFamily})
            this.menuTitle.textColor("#0061FF");

            this.menuTitleCar = Crafty.e("2D, DOM, SpriteAnimation, spr_car");
            this.menuTitleCar.reel('Menu_Title_Car', 2000, 4, 6, 32, 10);
            this.menuTitleCar.animate('Menu_Title_Car', -1);
        }

        // display menu items
        for (var i = 0; i < this.menuItems.length; i++) {
            var item = this.menuItems[i];
            var menuItem = Crafty.e('OutlineText, Tween, Button');
            menuItem.setName("MenuItem");
            var textColor = (i === 0) ? this.selectedColour : this.colour;
            menuItem.text(item.displayName);
            menuItem.attr({w: width, h: this.buttonHeight, alpha: alpha});
            menuItem.textFont({type: 'normal', weight: 'normal', size: '50px', family: Game.fontFamily});
            menuItem.textColor(textColor, 1.0);
            menuItem.css({
                'line-height': `${this.buttonHeight}px`,
                'border': `2px solid ${this.colour}`,
            });
            if (i === 0) {
                menuItem.css({
                    '-moz-animation-duration': '1s',
                    '-moz-animation-name': 'selected_menu_item',
                    '-moz-animation-iteration-count': 'infinite',
                    '-webkit-animation-duration': '1s',
                    '-webkit-animation-name': 'selected_menu_item',
                    '-webkit-animation-iteration-count': 'infinite'
                });
            }
            let clickHandler = (menuIndex) => { return () => this.menuItemSelected(menuIndex); };
            menuItem.bind('Click', clickHandler(i));
            menuItem.bind('TouchStart', clickHandler(i));
            item.entity = menuItem;
        }

        this._resizeMenuItems();

        Game.playSoundEffect('menu_change_page', 1, 1.0);

    },


    hideMenu: function () {
        // unbind event handlers
        this.unbind('KeyDown', this.handleKeyDown);
        this.unbind('EnterFrame', this._enterFrame);
        Game.gamePad.unbind(Gamepad.Event.BUTTON_DOWN);
        Game.gamePad.unbind(Gamepad.Event.BUTTON_UP);
        this.unbind('SelectionChanged', this.handleSelectionChanged);
        // hide menu title
        if (this.menuTitleText !== "") {
            this.menuTitle.destroy();
            this.menuTitleCar.destroy();
        }
        // hide menu items
        for (var i = 0; i < this.menuItems.length; i++) {
            this.menuItems[i].entity.destroy();
        }
    },

    menuItemSelectedViaHotKey: function () {

    },

    _gamePadButtonDown: function (e) {
        Game.dispatchKeyDown(this.gamePadMapping[e.control]);
    },

    _gamePadButtonUp: function (e) {
        Game.dispatchKeyUp(this.gamePadMapping[e.control]);
    },

    _enterFrame: function () {
        this.timeIdle++;
        if (this.timeIdle > this.MAX_IDLE_FRAMES) {
            this.timeIdle = 0;
            Game.startAttractMode();
        }
    },

    menuItemSelected: function (menuIndex) {
        this.hideMenu();
        let selectedMenuItem = this.menuItems[menuIndex];
        selectedMenuItem.menuItemFunction();
    },

    handleKeyDown: function () {
        this.timeIdle = 0;
        var selectedMenuItem = null;
        var previousIndex = this.selectedMenuIndex;

        if (this.isDown('UP_ARROW')) {
            this.selectedMenuIndex--;
            if (this.selectedMenuIndex < 0) {
                this.selectedMenuIndex = this.menuItems.length - 1;
            }
            Crafty.trigger("SelectionChanged", {oldIndex: previousIndex, newIndex: this.selectedMenuIndex});

        } else if (this.isDown('DOWN_ARROW')) {
            this.selectedMenuIndex++;
            if (this.selectedMenuIndex > this.menuItems.length - 1) {
                this.selectedMenuIndex = 0;
            }
            Crafty.trigger("SelectionChanged", {oldIndex: previousIndex, newIndex: this.selectedMenuIndex});

        } else if (this.isDown('ENTER')) {
            this.menuItemSelected(this.selectedMenuIndex);

        } else if ((selectedMenuItem = this.menuItemSelectedViaHotKey()) != null) {
            this.hideMenu();
            selectedMenuItem.menuItemFunction();

        } else if (this.options.escapeKeyHidesMenu && this.isDown('ESC')) {
            this.hideMenu();
            if (this.options.parentMenu) {
                this.options.parentMenu.showMenu();
            } else {
                Game.startAttractMode();
            }
        } else if (this.isDown('F4')) {
//      this.hideMenu();
//      Game.loadAndEditLevel(3);
        }

    }

});
