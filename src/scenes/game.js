require('../../lib/crafty_0.9.0');

import {Debug} from "../utils";
import {Game} from "../game";

Crafty.scene('Game', function() {
    Debug.logTriggeredEvents();
    Debug.logEntitiesAndHandlers("Before Menu");

    Game.initFullscreenButton();
    Game.showMainMenu();

    // Show the victory screen once all waypoints are reached
    this.show_victory = function() {
        if (Game.isLevelComplete()) {
            if (Game.isAttractMode()) {
                Crafty.trigger("PlaybackEnded");
                return;
            }
            Game.pauseGame();
            Game.disablePauseControl();
            Game.stopAllSoundsExcept('woop');
            Game.playMusic('end_level_music');
            var levelCompleteControl = Crafty.e('LevelCompleteControl');
            levelCompleteControl.setName("LevelCompleteControl");
        } else {
            Game.nextWaypoint();
        }
    }
    Crafty.bind('WaypointReached', this.show_victory);

    // Show the game over screen when time is up
    this.show_game_over_times_up = function() {
        if (Game.isAttractMode()) {
            Crafty.trigger("PlaybackEnded");
            return;
        }
        Game.stopAllSoundsExcept();
        Game.pauseGame();
        Game.disablePauseControl();

        var gameOverControl = Crafty.e('GameOverControl');
        gameOverControl.setName("GameOverControlTimesUp");
        gameOverControl.setReason("TIMES UP");
    }
    Crafty.bind('TimesUp', this.show_game_over_times_up);

    // Show the game over screen when off the edge
    this.show_game_over_off_the_edge = function() {
        if (Game.isAttractMode()) {
            Crafty.trigger("PlaybackEnded");
            return;
        }
        Game.stopAllSoundsExcept();
        Game.pauseGame();
        Game.disablePauseControl();

        var gameOverControl = Crafty.e('GameOverControl');
        gameOverControl.setName("GameOverControlOffTheEdge");
        gameOverControl.setReason("OFF THE EDGE");
    }
    Crafty.bind('OffTheEdge', this.show_game_over_off_the_edge);

    this.quit = function() {
        Game.destroyAll2DEntities();
        Game.stopAllSoundsExcept();
        Game.showMainMenu();
    }
    Crafty.bind('Quit', this.quit);

}, function() {
});
