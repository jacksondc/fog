var DocumentManager = require('./electron/main').main;
var electron = require('electron');
var Menu = electron.Menu;
var MenuItem = electron.MenuItem;

DocumentManager({
  entryPoint: 'file://' + __dirname + '/dist/app.html',
  menuReady: function() {
    // Get template for default menu
    var menu = Menu.getApplicationMenu();

    // Add custom menu
    // menu.insert(0, new MenuItem({
    //   label: 'Blur',
    //   click: function(item, focusedWindow) {
    //     console.log('blur!');
    //   }
    // }));
  }
});
