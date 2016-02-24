var CompositeDisposable = require('atom').CompositeDisposable;

var jadeBeautify = {
    subscriptions: new CompositeDisposable(),
    DEBUG: false,
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
            title: 'Force beautify when save',
            description: 'force beautify when save.',
            type: 'boolean',
            default: false
        },
        BEAUTIFY_ON_SAVE_ALL: { // Issue #4
            title: 'Force beautify when save-all',
            description: 'force beautify on modified files when save all.',
            type: 'boolean',
            default: false
        },
    },
    activate: function() {
        if (jadeBeautify.DEBUG) console.log('JadeBeautify is activated!!');
        this.subscriptions.add(atom.commands.add('atom-workspace', 'jade-beautify:convert', this.handleConvert));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'core:save', this.handleSaveEvent));
        this.subscriptions.add(atom.commands.add('atom-workspace', 'window:save-all', this.handleSaveAllEvent));
    },
    deactivate: function() {
        this.subscriptions.dispose();
    },
    isJadeFile: function(editor) {
        // issue #3
        if (editor && editor.getPath())
            return editor.getPath().endsWith('.jade') ? true : false;
        else
            return false;
    },
    // trigger on command
    handleConvert: function() {
        if (jadeBeautify.DEBUG) console.log('handleConvert');
        var editor = atom.workspace.getActiveTextEditor();
        jadeBeautify.convert(editor);
    },
    // trigger on core:save
    handleSaveEvent: function() {
        if (jadeBeautify.DEBUG) console.log('handleSaveEvent');
        var beautify = atom.config.get('jade-beautify.BEAUTIFY_ON_SAVE');
        if (!beautify) return;
        // It works only jade file.
        var editor = atom.workspace.getActiveTextEditor();
        jadeBeautify.convert(editor);
    },
    // trigger on window:save-all
    handleSaveAllEvent: function() {
        if (jadeBeautify.DEBUG) console.log('handleSaveAllEvent');
        var beautify = atom.config.get('jade-beautify.BEAUTIFY_ON_SAVE_ALL');
        if (!beautify) return;

        var editors = atom.workspace.getTextEditors();
        editors.forEach(function(editor) {
            if (editor.isModified())
                jadeBeautify.convert(editor);
        });
    },
    convert: function(editor) {
        // It works only jade file.
        if (!jadeBeautify.isJadeFile(editor)) return;
        if (jadeBeautify.DEBUG) console.log('convert ', editor.getPath());

        // var debug = false;
        var fill_tab = atom.config.get('jade-beautify.FILL_TAB');
        var omit_div = atom.config.get('jade-beautify.OMIT_DIV');

        if (jadeBeautify.DEBUG) console.log(fill_tab, omit_div);

        // var editor = atom.workspace.getActiveTextEditor();
        var tabSize = editor.getTabLength();
        var indentList = [];

        //  Moves the cursor to the end of the file on save. #6
        var prev_position = editor.getCursorScreenPosition();

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

            if (omit_div) {
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
            // if (jadeBeautify.DEBUG) console.log(n + 1, indent, tab, prevIndent.indent);

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
            if (!fill_tab) space = space.replace(/\t/g, Array(tabSize + 1).join(' '));

            // if (jadeBeautify.DEBUG) console.log(n + 1, line.indent, line.tab, space + line.input);
            return space + line.input;
        });

        //Rewrite data
        editor.setText(formatedLine.join('\n'));

        // #6 Move Cursor to Previous Postion.
        if (prev_position) editor.setCursorScreenPosition(prev_position);
    }
};
module.exports = jadeBeautify;
