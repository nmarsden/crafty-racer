require('../../lib/crafty_0.9.0');

import {Game} from "../game";

Crafty.c('Menu', {
    init: function () {
        this.requires('UILayer, 2D, DOM, Text, Keyboard');
        this.backgroundImageDim = { width: 922, height: 555 };
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

        this.overlay = Crafty.e('UILayer, 2D, DOM, spr_menu_background, Tween');
        this.overlay.setName("MenuBackground")
        this.overlay.attr({alpha:0.5});

        this._resizeMenu();

        // this.displayMenuInstructions();

        Crafty.addEvent(this, window, "resize", this._resizeMenu.bind(this));
        this.bind('EnterFrame', this._enterFrame);

        this.options = {
            parentMenu: null,
            escapeKeyHidesMenu: true
        }
    },

    _resizeMenu: function() {
        if (Crafty.viewport.height > Crafty.viewport.width) {
            // Fit to width
            let scaleHeight = Crafty.viewport.width / this.backgroundImageDim.width;
            let x = 0;
            let width = Crafty.viewport.width;
            let height = scaleHeight * this.backgroundImageDim.height;
            let y = (Crafty.viewport.height - height)/2;

            this.overlay.attr({x: x, y: y, w: width, h: height});
        } else {
            // Fit to Height
            let scaleWidth = Crafty.viewport.height / this.backgroundImageDim.height;
            let y = 0;
            let height = Crafty.viewport.height;
            let width = scaleWidth * this.backgroundImageDim.width;
            let x = (Crafty.viewport.width - width)/2;

            this.overlay.attr({x: x, y: y, w: width, h: height});
        }
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

        var totalHeight = (this.buttonHeight + (2 * margin)) * this.menuItems.length;
        var y = Crafty.viewport.height / 2 - (totalHeight / 2);
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

    displayMenuInstructions: function () {
        var x = this.overlay.x + this.overlay._w - 240;
        var y = this.overlay.y + 555 - 130;
        var alpha = 0.5
        var textColour = '#0061FF';

        // - up arrow / down arrow: navigate
        var upArrow = Crafty.e('2D, Canvas, spr_up_arrow');
        upArrow.setName("UpArrow");
        upArrow.attr({x: x, y: y, w: 51, h: 48});
        upArrow.alpha = alpha;
        var downArrow = Crafty.e('2D, Canvas, spr_down_arrow');
        downArrow.setName("DownArrow");
        downArrow.attr({x: x + 56, y: y, w: 51, h: 48});
        downArrow.alpha = alpha;
        var navigate = Crafty.e('2D, DOM, Text');
        navigate.setName("NavigateText");
        navigate.text("navigate");
        navigate.attr({x: x + 110, y: y, w: 100, h: 48});
        navigate.textFont({type: 'normal', weight: 'normal', size: '32px', family: 'ARCADE'});
        navigate.css({
            'padding': '5px',
            'text-align': 'left'
        });
        navigate.textColor(textColour, 1.0);
        navigate.alpha = alpha;

        this.overlay.attach(upArrow);
        this.overlay.attach(downArrow);
        this.overlay.attach(navigate);

        // - enter: select
        var enterKey = Crafty.e('2D, Canvas, spr_enter_key');
        enterKey.setName("EnterKey");
        enterKey.attr({x: x, y: y + 53, w: 100, h: 48});
        enterKey.alpha = alpha;
        var select = Crafty.e('2D, DOM, Text');
        select.setName("SelectText");
        select.text("select");
        select.attr({x: x + 110, y: y + 53, w: 100, h: 48});
        select.textFont({type: 'normal', weight: 'normal', size: '32px', family: 'ARCADE'});
        select.css({
            'padding': '5px',
            'text-align': 'left'
        });
        select.textColor(textColour, 1.0);
        select.alpha = alpha;

        this.overlay.attach(enterKey);
        this.overlay.attach(select);
    },

    hideMenu: function () {
        // unbind event handlers
        this.unbind('KeyDown', this.handleKeyDown);
        this.unbind('EnterFrame', this._enterFrame);
        Game.gamePad.unbind(Gamepad.Event.BUTTON_DOWN);
        Game.gamePad.unbind(Gamepad.Event.BUTTON_UP);
        this.unbind('SelectionChanged', this.handleSelectionChanged);
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
