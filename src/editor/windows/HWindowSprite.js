import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HButton, HTextInput, HNumberInput, HImage, HCheckBoxInput} from "~/common/h";
import ImageWrapper from "~/common/ImageWrapper.js";
import {ProjectSprite} from "~/common/project/ProjectProperties.js";
import {openFile, setDeepOnUpdateOnElement, setOnFileDrop} from "~/common/tools.js";

import HWindowSpriteImages from "./HWindowSpriteImages.js";
import HWindowSpriteMask from "./HWindowSpriteMask.js";

export default class HWindowSprite extends HWindow {
	constructor(manager, editor, resource) {
		super(manager);
		this.editor = editor;
		this.resource = resource;

		this.modified = false;
		this.copyData();

		this.updateTitle();

		parent(this.client);
			parent( add( new HElement("div", {class: "panel-container window-sprite"}) ) );
				parent( add( new HElement("div", {class: "properties"}) ) );

					this.inputName = add( new HTextInput("Name:", this.resource.name) );

					parent( add( new HElement("div") ) );
						this.buttonLoadSprite = add( new HButton("Load Sprite", async () => {
							const files = await openFile("image/*", true);
							this.setImagesFromFiles(files);
						}) );
						endparent();

					parent( add( new HElement("div") ) );
						add( new HButton("Edit Sprite", () => {
							this.openAsChild(HWindowSpriteImages, w => w.spriteWindow == this, this);
						}) );
						endparent();

					parent( add( new HElement("div", {}, "Width: ")) );
						this.divWidth = add( new HElement("span") );
						endparent();

					parent( add( new HElement("div", {}, "Height: ")) );
						this.divHeight = add( new HElement("span") );
						endparent();

					parent( add( new HElement("div", {}, "Number of subimages: ")) );
						this.divSubimages = add( new HElement("span") );
						endparent();

					this.showSubimage = 0;

					parent( add( new HElement("div", {}, "Show: ")) );

						this.buttonShowSubimageLeft = add( new HButton("◀", () => {
							this.showSubimage -= 1;
							this.updateShow();
						}) );
						this.divShowSubimage = add( new HElement("span") );
						this.buttonShowSubimageRight = add( new HButton("▶", () => {
							this.showSubimage += 1;
							this.updateShow();
						}) );

						endparent();

					parent( add( new HElement("fieldset") ) );

						add( new HElement("legend", {}, "Origin") );

						parent( add( new HElement("div", {class: "origin-x-y"})) );
							this.inputOriginX = add( new HNumberInput("X:", this.resource.originx, 1, 0) );
							this.inputOriginY = add( new HNumberInput("Y:", this.resource.originy, 1, 0) );
							endparent();

						add( new HButton("Center", () => {
							let w=16, h=16;
							if (this.resource.images.length > 0) {
								w = Math.floor(this.resource.images[0].width / 2);
								h = Math.floor(this.resource.images[0].height / 2);
							}
							this.inputOriginX.setValue(w);
							this.inputOriginY.setValue(h);
							this.onUpdate();
						}) );

						endparent();

					add( new HButton("OK", () => {
						this.modified = false;
						this.close();
					}) );

					endparent();

				parent( add( new HElement("div", {class: "mask"}) ) );
					parent( add( new HElement("fieldset") ) );
						add( new HElement("legend", {}, "Collision Checking") );

						this.inputPreciseCollisionChecking = add( new HCheckBoxInput("Precise collision checking", (this.resource.shape == "precise")) );
						this.inputPreciseCollisionChecking.input.html.indeterminate = (this.resource.shape != "precise" && this.resource.shape != "rectangle");

						this.inputSeparateCollisionMasks = add( new HCheckBoxInput("Separate collision masks", this.resource.separateCollisionMasks) );

						const isModified = () => (
							this.resource.alphaTolerance != 0
							|| this.resource.boundingBox != "automatic"
							|| (this.resource.shape != "precise" && this.resource.shape != "rectangle")
						);

						this.divMaskModified = add( new HElement("div", {}, isModified() ? "Modified" : "\u200B") );

						add( new HButton("Modify Mask", async () => {
							await this.editor.windowManager.openModal(HWindowSpriteMask, this).promise;

							// Update UI beforehand so saveData() doesn't override it
							this.inputPreciseCollisionChecking.setChecked((this.resource.shape == "precise"));
							this.inputPreciseCollisionChecking.input.html.indeterminate = (this.resource.shape != "precise" && this.resource.shape != "rectangle");

							this.inputSeparateCollisionMasks.setChecked(this.resource.separateCollisionMasks);

							this.divMaskModified.html.textContent = isModified() ? "Modified" : "\u200B";

							this.onUpdate();
						}) );

						endparent();
					endparent();

				parent( add( new HElement("div", {class: "preview"}) ) );
					this.imgSprite = add( new HImage() );
					endparent();

				this.updateImageInfo();

				endparent();

			endparent();

		setDeepOnUpdateOnElement(this.client, () => this.onUpdate());

		// Open file if dropped in the window body
		setOnFileDrop(this.html, files => this.setImagesFromFiles(files), true);
	}

