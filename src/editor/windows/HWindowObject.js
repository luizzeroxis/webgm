import HWindow from "~/common/components/HWindowManager/HWindow.js";
import Events from "~/common/Events.js";
import { parent, endparent, add, HElement, HButton, HTextInput, HNumberInput, HCheckBoxInput, HSelect, HOption } from "~/common/h";
import {
	ProjectSprite, ProjectObject, ProjectEvent,
} from "~/common/project/ProjectProperties.js";
import { setDeepOnUpdateOnElement } from "~/common/tools.js";
import HActionsEditor from "~/editor/HActionsEditor.js";
import HResourceSelect from "~/editor/HResourceSelect.js";

import HEventChooserWindow from "./HEventChooserWindow.js";

export default class HWindowObject extends HWindow {
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
						this.actionsEditor.updateActions(this.getSelectedEvent()?.actions);
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

							this.actionsEditor.updateActions(event.actions);

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
									this.actionsEditor.closeActionWindow(action);
								});

								this.resource.events.splice(index, 1);

								this.updateSelectEvents();
								this.updateEventsMenu();

								this.actionsEditor.updateActions(this.getSelectedEvent()?.actions);

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

								this.onUpdate();
							}) );
							endparent();

						endparent();

					endparent();

				this.actionsEditor = add(new HActionsEditor(this.editor, this, actions => {
					const event = this.getSelectedEvent();
					if (!event) return;

					event.actions = actions;
					this.onUpdate();
				}, "an event"));

				endparent();

			// Add initial events
			this.sortEvents();
			this.updateSelectEvents();
			this.selectEvents.setSelectedIndex(0);
			this.updateEventsMenu();

			// Select first event
			this.actionsEditor.updateActions(this.getSelectedEvent()?.actions);

			endparent();

		setDeepOnUpdateOnElement(this.divProperties, () => this.onUpdate());
	}

	onAdd() {
		super.onAdd();

		this.listeners = this.editor.project.dispatcher.listen({
			changeResourceName: () => {
				this.updateSelectEvents();
				this.actionsEditor.updateActions();
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

	getSelectedEvent() {
		return this.resource.events.find(event => this.selectEvents.getValue() == event.getNameId());
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