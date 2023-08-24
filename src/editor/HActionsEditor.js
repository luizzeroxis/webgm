import { parent, endparent, add, HElement, HButton, HImage, HSelect, HOption } from "~/common/h";
import {
	ProjectSprite, ProjectSound, ProjectBackground, ProjectPath, ProjectScript, ProjectObject, ProjectRoom, ProjectFont, ProjectTimeline, ProjectAction,
} from "~/common/project/ProjectProperties.js";
import HTabControl from "~/editor/components/HTabControl/HTabControl.js";
import HWindowAction from "~/editor/windows/HWindowAction.js";
import HWindowCode from "~/editor/windows/HWindowCode.js";

export default class HActionsEditor extends HElement {
	static actionArgResourceTypes = {
		"sprite": ProjectSprite,
		"sound": ProjectSound,
		"background": ProjectBackground,
		"path": ProjectPath,
		"script": ProjectScript,
		"object": ProjectObject,
		"room": ProjectRoom,
		"font": ProjectFont,
		"timeline": ProjectTimeline,
	};

	constructor(editor, parentWindow, onActionsChange, containerName) {
		parent(super("div", {class: "actions-editor"}));

			this.editor = editor;
			this.parentWindow = parentWindow;
			this.onActionsChange = onActionsChange;
			this.containerName = containerName;

			this.actions = null;

			parent( add( new HElement("div", {class: "actions"}) ) );

				this.selectActions = add( new HSelect("Actions:", "actions-list") );
				this.selectActions.select.html.size = 2;
				this.selectActions.select.html.multiple = true;

				this.selectActions.setOnChange(() => {
					this.updateActionsMenu();
				});

				this.selectActions.setEvent("contextmenu", e => {
					e.preventDefault();
					this.editor.menuManager.openMenu([
						{text: "Edit Values...", onClick: e => {
							e.focusedBefore = null;

							const actionIndex = this.selectActions.getSelectedIndex();
							if (actionIndex < 0) return;

							const action = this.actions[actionIndex];
							if (!action) return;

							this.openActionWindow(action);
						}},

						{text: "Cut", onClick: () => {
							const actionIndexes = this.selectActions.getSelectedIndexes();
							if (actionIndexes.length == 0) return;

							this.editor.clipboard.actions = actionIndexes.map(index => new ProjectAction(this.actions[index]));

							for (const index of actionIndexes) {
								this.closeActionWindow(this.actions[index]);
							}

							this.actions = this.actions.filter((action, index) => !actionIndexes.includes(index));

							this.updateSelectActions();
							this.updateActionsMenu();

							onActionsChange(this.actions);
						}},

						{text: "Copy", onClick: () => {
							const actionIndexes = this.selectActions.getSelectedIndexes();
							if (actionIndexes.length == 0) return;

							this.editor.clipboard.actions = actionIndexes.map(index => new ProjectAction(this.actions[index]));
						}},

						{text: "Paste", onClick: () => {
							if (this.editor.clipboard.actions) {
								const actionIndexes = this.selectActions.getSelectedIndexes();
								const insertIndex = (actionIndexes.length == 0) ? this.actions.length : actionIndexes[actionIndexes.length-1]+1;

								const actions = this.editor.clipboard.actions.map(action => new ProjectAction(action));
								this.actions.splice(insertIndex, 0, ...actions);

								const pastedActionIndexes = Array.from({length: actions.length}, (x, i) => i+insertIndex);

								this.updateSelectActions();
								this.selectActions.setSelectedIndexes(pastedActionIndexes);
								this.updateActionsMenu();

								onActionsChange(this.actions);
							}
						}},

						{text: "Delete", onClick: () => {
							this.deleteAction();
						}},

						{text: "Select All", onClick: () => {
							for (const option of this.selectActions.select.html.options) {
								option.selected = true;
							}
							this.updateActionsMenu();
						}},

						{text: "Clear", onClick: () => {
							for (const action of this.actions) {
								this.closeActionWindow(action);
							}

							this.actions = [];

							this.updateSelectActions();
							this.updateActionsMenu();

							onActionsChange(this.actions);
						}},
					], {returnFocus: false, x: e.clientX, y: e.clientY});
				});

				this.selectActions.setEvent("keydown", e => {
					if (e.code == "Enter") {
						const actionIndex = this.selectActions.getSelectedIndex();
						if (actionIndex < 0) return;

						const action = this.actions[actionIndex];
						if (!action) return;

						this.openActionWindow(action);
					} else if (e.code == "Delete") {
						this.deleteAction();
					}
				});

				this.selectActions.setEvent("drop", e => {
					const data = e.dataTransfer.getData("application/json");
					if (data == "") return;
					const {libraryName, actionTypeId} = JSON.parse(data);
					const actionType = this.editor.getActionType(libraryName, actionTypeId);
					this.addAction(libraryName, actionType);
				});

				this.selectActions.setEvent("dragover", e => {
					e.stopPropagation();
					e.preventDefault();

					console.log(e.dataTransfer.items);
					// debugger;
					console.log(Array.from(e.dataTransfer.items));
					console.log(Array.from(e.dataTransfer.items).find(item => item.type == "application/json"))
					const v = !(Array.from(e.dataTransfer.items).find(item => item.type == "application/json"));

					if (v) {
						console.log("setting to none")
						e.dataTransfer.dropEffect = "none";
					}
				});

				parent( add( new HElement("div") ) );

					this.buttonActionUp = add( new HButton("↑", () => {
						const actionIndex = this.selectActions.getSelectedIndex();
						if (actionIndex < 0 || actionIndex == 0) return;

						this.actions.splice(actionIndex-1, 0, this.actions.splice(actionIndex, 1)[0]);

						this.updateSelectActions();
						this.selectActions.setSelectedIndex(actionIndex-1);
						this.updateActionsMenu();

						onActionsChange(this.actions);
					}) );

					this.buttonActionDown = add( new HButton("↓", () => {
						const actionIndex = this.selectActions.getSelectedIndex();
						if (actionIndex < 0 || actionIndex == this.actions.length-1) return;

						this.actions.splice(actionIndex+1, 0, this.actions.splice(actionIndex, 1)[0]);

						this.updateSelectActions();
						this.selectActions.setSelectedIndex(actionIndex+1);
						this.updateActionsMenu();

						onActionsChange(this.actions);
					}) );

					endparent();
				endparent();

			parent( add( new HElement("div", {class: "libraries"}) ) );

				const librariesTabs = add( new HTabControl("libraries-tabs", "right") );

				this.editor.libraries.forEach(library => {
					const tab = parent( librariesTabs.addTab(library.name) );

						if (library.name == this.editor.preferences.get("defaultActionLibraryTab")) {
							librariesTabs.setSelectedContent(tab);
						}

						let nextClass = null;

						parent( add( new HElement("div", {class: "action-types"}) ) );

							library.items.forEach(actionType => {
								if (actionType.kind == "label") {
									add( new HElement("div", {class: "label"}, actionType.name) );
								} else if (actionType.kind == "separator") {
									nextClass = "new-row";
								} else {
									const actionTypeButton = add( new HButton(null, () => {
										this.addAction(library.name, actionType);
									}, "action-type") );

									actionTypeButton.setEvent("contextmenu", e => {
										e.preventDefault();
										this.addAction(library.name, actionType);
									});

									actionTypeButton.setEvent("dragstart", e => {
										e.dataTransfer.setData("application/json", JSON.stringify({libraryName: library.name, actionTypeId: actionType.id}));
									});

									if (nextClass) {
										actionTypeButton.html.classList.add(nextClass);
										nextClass = null;
									}

									actionTypeButton.html.title = actionType.description;
									actionTypeButton.html.draggable = true;

									if (actionType.image) {
										actionTypeButton.html.classList.add("image-button");
										parent(actionTypeButton);
											add( new HImage(actionType.image) );
											endparent();
									} else {
										actionTypeButton.html.textContent = actionType.description;
									}
								}
							});

							endparent();

						endparent();
				});

				endparent();

			endparent();
	}

