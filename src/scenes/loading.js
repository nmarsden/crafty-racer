require('../../lib/crafty_0.9.0');

Crafty.scene('Loading', function(){

    Crafty.viewport.scroll('_x', 0);
    Crafty.viewport.scroll('_y', 0);

    Crafty.e('LoadingText');

    Crafty.load({
        "audio": {
            engine_idle:        ['assets/audio/engine_idle.mp3'],
            engine_speed_up:    ['assets/audio/engine_speed_up.mp3'],
            engine_slow_down:   ['assets/audio/engine_slow_down.mp3'],
            engine_top_speed:   ['assets/audio/engine_top_speed.mp3'],
            wheel_spin:         ['assets/audio/wheel_spin.mp3'],
            woop:               ['assets/audio/woop.ogg'],
            car_horn:           ['assets/audio/car_horn.ogg'],
            low_time:           ['assets/audio/low_time_warning.mp3'],
            falling:            ['assets/audio/falling.mp3'],
            disappear:          ['assets/audio/disappear.mp3'],
            menu_nav:           ['assets/audio/menu_nav.mp3'],
            menu_change_page:   ['assets/audio/menu_change_page.mp3'],
            game_over:          ['assets/audio/game_over.mp3'],
            level_music:        ['assets/audio/Mighty_Eight_Bit_Ranger.mp3'],
            menu_music:         ['assets/audio/Ring_Road.mp3'],
            end_level_music:    ['assets/audio/Bloom_Full_Groove.mp3']
        },
        "sprites": {
            'assets/images/car.png':                { 'tile': 98,  'tileh': 98,  map: { "spr_car": [6,1] } },
            'assets/images/waypoint_animation.png': { 'tile': 64,  'tileh': 64,  map: { "spr_waypoint": [0,0] } },
            "assets/images/waypoint_indicator.png": { 'tile': 21,  'tileh': 21,  map: { "spr_waypoint_indicator": [0,0] } },
            'assets/images/arrow.svg':              { 'tile': 576.556, 'tileh': 576.556, map: { "spr_arrow": [0,0] } },
            'assets/images/nav_arrow.svg':          { 'tile': 512, 'tileh': 512, map: { "spr_navigator": [0,0] } },
            "assets/images/up_arrow_51x48.png":     { 'tile': 51,  'tileh': 48,  map: { "spr_up_arrow": [0,0] } },
            "assets/images/right_arrow_51x48.png":  { 'tile': 51,  'tileh': 48,  map: { "spr_right_arrow": [0,0] } },
            "assets/images/down_arrow_51x48.png":   { 'tile': 51,  'tileh': 48,  map: { "spr_down_arrow": [0,0] } },
            "assets/images/left_arrow_51x48.png":   { 'tile': 51,  'tileh': 48,  map: { "spr_left_arrow": [0,0] } },
            "assets/images/escape_key_51x48.png":   { 'tile': 51,  'tileh': 48,  map: { "spr_escape_key": [0,0] } },
            "assets/images/enter_key_100x48.png":   { 'tile': 100, 'tileh': 48,  map: { "spr_enter_key": [0,0] } },
            "assets/images/glass_overlay.png":      { 'tile': 700, 'tileh': 450, map: { "spr_glass_overlay": [0,0] } },
            "assets/images/delete.png":             { 'tile': 128, 'tileh': 64,  map: { "spr_delete": [0,0] } },
            "assets/images/menu_icon.svg":          { 'tile': 32, 'tileh': 32, map: { "spr_menu_icon": [0,0] } },
            "assets/images/fullscreen_activate.svg":{ 'tile': 32, 'tileh': 32, map: { "spr_fullscreen_activate_icon": [0,0] } },
            "assets/images/fullscreen_deactivate.svg":{ 'tile': 32, 'tileh': 32, map: { "spr_fullscreen_deactivate_icon": [0,0] } }
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
