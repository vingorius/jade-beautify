var JadeBeautify = require('../lib/jade-beautify');

require('fs');
describe("A suite", function() {
	var workspaceElement, activationPromise;
	var promise;
	beforeEach(function() {
		workspaceElement = atom.views.getView(atom.workspace);
	    activationPromise = atom.packages.activatePackage('jade-beautify');
		waitsForPromise(function() {
			return atom.workspace.open('../test/jade.jade');
		});

	});

	it("contains spec with an expectation", function() {

		runs(function(){
			atom.commands.dispatch( workspaceElement, 'jade-beautify:convert');
			expect(atom.workspace.getActiveTextEditor().getPath()).toContain('jade');
			console.log(atom.workspace.getActiveTextEditor().getText());
		});
		/*
		waitsForPromise(function() {
			return atom.workspace.open('../test/jade.jade').then(function() {
				expect(atom.workspace.getActiveTextEditor().getPath()).toContain('jade');
			});
		});
		waitsForPromise(function() {
			return atom.packages.activatePackage('jade-beautify');
		});
		runs(function(){
			expect(atom.workspace.getActiveTextEditor().getPath()).toContain('jade');
		});
		*/
	});

	it("contains spec with an expectation", function() {
		// runs(function() {
		// 	// expect(atom.workspace.getActiveTextEditor().getPath()).toContain('x');
		// 	expect(atom.packages.isPackageActive('jade-beautify')).toBe(true);
		// 	var editor = atom.workspace.getActiveTextEditor();
		// 	console.log('getPath', editor.getPath());
		// 	console.log('text', editor.getText());
		//
		// });

	});


});
