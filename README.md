# jade-beautify package

This tiny program only reformat a jade file.

To reformat jade indent, clik Ctrl-Atl-o.

The logic is very simple.

First it collect indent size of all lines.

then, filter only unique size.

new indent size = '  ' * indexOfUniqueArray;

finally give new indent size to line.

<!-- ![A screenshot of your package](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif) -->
