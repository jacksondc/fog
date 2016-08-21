'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog;
const path = require('path');
const _ = require('lodash');

var windows = [];
var untitledIndex = 1;
var indexFile;

var focusUpdateHandler = null;

function createWindow(options) {
  options = options || {};

  //pick a title (set as BrowserWindow.title and send with set-title)
  var title = options.filepath ? path.basename(options.filepath) : ( "Untitled " + untitledIndex++ );

  var parameters = {
      width: 800,
      height: 600,
      title: title
  };

  if(options.focusedWindow) {
    var bounds = options.focusedWindow.getBounds();
    parameters = _.extend(parameters, {
      x: bounds.x + 20,
      y: bounds.y + 20
    });
  }

  // Create the browser window.
  var win = new BrowserWindow(parameters);
  windows.push(win);

  // and load the index.html of the app.
  win.loadURL(indexFile);

  win.webContents.on('did-finish-load', function() {
    setUpWindow(win, options.filepath, options.fileContent);
  });

  // Emitted when the window is closed.
  win.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    windows = _.without(windows, win);
  });

  if(focusUpdateHandler) {
    focusUpdateHandler();
    win.on('focus', focusUpdateHandler);
    win.on('blur', focusUpdateHandler);
  }
}

function setUpWindow(win, filepath, contents) {
  if(filepath) {
    win.webContents.send('set-filepath', filepath);
    win.setRepresentedFilename(filepath);
    win.setTitle(path.basename(filepath));
  }
  if(contents) {
    win.webContents.send('set-content', contents);
  }
}

module.exports = {
  createWindow: createWindow,
  setUpWindow: setUpWindow,
  //note: focus and blur handlers will only apply to future windows at creation
  setFocusUpdateHandler: function(func) {
    focusUpdateHandler = func;
  },
  initializeWithEntryPoint: function(entryPointArg) {
    indexFile = entryPointArg;
  },
  getWindows: function() {
    return windows;
  }
};
