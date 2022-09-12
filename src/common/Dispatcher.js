export default class Dispatcher {
	constructor() {
		this.listeners = {};
	}

	listen(listeners) {
		for (const subject in listeners) {
			if (!this.listeners[subject]) this.listeners[subject] = [];
			this.listeners[subject].push(listeners[subject]);
		}
		return listeners;
	}

	stopListening(listeners) {
		for (const subject in listeners) {
			const index = this.listeners[subject].findIndex(x => x == listeners[subject]);
			if (index >= 0) {
				this.listeners[subject].splice(index, 1);
			}
			if (this.listeners[subject].length == 0) {
				delete this.listeners[subject];
			}
		}
	}

	speak(subject, ...words) {
		const responses = [];
		if (this.listeners[subject]) {
			for (const listener in this.listeners[subject]) {
				responses.push(this.listeners[subject][listener](...words));
			}
		}
		return responses;
	}
}