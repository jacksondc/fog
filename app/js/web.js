var hasLocalStorage = localStorageTest();
var write;

document.title = "Fog";

$(document).ready(function() {
  write = $('.write');
});

function localStorageTest() {
    var test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
}

$( window ).unload(function() {
  if(hasLocalStorage) {
    localStorage.setItem('text',$('.write').val());
    localStorage.setItem('foggy', foggy);
  }
});

if(hasLocalStorage){
  var used = localStorage.getItem('alreadyUsed');
  if(!used || used === "null") {
    localStorage.setItem('alreadyUsed', true);
    showModal();
  }

  var text = localStorage.getItem('text');
  if(text) {
    write.val(text);
    updateTextareaBorder();
  }

  previousFoggySetting = localStorage.getItem('foggy');
  previouslyFoggy = previousFoggySetting === 'true' || previousFoggySetting === 'null';
  if(!previouslyFoggy) {
    toggleBlur();
  }
}
