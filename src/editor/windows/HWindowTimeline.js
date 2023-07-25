import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HButton, HTextInput, HSelect, HOption} from "~/common/h";
import {ProjectTimeline, ProjectTimelineMoment} from "~/common/project/ProjectProperties.js";
import {setDeepOnUpdateOnElement} from "~/common/tools.js";
import HActionsEditor from "~/editor/HActionsEditor.js";

export default class HWindowTimeline extends HWindow {
	constructor(manager, editor, resource) {
		super(manager);
		this.editor = editor;
		this.resource = resource;

		this.modified = false;
		this.copyData();

		this.updateTitle();

		parent(this.client);
			parent( add( new HElement("div", {class: "panel-container window-timeline"}) ) );

				this.divProperties = parent( add( new HElement("div", {class: "properties"}) ) );

					this.inputName = add( new HTextInput("Name:", this.resource.name) );

					parent( add( new HElement("div") ) );
						add( new HButton("Add", () => {
							const step = parseInt(prompt("Indicate the moment:", (this.getSelectedMoment()?.step ?? -1) + 1));
							if (Number.isNaN(step) || step < 0) return;

							if (this.resource.moments.find(moment => moment.step == step)) {
								this.selectMoments.setValue(step);
								return;
							}

							const moment = new ProjectTimelineMoment();
							moment.step = step;
							this.resource.moments.push(moment);

							this.updateSelectMoments();
							this.selectMoments.setValue(step);

							this.actionsEditor.updateActions(moment.actions);

							this.onUpdate();
						}) );

						add( new HButton("Change", () => {
							const moment = this.getSelectedMoment();
							if (!moment) return;

							const step = parseInt(prompt("Indicate new moment:", moment.step));
							if (Number.isNaN(step) || step < 0) return;

							moment.step = step;

							this.updateSelectMoments();

							this.onUpdate();
						}) );
						endparent();

					parent( add( new HElement("div") ) );
						add( new HButton("Delete", () => {
							const moment = this.getSelectedMoment();

							const stepFrom = parseInt(prompt("From moment:", moment?.step ?? 0));
							if (Number.isNaN(stepFrom) || stepFrom < 0) return;
							const stepTill = parseInt(prompt("Till moment:", stepFrom));
							if (Number.isNaN(stepTill) || stepTill < 0) return;

							this.resource.moments = this.resource.moments.filter(moment => {
								if (moment.step < stepFrom || moment.step > stepTill) {
									return true;
								} else {
									moment.actions.forEach(action => {
										this.actionsEditor.closeActionWindow(action);
									});
									return false;
								}
							});

							this.updateSelectMoments();

							this.actionsEditor.updateActions(this.getSelectedMoment()?.actions);

							this.onUpdate();
						}) );

						add( new HButton("Clear", () => {
							if (confirm("Are you sure you want to remove all moments?")) {
								this.resource.moments = [];

								this.updateSelectMoments();

								this.actionsEditor.updateActions(this.getSelectedMoment()?.actions);

								this.onUpdate();
							}
						}) );
						endparent();

					// parent( add( new HElement("div") ) );
					// 	add( new HButton("Shift", () => {

					// 	}) );

					// 	add( new HButton("Duplicate", () => {

					// 	}) );
					// 	endparent();

					// parent( add( new HElement("div") ) );
					// 	add( new HButton("Spread", () => {

					// 	}) );

					// 	add( new HButton("Merge", () => {

					// 	}) );
					// 	endparent();

					parent( add( new HElement("div") ) );
						add( new HButton("OK", () => {
							this.modified = false;
							this.close();
						}) );
						endparent();

					endparent();

				parent( add( new HElement("div", {class: "moments"}) ) );

					this.selectMoments = add( new HSelect("Moments:", "moments-list") );
					this.selectMoments.select.html.size = 2;

					this.selectMoments.setOnChange(() => {
						this.actionsEditor.updateActions(this.getSelectedMoment()?.actions);
					});

					this.updateSelectMoments();

					endparent();

				this.actionsEditor = add(new HActionsEditor(this.editor, this, actions => {
					const moment = this.getSelectedMoment();
						if (!moment) return;

						moment.actions = actions;
						this.onUpdate();
				}, "a moment"));

				endparent();

			endparent();

		this.updateSelectMoments();
		this.selectMoments.setSelectedIndex(0);

		this.actionsEditor.updateActions(this.getSelectedMoment()?.actions);

		setDeepOnUpdateOnElement(this.divProperties, () => this.onUpdate());
	}

	onAdd() {
		super.onAdd();

		this.listeners = this.editor.project.dispatcher.listen({
			changeResourceName: () => {
				this.updateSelectMoments();
				this.actionsEditor.updateActions();
			},
		});
	}

	onRemove() {
		this.editor.project.dispatcher.stopListening(this.listeners);
	}

	copyData() {
		this.resourceCopy = new ProjectTimeline(this.resource);
	}

	saveData() {
		this.editor.project.changeResourceName(this.resource, this.inputName.getValue());
		this.updateTitle();
	}

	restoreData() {
		Object.assign(this.resource, this.resourceCopy);

		this.editor.project.changeResourceName(this.resource, this.resourceCopy.name);
		this.updateTitle();
	}

	onUpdate() {
		this.modified = true;
		this.saveData();
	}

	updateTitle() {
		this.setTitle("Time Line Properties: "+this.resource.name);
	}

	getSelectedMoment() {
		return this.resource.moments.find(moment => this.selectMoments.getValue() == moment.step.toString());
	}

	updateSelectMoments() {
		// Sort
		this.resource.moments.sort((a, b) => {
			return a.step - b.step;
		});

		const index = this.selectMoments.getSelectedIndex();
		this.selectMoments.removeOptions();

		parent( this.selectMoments.select );
			this.resource.moments.forEach(moment => {
				add( new HOption(`Step ${moment.step}`, moment.step) );
			});
			endparent();

		this.selectMoments.setSelectedIndex(Math.min(index, this.resource.moments.length-1));
	}

	close() {
		if (this.modified) {
			if (!confirm(`Close without saving the changes to ${this.resource.name}?`)) return;
			this.restoreData();
		}
		super.close();
	}
}