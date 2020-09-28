require('../../lib/crafty_0.9.0');

Crafty.c('MainMenu', {
    init: function () {
        this.requires('Menu');

        this.addMenuItem("Play", this.showLevelMenu.bind(this), "P");
        // this.addMenuItem("Instructions", this.comingSoonHandler("Instructions").bind(this), "I");
        // this.addMenuItem("Settings", this.comingSoonHandler("Settings").bind(this), "S");
        // this.addMenuItem("Credits", this.comingSoonHandler("Credits").bind(this), "C");
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
