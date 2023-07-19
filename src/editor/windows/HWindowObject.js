import HWindow from "~/common/components/HWindowManager/HWindow.js";
import Events from "~/common/Events.js";
import {parent, endparent, add, HElement, HButton, HTextInput, HNumberInput, HCheckBoxInput, HSelect, HOption} from "~/common/h";
import {
	ProjectSprite, ProjectSound, ProjectBackground, ProjectPath, ProjectScript, ProjectObject, ProjectRoom, ProjectFont, ProjectTimeline, ProjectEvent, ProjectAction,
} from "~/common/project/ProjectProperties.js";
import {setDeepOnUpdateOnElement} from "~/common/tools.js";
import HActionLibraries from "~/editor/HActionLibraries.js";
import HResourceSelect from "~/editor/HResourceSelect.js";

import HEventChooserWindow from "./HEventChooserWindow.js";
import HWindowAction from "./HWindowAction.js";
import HWindowCode from "./HWindowCode.js";

export default class HWindowObject extends HWindow {
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

	constructor(manager, editor, resource) {
		super(manager);
		this.editor = editor;
		this.resource = resource;

		this.modified = false;
		this.copyData();

		this.updateTitle();

		parent(this.client);
			parent( add( new HElement("div", {class: "panel-container window-object"}) ) );

				this.divProperties = parent( add( new HElement("div", {class: "properties"}) ) );

					this.inputName = add( new HTextInput("Name:", this.resource.name) );

					this.selectSprite = add( new HResourceSelect(this.editor, "Sprite:", ProjectSprite) );
					this.selectSprite.setValue(this.resource.sprite_index);

					this.inputVisible = add( new HCheckBoxInput("Visible", this.resource.visible) );
					this.inputSolid = add( new HCheckBoxInput("Solid", this.resource.solid) );
					this.inputDepth = add( new HNumberInput("Depth:", this.resource.depth, 1) );
					this.inputPersistent = add( new HCheckBoxInput("Persistent", this.resource.persistent) );

					this.selectParent = add( new HResourceSelect(this.editor, "Parent:", ProjectObject) );
					this.selectParent.setValue(this.resource.parent_index);

					this.selectMask = add( new HResourceSelect(this.editor, "Mask:", ProjectSprite) );
					this.selectMask.setValue(this.resource.mask_index);

					add( new HButton("OK", () => {
						this.modified = false;
						this.close();
					}) );

					endparent();

				parent( add( new HElement("div", {class: "events"}) ) );

					// Event select

					this.selectEvents = add( new HSelect("Events:", "events-list") );
					this.selectEvents.select.html.size = 2;

					this.selectEvents.setOnChange(() => {
						this.updateSelectActions();
						this.updateActionsMenu();
					});

					parent( add( new HElement("div") ) );

						// Add event button
						this.buttonEventAdd = add( new HButton("Add Event", async () => {
							const newEvent = await this.editor.windowManager.openModal(HEventChooserWindow, this.editor).promise;
							if (!newEvent) return;

							// Don't continue if there's an event with the exact same type and subtype
							if (this.resource.events.find(x => x.type == newEvent.type && x.subtype == newEvent.subtype))
								return;

							const event = new ProjectEvent();
							event.type = newEvent.type;
							event.subtype = newEvent.subtype;
							this.resource.events.push(event);

							this.sortEvents();

							this.updateSelectEvents();
							this.selectEvents.setValue(event.getNameId());
							this.updateEventsMenu();
							this.updateSelectActions();
							this.updateActionsMenu();

							this.onUpdate();
						}) );

						parent( add( new HElement("div") ) );
							// Delete event button
							this.buttonEventDelete = add( new HButton("Delete", () => {
								const index = this.resource.events.findIndex(event => this.selectEvents.getValue() == event.getNameId());
								if (index < 0) return;

								if (this.resource.events[index].actions.length > 0)
								if (!confirm("Are you sure you want to remove the event with all its actions?"))
									return;

								// Close action windows related to event
								this.resource.events[index].actions.forEach(action => {
									this.closeActionWindow(action);
								});

								this.resource.events.splice(index, 1);

								this.updateSelectEvents();
								this.updateEventsMenu();
								this.updateSelectActions();
								this.updateActionsMenu();

								this.onUpdate();
							}) );

							// Change event button

							this.buttonEventChange = add( new HButton("Change", async () => {
								const newEvent = await this.editor.windowManager.openModal(HEventChooserWindow, this.editor).promise;

								const event = this.getSelectedEvent();
								if (!event) return;

								// Don't continue if there's an event with the exact same type and subtype
								if (this.resource.events.find(x => x.type == newEvent.type && x.subtype == newEvent.subtype))
									return;

								event.type = newEvent.type;
								event.subtype = newEvent.subtype;

								this.sortEvents();

								this.updateSelectEvents();
								this.selectEvents.setValue(event.getNameId());
								// this.updateEventsMenu();
								// this.updateSelectActions();
								// this.updateActionsMenu();

								this.onUpdate();
							}) );
							endparent();

						endparent();

					endparent();

				parent( add( new HElement("div", {class: "actions"}) ) );

					// // Actions

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

								const event = this.getSelectedEvent();
								if (!event) return;

								const actionIndex = this.selectActions.getSelectedIndex();
								if (actionIndex < 0) return;

								const action = event.actions[actionIndex];
								if (!action) return;

								this.openActionWindow(action);
							}},

							{text: "Cut", onClick: () => {
								const event = this.getSelectedEvent();
								if (!event) return;

								const actionIndexes = this.selectActions.getSelectedIndexes();
								if (actionIndexes.length == 0) return;

								this.editor.clipboard.actions = actionIndexes.map(index => new ProjectAction(event.actions[index]));

								for (const index of actionIndexes) {
									this.closeActionWindow(event.actions[index]);
								}

								event.actions = event.actions.filter((action, index) => !actionIndexes.includes(index));

								this.updateSelectActions();
								this.updateActionsMenu();

								this.onUpdate();
							}},

							{text: "Copy", onClick: () => {
								const event = this.getSelectedEvent();
								if (!event) return;

								const actionIndexes = this.selectActions.getSelectedIndexes();
								if (actionIndexes.length == 0) return;

								this.editor.clipboard.actions = actionIndexes.map(index => new ProjectAction(event.actions[index]));
							}},

							{text: "Paste", onClick: () => {
								if (this.editor.clipboard.actions) {
									const event = this.getSelectedEvent();
									if (!event) return;

									const actionIndexes = this.selectActions.getSelectedIndexes();
									const insertIndex = (actionIndexes.length == 0) ? event.actions.length : actionIndexes[actionIndexes.length-1]+1;

									const actions = this.editor.clipboard.actions.map(action => new ProjectAction(action));
									event.actions.splice(insertIndex, 0, ...actions);

									const pastedActionIndexes = Array.from({length: actions.length}, (x, i) => i+insertIndex);

									this.updateSelectActions();
									this.selectActions.setSelectedIndexes(pastedActionIndexes);
									this.updateActionsMenu();

									this.onUpdate();
								}
							}},

							{text: "Delete", onClick: () => {
								const event = this.getSelectedEvent();
								if (!event) return;

								const actionIndexes = this.selectActions.getSelectedIndexes();

								for (const index of actionIndexes) {
									this.closeActionWindow(event.actions[index]);
								}

								event.actions = event.actions.filter((action, index) => !actionIndexes.includes(index));

								this.updateSelectActions();
								this.updateActionsMenu();

								this.onUpdate();
							}},

							{text: "Select All", onClick: () => {
								for (const option of this.selectActions.select.html.options) {
									option.selected = true;
								}
								this.updateActionsMenu();
							}},

							{text: "Clear", onClick: () => {
								const event = this.getSelectedEvent();
								if (!event) return;

								for (const action of event.actions) {
									this.closeActionWindow(action);
								}

								event.actions = [];

								this.updateSelectActions();
								this.updateActionsMenu();

								this.onUpdate();
							}},
						], {returnFocus: false, x: e.clientX, y: e.clientY});
					});

					parent( add( new HElement("div") ) );

						this.buttonActionUp = add( new HButton("↑", () => {
							const event = this.getSelectedEvent();
							if (!event) return;

							const actionIndex = this.selectActions.getSelectedIndex();
							if (actionIndex < 0 || actionIndex == 0) return;

							event.actions.splice(actionIndex-1, 0, event.actions.splice(actionIndex, 1)[0]);

							this.updateSelectActions();
							this.selectActions.setSelectedIndex(actionIndex-1);
							this.updateActionsMenu();

							this.onUpdate();
						}) );

						this.buttonActionDown = add( new HButton("↓", () => {
							const event = this.getSelectedEvent();
							if (!event) return;

							const actionIndex = this.selectActions.getSelectedIndex();
							if (actionIndex < 0 || actionIndex == event.actions.length-1) return;

							event.actions.splice(actionIndex+1, 0, event.actions.splice(actionIndex, 1)[0]);

							this.updateSelectActions();
							this.selectActions.setSelectedIndex(actionIndex+1);
							this.updateActionsMenu();

							this.onUpdate();
						}) );

						endparent();

					endparent();

				parent( add( new HElement("div", {class: "libraries"}) ) );

					add( new HActionLibraries(this.editor, action => {
						const event = this.getSelectedEvent();
						if (!event) {
							alert("You need to select or add an event before you can add actions.");
							return;
						}

						this.openActionWindow(action);

						event.actions.push(action);

						this.updateSelectActions();
						this.selectActions.setSelectedIndex(event.actions.length-1);
						this.updateActionsMenu();

						this.onUpdate();
					}) );

					endparent();

				endparent();

			// Add initial events
			this.sortEvents();
			this.updateSelectEvents();
			this.selectEvents.setSelectedIndex(0);
			this.updateEventsMenu();

			// Select first event
			this.updateSelectActions();
			this.updateActionsMenu();

			endparent();

		setDeepOnUpdateOnElement(this.divProperties, () => this.onUpdate());
	}

	onAdd() {
		super.onAdd();

		this.listeners = this.editor.project.dispatcher.listen({
			changeResourceName: () => {
				this.updateSelectEvents();
				this.updateSelectActions();
			},
		});
	}

	onRemove() {
		super.onRemove();

		this.editor.project.dispatcher.stopListening(this.listeners);
	}

	copyData() {
		this.resourceCopy = new ProjectObject(this.resource);
	}

	saveData() {
		this.editor.project.changeResourceName(this.resource, this.inputName.getValue());
		this.updateTitle();

		this.editor.project.changeObjectSprite(this.resource, this.selectSprite.getValue());
		this.resource.visible = this.inputVisible.getChecked();
		this.resource.solid = this.inputSolid.getChecked();
		this.resource.depth = parseInt(this.inputDepth.getValue());
		this.resource.persistent = this.inputPersistent.getChecked();
		this.resource.parent_index = this.selectParent.getValue();
		this.resource.mask_index = this.selectMask.getValue();
	}

	restoreData() {
		Object.assign(this.resource, this.resourceCopy);

		this.editor.project.changeResourceName(this.resource, this.resource.name);
		this.updateTitle();

		this.editor.project.changeObjectSprite(this.resource, this.resource.sprite_index);
	}

	onUpdate() {
		this.modified = true;
		this.saveData();
	}

	updateTitle() {
		this.setTitle("Object Properties: "+this.resource.name);
	}

	sortEvents() {
		this.resource.events.sort((a, b) => {
			const aTypeId = Events.listEventTypes.find(x => x.value == a.type).id;
			const bTypeId = Events.listEventTypes.find(x => x.value == b.type).id;

			const compareTypeId = aTypeId - bTypeId;
			if (compareTypeId != 0) return compareTypeId;

			const aSubtypeId = a.subtype;
			const bSubtypeId = b.subtype;

			const compareSubtypeId = aSubtypeId - bSubtypeId;
			return compareSubtypeId;
		});
	}

	updateSelectEvents() {
		const index = this.selectEvents.getSelectedIndex();
		this.selectEvents.removeOptions();

		parent( this.selectEvents.select );
			this.resource.events.forEach(event => {
				add( new HOption(Events.getEventName(event, this.editor.project), event.getNameId()) );
			});
			endparent();

		this.selectEvents.setSelectedIndex(Math.min(index, this.resource.events.length-1));
	}

	updateEventsMenu() {
		if (this.selectEvents.getSelectedIndex() < 0) {
			this.buttonEventChange.setDisabled(true);
			this.buttonEventDelete.setDisabled(true);
		} else {
			this.buttonEventChange.setDisabled(false);
			this.buttonEventDelete.setDisabled(false);
		}
	}

	updateSelectActions() {
		const index = this.selectActions.getSelectedIndex();
		this.selectActions.removeOptions();

		const event = this.getSelectedEvent();

		if (event) {
			parent(this.selectActions.select);
				for (const action of event.actions) {
					const actionType = this.editor.getActionType(action);
					const listText = this.getActionListText(action, actionType);
					const hintText = this.getActionHintText(action, actionType);

					const option = add( new HOption(
						(this.editor.preferences.get("hintTextInAction") ? hintText.text : listText.text), // text
						null, // value
						[...(listText.bold ? ["bold"] : []), ...(listText.italic ? ["italic"] : [])], // class
					) );
					option.html.title = hintText.text;

					option.setEvent("dblclick", () => {
						this.openActionWindow(action);
					});
				}
				endparent();

			this.selectActions.setSelectedIndex(Math.min(index, event.actions.length-1));
		}
	}

	updateActionsMenu() {
		const event = this.getSelectedEvent();

		if (this.selectActions.select.html.selectedOptions.length == 0) {
			this.buttonActionUp.setDisabled(true);
			this.buttonActionDown.setDisabled(true);
		} else
		if (this.selectActions.select.html.selectedOptions.length == 1) {
			this.buttonActionUp.setDisabled(this.selectActions.getSelectedIndex() == 0);
			this.buttonActionDown.setDisabled(this.selectActions.getSelectedIndex() == event.actions.length-1);
		} else {
			this.buttonActionUp.setDisabled(true);
			this.buttonActionDown.setDisabled(true);
		}
	}

	getSelectedEvent() {
		return this.resource.events.find(event => this.selectEvents.getValue() == event.getNameId());
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
						const resourceType = HWindowObject.actionArgResourceTypes[actionArg.kind];
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
			this.openAsChild(windowClass, w => w.action == action, this.editor, action, this);
		}
	}

	closeActionWindow(action) {
		this.windowChildren.find(x => x.action == action)?.forceClose();
	}

	close() {
		if (this.modified) {
			if (!confirm(`Close without saving the changes to ${this.resource.name}?`)) return;
		}

		for (const child of this.windowChildren) {
			child.forceClose();
		}

		if (this.modified) {
			this.restoreData();
		}

		super.close();
	}
}