	addAction(libraryName, actionType) {
		if (!this.actions) {
			alert(`You need to select or add ${this.containerName} before you can add actions.`);
			return;
		}
		const action = new ProjectAction();
		action.setType(libraryName, actionType);

		this.openActionWindow(action);

		this.actions.push(action);

		this.updateSelectActions();
		this.selectActions.setSelectedIndex(this.actions.length-1);
		this.updateActionsMenu();

		this.onActionsChange(this.actions);
	}

	deleteAction() {
		const actionIndexes = this.selectActions.getSelectedIndexes();

		for (const index of actionIndexes) {
			this.closeActionWindow(this.actions[index]);
		}

		this.actions = this.actions.filter((action, index) => !actionIndexes.includes(index));

		this.updateSelectActions();
		this.updateActionsMenu();

		this.onActionsChange(this.actions);
	}

	setActions(actions) {
		this.actions = actions;
		this.updateAll();
	}

	updateAll() {
		this.updateSelectActions();
		this.updateActionsMenu();
	}

	updateSelectActions() {
		const index = this.selectActions.getSelectedIndex();
		this.selectActions.removeOptions();

		if (this.actions) {
			let indent = 0;

			parent(this.selectActions.select);
				for (const action of this.actions) {
					const actionType = this.editor.getActionType(action);
					const listText = this.getActionListText(action, actionType);
					const hintText = this.getActionHintText(action, actionType);

					if (actionType.kind == "begin") {
						indent += 1;
					}

					const option = add( new HOption(
						(this.editor.preferences.get("hintTextInAction") ? hintText.text : listText.text), // text
						null, // value
						[...(listText.bold ? ["bold"] : []), ...(listText.italic ? ["italic"] : [])], // class
					) );
					option.html.title = hintText.text;

					const offset = (Math.max(0, indent) * 16);
					option.html.style.paddingLeft = `${2 + 24 + 2 + offset}px`;
					option.html.style.backgroundImage = `url(${actionType.image})`;
					option.html.style.backgroundPositionX = `${2 + offset}px`;

					option.setEvent("dblclick", () => {
						this.openActionWindow(action);
					});

					if (actionType.kind == "end") {
						indent -= 1;
					}
				}
				endparent();

			this.selectActions.setSelectedIndex(Math.min(index, this.actions.length-1));
		}
	}

