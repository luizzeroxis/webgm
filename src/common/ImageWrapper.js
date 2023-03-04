export default class ImageWrapper {
	constructor(res, load=true) {
		this.image = new Image();
		this.width = null;
		this.height = null;

		if (res instanceof Blob) {
			this.blob = res;
			this.src = URL.createObjectURL(res);
		} else {
			this.src = res;
		}

		this.promise = null;

		if (load) {
			this.load();
		}
	}

	static copy(object) {
		return object;
	}

	load() {
		if (this.promise == null) {
			this.promise = new Promise((resolve, reject) => {
				this.image.onload = () => {
					this.width = this.image.width;
					this.height = this.image.height;
					resolve();
				};
				this.image.onerror = () => {
					reject(new Error("Could not load image"));
				};
			});

			this.image.src = this.src;
		}
	}

	toJSON() {
		return null;
	}
}