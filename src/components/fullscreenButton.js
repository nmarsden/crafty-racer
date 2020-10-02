require('../../lib/crafty_0.9.0');

Crafty.c('FullscreenButton', {
    currentState: 'ACTIVATE',
    stateIcons: {
      'ACTIVATE':   'spr_fullscreen_activate_icon',
      'DEACTIVATE': 'spr_fullscreen_deactivate_icon'
    },

    init: function () {
        this.requires('UILayer, 2D, DOM, Button');
        this.addComponent(this.stateIcons[this.currentState]);
        this.attr({w: 60, h: 60, z:50})
        this.css({
            'cursor': 'pointer'
        });
        this.bind('Click', this.buttonClickHandler.bind(this));
        this.bind('MouseDown', this.buttonClickHandler.bind(this));
        this.bind('TouchStart', this.buttonClickHandler.bind(this));

        this.bind("ViewportChanged", this.viewportChanged.bind(this));

        this.fullscreenChangeHandler = () => { this.updateState() };

        document.addEventListener('fullscreenchange', this.fullscreenChangeHandler);

        this.updateState();
        this.updatePosition();
    },

    remove: function() {
        document.removeEventListener('fullscreenchange', this.fullscreenChangeHandler);
    },

    buttonClickHandler: function() {
        this.toggleFullScreen()
            .catch(() => console.log("cannot toggle fullscreen"))
            .finally(() => { Crafty.s('Touch').resetTouchPoints(); });
    },

    toggleFullScreen: function() {
        let doc = window.document;
        let docEl = doc.documentElement;

        let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (this.isFullscreen()) {
            return cancelFullScreen.call(doc);
        }
        else {
            return requestFullScreen.call(docEl);
        }
    },

    isFullscreen: function() {
        let doc = window.document;
        return !(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement);
    },

    updateState: function() {
        let isFS = this.isFullscreen();
        if ((isFS && this.currentState !== 'DEACTIVATE') || (!isFS && this.currentState !== 'ACTIVATE')) {
            this.switchState();
        }
    },

    viewportChanged: function () {
        this.updatePosition();
    },

    updatePosition: function() {
        let padding = 10;
        this.x = Crafty.viewport.width - this.w - padding;
        this.y = padding;
    },

    switchState: function() {
        this.removeComponent(this.stateIcons[this.currentState], false);
        this.currentState = (this.currentState === 'ACTIVATE') ? 'DEACTIVATE' : 'ACTIVATE';
        this.addComponent(this.stateIcons[this.currentState]);
        this.attr({w: 60, h: 60, z:50})
    }
});
