import {$, parent, endparent, add, newElem, newRadioBox, uniqueID} from '../common/H.js'
import {ProjectObject} from '../common/Project.js';

import HTMLCodeEditor from './HTMLCodeEditor.js';
import HTMLResourceSelect from './HTMLResourceSelect.js';
import HTMLWindow from './HTMLWindow.js';

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
			add( newElem(null, 'div') )

			var appliesToGroup = '_radio_'+uniqueID();
			this.radioAppliesToSelf = $( add( newRadioBox(null, 'Self',
				appliesToGroup, (action.appliesTo == -1)) ), 'input')
			this.radioAppliesToOther = $( add( newRadioBox(null, 'Other',
				appliesToGroup, (action.appliesTo == -2)) ), 'input')
			this.radioAppliesToObject = $( add( newRadioBox(null, 'Object:',
				appliesToGroup, (action.appliesTo >= 0)) ), 'input')

			this.selectObject = new HTMLResourceSelect(this.editor, null, ProjectObject);
			if (action.appliesTo >= 0)
				this.selectObject.setValue(action.appliesTo);

			this.codeEditor = new HTMLCodeEditor(action.args[0].value);

			this.makeApplyOkButtons(
				() => {
					this.apply()
				},
				() => {
					this.object.deleteActionWindow(this);
					this.close();
				}
			);

			this.codeEditor.setNextElem(this.htmlApply);

			endparent();
	}

	apply() {
		this.action.args[0].value = this.codeEditor.getValue();
		this.action.appliesTo = (
			this.radioAppliesToSelf.checked ? -1 :
			this.radioAppliesToOther.checked ? -2 :
			this.radioAppliesToObject.checked ? this.selectObject.getValue() :
			null
		);
	}
	
}