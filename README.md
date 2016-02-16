# jade-beautify package

This tiny program only reformat a jade file.

The idea is from @pjbrow on https://github.com/Glavin001/atom-beautify/issues/199

# Installation
To install jade-beautify,at atom, Packages >> Setting View >> Open or Ctrl-comma.
Click install tab, search 'jade-beautify' and install it.

# Usage
To reformat jade indent, click ctl-alt-o.
When you check 'Force beautify on save'(default is 'checked'), reformat it automatically.
It works on save-all event also.

# Settings
- Force beautify when save : when checked, jade-beautify format it automatically on save event. default checked.
- Force beautify modified one when save-all: when checked,  jade-beautify format it automatically on save-all event. but only modified one. default unchecked.
- Indent with tabs : when checked, jade-beautify fill indent as tab, when not spaces. default is checked.
- Omit div tag : when checked, jade-beautify omit div tag. default unchecked.

# To leave Issues
Please visit on https://github.com/vingorius/jade-beautify/issues

# TODO
- [X] only work for jade file
- [ ] write test

## Below From @jerone on https://github.com/Glavin001/atom-beautify/issues/199
- [X] As @pjbrow mentions, indention alignment is one that a beautifier could solve.
- [X] As JetBrains mentions, tabs to spaces and visa versa.
- [X] Omit the div element when it has a class or id.
- [ ] Force/remove comma's , between attributes.
- [ ] Force/remove spaces between attributes.
- [ ] For negated conditions use unless.
- [ ] Use basic pattern for clean escaped string interpolation, e.g. div= value instead of div #{value}.
- [ ] Force space after basic escaped string interpolation, e.g. div= value instead of div=value.
- [ ] Use block expansion for simple nested tags.
- [ ] Self closing tags.
- [ ] Format multiple places where normal JS is allowed.
