import HTMLWindow from './HTMLWindow.js';

import {$, parent, endparent, add, newElem, newTextBox} from '../common/H.js'

import HTMLCodeEditor from './HTMLCodeEditor.js';

export default class HTMLWindowScript extends HTMLWindow {
	constructor(...args) {
		super(...args);
	}
	makeClient(script) {
		this.htmlTitle.textContent = 'Edit Script '+script.name;

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-script', 'div') ) )
				parent( add( newElem(null, 'div') ) )

					var inputName = $( add( newTextBox(null, 'Name:', script.name) ), 'input');

					this.codeEditor = new HTMLCodeEditor(script.code);

					endparent()
				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(script, inputName.value);
					script.code = this.codeEditor.getValue();
				},
				() => {
					this.editor.deleteWindow(this);
				}
			);

			this.codeEditor.setNextElem(this.htmlApply);

			endparent();
	}
}