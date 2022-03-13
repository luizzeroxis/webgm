export default class Dispatcher {
	
	constructor() {
		this.listeners = {};
	}

	listen(listeners) {
		for (var subject in listeners) {
			if (!this.listeners[subject]) this.listeners[subject] = [];
			this.listeners[subject].push(listeners[subject]);
		}
		return listeners;
	}

	stopListening(listeners) {
		// console.log('stopListening:')
		for (var subject in listeners) {
			var index = this.listeners[subject].findIndex(x => x == listeners[subject]);
			if (index >= 0) {
				this.listeners[subject].splice(index, 1);
				// console.log('*', subject, listeners[subject]);
			}
			if (this.listeners[subject].length == 0) {
				delete this.listeners[subject];
			}
		}
	}

	speak(subject, ...words) {
		if (this.listeners[subject]) {
			for (var listener in this.listeners[subject]) {
				this.listeners[subject][listener](...words);
			}
		}
	}

}