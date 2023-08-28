import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HButton, HMultilineTextInput} from "~/common/h";
import {ProjectGameInformation} from "~/common/project/ProjectProperties.js";
import {setDeepOnUpdateOnElement} from "~/common/tools.js";

export default class HGameInformationEditorWindow extends HWindow {
	constructor(manager, editor, resource) {
		super(manager);
		this.editor = editor;
		this.resource = resource;

		this.modified = false;
		this.copyData();

		this.setTitle("Game Information");

		parent(this.client);
			parent( add( new HElement("div", {class: "window-game-information"}) ) );

				parent( add( new HElement("div") ) );
					add( new HButton("OK", () => {
						this.modified = false;
						this.close();
					}) );
					endparent();

				this.inputText = add( new HMultilineTextInput(null, this.resource.text) );
				endparent();
			endparent();

		setDeepOnUpdateOnElement(this.client, () => this.onUpdate());
	}

	copyData() {
		this.resourceCopy = new ProjectGameInformation(this.resource);
	}

	saveData() {
		this.resource.text = this.inputText.getValue();
	}

	restoreData() {
		Object.assign(this.resource, this.resourceCopy);
	}

	onUpdate() {
		this.modified = true;
		this.saveData();
	}

	close() {
		if (this.modified) {
			if (!confirm("Close without saving the changes to game information?")) return;
			this.restoreData();
		}
		super.close();
	}
}