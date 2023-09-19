export default class AudioWrapper {
	constructor(blob) {
		this.blob = blob;
		this.src = URL.createObjectURL(blob);
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