import './styles.css';

require('../lib/qlass');
require('../lib/crafty_0.7.0');
require('../lib/gamepad');
require('../lib/tiledmapbuilder/create_mocks_module');
require('../lib/tiledmapbuilder/tiledmapbuilder');

import { Game } from './game.js';


window.addEventListener('load', Game.start);
