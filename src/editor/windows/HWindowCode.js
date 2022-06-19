import {parent, endparent, add, HRadioInput, uniqueID} from '../../common/H.js'
import {ProjectObject} from '../../common/Project.js';
import HCodeEditor from '../HCodeEditor.js';
import HResourceSelect from '../HResourceSelect.js';
import HPropertiesWindow from '../HPropertiesWindow.js';

export default class HWindowCode extends HPropertiesWindow {

	constructor(manager, id, editor, object) {
		super(manager, id, editor);

		this.action = id;
		this.object = object;

		this.actionType = this.editor.getActionType(this.action.typeLibrary, this.action.typeId);

		this.title.html.textContent = this.actionType.description;

		parent(this.client)

			const appliesToGroup = '_radio_'+uniqueID();

			this.radioAppliesToSelf = add( new HRadioInput(appliesToGroup, 'Self', (this.action.appliesTo == -1)) );
			this.radioAppliesToOther = add( new HRadioInput(appliesToGroup, 'Other', (this.action.appliesTo == -2)) );
			this.radioAppliesToObject = add( new HRadioInput(appliesToGroup, 'Object:', (this.action.appliesTo >= 0)) );

			this.selectObject = add( new HResourceSelect(this.editor, null, ProjectObject) )
			if (this.action.appliesTo >= 0)
				this.selectObject.setValue(this.action.appliesTo);

			this.codeEditor = add( new HCodeEditor(this.action.args[0].value) )

			this.makeApplyOkButtons(
				() => {
					this.apply()
				},
				() => {
					this.object.deleteActionWindow(this.id);
					this.close();
				}
			);

			this.codeEditor.setNextElem(this.applyButton);

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
	
}