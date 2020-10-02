require('../../lib/crafty_0.9.0');

Crafty.c('MainMenu', {
    init: function () {
        this.requires('Menu');

        this.addMenuTitle("Crafty Racer");
        this.addMenuItem("PLAY", this.showLevelMenu.bind(this), "P");
        // this.addMenuItem("Instructions", this.comingSoonHandler("Instructions").bind(this), "I");
        // this.addMenuItem("Settings", this.comingSoonHandler("Settings").bind(this), "S");
        // this.addMenuItem("Credits", this.comingSoonHandler("Credits").bind(this), "C");

        this.bind("ViewportChanged", this.updatePosition.bind(this));

        this.updatePosition();
    },

    updatePosition: function () {
        let x = Crafty.viewport.width / 2;
        let y = Crafty.viewport.height / 2;

        this.attr({w:Crafty.viewport.width, h:Crafty.viewport.height});
    },

    showLevelMenu: function () {
        this.levelSelectMenu = Crafty.e('LevelSelectMenu');
        this.levelSelectMenu.setName("LevelSelectMenu");
        this.levelSelectMenu.setMenuOptions({
            parentMenu: this
        });
        this.levelSelectMenu.showMenu();
    },

    comingSoonHandler: function (name) {
        return function () {
            Crafty.e('Menu')
                .setName("Menu")
                .setMenuOptions({
                    parentMenu: this
                })
                .addMenuItem(name + " Coming Soon", this.showMenu.bind(this))
                .showMenu();
        }
    }
});
