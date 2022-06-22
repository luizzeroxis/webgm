import Events from "../../common/Events.js";
import {parent, endparent, add, removeChildren, HElement, HButton, HTextInput, HNumberInput, HCheckBoxInput, HSelect, HOption, HSelectWithOptions, HImage} from "../../common/H.js";
import {
	ProjectSprite, ProjectSound, ProjectBackground, ProjectPath, ProjectScript, ProjectObject, ProjectRoom, ProjectFont, ProjectTimeline,
	ProjectEvent, ProjectAction, ProjectActionArg,
} from "../../common/Project.js";
import HResourceSelect from "../HResourceSelect.js";
import HTabControl from "../HTabControl.js";
import HWindow from "../HWindow.js";

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

	constructor(editor, id, object) {
		super(editor, id);

		this.object = object;

		this.title.html.textContent = "Edit Object "+object.name;
		this.htmlActionWindows = [];

		// Create paramEvents as copy
		this.copyProperties();

		parent(this.client);
			parent( add( new HElement("div", {class: "grid-resource resource-object"}) ) );

				parent( add( new HElement("div") ) ); // Properties area

					const inputName = add( new HTextInput("Name:", object.name) );

					this.selectSprite = add( new HResourceSelect(this.editor, "Sprite:", ProjectSprite) );
					this.selectSprite.setValue(object.sprite_index);

					const inputVisible = add( new HCheckBoxInput("Visible", object.visible) );
					const inputSolid = add( new HCheckBoxInput("Solid", object.solid) );
					const inputDepth = add( new HNumberInput("Depth:", object.depth, 1) );
					const inputPersistent = add( new HCheckBoxInput("Persistent", object.persistent) );

					endparent();

				parent( add( new HElement("div") ) ); // Events area

					// Event select

					this.selectEvents = add( new HSelect("Events:", "events") );
					this.selectEvents.select.html.size = 2;

					this.selectEvents.setOnChange(() => {
						this.updateSelectActions();
						this.updateActionsMenu();
					});

					// Event type select

					this.selectEventType = add( new HSelectWithOptions("Event type:", Events.listEventTypes) );

					this.selectEventType.setOnChange(() => {
						this.updateDivEventSubtype();
					});

					// Event subtype div

					this.selectCollisionObject = null;
					this.divEventSubtype = add( new HElement("div") );

					// Add event button
					this.buttonEventAdd = add( new HButton("Add Event", () => {
						const eventType = this.selectEventType.getValue();
						let eventSubtype = 0;

						if (this.subtypeValueFunction) {
							eventSubtype = this.subtypeValueFunction();
						}

						// Don't continue if there's an event with the exact same type and subtype
						if (this.paramEvents.find(x => x.type == eventType && x.subtype == eventSubtype))
							return;

						const event = new ProjectEvent();
						event.type = eventType;
						event.subtype = eventSubtype;
						this.paramEvents.push(event);

						this.sortEvents();

						this.updateSelectEvents();
						this.selectEvents.setValue(event.getNameId());
						this.updateEventsMenu();
						this.updateSelectActions();
						this.updateActionsMenu();
					}) );

					// Delete event button
					this.buttonEventDelete = add( new HButton("Delete", () => {
						const index = this.paramEvents.findIndex(event => this.selectEvents.getValue() == event.getNameId());
						if (index < 0) return;

						if (this.paramEvents[index].actions.length > 0)
						if (!confirm("Are you sure you want to remove the event with all its actions?"))
							return;

						// Close action windows related to event
						this.paramEvents[index].actions.forEach(action => {
							this.deleteActionWindow(action);
						});

						this.paramEvents.splice(index, 1);

						this.updateSelectEvents();
						this.updateEventsMenu();
						this.updateSelectActions();
						this.updateActionsMenu();
					}) );

					// Change event button

					this.buttonEventChange = add( new HButton("Change", () => {
						const event = this.getSelectedEvent();
						if (!event) return;

						const eventType = this.selectEventType.getValue();
						let eventSubtype = 0;

						if (this.subtypeValueFunction) {
							eventSubtype = this.subtypeValueFunction();
						}

						// Don't continue if there's an event with the exact same type and subtype
						if (this.paramEvents.find(x => x.type == eventType && x.subtype == eventSubtype))
							return;

						event.type = eventType;
						event.subtype = eventSubtype;

						this.sortEvents();

						this.updateSelectEvents();
						this.selectEvents.setValue(event.getNameId());
						// this.updateEventsMenu();
						// this.updateSelectActions();
						// this.updateActionsMenu();
					}) );

					endparent();

				parent( add( new HElement("div") ) ); // Actions area

					// // Actions

					this.selectActions = add( new HSelect("Actions:", "actions") );
					this.selectActions.select.html.size = 2;

					this.selectActions.setOnChange(() => {
						this.updateActionsMenu();
					});

					this.buttonActionEdit = add( new HButton("Edit action", () => {
						const event = this.getSelectedEvent();
						if (!event) return;

						const actionIndex = this.selectActions.getSelectedIndex();
						if (actionIndex < 0) return;

						const action = event.actions[actionIndex];
						if (!action) return;

						this.openActionWindow(action);
					}) );

					this.buttonActionDelete = add( new HButton("Delete action", () => {
						const event = this.getSelectedEvent();
						if (!event) return;

						const actionIndex = this.selectActions.getSelectedIndex();
						if (actionIndex < 0) return;

						const action = event.actions[actionIndex];
						if (!action) return;

						this.deleteActionWindow(action);

						event.actions.splice(actionIndex, 1);

						this.updateSelectActions();
						this.updateActionsMenu();
					}) );

					this.buttonActionUp = add( new HButton("▲", () => {
						const event = this.getSelectedEvent();
						if (!event) return;

						const actionIndex = this.selectActions.getSelectedIndex();
						if (actionIndex < 0 || actionIndex == 0) return;

						event.actions.splice(actionIndex-1, 0, event.actions.splice(actionIndex, 1)[0]);

						this.updateSelectActions();
						this.selectActions.setSelectedIndex(actionIndex-1);
						this.updateActionsMenu();
					}) );

					this.buttonActionDown = add( new HButton("▼", () => {
						const event = this.getSelectedEvent();
						if (!event) return;

						const actionIndex = this.selectActions.getSelectedIndex();
						if (actionIndex < 0 || actionIndex == event.actions.length-1) return;

						event.actions.splice(actionIndex+1, 0, event.actions.splice(actionIndex, 1)[0]);

						this.updateSelectActions();
						this.selectActions.setSelectedIndex(actionIndex+1);
						this.updateActionsMenu();
					}) );

					endparent();

				parent( add( new HElement("div") ) ); // Libraries area

					this.librariesTabControl = add( new HTabControl() );

					this.editor.libraries.forEach(library => {
						parent( this.librariesTabControl.addTab(library.name, (library.name == this.editor.preferences.get("defaultActionLibraryTab"))) );

							let nextClass = null;

							parent( add( new HElement("div", {class: "grid-action-types"}) ) );

								library.items.forEach(actionType => {
									if (actionType.kind == "label") {
										add( new HElement("div", {class: "label"}, actionType.name) );
									} else if (actionType.kind == "separator") {
										nextClass = "new-row";
									} else {
										// TODO add images to the buttons
										const actionTypeButton = add( new HButton(null, () => {
											const event = this.getSelectedEvent();
											if (!event) {
												alert("You need to select or add an event before you can add actions.");
												return;
											}

											const action = new ProjectAction();
											action.typeLibrary = library.name;
											action.typeId = actionType.id;
											action.typeKind = actionType.kind;
											action.typeExecution = actionType.execution;
											action.typeExecutionFunction = actionType.executionFunction;
											action.typeExecutionCode = actionType.executionCode;
											action.typeIsQuestion = actionType.isQuestion;

											action.appliesTo = -1;
											action.relative = false;
											action.not = false;

											if (actionType.kind == "normal" && actionType.interfaceKind == "normal") {
												// If kind and interface are normal, arguments come from the action type itself
												action.args = actionType.args.map(typeArg => {
													const actionArg = new ProjectActionArg();
													actionArg.kind = typeArg.kind;
													actionArg.value = typeArg.default;
													return actionArg;
												});
											} else {
												// Otherwise, the arguments come from a predefined list
												action.args = this.getActionTypeInfo()
													.find(x => x.kind == actionType.kind && x.interfaceKind == actionType.interfaceKind)
													.args.map(typeArg => {
														const actionArg = new ProjectActionArg();
														actionArg.kind = typeArg.kind;
														actionArg.value = typeArg.default;
														return actionArg;
													});
											}

											this.openActionWindow(action);

											event.actions.push(action);

											this.updateSelectActions();
											this.selectActions.setSelectedIndex(event.actions.length-1);
											this.updateActionsMenu();
										}, "action-type") );

										if (nextClass) {
											actionTypeButton.html.classList.add(nextClass);
											nextClass = null;
										}

										actionTypeButton.html.title = actionType.description;

										if (actionType.image) {
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

			// Add initial events
			this.sortEvents();
			this.updateSelectEvents();
			this.selectEvents.setSelectedIndex(0);
			this.updateEventsMenu();

			// Add initial subtypes
			this.updateDivEventSubtype();

			// Select first event
			this.updateSelectActions();
			this.updateActionsMenu();

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(object, inputName.getValue());
					this.editor.changeObjectSprite(object, this.selectSprite.getValue());
					object.visible = inputVisible.getChecked();
					object.solid = inputSolid.getChecked();
					object.depth = parseInt(inputDepth.getValue());
					object.persistent = inputPersistent.getChecked();
					this.htmlActionWindows.forEach(w => {
						w.apply();
					});

					object.events = this.paramEvents;

					// Make sure that paramEvents is a copy
					this.copyProperties();
				},
				() => {
					this.close();
				},
			);
			endparent();
	}

	onAdd() {
		this.listeners = this.editor.dispatcher.listen({
			changeResourceName: i => {
				this.updateSelectEvents();
				this.updateSelectActions();
			},
		});
	}

	onRemove() {
		this.editor.dispatcher.stopListening(this.listeners);
	}

	// Make a copy of every property of the resource so we can change it at will without changing the original resource.
	copyProperties() {
		this.paramEvents = this.object.events.map(event => new ProjectEvent(event));
	}

	sortEvents() {
		this.paramEvents.sort((a, b) => {
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
			this.paramEvents.forEach(event => {
				add( new HOption(Events.getEventName(event, this.editor.project), event.getNameId()) );
			});
			endparent();

		this.selectEvents.setSelectedIndex(Math.min(index, this.paramEvents.length-1));
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

	updateDivEventSubtype() {
		removeChildren(this.divEventSubtype);

		const eventType = this.selectEventType.getValue();

		parent(this.divEventSubtype);

			this.subtypeValueFunction = null;

			if (eventType == "step") {
				const subtypeElement = add( new HSelectWithOptions("Step:", Events.listStepSubtypes));
				this.subtypeValueFunction = () => subtypeElement.getValue();
			} else

			if (eventType == "alarm") {
				const subtypeElement = add( new HNumberInput("Alarm:", 0, 1, 0, 11) );
				this.subtypeValueFunction = () => (parseInt(subtypeElement.getValue()));
			} else

			if (eventType == "keyboard" || eventType == "keypress" || eventType == "keyrelease") {
				const subtypeElement = add( new HNumberInput("Key:", 0, 1, 0) );
				this.subtypeValueFunction = () => (parseInt(subtypeElement.getValue()));
			} else

			if (eventType == "mouse") {
				const subtypeElement = add( new HSelectWithOptions("Mouse:", Events.listMouseSubtypes));
				this.subtypeValueFunction = () => (parseInt(subtypeElement.getValue()));
			} else

			if (eventType == "collision") {
				this.selectCollisionObject = add( new HResourceSelect(this.editor, "Object:", ProjectObject, true) );
				this.subtypeValueFunction = () => (parseInt(this.selectCollisionObject.getValue()));
			} else

			if (eventType == "other") {
				const subtypeElement = add( new HSelectWithOptions("Other:", Events.listOtherSubtypes));
				this.subtypeValueFunction = () => (parseInt(subtypeElement.getValue()));
			}

			endparent();
	}

	updateSelectActions() {
		const index = this.selectActions.getSelectedIndex();
		this.selectActions.removeOptions();

		const event = this.getSelectedEvent();

		if (event) {
			parent(this.selectActions.select);
				event.actions.forEach((action, i) => {
					const actionType = this.editor.getActionType(action);
					const listText = this.getActionListText(action, actionType);
					const hintText = this.getActionHintText(action, actionType);

					const option = add( new HOption(
						(this.editor.preferences.get("hintTextInAction") ? hintText.text : listText.text), // text
						null, // value
						(listText.bold ? "bold " : "") + (listText.italic ? "italic " : ""), // class
					) );
					option.html.title = hintText.text;
				});
				endparent();

			this.selectActions.setSelectedIndex(Math.min(index, event.actions.length-1));
		}

		this.updateActionsMenu();
	}

	updateActionsMenu() {
		const event = this.getSelectedEvent();

		if (this.selectActions.getSelectedIndex() < 0) {
			this.buttonActionEdit.setDisabled(true);
			this.buttonActionDelete.setDisabled(true);
			this.buttonActionUp.setDisabled(true);
			this.buttonActionDown.setDisabled(true);
		} else {
			this.buttonActionEdit.setDisabled(false);
			this.buttonActionDelete.setDisabled(false);
			this.buttonActionUp.setDisabled(this.selectActions.getSelectedIndex() == 0);
			this.buttonActionDown.setDisabled(this.selectActions.getSelectedIndex() == event.actions.length-1);
		}
	}

	getSelectedEvent() {
		return this.paramEvents.find(event => this.selectEvents.getValue() == event.getNameId());
	}

	getActionTypeInfo() {
		return [
			{kind: "normal", interfaceKind: "none", args: []},
			{kind: "normal", interfaceKind: "normal", htmlclass: HWindowAction},
			{kind: "normal", interfaceKind: "arrows", htmlclass: HWindowAction, args: [
				{name: "Directions:", kind: "string", default: "000000000"},
				{name: "Speed:", kind: "expression", default: "0"},
			]},
			{kind: "normal", interfaceKind: "code", htmlclass: HWindowCode, args: [
				{kind: "string", default: ""},
			]},
			{kind: "normal", interfaceKind: "text", htmlclass: HWindowCode, args: [
				{kind: "string", default: ""},
			]},
			{kind: "repeat", htmlclass: HWindowAction, hasApplyTo: false, args: [
				{name: "times:", kind: "expression", default: "1"},
			]},
			{kind: "variable", htmlclass: HWindowAction, hasApplyTo: true, hasRelative: true, args: [
				{name: "variable:", kind: "string", default: ""},
				{name: "value:", kind: "expression", default: "0"},
			]},
			{kind: "code", htmlclass: HWindowCode, hasApplyTo: true, args: [
				{kind: "string", default: ""},
			]},
			{kind: "begin", args: []},
			{kind: "end", args: []},
			{kind: "else", args: []},
			{kind: "exit", args: []},
		];
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
						const resourceType = this.constructor.actionArgResourceTypes[actionArg.kind];
						if (!resourceType) throw new Error("Impossible action arg kind "+actionArg.kind);
						const resource = this.editor.project.resources[resourceType.getClassName()].find(x => x.id == actionArg.value);
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
					const resource = this.editor.project.resources.ProjectObject.find(x => x.id == action.appliesTo);
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

		const actionTypeInfo = this.getActionTypeInfo();
		const actionTypeInfoItem = actionTypeInfo.find(x => x.kind == actionType.kind && x.interfaceKind == actionType.interfaceKind);

		if (actionTypeInfoItem.htmlclass) {
			let w = this.editor.windowsArea.getId(action);
			if (w) {
				this.editor.windowsArea.focus(action);
			} else {
				w = this.editor.windowsArea.open(actionTypeInfoItem.htmlclass, action, action, this);
				this.htmlActionWindows.push(w);
			}
		}
	}

	deleteActionWindow(id) {
		const index = this.htmlActionWindows.findIndex(x => x.id == id);
		if (index >= 0) {
			this.htmlActionWindows[index].close();
			this.htmlActionWindows.splice(index, 1);
		}
	}

	close() {
		super.close();
		this.htmlActionWindows.forEach(w => {
			w.close();
		});
		this.htmlActionWindows = [];
	}
}