import {parent, endparent, add, HElement, HRadioInput, uniqueID} from "~/common/H.js";
import {ProjectObject} from "~/common/ProjectProperties.js";
import HCodeEditor from "~/editor/HCodeEditor.js";
import HResourceSelect from "~/editor/HResourceSelect.js";
import HWindow from "~/editor/HWindow.js";

export default class HWindowCode extends HWindow {
	constructor(editor, id, action, object) {
		super(editor, id);

		this.action = action;
		this.object = object;

		this.actionType = this.editor.getActionType(action.typeLibrary, action.typeId);

		this.title.html.textContent = this.actionType.description;

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