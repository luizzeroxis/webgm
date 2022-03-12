import {parent, endparent, add, HTextInput, newElem} from '../../common/H.js'
import HCodeEditor from '../HCodeEditor.js';
import HTMLWindow from '../HTMLWindow.js';

export default class HTMLWindowScript extends HTMLWindow {
	constructor(...args) {
		super(...args);
	}
	makeClient(script) {
		this.htmlTitle.textContent = 'Edit Script '+script.name;

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-script', 'div') ) )
				parent( add( newElem(null, 'div') ) )

					var inputName = add( new HTextInput('Name:', script.name) )

					this.codeEditor = add( new HCodeEditor(script.code) )

					endparent()
				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(script, inputName.getValue());
					script.code = this.codeEditor.getValue();
				},
				() => {
					this.close()
				}
			);

			this.codeEditor.setNextElem(this.htmlApply);

			endparent();
	}
}