import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HButton, HTextInput, HImage} from "~/common/h";
import ImageWrapper from "~/common/ImageWrapper.js";
import {ProjectBackground} from "~/common/project/ProjectProperties.js";
import {openFile, setDeepOnUpdateOnElement, setOnFileDrop} from "~/common/tools.js";

export default class HWindowBackground extends HWindow {
	constructor(manager, editor, resource) {
		super(manager);
		this.editor = editor;
		this.resource = resource;

		this.modified = false;
		this.copyData();

		this.updateTitle();

		parent(this.client);
			parent( add( new HElement("div", {class: "panel-container window-background"}) ) );
				parent( add( new HElement("div", {class: "properties"}) ) );

					this.inputName = add( new HTextInput("Name:", this.resource.name) );

					this.buttonLoadBackground = add( new HButton("Load Background", async () => {
						const file = await openFile("image/*");
						this.loadBackgroundFromFile(file);
					}) );

					parent( add( new HElement("div", {}, "Width: ")) );
						this.divWidth = add( new HElement("span", {}, "0") );
						endparent();

					parent( add( new HElement("div", {}, "Height: ")) );
						this.divHeight = add( new HElement("span", {}, "0") );
						endparent();

					add( new HButton("OK", () => {
						this.modified = false;
						this.close();
					}) );

					endparent();

				parent( add( new HElement("div", {class: "preview"}) ) );
					this.imgBackground = add( new HImage() );
					endparent();

				this.updateImageInfo();

				endparent();
			endparent();

		setDeepOnUpdateOnElement(this.client, () => this.onUpdate());

		// Open file if dropped in the window body
		setOnFileDrop(this.html, file => this.loadBackgroundFromFile(file));
	}

	copyData() {
		this.resourceCopy = new ProjectBackground(this.resource);
	}

	saveData() {
		this.editor.project.changeResourceName(this.resource, this.inputName.getValue());
		this.updateTitle();

		this.editor.project.changeBackgroundImage(this.resource, this.resource.image);
	}

	restoreData() {
		Object.assign(this.resource, this.resourceCopy);

		this.editor.project.changeResourceName(this.resource, this.resourceCopy.name);
		this.updateTitle();

		this.editor.project.changeBackgroundImage(this.resource, this.resourceCopy.image);
	}

	onUpdate() {
		this.modified = true;
		this.saveData();
	}

	updateTitle() {
		this.setTitle("Background Properties: "+this.resource.name);
	}

	loadBackgroundFromFile(file) {
		this.buttonLoadBackground.setDisabled(true);

		const image = new ImageWrapper(file);

		image.promise
		.then(() => {
			this.resource.image = image;
			this.updateImageInfo();
			this.onUpdate();
		})
		.catch(() => {
			// this.updateImageInfo();
			alert("Error when opening image");
		})
		.finally(() => {
			this.buttonLoadBackground.setDisabled(false);
		});
	}

	updateImageInfo() {
		if (this.resource.image != null) {
			this.imgBackground.setSrc(this.resource.image.src);
			this.resource.image.promise.then(() => {
				this.divWidth.html.textContent = this.resource.image.width;
				this.divHeight.html.textContent = this.resource.image.height;
			});
		} else {
			this.imgBackground.setSrc(null);
			this.divWidth.html.textContent = "0";
			this.divHeight.html.textContent = "0";
		}
	}

	close() {
		if (this.modified) {
			if (!confirm(`Close without saving the changes to ${this.resource.name}?`)) return;
			this.restoreData();
		}
		super.close();
	}
}