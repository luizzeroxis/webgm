import HTMLWindow from './HTMLWindow.js';

import {$, parent, endparent, add, newElem, newTextBox} from '../common/H.js'

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

					this.textareaCode = add( newElem('code', 'textarea', script.code) )

					endparent()
				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(script, inputName.value);
					script.code = this.textareaCode.value;
				},
				() => {
					this.editor.deleteWindow(this);
				}
			);
			endparent();
	}
}