	copyData() {
		this.resourceCopy = new ProjectSprite(this.resource);
	}

	saveData() {
		this.editor.project.changeResourceName(this.resource, this.inputName.getValue());
		this.updateTitle();

		this.editor.project.changeSpriteImages(this.resource, this.resource.images);
		this.editor.project.changeSpriteOrigin(this.resource, parseInt(this.inputOriginX.getValue()), parseInt(this.inputOriginY.getValue()));

		if (!this.inputPreciseCollisionChecking.input.html.indeterminate) {
			this.resource.shape = this.inputPreciseCollisionChecking.getChecked() ? "precise" : "rectangle";
		}
		this.resource.separateCollisionMasks = this.inputSeparateCollisionMasks.getChecked();

		// this.resource.alphaTolerance = 0;
		// this.resource.boundingBox = "automatic";
		// this.resource.bbLeft = 0;
		// this.resource.bbTop = 0;
		// this.resource.bbRight = 0;
		// this.resource.bbBottom = 0;

		this.resource.updateMaskProperties();
	}

	restoreData() {
		Object.assign(this.resource, this.resourceCopy);

		this.editor.project.changeResourceName(this.resource, this.resourceCopy.name);
		this.updateTitle();

		this.editor.project.changeSpriteImages(this.resource, this.resourceCopy.images);
		this.editor.project.changeSpriteOrigin(this.resource, this.resourceCopy.originx, this.resourceCopy.originy);
	}

	onUpdate() {
		this.modified = true;
		this.saveData();
	}

	updateTitle() {
		this.setTitle("Sprite Properties: "+this.resource.name);
	}

	loadImagesFromFiles(files) {
		const images = [];

		for (const file of files) {
			images.push(new ImageWrapper(file));
		}

		return Promise.all(images.map(x => x.promise));
	}

	setImagesFromFiles(files) {
		for (const child of this.windowChildren) {
			child.forceClose();
		}

		this.buttonLoadSprite.setDisabled(true);

		this.loadImagesFromFiles(files)
		.then(images => {
			this.resource.images = images;
			this.updateImageInfo();
			this.onUpdate();
		})
		.catch(e => {
			if (e.message == "Could not load image") {
				alert("Error when opening image");
			}
			throw e;
		})
		.finally(() => {
			this.buttonLoadSprite.setDisabled(false);
		});
	}

	updateImageInfo() {
		this.showSubimage = 0;

		if (this.resource.images.length > 0) {
			this.resource.images[0].promise.then(() => {
				this.divWidth.html.textContent = this.resource.images[0].width;
				this.divHeight.html.textContent = this.resource.images[0].height;
			});
		} else {
			this.imgSprite.setSrc(null);
			this.divWidth.html.textContent = "32";
			this.divHeight.html.textContent = "32";
		}

		this.divSubimages.html.textContent = this.resource.images.length.toString();

		this.updateShow();
	}

	updateShow() {
		if (this.resource.images.length > 0) {
			this.imgSprite.setSrc(this.resource.images[this.showSubimage].src);
		}

		this.divShowSubimage.html.textContent = this.showSubimage.toString();
		this.buttonShowSubimageLeft.setDisabled(this.showSubimage == 0);
		this.buttonShowSubimageRight.setDisabled(this.showSubimage >= this.resource.images.length - 1);
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