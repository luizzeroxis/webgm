import {WebGMException} from './Exceptions.js';

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
		this.promise = new Promise((resolve, reject) => {
			this.image.onload = (e) => {
				resolve();
			};
			this.image.onerror = (e) => {
				reject(new WebGMException("Could not load image"));
			};
		});

		this.image.src = this.src;
	}

	toJSON() {
		return undefined;
	}

}