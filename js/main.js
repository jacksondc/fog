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
  //start with modal closed by default
  hideModal(true); //true for instant - don't wait for animation!

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
    toggleModal();
  });

  $('.modal-overlay').click(function() {
    hideModal();
  });
});

function toggleModal() {
  if($('body').hasClass('modal-open')) {
    hideModal();
  } else {
    showModal();
  }
}

function showModal() {
  $('.modal').show();
  $('.modal').css('display', 'block'); //forces browser to draw it below the screen
  $('body').addClass('modal-open');
}

function hideModal(instant) { //instant defaults to false

  $('body').removeClass('modal-open');

  if(!instant) { //we need to do it instantly on page load
    setTimeout(function() {
      $('.modal').hide();
    }, 300); //wait for animation
  }

}