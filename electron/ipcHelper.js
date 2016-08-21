const electron = require('electron');
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;

function requestFromRenderer(win, variable, callback) {
	win.webContents.send('request-' + variable, 'return-' + variable);

	//remove all listeners, because otherwise we'll start calling old callbacks
	ipcMain.removeAllListeners('return-' + variable);
	ipcMain.on('return-' + variable, callback);
}

module.exports = {
	requestFromRenderer: requestFromRenderer
};
