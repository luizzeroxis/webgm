import {parent, endparent, add, HRadioInput, uniqueID} from '../../common/H.js'
import {ProjectObject} from '../../common/Project.js';
import HTMLCodeEditor from '../HTMLCodeEditor.js';
import HTMLResourceSelect from '../HTMLResourceSelect.js';
import HTMLWindow from '../HTMLWindow.js';

export default class HTMLWindowCode extends HTMLWindow {

	constructor(...args) {
		super(...args);
	}

	makeClient(action, object) {

		this.action = action;
		this.object = object;

		this.actionType = this.editor.getActionType(action.typeLibrary, action.typeId);

		this.htmlTitle.textContent = this.actionType.description;

		parent(this.htmlClient)

			var appliesToGroup = '_radio_'+uniqueID();

			this.radioAppliesToSelf = add( new HRadioInput(appliesToGroup, 'Self', (action.appliesTo == -1)) );
			this.radioAppliesToOther = add( new HRadioInput(appliesToGroup, 'Other', (action.appliesTo == -2)) );
			this.radioAppliesToObject = add( new HRadioInput(appliesToGroup, 'Object:', (action.appliesTo >= 0)) );

			this.selectObject = new HTMLResourceSelect(this.editor, null, ProjectObject);
			if (action.appliesTo >= 0)
				this.selectObject.setValue(action.appliesTo);

			this.codeEditor = new HTMLCodeEditor(action.args[0].value);

			this.makeApplyOkButtons(
				() => {
					this.apply()
				},
				() => {
					this.object.deleteActionWindow(this.id);
					this.close();
				}
			);

			this.codeEditor.setNextElem(this.htmlApply);

			endparent();
	}

	apply() {
		this.action.args[0].value = this.codeEditor.getValue();
		this.action.appliesTo = (
			this.radioAppliesToSelf.getChecked() ? -1 :
			this.radioAppliesToOther.getChecked() ? -2 :
			this.radioAppliesToObject.getChecked() ? this.selectObject.getValue() :
			null
		);

		// Update action in event in object
		this.object.updateSelectActions();
	}

	remove() {
		super.remove();
		this.selectObject.remove();
	}
	
}