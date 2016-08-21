var typewrite = require('typewrite');
var $         = require('jquery');
var Mousetrap = require('mousetrap');
var getCaretCoordinates = require('textarea-caret');
var autosize  = require('autosize');

var blurry = true;
var empty = true;

var write;

function updateTextareaBorder() {
  var writeIsEmpty = write.val() === "";

  if(writeIsEmpty) {
    empty = true;
    write.addClass('notext');
  } else {
    empty = true;
    write.removeClass('notext');
  }
}

function toggleBlur() {
  $('body').toggleClass('blur');
  $('.focus-button, .blur-button').toggleClass('active').toggleClass('inactive');
  blurry = !blurry;
  updateCaret();
}

function updateAllTextareaProperties() {
  updateCaret();
  updateTextareaBorder();
  autosize.update(write);
}

window.fogInterface = {
  toggleBlur: toggleBlur,
  updateAllTextareaProperties: updateAllTextareaProperties
};

function hasLocalStorage() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
    } catch(e) {
        return false;
    }
}

function updateCaret() {
    var raw_write = document.querySelector('.write');
    if($('.write').is(':focus') && (raw_write.selectionStart === raw_write.selectionEnd) && $('body').hasClass('blur')) {
      $('.caret').css('visibility','visible');
      var coordinates = getCaretCoordinates(raw_write, raw_write.selectionEnd);

      $('.caret').css({
        // specify the base just in case, see https://stackoverflow.com/questions/395163/get-css-top-value-as-number-not-as-string
        left: coordinates.left + parseInt($('.write-wrap').css('padding-left'), 10),
        top: coordinates.top + parseInt($('.write-wrap').css('padding-top'), 10)
      });
    } else {
      $('.caret').css('visibility','hidden');
    }
}

window.updateCaret = updateCaret; // so google's webfonts loader can use it

document.querySelector('.write').addEventListener('input', updateCaret);
document.querySelector('.write').addEventListener('keyup', updateCaret);
document.querySelector('.write').addEventListener('click', updateCaret);
document.querySelector('.write').addEventListener('focus', updateCaret);
document.querySelector('.write').addEventListener('blur', updateCaret);


$(document).ready(function() {

  write = $('.write');
  write.focus();
  updateCaret();

  typewrite(document.querySelector('.write'), {
    bottomMarginSize: 0.25
  });

  //change tooltip based on operating system
  var isMac = navigator.platform.indexOf('Mac') > -1;
  if(isMac) {
    $('.toggle-button-tooltip').text('cmd+b');
  }

  //if webkit
  if(document.body.style.WebkitTextFillColor === "") {
    $('body').addClass('textfill');
  } else {
    $('body').addClass('notextfill');
  }

  Mousetrap.bind('mod+b', function(e) {
    toggleBlur();
    e.preventDefault();
  });

  $('.toggle-button').click(toggleBlur);

  write.on('input', updateTextareaBorder);

  // tab means indent
  write.keydown(function(e) {
    //keydown because we need to get the
    //event early to prevent shifting focus

    if (e.keyCode == 9) {
      var indent = "\t";
      var startPos = this.selectionStart;
      var endPos = this.selectionEnd;
      var scrollTop = this.scrollTop;
      this.value = this.value.substring(0, startPos) + indent + this.value.substring(endPos,this.value.length);
      this.focus();
      this.selectionStart = startPos + indent.length;
      this.selectionEnd = startPos + indent.length;
      this.scrollTop = scrollTop;

      e.preventDefault();
    }
  });

});

/* ==========================================================================
   Web
   ========================================================================== */
$(document).ready(function() {
  if($(document.body).hasClass('web')) {

    $(window).on('beforeunload', function() {
      if(hasLocalStorage) {
        localStorage.setItem('text', $('.write').val());
        localStorage.setItem('blurry', blurry);
      }
    });

    if(hasLocalStorage){
      previousBlurrySetting = localStorage.getItem('blurry');
      previouslyBlurry = previousBlurrySetting === 'true' || previousBlurrySetting === 'null';
      if(!previouslyBlurry) {
        toggleBlur();
      }

      var text = localStorage.getItem('text');
      if(text) {
        document.querySelector('.write').value = text;
        updateAllTextareaProperties();
      }
    }
  }
});

/* ==========================================================================
   Desktop
   ========================================================================== */
// if(window.process && window.process.versions.electron) {
//    // electron environment
//    var script = document.createElement('script');
//    script.setAttribute('src','js/desktop.js');
//    document.addEventListener("DOMContentLoaded", function() {
//    });
// }
