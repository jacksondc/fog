# Fog
A text editor that blurs what you type.

##Technical Notes
Fog uses text-shadow to blur the text. In most browsers the text can only go about half invisible, because you still need to be able to see the caret. In Chrome and Safari, Fog uses `-webkit-text-fill` to make the text transparent without affecting the caret.
