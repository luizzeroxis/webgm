import {WebGMException} from './Exceptions.js';

export default class AbstractAudio {

	constructor(res, load=true) {
		this.audio = new Audio();

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
				this.audio.onload = (e) => {
					resolve();
				};
				this.audio.onerror = (e) => {
					reject(new WebGMException("Could not load audio"));
				};
			});

			this.audio.src = this.src;
		}
	}

	toJSON() {
		return undefined;
	}

}