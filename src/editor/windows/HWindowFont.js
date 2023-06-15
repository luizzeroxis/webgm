import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HButton, HTextInput, HNumberInput, HCheckBoxInput} from "~/common/h";
import {ProjectFont} from "~/common/project/ProjectProperties.js";
import {setDeepOnUpdateOnElement} from "~/common/tools.js";

export default class HWindowFont extends HWindow {
	constructor(manager, editor, resource) {
		super(manager);
		this.editor = editor;
		this.resource = resource;

		this.modified = false;
		this.copyData();

		this.updateTitle();

		parent(this.client);
			parent( add( new HElement("div", {class: "window-font"}) ) );

				this.inputName = add( new HTextInput("Name:", this.resource.name) );
				this.inputFont = add( new HTextInput("Font:", this.resource.font) );
				this.inputSize = add( new HNumberInput("Size", this.resource.size, 1, 1) );
				this.inputBold = add( new HCheckBoxInput("Bold", this.resource.bold) );
				this.inputItalic = add( new HCheckBoxInput("Italic", this.resource.italic) );

				this.divPreview = add( new HElement("div", {class: "preview"}, "AaBbCcDd") );

				this.inputFont.input.html.addEventListener("input", () => this.updatePreview());
				this.inputSize.input.html.addEventListener("input", () => this.updatePreview());
				this.inputBold.input.html.addEventListener("input", () => this.updatePreview());
				this.inputItalic.input.html.addEventListener("input", () => this.updatePreview());

				add( new HButton("OK", () => {
					this.modified = false;
					this.close();
				}) );

				this.updatePreview();

				endparent();
			endparent();

		setDeepOnUpdateOnElement(this.client, () => this.onUpdate());
	}

	copyData() {
		this.resourceCopy = new ProjectFont(this.resource);
	}

	saveData() {
		this.editor.project.changeResourceName(this.resource, this.inputName.getValue());
		this.updateTitle();

		this.resource.font = this.inputFont.getValue();
		this.resource.size = parseInt(this.inputSize.getValue());
		this.resource.bold = this.inputBold.getChecked();
		this.resource.italic = this.inputItalic.getChecked();
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
		this.setTitle("Font Properties: "+this.resource.name);
	}

	updatePreview() {
		this.divPreview.html.style.fontFamily = this.inputFont.getValue();
		this.divPreview.html.style.fontSize = this.inputSize.getValue() + "pt";
		this.divPreview.html.style.fontWeight = (this.inputBold.getChecked() ? "bold" : null);
		this.divPreview.html.style.fontStyle = (this.inputItalic.getChecked() ? "italic" : null);
	}

	close() {
		if (this.modified) {
			if (!confirm(`Close without saving the changes to ${this.resource.name}?`)) return;
			this.restoreData();
		}
		super.close();
	}
}