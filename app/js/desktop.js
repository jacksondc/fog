//can't use jquery because it's not available until load
window.onload = function() {
	var DocumentManager = require('electron-document-manager').getRendererModule();

	DocumentManager.setContentSetter(function(content) {
		document.querySelector('.write').value = content;
	});

	DocumentManager.setContentGetter(function() {
		return document.querySelector('.write').value;
	});

	document.querySelector('.write').addEventListener('input', function() {
		DocumentManager.setEdited(true);
	});
};
