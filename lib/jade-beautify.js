var CompositeDisposable = require('atom').CompositeDisposable;

var jadeBeautify = {
    subscriptions: new CompositeDisposable(),
    debug: function() {
        return false;
    },
    config: {
        FILL_TAB: {
            title: 'Indent with Tabs',
            description: 'Indent with Tabs, if false, with spaces.',
            type: 'boolean',
            default: true
        },
        OMIT_DIV: {
            title: 'Omit div tag',
            description: 'Omit div tag when it has id or class.',
            type: 'boolean',
            default: false
        },
        BEAUTIFY_ON_SAVE: { // Issue #1
            title: 'Force beautify on save',
            description: 'force beautify on save.',
            type: 'boolean',
            default: false
        },
    },
    activate: function() {
        if (jadeBeautify.debug()) console.log('JadeBeautify is activated!!');
        this.subscriptions.add(atom.commands.add('atom-workspace', 'jade-beautify:convert', this.convert));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'core:save', this.handleSaveEvent));
    },
    deactivate: function() {
        this.subscriptions.dispose();
    },
    isJadeFile: function() {
        // issue #3
        var editor = atom.workspace.getActiveTextEditor();
        if (editor)
            return editor.getPath().endsWith('.jade') ? true : false;
        else
            return false;
    },
    handleSaveEvent: function() {
        if (jadeBeautify.debug()) console.log('handleSaveEvent');
        // It works only jade file.
        if (!jadeBeautify.isJadeFile()) return;

        var BEAUTIFY_ON_SAVE = atom.config.get('jade-beautify.BEAUTIFY_ON_SAVE');
        if (BEAUTIFY_ON_SAVE) {
            jadeBeautify.convert();
        }
    },
    convert: function() {
        if (jadeBeautify.debug()) console.log('convert');
        // It works only jade file.
        if (!jadeBeautify.isJadeFile()) return;

        // var debug = false;
        var FILL_TAB = atom.config.get('jade-beautify.FILL_TAB');
        var OMIT_DIV = atom.config.get('jade-beautify.OMIT_DIV');

        if (jadeBeautify.debug()) console.log(FILL_TAB, OMIT_DIV);

        var editor = atom.workspace.getActiveTextEditor();
        var tabSize = editor.getTabLength();
        var indentList = [];


        var prevIndent = {
            type: 'code', // type 'code','remark'
            indent: 0, // count of indent space. it replace tab as space
            tab: 0, // count of tab ,line indent will be filled up with this value.
            input: '', // input line after removing indent.
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

            if (OMIT_DIV) {
                remainedInput = remainedInput.replace(/^div(\.|#)/i, '$1');
            }

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
            if (jadeBeautify.debug()) console.log(n + 1, indent, tab, prevIndent.indent);

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
            if (!FILL_TAB) space = space.replace(/\t/g, Array(tabSize + 1).join(' '));

            if (jadeBeautify.debug()) console.log(n + 1, line.indent, line.tab, space + line.input);
            return space + line.input;
        });

        //Rewrite data
        editor.setText(formatedLine.join('\n'));
    }
};
module.exports = jadeBeautify;
