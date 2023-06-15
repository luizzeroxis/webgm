import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HRadioInput, uniqueID} from "~/common/h";
import {ProjectObject} from "~/common/project/ProjectProperties.js";
import HCodeEditor from "~/editor/components/HCodeEditor/HCodeEditor.js";
import HResourceSelect from "~/editor/HResourceSelect.js";

export default class HWindowCode extends HWindow {
	constructor(manager, editor, action, windowObject) {
		super(manager);
		this.editor = editor;
		this.action = action;
		this.windowObject = windowObject;

		this.actionType = this.editor.getActionType(action.typeLibrary, action.typeId);

		this.setTitle(this.actionType.description);

		parent(this.client);

			parent( add( new HElement("div", {class: "window-code"}) ) );

				parent( add( new HElement("div", {class: "applies-to"}) ) );

					const appliesToGroup = "_radio_"+uniqueID();

					this.radioAppliesToSelf = add( new HRadioInput(appliesToGroup, "Self", (action.appliesTo == -1)) );
					this.radioAppliesToOther = add( new HRadioInput(appliesToGroup, "Other", (action.appliesTo == -2)) );
					this.radioAppliesToObject = add( new HRadioInput(appliesToGroup, "Object:", (action.appliesTo >= 0)) );

					this.selectObject = add( new HResourceSelect(this.editor, null, ProjectObject) );
					if (action.appliesTo >= 0)
						this.selectObject.setValue(action.appliesTo);

					endparent();

				this.codeEditor = add( new HCodeEditor(action.args[0].value) );

				endparent();

			this.makeApplyOkButtons(
				() => {
					this.apply();
				},
				() => {
					this.windowObject.deleteActionWindow(this.id);
					this.close();
				},
			);

			this.codeEditor.nextElem = this.applyButton;

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
		this.windowObject.updateSelectActions();
	}
}