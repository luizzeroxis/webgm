export class HElement {
	// new HElement(HElement element)
	// new HElement(tag, attributes=null, text=null)
	constructor(...args) {
		this.parent = null;
		this.children = [];

		if (args.length == 1 && args[0] instanceof Element) {
			const [html] = args;
			this.html = html;
		} else {
			const [tag, attributes, text] = args;
			this.html = document.createElement(tag);

			if (attributes) {
				for (const [name, value] of Object.entries(attributes)) {
					if (value != null) {
						this.html.setAttribute(name, value);
					}
				}
			}

			if (text) {
				this.html.textContent = text;
			}
		}
	}

	// Remove the element from its parent.
	remove() {
		if (!this.parent) {
			throw new Error("Trying to remove element that already has no parent!");
		}
		if (this.parent) {
			this.parent.children.splice(this.parent.children.indexOf(this), 1);
			this.parent = null;
		}
		this.html.remove();
		callOnRemoveIfNotConnected(this);
	}

	// Remove the element's children.
	removeChildren() {
		for (const child of [...this.children]) {
			child.remove();
		}
	}

	setEvent(event, fn) {
		this.html.addEventListener(event, fn);
	}

	onAdd() {}
	onRemove() {}
}

export const parentStack = [new HElement(document.body)];

// Make the element the parent of newly added elements.
// If inFunction is defined, it is called with the element as it's argument, and afterwards endparent is called.
export function parent(element, inFunction) {
	parentStack.push(element);
	if (inFunction) {
		inFunction(element);
		parentStack.pop();
	}
	return element;
}

// Make the current parent the one used before this one was made a parent.
export function endparent() {
	parentStack.pop();
}

// Add the element to the current parent.
export function add(...args) {
	let element;
	if (typeof args[0] == "string") {
		element = new HElement(...args);
	} else {
		element = args[0];
	}

	const parent = parentStack[parentStack.length - 1];

	if (parent instanceof HElement) {
		parent.children.push(element);

		if (element instanceof HElement) {
			if (element.parent) {
				throw new Error("Trying to add element that already has a parent!");
			}
			element.parent = parent;
			parent.html.append(element.html);
			callOnAddIfConnected(element);
		} else {
			parent.html.append(element);
		}
	} else {
		if (element instanceof HElement) {
			parent.append(element.html);
			callOnAddIfConnected(element);
		} else {
			parent.append(element);
		}
	}
	return element;
}

// Move element to place it inside the current parent.
export function moveAdd(element) {
	const parent = parentStack[parentStack.length - 1];

	if (parent instanceof HElement) {
		if (element instanceof HElement) {
			if (element.parent) {
				element.parent.children.splice(element.parent.children.indexOf(element), 1);
			}
			element.parent = parent;
			parent.children.push(element);

			const wasConnected = element.html.isConnected;
			parent.html.append(element.html);

			if (!wasConnected) {
				callOnAddIfConnected(element);
			} else {
				callOnRemoveIfNotConnected(element);
			}
		} else {
			parent.children.push(element);
			parent.html.append(element);
		}
	} else {
		if (element instanceof HElement) {
			if (element.parent) {
				element.parent.children.splice(element.parent.children.indexOf(element), 1);
			}
			element.parent = null;

			const wasConnected = element.html.isConnected;
			parent.append(element.html);

			if (!wasConnected) {
				callOnAddIfConnected(element);
			} else {
				callOnRemoveIfNotConnected(element);
			}
		} else {
			parent.append(element);
		}
	}
	return element;
}

// Move element to place it before another element.
export function moveBefore(beforeElement, element) {
	if (!(element instanceof HElement) || !(beforeElement instanceof HElement)) {
		throw new Error("Not supported.");
	}

	if (element.parent) {
		element.parent.children.splice(element.parent.children.indexOf(element), 1);
	}
	element.parent = beforeElement.parent;

	const index = beforeElement.parent.children.indexOf(beforeElement);
	beforeElement.parent.children.splice(index, 0, element);

	const wasConnected = element.html.isConnected;
	beforeElement.html.before(element.html);

	if (!wasConnected) {
		callOnAddIfConnected(element);
	} else {
		callOnRemoveIfNotConnected(element);
	}
}

function callOnAddIfConnected(element) {
	if (element.html.isConnected) {
		for (const child of [...element.children]) {
			if (child instanceof HElement) {
				callOnAddIfConnected(child);
			}
		}
		element.onAdd();
	}
}

function callOnRemoveIfNotConnected(element) {
	if (!element.html.isConnected) {
		for (const child of [...element.children]) {
			if (child instanceof HElement) {
				callOnRemoveIfNotConnected(child);
			}
		}
		element.onRemove();
	}
}

export function classToAttr(_class) {
	if (Array.isArray(_class)) {
		if (_class.length == 0) return null;
		return _class.join(" ");
	} else if (typeof _class == "string") {
		if (_class == "") return null;
		return _class;
	} else {
		return null;
	}
}

export function classToArray(_class) {
	if (typeof _class == "string") {
		return _class.split(" ");
	} else if (Array.isArray(_class)) {
		return _class;
	} else {
		return [];
	}
}

// ID generator for unique elements
let lastUniqueID = 0;

export function uniqueID() {
	return lastUniqueID++;
}