var DocumentManager = require('electron-document-manager').main;

DocumentManager({ entryPoint: 'file://' + __dirname + '/app/app.html' });
