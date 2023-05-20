export default class WebGMException extends Error {
	constructor(messageOrObject) {
		if (typeof messageOrObject != "object") {
			super(messageOrObject);
		} else {
			if (messageOrObject.text) {
				super(messageOrObject.text);
			} else {
				super(JSON.stringify(messageOrObject));
			}
			Object.assign(this, messageOrObject);
		}
		this.name = this.constructor.name;
	}
}