	updateActionsMenu() {
		if (this.selectActions.select.html.selectedOptions.length == 0) {
			this.buttonActionUp.setDisabled(true);
			this.buttonActionDown.setDisabled(true);
		} else
		if (this.selectActions.select.html.selectedOptions.length == 1) {
			this.buttonActionUp.setDisabled(this.selectActions.getSelectedIndex() == 0);
			this.buttonActionDown.setDisabled(this.selectActions.getSelectedIndex() == this.actions.length-1);
		} else {
			this.buttonActionUp.setDisabled(true);
			this.buttonActionDown.setDisabled(true);
		}
	}

	openActionWindow(action) {
		const actionType = this.editor.getActionType(action.typeLibrary, action.typeId);

		let windowClass;

		if ((actionType.kind == "normal" && actionType.interfaceKind == "normal")
			|| (actionType.kind == "normal" && actionType.interfaceKind == "arrows")
			|| (actionType.kind == "repeat")
			|| (actionType.kind == "variable")) {
			windowClass = HWindowAction;
		} else if ((actionType.kind == "normal" && actionType.interfaceKind == "code")
			|| (actionType.kind == "normal" && actionType.interfaceKind == "text")
			|| (actionType.kind == "code")) {
			windowClass = HWindowCode;
		}

		if (windowClass) {
			this.parentWindow.openAsChild(windowClass, w => w.action == action, this.editor, action, this.parentWindow);
		}
	}

	closeActionWindow(action) {
		this.parentWindow.windowChildren.find(x => x.action == action)?.forceClose();
	}

	getActionListText(action, actionType) {
		return this.parseActionListOrHintText(actionType.listText, action, actionType);
	}

	getActionHintText(action, actionType) {
		return this.parseActionListOrHintText(actionType.hintText, action, actionType);
	}

	parseActionListOrHintText(textArray, action, actionType) {
		const result = {
			bold: false,
			italic: false,
		};

		result.text = textArray.reduce((previous, part) => {
			if (typeof part == "string") return previous + part;
			switch (part.type) {
				case "a": {
					const actionArg = action.args[part.number];

					if (["expression", "string", "both", "color"].includes(actionArg.kind)) {
						return previous + actionArg.value.toString();
					} else if ("boolean" == actionArg.kind) {
						return previous + (actionArg.value ? "true" : "false");
					} else if ("menu" == actionArg.kind) {
						return previous + actionType.args[part.number].menu[actionArg.value];
					} else {
						const resourceType = HActionsEditor.actionArgResourceTypes[actionArg.kind];
						if (!resourceType) throw new Error("Impossible action arg kind "+actionArg.kind);
						const resource = this.editor.project.getResourceById(resourceType.getClassName(), actionArg.value);
						return previous + (resource ? resource.name : "<undefined>");
					}
				}
				case "r":
					return previous + (action.relative ? "relative " : "");
				case "n":
					return previous + (action.not ? "not " : "");
				case "w": {
					if (action.appliesTo == -1) return "";
					if (action.appliesTo == -2) return "for the other object: ";
					const resource = this.editor.project.getResourceById("ProjectObject", action.appliesTo);
					return previous + "for object " + (resource ? resource.name : "<undefined>") + ": ";
				}

				case "i":
					result.italic = true;
					break;
				case "b":
					result.bold = true;
					break;
			}
			return previous;
		}, "");

		return result;
	}
}