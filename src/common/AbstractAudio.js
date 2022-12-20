import {WebGMException} from "./Exceptions.js";

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

	static copy(object) {
		return object;
	}

	load() {
		if (this.promise == null) {
			this.promise = new Promise((resolve, reject) => {
				this.audio.oncanplaythrough = () => { // onload simply isn't a thing. That's great.
					resolve();
				};
				this.audio.onerror = () => {
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