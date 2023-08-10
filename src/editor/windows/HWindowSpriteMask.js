import HModalWindow from "~/common/components/HWindowManager/HModalWindow.js";
import {parent, endparent, add, HElement, HButton, HNumberInput, HCheckBoxInput, HRadioInput, HRangeInput, HCanvas, uniqueID} from "~/common/h";
import {ProjectSprite} from "~/common/project/ProjectProperties.js";
import {setDeepOnUpdateOnElement} from "~/common/tools.js";

export default class HWindowSpriteMask extends HModalWindow {
	constructor(manager, spriteWindow) {
		super(manager);
		this.spriteWindow = spriteWindow;
		this.resource = spriteWindow.resource;

		this.modified = false;
		this.copyData();

		this.updateTitle();

		parent(this.client);
			parent( add( new HElement("div", {class: "panel-container window-sprite-mask"}) ) );
				parent( add( new HElement("div", {class: "properties"}) ) );

					parent( add( new HElement("fieldset") ) );
						add( new HElement("legend", {}, "Image") );

						this.inputShowCollisionMask = add( new HCheckBoxInput("Show collision mask", true) );
						endparent();

					parent( add( new HElement("fieldset") ) );
						add( new HElement("legend", {}, "General") );

						this.inputSeparateCollisionMasks = add( new HCheckBoxInput("Separate collision masks", this.resource.separateCollisionMasks) );
						this.inputAlphaTolerance = add( new HRangeInput("Alpha Tolerance:", this.resource.alphaTolerance, 1, 0, 255) );
						endparent();

					parent( add( new HElement("fieldset") ) );
						add( new HElement("legend", {}, "Bounding Box") );

						const bbGroup = "_radio_"+uniqueID();
						this.radioBBAutomatic = add( new HRadioInput(bbGroup, "Automatic", (this.resource.boundingBox == "automatic")) );
						this.radioBBFullImage = add( new HRadioInput(bbGroup, "Full image", (this.resource.boundingBox == "fullimage")) );
						this.radioBBManual = add( new HRadioInput(bbGroup, "Manual", (this.resource.boundingBox == "manual")) );

						this.inputBBLeft = add( new HNumberInput("Left", this.resource.bbLeft) );
						this.inputBBTop = add( new HNumberInput("Top", this.resource.bbTop) );
						this.inputBBRight = add( new HNumberInput("Right", this.resource.bbRight) );
						this.inputBBBottom = add( new HNumberInput("Bottom", this.resource.bbBottom) );

						this.updateBBInputs();
						endparent();

					parent( add( new HElement("fieldset") ) );
						add( new HElement("legend", {}, "Shape") );

						const shapeGroup = "_radio_"+uniqueID();
						this.radioShapePrecise = add( new HRadioInput(shapeGroup, "Precise", (this.resource.shape == "precise")) );
						this.radioShapeRectangle = add( new HRadioInput(shapeGroup, "Rectangle", (this.resource.shape == "rectangle")) );
						this.radioShapeDisk = add( new HRadioInput(shapeGroup, "Disk", (this.resource.shape == "disk")) );
						this.radioShapeDiamond = add( new HRadioInput(shapeGroup, "Diamond", (this.resource.shape == "diamond")) );
						endparent();

					add( new HButton("OK", () => {
						this.modified = false;
						this.close();
					}) );

					endparent();

				parent( add( new HElement("div", {class: "preview"}) ) );
					this.canvasPreview = add( new HCanvas(0, 0) );
					this.ctx = this.canvasPreview.html.getContext("2d", {willReadFrequently: true});
					endparent();

				endparent();
			endparent();

		setDeepOnUpdateOnElement(this.client, () => {
			this.updateBBInputs();
			this.updatePreview();
			this.onUpdate();
		});
	}

	async onAdd() {
		await this.updatePreview();
		super.onAdd();
	}

	copyData() {
		this.resourceCopy = new ProjectSprite(this.resource); // TODO maybe just copy certain properties?
	}

