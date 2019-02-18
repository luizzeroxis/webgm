class Dispatcher {
	
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

		for (var subject in listeners) {
			var index = this.listeners[subject].findIndex(x => x == listeners[subject]);
			this.listener[subject].splice(index, 1);
		}

	}
	speak(subject, ...words) {
		if (this.listeners[subject])
			for (var listener in this.listeners[subject]) {
				this.listeners[subject][listener](...words);
			}
	}

}