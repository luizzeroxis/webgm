import {parent, endparent, add, HElement, HTextInput} from '../../common/H.js'
import HCodeEditor from '../HCodeEditor.js';
import HWindow from '../HWindow.js';

export default class HWindowScript extends HWindow {
	
	constructor(editor, id, script) {
		super(editor, id);

		this.script = script;

		this.title.html.textContent = 'Edit Script '+script.name;

		parent(this.client)
			parent( add( new HElement('div', {class: 'grid-resource resource-script'}) ) )
				parent( add( new HElement('div') ) )

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

			this.codeEditor.setNextElem(this.applyButton);

			endparent();
	}
}