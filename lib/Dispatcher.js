class Dispatcher {

	/* 
		This is a event system.
		new Dispatcher() - Makes a new event, returns a Dispatcher.
		.addListener(func) - func will be executed when dispatched.
		.dispatch(...args) - Execute all added listeners with args.
	*/
	
	constructor() {
		this.listeners = [];
	}
	addListener(func) {
		this.listeners.push(func);
		return this.listeners.length-1;
	}
	removeListener(idOrFunc) {
		if (idOrFunc instanceof Function) {
			var i = array.indexOf(idOrFunc);
			if (i !== -1) {
				array.splice(i, 1);
			}
		} else {
			this.listeners.splice(idOrFunc, 1);
		}
	}
	dispatch(/**/) {
		for (var listener of this.listeners) {
			listener(...arguments);
		}
	}

}