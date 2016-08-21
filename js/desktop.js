var electron = require('electron');
var DocumentManager = require('./../electron/main').getRendererModule();
var ipcRenderer = electron.ipcRenderer;

var write = document.querySelector('.write');

DocumentManager.setContentSetter(function(content) {
 write.value = content;
 window.fogInterface.updateAllTextareaProperties();
});

DocumentManager.setContentGetter(function() {
 return write.value;
});

ipcRenderer.on('toggle-blur', function(event) {
 window.fogInterface.toggleBlur();
});

document.querySelector('.write').addEventListener('input', function() {
 DocumentManager.setEdited(true);
});
