var CompositeDisposable = require('atom').CompositeDisposable;

module.exports = {
    subscriptions: new CompositeDisposable(),
    activate: function() {
        return this.subscriptions.add(atom.commands.add('atom-workspace', 'jade-beautify:convert', this.convert));
    },
    deactivate: function() {
        this.subscriptions.dispose();
    },
    convert: function() {
        var editor = atom.workspace.getActiveTextEditor();
        // Base tabSize = 2, is more readable.
        var tabSize = editor.getTabLength();
        var indentList = [];

        var prevIndent = 0;
        var lines = editor.getText().split('\n');

        lines.forEach(function(line) {
            var data = line.match(/^\s*/);
            var inputAfterRemoveIndent = data.input.replace(/^\s*/, '');
            var indent = (inputAfterRemoveIndent.length === 0) ? 0 : data[0].length;

            var newindent = 0;
            var type = (inputAfterRemoveIndent.match(/^\/\/|^\/\*|^\*/)) ? 'remark' : 'code';

            if (indent === 0) {
                newindent = 0;
            } else {
                // 현재 라인이 remark이고 앞 라인이 remark인 경우는 앞 라인 indent를 따른다.
                if (indentList.length > 0 && type === 'remark' && indentList[indentList.length - 1].type == 'remark') {
                    newindent = indentList[indentList.length - 1].newindent;
                } else {
                    if (indent === prevIndent) {
                        newindent = indentList[indentList.length - 1].newindent;
                    } else if (indent > prevIndent) {
                        newindent = indentList[indentList.length - 1].newindent + tabSize;
                    } else {
                        for (i = indentList.length - 1; i >= 0; i--) {
                            if (indent == indentList[i].indent) {
                                newindent = indentList[i].newindent;
                                console.log('match', line, '--->', indentList[i].input);
                                break;
                            }
                        }
                    }
                }
            }

            indentList.push({
                type: type,
                indent: indent,
                newindent: newindent,
                input: inputAfterRemoveIndent,
            });

            if (inputAfterRemoveIndent.length !== 0) { // null 라인은 무시한다.
                prevIndent = indent;
            }
        });

        // // Here,it reformat as it's order
        var formatedLine = indentList.map(function(line) {
            console.log(Array(line.newindent + 1).join('+') + line.input);
            return Array(line.newindent + 1).join(' ') + line.input;
        });

        //Reset data
        editor.setText(formatedLine.join('\n'));

    }
};
