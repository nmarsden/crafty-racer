require('../../lib/crafty_0.9.0');

Crafty.c('ShowFPS', {
    init: function () {
        this.requires('2D, DOM, FPS, Text');
        this.attr({maxValues: 10});

        this.bind("MessureFPS", function (fps) {
            this.text("FPS: " + fps.value); //Display Current FPS
            //console.log(this.values); // Display last x Values
        });

        this.bind("EnterFrame", function () {
            this.x = -Crafty.viewport.x;
            this.y = -Crafty.viewport.y + 10;

            //console.log("ShowFPS:", "x", this.x, "y", this.y);
        });

    }
});
