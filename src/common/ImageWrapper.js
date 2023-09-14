export default class ImageWrapper {
	constructor(blob) {
		this.image = new Image();
		this.blob = blob;
		this.src = URL.createObjectURL(blob);

		this.width = null;
		this.height = null;

		this.promise = new Promise((resolve, reject) => {
			this.image.onload = () => {
				this.width = this.image.width;
				this.height = this.image.height;
				resolve(this);
			};
			this.image.onerror = () => {
				reject(new Error("Could not load image"));
			};
		});

		this.image.src = this.src;
	}

	static copy(object) {
		return object;
	}

	toJSON() {
		return undefined;
	}

	static fromJSON() {
		return undefined;
	}
}