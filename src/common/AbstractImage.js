import {WebGMException} from "./Exceptions.js";

export default class AbstractImage {
	constructor(res, load=true) {
		this.image = new Image();

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

	load() {
		if (this.promise == null) {
			this.promise = new Promise((resolve, reject) => {
				this.image.onload = () => {
					resolve();
				};
				this.image.onerror = () => {
					reject(new WebGMException("Could not load image"));
				};
			});

			this.image.src = this.src;
		}
	}

	toJSON() {
		return undefined;
	}
}