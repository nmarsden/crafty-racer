require('../../../lib/crafty_0.9.0');

Crafty.c('ScaleIndicator', {
    init: function() {
        this.requires('2D, DOM, Text, Editor');
        this.scalePercentage = 100.0;
        this.fontSize = 16;
        this.margin = 10;
        this.h = 5;
        this.w = 4800;
        this.textFont({ type: 'normal', weight: 'normal', size: this.fontSize + 'px', family: 'Consolas' });
        this.css('text-align', 'left');
        this.textColor('#00000', 1.0);
        this.text("Scale: " + this.scalePercentage + "%");
        this.unselectable();
        this._updatePosition();

        this.bind("ViewportChanged", this._updatePosition.bind(this));
        this.bind("ZoomLevelChanged", this._updateScalePercentage.bind(this));
    },

    _updatePosition: function() {
        // Update position to be in bottom-left corner of viewport
        // Note: Dividing by viewport._scale to undo the effects of the viewport being scaled
        this.x = -Crafty.viewport.x + (this.margin / Crafty.viewport._scale);
        this.y = -Crafty.viewport.y + (Crafty.viewport._height - this.fontSize - this.margin)/ Crafty.viewport._scale;
    },

    _updateScalePercentage: function(zoomLevel) {
        this.scalePercentage = zoomLevel * 100.0;
        this.text("Scale: " + this.scalePercentage + "%");

        // Note: Adjusting fontSize to undo the effects of Crafty applying a scale transform to the stage when the viewport is scaled
        this.textFont({ size: (this.fontSize / zoomLevel) + 'px'});
    }
});