	saveData() {
		this.resource.separateCollisionMasks = this.inputSeparateCollisionMasks.getChecked();
		this.resource.alphaTolerance = this.inputAlphaTolerance.getIntValue();

		this.resource.boundingBox = (
			this.radioBBAutomatic.getChecked() ? "automatic"
			: this.radioBBFullImage.getChecked() ? "fullimage"
			: this.radioBBManual.getChecked() ? "manual"
			: null
		);

		this.resource.bbLeft = this.inputBBLeft.getIntValue();
		this.resource.bbTop = this.inputBBTop.getIntValue();
		this.resource.bbRight = this.inputBBRight.getIntValue();
		this.resource.bbBottom = this.inputBBBottom.getIntValue();

		this.resource.shape = (
			this.radioShapePrecise.getChecked() ? "precise"
			: this.radioShapeRectangle.getChecked() ? "rectangle"
			: this.radioShapeDisk.getChecked() ? "disk"
			: this.radioShapeDiamond.getChecked() ? "diamond"
			: null
		);

		// TODO: perhaps it would be better to just invalidate it, but would screw over the save file.
		this.resource.updateMaskProperties();

		// this.spriteWindow.updateImageInfo();
		// this.spriteWindow.onUpdate();
	}

	restoreData() {
		Object.assign(this.resource, this.resourceCopy);

		// this.spriteWindow.updateImageInfo();
		// this.spriteWindow.onUpdate();
	}

	onUpdate() {
		this.modified = true;
		this.saveData();
	}

	updateTitle() {
		this.setTitle("Mask Properties: "+this.spriteWindow.resource.name);
	}


	updateBBInputs() {
		const disable = !this.radioBBManual.getChecked();
		this.inputBBLeft.input.html.disabled = disable;
		this.inputBBTop.input.html.disabled = disable;
		this.inputBBRight.input.html.disabled = disable;
		this.inputBBBottom.input.html.disabled = disable;
	}

	async updatePreview() {
		await Promise.all(this.resource.images.map(x => x.promise));

		const image = this.resource.images[0];
		if (!image) return;

		this.canvasPreview.setSize(image.width, image.height);

		this.ctx.drawImage(image.image, 0, 0);

		if (this.inputShowCollisionMask.getChecked()) {
			const masks = this.resource.getMasks();

			const imageMask = masks[0];

			const aO = (aA, aB) => {
				return aA + aB * (1 - aA);
			};
			const cO = (cA, cB, aA, aB, aO) => {
				return (cA * aA + cB * aB * (1 - aA)) / aO;
			};

			const data = this.ctx.getImageData(0, 0, image.width, image.height);
			for (let x=0; x<imageMask.length; ++x)
			for (let y=0; y<imageMask[x].length; ++y) {
				const pixel = (x+(y*imageMask.length)) * 4;
				const r = data.data[pixel] / 255;
				const g = data.data[pixel + 1] / 255;
				const b = data.data[pixel + 2] / 255;
				const a = data.data[pixel + 3] / 255;

				const outA = aO(0.5, a);

				if (imageMask[x][y]) {
					data.data[pixel] = cO(0, r, 0.5, a, outA) * 255;
					data.data[pixel+1] = cO(0, g, 0.5, a, outA) * 255;
					data.data[pixel+2] = cO(0, b, 0.5, a, outA) * 255;
					data.data[pixel+3] = outA * 255;
				} else {
					data.data[pixel] = cO(1, r, 0.5, a, outA) * 255;
					data.data[pixel+1] = cO(1, g, 0.5, a, outA) * 255;
					data.data[pixel+2] = cO(1, b, 0.5, a, outA) * 255;
					data.data[pixel+3] = outA * 255;
				}
			}

			this.ctx.putImageData(data, 0, 0);
		}

		// TOOD no
		this.inputBBLeft.setValue(this.resource.bbLeft);
		this.inputBBTop.setValue(this.resource.bbTop);
		this.inputBBRight.setValue(this.resource.bbRight);
		this.inputBBBottom.setValue(this.resource.bbBottom);
	}

	close() {
		if (this.modified) {
			if (!confirm(`Close without saving the changes to the mask of sprite ${this.spriteWindow.resource.name}?`)) return;
			this.restoreData();
		}
		super.close();
	}
}