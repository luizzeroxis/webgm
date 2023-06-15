import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HButton, HTextInput} from "~/common/h";
import {ProjectTimeline} from "~/common/project/ProjectProperties.js";
import {setDeepOnUpdateOnElement} from "~/common/tools.js";

export default class HWindowTimeline extends HWindow {
	constructor(manager, editor, resource) {
		super(manager);
		this.editor = editor;
		this.resource = resource;

		this.modified = false;
		this.copyData();

		this.updateTitle();

		parent(this.client);
			parent( add( new HElement("div", {class: "window-timeline"}) ) );
				parent( add( new HElement("div") ) );

					this.inputName = add( new HTextInput("Name:", this.resource.name) );

					add( new HButton("OK", () => {
						this.modified = false;
						this.close();
					}) );

					endparent();
				endparent();
			endparent();

		setDeepOnUpdateOnElement(this.client, () => this.onUpdate());
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

	close() {
		if (this.modified) {
			if (!confirm(`Close without saving the changes to ${this.resource.name}?`)) return;
			this.restoreData();
		}
		super.close();
	}
}