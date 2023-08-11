import ImageWrapper from "~/common/ImageWrapper.js";
import Serializer from "~/common/Serializer.js";

export class ProjectSprite {
	static {
		Serializer.setupClass(this, "ProjectSprite", {
			id: null,
			name: null,
			images: {array: ImageWrapper}, // this should not be serialized, however look at ProjectSerializer
			originx: 0,
			originy: 0,
			separateCollisionMasks: false,
			alphaTolerance: 0,
			boundingBox: "automatic", // automatic, fullimage, manual
			bbLeft: 0,
			bbTop: 0,
			bbRight: 0,
			bbBottom: 0,
			shape: "precise", // precise, rectangle, disk, diamond
		});

		this.masks = null;
	}

	constructor(...args) {
		Serializer.initProperties(this, args);
	}

	// Creates masks and updates bb props.
	updateMaskProperties() {
		const offscreen = new OffscreenCanvas(0, 0);
		const offscreenCtx = offscreen.getContext("2d", {willReadFrequently: true});
		const masks = this.makeMaskProperties(offscreen, offscreenCtx);

		this.masks = masks.list;
		this.bbLeft = masks.bbox.l;
		this.bbTop = masks.bbox.t;
		this.bbRight = masks.bbox.r;
		this.bbBottom = masks.bbox.b;
	}

	// Use this to get masks if you are sure bb props are correct.
	getMasks(canvas, ctx) {
		if (this.masks) return this.masks;

		canvas ??= new OffscreenCanvas(0, 0);
		ctx ??= canvas.getContext("2d", {willReadFrequently: true});

		const masks = this.makeMaskProperties(canvas, ctx);
		this.masks = masks.list;
		return this.masks;
	}

	// Returns masks and bb props.
	makeMaskProperties(canvas, ctx) {
		const masks = {
			list: [],
			bbox: {},
		};

		let currentMask;

		if (this.boundingBox == "automatic") {
			masks.bbox = {
				l: (this.images[0]?.width ?? 32) - 1,
				t: (this.images[0]?.height ?? 32) - 1,
				r: 0,
				b: 0,
			};
		} else if (this.boundingBox == "fullimage") {
			masks.bbox = {
				l: 0,
				t: 0,
				r: (this.images[0]?.width ?? 32) - 1,
				b: (this.images[0]?.height ?? 32) - 1,
			};
		} else if (this.boundingBox == "manual") {
			masks.bbox = {
				l: this.bbLeft,
				t: this.bbTop,
				r: this.bbRight,
				b: this.bbBottom,
			};
		}

		for (const [imageIndex, image] of this.images.entries()) {
			// TODO account for boundingBox, bbLeft, bbTop, bbRight, bbBottom
			if (!currentMask) {
				currentMask = new Array(image.width);
				for (let x=0; x<image.width; ++x) {
					currentMask[x] = new Array(image.height);
				}
			}

			let bbox = {};

			if (this.boundingBox == "automatic") {
				bbox = {
					l: image.width-1,
					t: image.height-1,
					r: 0,
					b: 0,
				};
			} else {
				bbox = masks.bbox;
			}

			if (image.width > canvas.width || image.height > canvas.height) {
				canvas.width = image.width;
				canvas.height = image.height;
			}

			ctx.clearRect(0, 0, image.width, image.height);
			ctx.drawImage(image.image, 0, 0);

			const data = ctx.getImageData(0, 0, image.width, image.height);

			for (let i=0; i<data.data.length; i+=4) {
				const x = (i/4) % image.width;
				const y = Math.floor((i/4) / image.width);
				const alpha = data.data[i+3];

				if (alpha > this.alphaTolerance) {
					if (this.boundingBox == "automatic") {
						if (x < bbox.l) bbox.l = x;
						if (y < bbox.t) bbox.t = y;
						if (x > bbox.r) bbox.r = x;
						if (y > bbox.b) bbox.b = y;
					}

					if (this.shape == "precise") {
						if (/*this.boundingBox != "manual" || */(x >= bbox.l && y >= bbox.t && x < bbox.r+1 && y < bbox.b+1)) {
							currentMask[x][y] = true;
						}
					}
				}
			}

			// Merge image bbox with sprite bbox
			if (this.boundingBox == "automatic") {
				masks.bbox.l = Math.min(masks.bbox.l, bbox.l);
				masks.bbox.t = Math.min(masks.bbox.t, bbox.t);
				masks.bbox.r = Math.max(masks.bbox.r, bbox.r);
				masks.bbox.b = Math.max(masks.bbox.b, bbox.b);
			}

			if (this.separateCollisionMasks) {
				this.fillMaskInBBox(currentMask, bbox);
			}

			masks.list[imageIndex] = currentMask;

			if (this.separateCollisionMasks) {
				currentMask = null;
			}
		}

		if (!this.separateCollisionMasks && this.images[0]) {
			this.fillMaskInBBox(currentMask, masks.bbox);
		}

		return masks;
	}

	fillMaskInBBox(mask, bbox) {
		if (this.shape == "rectangle") {
			for (let x=bbox.l; x<bbox.r+1; ++x)
			for (let y=bbox.t; y<bbox.b+1; ++y) {
				mask[x][y] = true;
			}
		} else if (this.shape == "disk") {
			const w = (bbox.r+1 - bbox.l);
			const h = (bbox.b+1 - bbox.t);
			const ellipseX = bbox.l - 0.5 + (w/2);
			const ellipseY = bbox.t - 0.5 + (h/2);
			const wPrime = ((w/2) ** 2);
			const hPrime = ((h/2) ** 2);

			for (let x=bbox.l; x<bbox.r+1; ++x)
			for (let y=bbox.t; y<bbox.b+1; ++y) {
				const xPrime = ((x - ellipseX) ** 2);
				const yPrime = ((y - ellipseY) ** 2);

				if ((xPrime/wPrime + yPrime/hPrime) <= 1) {
					mask[x][y] = true;
				}
			}
		} else if (this.shape == "diamond") {
			for (let x=bbox.l; x<bbox.r+1; ++x)
			for (let y=bbox.t; y<bbox.b+1; ++y) {
				const diamondW = (bbox.r+1 - bbox.l);
				const diamondH = (bbox.b+1 - bbox.t);
				const diamondX = bbox.l - 0.5 + (diamondW/2);
				const diamondY = bbox.t - 0.5 + (diamondH/2);

				const dx = Math.abs(x - diamondX);
				const dy = Math.abs(y - diamondY);

				if ((dx/diamondW + dy/diamondH) <= 0.5) {
					mask[x][y] = true;
				}
			}
		}
	}

	static getName() { return "sprite"; }
	static getScreenName() { return "Sprite"; }
	static getScreenGroupName() { return "Sprites"; }
	static getClassName() { return "ProjectSprite"; }
}