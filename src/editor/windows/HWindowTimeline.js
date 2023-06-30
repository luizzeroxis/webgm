import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HButton, HTextInput, HSelect, HOption} from "~/common/h";
import {ProjectTimeline, ProjectTimelineMoment} from "~/common/project/ProjectProperties.js";
import {setDeepOnUpdateOnElement} from "~/common/tools.js";
import HActionLibraries from "~/editor/HActionLibraries.js";

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

							this.onUpdate();
						}) );

						add( new HButton("Change", () => {

						}) );
						endparent();

					parent( add( new HElement("div") ) );
						add( new HButton("Delete", () => {
							const index = this.resource.moments.findIndex(moment => this.selectMoments.getValue() == moment.step);
							if (index < 0) return;

							// TODO check actions
							// TODO close action windows

							this.resource.events.splice(index, 1);

							this.updateSelectMoments();

							this.onUpdate();
						}) );

						add( new HButton("Clear", () => {

						}) );
						endparent();

					parent( add( new HElement("div") ) );
						add( new HButton("Shift", () => {

						}) );

						add( new HButton("Duplicate", () => {

						}) );
						endparent();

					parent( add( new HElement("div") ) );
						add( new HButton("Spread", () => {

						}) );

						add( new HButton("Merge", () => {

						}) );
						endparent();

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

					endparent();

				parent( add( new HElement("div", {class: "actions"}) ) );

					this.selectActions = add( new HSelect("Actions:", "actions-list") );
					this.selectActions.select.html.size = 2;
					this.selectActions.select.html.multiple = true;

					endparent();

				parent( add( new HElement("div", {class: "libraries"}) ) );

					add( new HActionLibraries(this.editor, action => {

					}) );

					endparent();

				endparent();

			endparent();

		setDeepOnUpdateOnElement(this.divProperties, () => this.onUpdate());
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
		return this.resource.moments.find(moment => this.selectMoments.getValue() == moment.step);
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