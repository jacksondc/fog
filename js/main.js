var foggy = true;
var empty = true;


$(document).ready(function() {

  var write = $('.write');

  Mousetrap.bind('mod+h', function(e) {
    write.toggleClass('blur');
    foggy = !foggy;
  });

  write.focus();

  write.keydown(function(e) {
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

    var text = write.val();

    if(text && empty) {
      empty = false;
      write.removeClass('notext');
    } else if(!text && !empty) {
      empty = true;
      write.addClass('notext');
    }
  });

  $('.info').click(function() {
    $('body').toggleClass('modal-open');
  });
});