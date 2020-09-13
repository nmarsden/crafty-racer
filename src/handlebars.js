// Import Handlebars runtime lib
const Handlebars = require('handlebars/runtime');

Handlebars.registerHelper('$toolbarItems', ( arg ) => {
    var output = '';
    if (arg.type === 'button') {
        output += '<a href="#">';
        output += '<span class="tooltip"><img class="callout" src="assets/images/callout.png" />' + arg.tooltip + '<br/>';
        output += '<span class="hotkey">Hotkey: ' + arg.hotKey + '</span></span>';
        output += '<span class="' + arg.type + '"><img src="assets/images/editorToolbar.png" id="' + arg.id + '"/></span>';
        output += '</a>';
    } else {
        output += '<div class="' + arg.type + '"></div>';
    }
    return new Handlebars.SafeString(output);
});

/**
 * Handlebars runtime with custom helpers.
 * Used by handlebars-loader.
 */
module.exports = Handlebars;