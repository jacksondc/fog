var foggy = true;
var empty = true;
var hasLocalStorage = localStorageTest();

var write;

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

function updateTextareaBorder() {
  var text = write.val();

  if(text && empty) {
    empty = false;
    write.removeClass('notext');
  } else if(!text && !empty) {
    empty = true;
    write.addClass('notext');
  }
}

function toggleBlur() {
  $('body').toggleClass('blur');
  var toggle = $('.toggle');

  var text = toggle.html();
  if(text === 'Sharp') {
    toggle.html('Blurry');
  } else {
    toggle.html('Sharp');
  }
  foggy = !foggy;
}

$( window ).unload(function() {
  if(hasLocalStorage) {
    localStorage.setItem('text',$('.write').val());
    localStorage.setItem('foggy', foggy);
  }
});

$(document).ready(function() {
  //if webkit
  if(document.body.style.WebkitTextFillColor === "") {
    $('html').addClass('textfill');
  } else {
    $('html').addClass('notextfill');
  }

  write = $('.write');

  write.focus();

  if(hasLocalStorage){
    var used = localStorage.getItem('alreadyUsed');
    if(!used || used === "null") {
      localStorage.setItem('alreadyUsed', true);
      $('body').toggleClass('modal-open');
    }

    var text = localStorage.getItem('text');
    if(text) {
      write.val(text);
      updateTextareaBorder();
    }

    previousFoggySetting = localStorage.getItem('foggy');
    previouslyFoggy = previousFoggySetting === 'false' || previousFoggySetting === 'null';
    if(!previouslyFoggy) {
      toggleBlur();
    }
  }

  Mousetrap.bind('mod+b', function(e) {
    e.preventDefault();
    toggleBlur();
  });

  var toggle = $('.toggle');

  toggle.click(function() {
    toggleBlur();
  });

  write.keydown(function(e) {
    //keydown because we need to get the
    //event early to prevent shifting focus

    if (e.keyCode == 9) {
      var myValue = "\t";
      var startPos = this.selectionStart;
      var endPos = this.selectionEnd;
      var scrollTop = this.scrollTop;
      this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos,this.value.length);
      this.focus();
      this.selectionStart = startPos + myValue.length;
      this.selectionEnd = startPos + myValue.length;
      this.scrollTop = scrollTop;

      e.preventDefault();
    }
  }).on('input', updateTextareaBorder);

  $('.info').click(function() {
    $('body').toggleClass('modal-open');
  });

  $('.modal-overlay').click(function() {
    $('body').removeClass('modal-open');
  });
});