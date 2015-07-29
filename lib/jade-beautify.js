var CompositeDisposable = require('atom').CompositeDisposable;

module.exports = {
	subscriptions: new CompositeDisposable(),
	// make this filed as config later.
	fillTab: false,
	// when debug, make below true.
	debug: true,
	activate: function() {
		return this.subscriptions.add(atom.commands.add('atom-workspace', 'jade-beautify:convert', this.convert));
	},
	deactivate: function() {
		this.subscriptions.dispose();
	},
	convert: function() {
		var editor = atom.workspace.getActiveTextEditor();
		var tabSize = editor.getTabLength();
		var indentList = [];

		var prevIndent = {
			type: 'code', // type 'code','remark'
			indent: 0,    // count of indent space. it replace tab as space
			tab: 0,       // count of tab ,line indent will be filled up with this value.
			input: '',    // input line after removing indent.
		};

		var lines = editor.getText().split('\n');

		lines.forEach(function(line, n) {
			// it return matching space --> data[0], data[index] = 0, remained input --> data.input
			var data = line.match(/^\s*/);

			// when tab and space mixed, it replace all tab to spaces.
			var tmp = data[0].replace(/\t/g, Array(tabSize + 1).join(' '));
			var remainedInput = data.input.replace(/^\s*/, '');
			var indent = (remainedInput.length === 0) ? 0 : tmp.length;

			var tab = 0;
			var type = (remainedInput.match(/^\/\/|^\/\*|^\*/)) ? 'remark' : 'code';

			if (indent === 0) {
				tab = 0;
			} else {
				// when this line & prev line is 'remark', it fallow prev line tab.
				if (indentList.length > 0 && type === 'remark' && indentList[indentList.length - 1].type == 'remark') {
					tab = prevIndent.tab;
				} else {
					if (indent === prevIndent.indent) { // when same indent, follow prev tab.
						tab = prevIndent.tab;
					} else if (indent > prevIndent.indent) { // when indented, add tab
						tab = prevIndent.tab + 1;
					} else { // when new indent, if find the same indent, and follow it's tab.
						for (i = indentList.length - 1; i >= 0; i--) {
							if (indent == indentList[i].indent) {
								tab = indentList[i].tab;
								break;
							}
						}
					}
				}
			}
			if (this.debug) console.log(n + 1, indent, tab, prevIndent.indent);

			var curIndent = {
				type: type,
				indent: indent,
				tab: tab,
				input: remainedInput,
			};

			indentList.push(curIndent);

			if (remainedInput.length !== 0) { // discard null line
				prevIndent = curIndent;
			}
		});

		// // Here,it reformat with it's tab count.
		var formatedLine = indentList.map(function(line, n) {
			var space = Array(line.tab + 1).join('\t');
			//when fill with space
			if (!this.fillTab) space = space.replace(/\t/g, Array(tabSize + 1).join(' '));

			if (this.debug) console.log(n + 1, line.indent, line.tab, space + line.input);
			return space + line.input;
		});

		//Rewrite data
		if (!this.debug) editor.setText(formatedLine.join('\n'));
	}
};
