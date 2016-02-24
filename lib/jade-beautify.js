var pugBeautify = require('pug-beautify');
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
        if (jadeBeautify.DEBUG) console.log('JadeBeautify is activated with pugBeautify!!');
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

        var option = {
            fill_tab: atom.config.get('jade-beautify.FILL_TAB'),
            omit_div: atom.config.get('jade-beautify.OMIT_DIV'),
            tab_size: editor.getTabLength()
        };

        if (jadeBeautify.DEBUG) console.log(option);

        //  Moves the cursor to the end of the file on save. #6
        var prev_position = editor.getCursorScreenPosition();

        // Beautify Jade(Pug) Template.
        try {
            var beautifiedCode = pugBeautify(editor.getText(),option);
            editor.setText(beautifiedCode);
            if (prev_position) editor.setCursorScreenPosition(prev_position);
        }catch(error){
            // error occured
            atom.notifications.addError('Fail to beautify.',{detail:error});
        }

        // #6 Move Cursor to Previous Postion.
    }
};
module.exports = jadeBeautify;
