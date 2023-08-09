import HModalWindow from "~/common/components/HWindowManager/HModalWindow.js";
import {parent, endparent, add, HElement, HButton, HCheckBoxInput, HRadioInput, HRangeInput, HCanvas, uniqueID} from "~/common/h";
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
			parent( add( new HElement("div", {class: "window-sprite-mask"}) ) );
				parent( add( new HElement("div") ) );

					this.inputShowCollisionMask = add( new HCheckBoxInput("Show collision mask", true) );

					this.inputSeparateCollisionMasks = add( new HCheckBoxInput("Separate collision masks", this.resource.separateCollisionMasks) );
					this.inputAlphaTolerance = add( new HRangeInput("Alpha Tolerance:", this.resource.alphaTolerance, 1, 0, 255) );

					parent( add( new HElement("fieldset") ) );
						add( new HElement("legend", {}, "Shape") );

						const shapeGroup = "_radio_"+uniqueID();

						this.radioShapePrecise = add( new HRadioInput(shapeGroup, "Precise", (this.resource.shape == "precise")) );
						this.radioShapeRectangle = add( new HRadioInput(shapeGroup, "Rectangle", (this.resource.shape == "rectangle")) );

						endparent();

					add( new HButton("OK", () => {
						this.modified = false;
						this.close();
					}) );

					//

					parent( add( new HElement("div", {class: "preview"}) ) );
						this.canvasPreview = add( new HCanvas(0, 0) );
						this.ctx = this.canvasPreview.html.getContext("2d");
						this.updatePreview();
						endparent();

					endparent();

				endparent();
			endparent();

		setDeepOnUpdateOnElement(this.client, () => {
			this.updatePreview();
			this.onUpdate();
		});
	}

	async updatePreview() {
		await Promise.all(this.resource.images.map(x => x.promise));

		const image = this.resource.images[0];
		if (!image) return;

		this.canvasPreview.setSize(image.width, image.height);

		this.ctx.drawImage(image.image, 0, 0);

		if (this.inputShowCollisionMask.getChecked()) {
			const offscreen = new OffscreenCanvas(0, 0);
			const offscreenCtx = offscreen.getContext("2d", {willReadFrequently: true});

			const masks = this.resource.getMasks(offscreen, offscreenCtx);

			const imageMask = masks[0];

			const aO = (aA, aB) => {
				return aA + aB * (1 - aA);
			}
			const cO = (cA, cB, aA, aB, aO) => {
				return (cA * aA + cB * aB * (1 - aA)) / aO;
			}

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
	}

	copyData() {
		this.resourceCopy = new ProjectSprite(this.resource); // TODO maybe just copy certain properties?
	}

	saveData() {
		this.resource.separateCollisionMasks = this.inputSeparateCollisionMasks.getChecked();
		this.resource.alphaTolerance = this.inputAlphaTolerance.getIntValue();

		this.resource.shape = (
			this.radioShapePrecise.getChecked() ? "precise"
			: this.radioShapeRectangle.getChecked() ? "rectangle"
			: null
		);

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

	close() {
		if (this.modified) {
			if (!confirm(`Close without saving the changes to the mask of sprite ${this.spriteWindow.resource.name}?`)) return;
			this.restoreData();
		}
		super.close();
	}
}