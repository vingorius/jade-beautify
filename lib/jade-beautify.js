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
        // Base indentSize = 2, is more readable.
        var indentSize = 2; //editor.getTabLength();
        var indentList = [];

        var lines = editor.getText().split('\n').map(function(line) {
            var data = line.match(/^\s*/);
            indentList.push(data[0].length);
            var inputAfterRemoveIndent = data.input.replace(/^\s*/, '');
            return {
                spaceLength: data[0].length,
                data: inputAfterRemoveIndent
            };
        });
        //unique indent list
        var uniqueIndentList = indentList.filter(function(value, index, self) {
            return self.indexOf(value) === index;
        });
        //uniqueIndentList does not need to sort because it's already sorted

        // Here,it reformat as it's order
        var formatedLine = lines.map(function(line) {
            var index = uniqueIndentList.indexOf(line.spaceLength);
            //console.log(index * indentSize, Array(index * indentSize).join('+'));
            return Array(index * indentSize + 1).join(' ') + line.data;
        });

        //Reset data
        editor.setText(formatedLine.join('\n'));

    }
};
