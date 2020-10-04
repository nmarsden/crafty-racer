require('../../lib/crafty_0.9.0');

Crafty.scene('Loading', function(){

    Crafty.viewport.scroll('_x', 0);
    Crafty.viewport.scroll('_y', 0);

    Crafty.e('LoadingText');

    Crafty.paths({ audio: "assets/audio/", images: "assets/images/" });
    Crafty.load({
        "audio": {
            engine_idle:        ['engine_idle.mp3'],
            engine_speed_up:    ['engine_speed_up.mp3'],
            engine_slow_down:   ['engine_slow_down.mp3'],
            engine_top_speed:   ['engine_top_speed.mp3'],
            wheel_spin:         ['wheel_spin.mp3'],
            woop:               ['woop.ogg'],
            car_horn:           ['car_horn.ogg'],
            low_time:           ['low_time_warning.mp3'],
            falling:            ['falling.mp3'],
            disappear:          ['disappear.mp3'],
            menu_nav:           ['menu_nav.mp3'],
            menu_change_page:   ['menu_change_page.mp3'],
            game_over:          ['game_over.mp3'],
            level_music:        ['Mighty_Eight_Bit_Ranger.mp3'],
            menu_music:         ['Ring_Road.mp3'],
            end_level_music:    ['Bloom_Full_Groove.mp3']
        },
        "sprites": {
            'car.png':                  { 'tile': 98,  'tileh': 98,  map: { "spr_car": [6,1] } },
            'waypoint_animation.png':   { 'tile': 64,  'tileh': 64,  map: { "spr_waypoint": [0,0] } },
            "waypoint_indicator.png":   { 'tile': 21,  'tileh': 21,  map: { "spr_waypoint_indicator": [0,0] } },
            'arrow.svg':                { 'tile': 72,  'tileh': 72,  map: { "spr_arrow": [0,0] } },
            "up_arrow_51x48.png":       { 'tile': 51,  'tileh': 48,  map: { "spr_up_arrow": [0,0] } },
            "right_arrow_51x48.png":    { 'tile': 51,  'tileh': 48,  map: { "spr_right_arrow": [0,0] } },
            "down_arrow_51x48.png":     { 'tile': 51,  'tileh': 48,  map: { "spr_down_arrow": [0,0] } },
            "left_arrow_51x48.png":     { 'tile': 51,  'tileh': 48,  map: { "spr_left_arrow": [0,0] } },
            "escape_key_51x48.png":     { 'tile': 51,  'tileh': 48,  map: { "spr_escape_key": [0,0] } },
            "enter_key_100x48.png":     { 'tile': 100, 'tileh': 48,  map: { "spr_enter_key": [0,0] } },
            "glass_overlay.png":        { 'tile': 700, 'tileh': 450, map: { "spr_glass_overlay": [0,0] } },
            "delete.png":               { 'tile': 128, 'tileh': 64,  map: { "spr_delete": [0,0] } },
            "menu_icon.svg":            { 'tile': 36,  'tileh': 36,  map: { "spr_menu_icon": [0,0] } },
            "fullscreen_activate.svg":  { 'tile': 32,  'tileh': 32,  map: { "spr_fullscreen_activate_icon": [0,0] } },
            "minimap_diamond.svg":      { 'tile': 200, 'tileh': 100, map: { "spr_minimap_diamond": [0,0] } },
            "minimap_car.svg":          { 'tile': 10,  'tileh': 10,  map: { "spr_minimap_car": [0,0] } },
            "minimap_waypoint.svg":     { 'tile': 10,  'tileh': 10,  map: { "spr_minimap_waypoint": [0,0] } },
            'minimap_arrow.svg':        { 'tile': 512, 'tileh': 512, map: { "spr_minimap_arrow": [0,0] } },
        }
    }, function(){
        Crafty.scene('Game');
    }, function(e) {
        // Progress
        //console.log("Progress:", e.percent);
    }, function(e) {
        // Error
        //console.log("Loading Error:", e);
    });

});
