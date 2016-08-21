'use strict';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;
const async = require('async');
const _ = require('lodash');
const menuManager = require('./menuManager');
const fileManager = require('./fileManager');
const windowManager = require('./windowManager');
const ipcHelper = require('./ipcHelper');

var initialize = function(options) {

  windowManager.initializeWithEntryPoint(options.entryPoint);

  // Quit when all windows are closed.
  app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
      app.quit();
    } else {
      menuManager.updateMenu();
    }
  });

  app.on('open-file', function(e, path) {
    app.addRecentDocument(path);
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  app.on('ready', function() {
    //set up menu
    menuManager.setMenu({
      newMethod: function(item, focusedWindow) {
        windowManager.createWindow({
          focusedWindow: focusedWindow
        });
      },
      openMethod: function(item, focusedWindow) {
        fileManager.openFile(function(err, filepath, currentFileContent, openFileContent) {
          //check if open in other window
          var windows = windowManager.getWindows();

          var checkFilepathFuncs = [];
          windows.forEach(function(win) {
            checkFilepathFuncs.push(function(callback) {
              ipcHelper.requestFromRenderer(win, 'filepath', function(event, winFilepath) {
                var alreadyOpen = false;
                if(winFilepath === filepath) {
                  alreadyOpen = true;
                  win.focus();
                }
                callback(null, alreadyOpen);
              });
            });
          });

          //not sure if ipcHelper response will work with paralle, so doing this in series
          async.series(checkFilepathFuncs, function(err, results) {
            if(!_.includes(results, true)) {
              //not open, do the rest of the stuff

              //check if should open in current window or new
              fileManager.fileIsEdited(filepath, currentFileContent, function(isEdited) {
                if(BrowserWindow.getFocusedWindow() && !isEdited && currentFileContent === "") {
                  //open in current window
                  windowManager.setUpWindow(BrowserWindow.getFocusedWindow(), filepath, openFileContent);
                } else {
                  //open in different window
                  windowManager.createWindow({
                    focusedWindow: focusedWindow,
                    fileContent: openFileContent,
                    filepath: filepath
                  });
                }
              });
            }
          });
        });
      },
      saveMethod: function(item, focusedWindow) {
        fileManager.saveFile();
      },
      saveAsMethod: function(item, focusedWindow) {
        fileManager.saveFileAs();
      },
      renameMethod: function(item, focusedWindow) {
        //fileManager.renameFile();
        //to implement later
      },
      closeMethod: function(item, focusedWindow) {
        fileManager.closeFile();
      },
      toggleBlurMethod: function(item, focusedWindow) {
        if (focusedWindow) {
          // to write: focusedWindow.toggleBlur();
          focusedWindow.webContents.send('toggle-blur');
        }
      }
    });

    if(options.menuReady) { options.menuReady(); }

    //set up window menu updates - to be run on focus, blur, and window create
    windowManager.setFocusUpdateHandler(menuManager.updateMenu);

    //create first window
    windowManager.createWindow();
  });
}

module.exports = {
  getRendererModule: function() {
    return require('./rendererModule');
  },
  main: initialize
}
