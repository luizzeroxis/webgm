import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HButton, HTextInput, HColorInput, HCheckBoxInput, HRadioInput, HSelectWithOptions, uniqueID} from "~/common/h";
import {ProjectObject, ProjectAction, ProjectActionArg} from "~/common/project/ProjectProperties.js";
import {setDeepOnUpdateOnElement, parseArrowString, stringifyArrowValues, decimalToHex, hexToDecimal} from "~/common/tools.js";
import HActionsEditor from "~/editor/HActionsEditor.js";
import HResourceSelect from "~/editor/HResourceSelect.js";

export default class HActionEditorWindow extends HWindow {
	constructor(manager, editor, action, windowObject) {
		super(manager);
		this.editor = editor;
		this.action = action;
		this.windowObject = windowObject;

		this.modified = false;
		this.copyData();

		this.actionType = this.editor.getActionType(this.action.typeLibrary, this.action.typeId);

		this.setTitle(this.actionType.description);

		const actionTypeInfoItem = ProjectAction.typeInfo.find(x => x.kind == this.actionType.kind && x.interfaceKind == this.actionType.interfaceKind);

		parent(this.client);
			parent( add( new HElement("div", {class: "window-action"}) ) );

				this.actionTypeHasApplyTo = this.actionType.hasApplyTo ?? actionTypeInfoItem.hasApplyTo;

				if (this.actionTypeHasApplyTo) {
					parent( add( new HElement("fieldset") ) );

						add( new HElement("legend", {}, "Applies to") );

						const appliesToGroup = "_radio_"+uniqueID();

						this.radioAppliesToSelf = add( new HRadioInput(appliesToGroup, "Self", (this.action.appliesTo == -1)) );
						this.radioAppliesToOther = add( new HRadioInput(appliesToGroup, "Other", (this.action.appliesTo == -2)) );
						this.radioAppliesToObject = add( new HRadioInput(appliesToGroup, "Object:", (this.action.appliesTo >= 0)) );

						this.selectObject = add( new HResourceSelect(this.editor, null, ProjectObject) );

						if (this.action.appliesTo >= 0)
							this.selectObject.setValue(this.action.appliesTo);

						endparent();
				}

				this.actionTypeArgs = this.actionType.args ?? actionTypeInfoItem.args;

				this.argsInterfaces = [];

				this.actionTypeArgs.forEach((argType, i) => {
					switch (argType.kind) {
						case "expression":
						case "string":
						case "both":
							if (this.actionType.interfaceKind == "arrows" && i == 0) {
								this.argsInterfaces[i] = this.makeDirectionInterface(argType.name, this.action.args[i].value);
							} else {
								this.argsInterfaces[i] = this.makeTextInterface(argType.name, this.action.args[i].value);
							}
							break;

						case "boolean":
							this.argsInterfaces[i] = this.makeMenuInterface(argType.name, ["false", "true"], this.action.args[i].value);
							break;

						case "menu":
							this.argsInterfaces[i] = this.makeMenuInterface(argType.name, argType.menu, this.action.args[i].value);
							break;

						case "color":
							this.argsInterfaces[i] = this.makeColorInterface(argType.name, this.action.args[i].value);
							break;

						case "sprite":
						case "sound":
						case "background":
						case "path":
						case "script":
						case "object":
						case "room":
						case "font":
						case "timeline":
							this.argsInterfaces[i] = this.makeResourceInterface(argType.name, argType.kind, this.action.args[i].value);
							break;
					}
				});

				this.actionTypeHasRelative = this.actionType.hasRelative ?? actionTypeInfoItem.hasRelative;

				if (this.actionTypeHasRelative) {
					this.inputRelative = add( new HCheckBoxInput("Relative", this.action.relative) );
				}

				this.actionTypeIsQuestion = this.actionType.isQuestion ?? actionTypeInfoItem.isQuestion;

				if (this.actionTypeIsQuestion) {
					this.inputNot = add( new HCheckBoxInput("NOT", this.action.not) );
				}

				endparent();

			add( new HButton("OK", () => {
				this.modified = false;
				this.close();
			}) );

			add( new HButton("Cancel", () => {
				this.close();
			}) );

			endparent();

		setDeepOnUpdateOnElement(this.client, () => this.onUpdate());
	}

	copyData() {
		this.actionCopy = new ProjectAction(this.action);
	}

	saveData() {
		for (let i = 0; i < this.action.args.length; i++) {
			const actionArg = new ProjectActionArg();
			actionArg.kind = this.actionTypeArgs[i].kind;
			actionArg.value = this.argsInterfaces[i].getValue();
			this.action.args[i] = actionArg;
		}

		if (this.actionTypeHasApplyTo) {
			this.action.appliesTo = (
				this.radioAppliesToSelf.getChecked() ? -1
				: this.radioAppliesToOther.getChecked() ? -2
				: this.radioAppliesToObject.getChecked() ? this.selectObject.getValue()
				: null
			);
		}

		if (this.actionTypeHasRelative)
			this.action.relative = this.inputRelative.getChecked();

		if (this.actionTypeIsQuestion)
			this.action.not = this.inputNot.getChecked();

		// Update action in event in object
		this.windowObject.actionsEditor.updateAll();
		this.windowObject.onUpdate();
	}

	restoreData() {
		Object.assign(this.action, this.actionCopy);

		// Update action in event in object
		this.windowObject.actionsEditor.updateAll();
		this.windowObject.onUpdate();
	}

	onUpdate() {
		this.modified = true;
		this.saveData();
	}

	makeTextInterface(name, value) {
		const input = add( new HTextInput(name, value) );
		return {
			getValue: () => input.getValue(),
		};
	}

	makeDirectionInterface(name, value) {
		const directions = parseArrowString(value);
		const directionNames = ["down left", "down", "down right", "left", "stop", "right", "up left", "up", "up right"];

		const inputs = [];

		add( new HElement("span", {}, name) );

		parent( add( new HElement("div", {class: "arrow-interface"}) ) );

			for (let y=2; y>=0; --y)
			for (let x=0; x<=2; ++x) {
				const i = (3*y)+x;
				inputs[i] = add( new HCheckBoxInput(directionNames[i], directions[i]) );
			}

			endparent();

		return {
			getValue: () => stringifyArrowValues(inputs.map(x => x.getChecked())),
		};
	}

	makeMenuInterface(name, optionNames, value) {
		const options = optionNames.map((text, index) => ({name: text, value: index}));

		const select = add( new HSelectWithOptions(name, options) );
		select.setSelectedIndex(value);

		return {
			getValue: () => parseInt(select.getValue()),
		};
	}

	makeColorInterface(name, value) {
		const input = add( new HColorInput(name, decimalToHex(value)) );
		return {
			getValue: () => hexToDecimal(input.getValue()),
		};
	}

	makeResourceInterface(name, resourceTypeName, value) {
		const resourceType = HActionsEditor.actionArgResourceTypes[resourceTypeName];

		const select = add( new HResourceSelect(this.editor, name, resourceType) );
		select.setValue(value);

		return {
			getValue: () => select.getValue(),
		};
	}

	close() {
		if (this.modified) {
			this.restoreData();
		}
		super.close();
	}
}