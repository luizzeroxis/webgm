import HTMLWindow from './HTMLWindow.js';

import {parent, endparent, add, newElem, newRadioBox, uniqueID} from '../common/tools.js'

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
			this.radioAppliesToSelf = add( newRadioBox(null, 'Self',
				appliesToGroup, (action.appliesTo == -1)) ).$('input')
			this.radioAppliesToOther = add( newRadioBox(null, 'Other',
				appliesToGroup, (action.appliesTo == -2)) ).$('input')
			this.radioAppliesToObject = add( newRadioBox(null, 'Object:',
				appliesToGroup, (action.appliesTo >= 0)) ).$('input')

			this.selectObject = this.makeResourceSelect(null, '', 'ProjectObject').$('select');
			if (action.appliesTo >= 0)
				this.selectObject.value = action.appliesTo;

			this.textareaCode = add( newElem('code', 'textarea', action.args[0].value) )

			this.makeApplyOkButtons(
				() => {
					this.apply()
				},
				() => {
					this.close();
				}
			);
			endparent();
	}

	apply() {
		this.action.args[0].value = this.textareaCode.value;
		this.action.appliesTo = (
			this.radioAppliesToSelf.checked ? -1 :
			this.radioAppliesToOther.checked ? -2 :
			this.radioAppliesToObject.checked ? this.selectObject.value :
			null
		);
	}

	close() {
		this.object.deleteActionWindow(this);
	}
}