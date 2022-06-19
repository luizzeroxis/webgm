import {parent, endparent, add, HElement, HTextInput} from '../../common/H.js'
import HCodeEditor from '../HCodeEditor.js';
import HPropertiesWindow from '../HPropertiesWindow.js';

export default class HWindowScript extends HPropertiesWindow {
	
	constructor(manager, id, editor) {
		super(manager, id, editor);

		this.script = id;

		this.title.html.textContent = 'Edit Script '+this.script.name;

		parent(this.client)
			parent( add( new HElement('div', {class: 'grid-resource resource-script'}) ) )
				parent( add( new HElement('div') ) )

					const inputName = add( new HTextInput('Name:', this.script.name) )

					this.codeEditor = add( new HCodeEditor(this.script.code) )

					endparent()
				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(this.script, inputName.getValue());
					this.script.code = this.codeEditor.getValue();
				},
				() => {
					this.close()
				}
			);

			this.codeEditor.setNextElem(this.applyButton);

			endparent();
	}
}