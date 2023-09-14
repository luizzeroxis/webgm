export default class AudioWrapper {
	constructor(blob) {
		this.audio = new Audio();
		this.blob = blob;
		this.src = URL.createObjectURL(blob);

		this.promise = new Promise((resolve, reject) => {
			this.audio.oncanplaythrough = () => { // onload simply isn't a thing. That's great.
				resolve(this);
			};
			this.audio.onerror = () => {
				reject(new Error("Could not load audio"));
			};
		});

		this.audio.src = this.src;
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