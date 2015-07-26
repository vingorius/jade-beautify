# jade-beautify package

This tiny program only reformat a jade file.

The idea is from pjbrow on https://github.com/Glavin001/atom-beautify/issues/199

To reformat jade indent, clik Ctrl-Atl-o.

The logic is very simple.

First it collect indent size of all lines.

then, filter only unique size.

new indent size = '  ' * indexOfUniqueArray;

finally give new indent size to line.

TODO : only work on jade file
   jerone's comment on https://github.com/Glavin001/atom-beautify/issues/199

<!-- ![A screenshot of your package](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif) -->
