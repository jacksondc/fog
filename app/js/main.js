var foggy = true;
var empty = true;
var write;

var typewrite = require('typewrite');
typewrite(document.querySelector('.write'), {
  bottomMarginSize: 0.25
});

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
  var toggle = $('.toggle-button');

  var text = toggle.html();
  if(text === 'Blur') {
    toggle.html('Unblur');
  } else {
    toggle.html('Blur');
  }
  foggy = !foggy;
}

$(document).ready(function() {
  //change tooltip based on operating system
  var isMac = navigator.platform.indexOf('Mac') > -1;
  if(isMac) {
    $('.toggle-button').attr('data-shortcut', 'cmd+b');
  }

  //if webkit
  console.log('textfill!');
  if(document.body.style.WebkitTextFillColor === "") {
    $('body').addClass('textfill');
  } else {
    $('body').addClass('notextfill');
  }

  write = $('.write');

  write.focus();

  Mousetrap.bind('mod+b', function(e) {
    e.preventDefault();
    toggleBlur();
  });

  var toggle = $('.toggle-button');

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

  var isToggledRecently = false;
  var backlog = 0;
  $('.info').click(function() {
    //don't toggle too frequently
    if(!isToggledRecently) {
      toggleModal();
      isToggledRecently = true;
      setTimeout(function() {
        isToggledRecently = false;
        if(backlog % 2 !== 0) {
          toggleModal();
        }
        backlog = 0;
      }, 300)
    } else {
      backlog++;
    }
  });
});
