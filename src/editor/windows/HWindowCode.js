import {parent, endparent, add, HRadioInput, uniqueID} from '../../common/H.js'
import {ProjectObject} from '../../common/Project.js';
import HCodeEditor from '../HCodeEditor.js';
import HResourceSelect from '../HResourceSelect.js';
import HWindow from '../HWindow.js';

export default class HWindowCode extends HWindow {

	constructor(editor, id, action, object) {
		super(editor, id);

		this.action = action;
		this.object = object;

		this.actionType = this.editor.getActionType(action.typeLibrary, action.typeId);

		this.title.html.textContent = this.actionType.description;

		parent(this.client)

			const appliesToGroup = '_radio_'+uniqueID();

			this.radioAppliesToSelf = add( new HRadioInput(appliesToGroup, 'Self', (action.appliesTo == -1)) );
			this.radioAppliesToOther = add( new HRadioInput(appliesToGroup, 'Other', (action.appliesTo == -2)) );
			this.radioAppliesToObject = add( new HRadioInput(appliesToGroup, 'Object:', (action.appliesTo >= 0)) );

			this.selectObject = add( new HResourceSelect(this.editor, null, ProjectObject) )
			if (action.appliesTo >= 0)
				this.selectObject.setValue(action.appliesTo);

			this.codeEditor = add( new HCodeEditor(action.args[0].value) )

			this.makeApplyOkButtons(
				() => {
					this.apply()
				},
				() => {
					this.object.deleteActionWindow(this.id);
					this.close();
				},
			);

			this.codeEditor.setNextElem(this.applyButton);

			endparent();
	}

	apply() {
		this.action.args[0].value = this.codeEditor.getValue();
		this.action.appliesTo = (
			this.radioAppliesToSelf.getChecked() ? -1
			: this.radioAppliesToOther.getChecked() ? -2
			: this.radioAppliesToObject.getChecked() ? this.selectObject.getValue()
			: null
		);

		// Update action in event in object
		this.object.updateSelectActions();
	}

}