import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HButton, HRadioInput, uniqueID} from "~/common/h";
import {ProjectObject, ProjectAction} from "~/common/project/ProjectProperties.js";
import {setDeepOnUpdateOnElement} from "~/common/tools.js";
import HCodeEditor from "~/editor/components/HCodeEditor/HCodeEditor.js";
import HResourceSelect from "~/editor/HResourceSelect.js";

export default class HWindowCode extends HWindow {
	constructor(manager, editor, action, windowObject) {
		super(manager);
		this.editor = editor;
		this.action = action;
		this.windowObject = windowObject;

		this.modified = false;
		this.copyData();

		this.actionType = this.editor.getActionType(this.action.typeLibrary, this.action.typeId);

		this.setTitle(this.actionType.description);

		parent(this.client);

			parent( add( new HElement("div", {class: "window-code"}) ) );

				parent( add( new HElement("div", {class: "tool-bar"}) ) );

					add( new HButton("OK", () => {
						this.modified = false;
						this.close();
					}) );

					const appliesToGroup = "_radio_"+uniqueID();

					this.radioAppliesToSelf = add( new HRadioInput(appliesToGroup, "Self", (this.action.appliesTo == -1)) );
					this.radioAppliesToOther = add( new HRadioInput(appliesToGroup, "Other", (this.action.appliesTo == -2)) );
					this.radioAppliesToObject = add( new HRadioInput(appliesToGroup, "Object:", (this.action.appliesTo >= 0)) );

					this.selectObject = add( new HResourceSelect(this.editor, null, ProjectObject) );
					if (this.action.appliesTo >= 0)
						this.selectObject.setValue(this.action.appliesTo);

					endparent();

				this.codeEditor = add( new HCodeEditor(this.action.args[0].value) );

				endparent();

			endparent();

		setDeepOnUpdateOnElement(this.client, () => this.onUpdate());
	}

	copyData() {
		this.actionCopy = new ProjectAction(this.action);
	}

	saveData() {
		this.action.args[0].value = this.codeEditor.getValue();
		this.action.appliesTo = (
			this.radioAppliesToSelf.getChecked() ? -1
			: this.radioAppliesToOther.getChecked() ? -2
			: this.radioAppliesToObject.getChecked() ? this.selectObject.getValue()
			: null
		);

		// Update action in event in object
		this.windowObject.updateSelectActions();
		this.windowObject.onUpdate();
	}

	restoreData() {
		Object.assign(this.action, this.actionCopy);

		// Update action in event in object
		this.windowObject.updateSelectActions();
		this.windowObject.onUpdate();
	}

	onUpdate() {
		this.modified = true;
		this.saveData();
	}

	close() {
		if (this.modified) {
			if (!confirm("Close without saving the changes to the code?")) return;
			this.restoreData();
		}
		super.close();
	}
}