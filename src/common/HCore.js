import "./H.scss";

export class HElement {
	constructor(...args) {
		if (args.length == 1) {
			const [html] = args;
			if (html instanceof Element) {
				this.html = html;
			}
		}

		if (this.html == null) {
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

		this.parent = null;
		this.children = [];
	}

	setEvent(event, fn) {
		this.html.addEventListener(event, fn);
	}

	onAdd() {}
	onRemove() {}
}

export const parentStack = [new HElement(document.body)];

// Make the element the parent of newly added elements.
export function parent(element) {
	// if (!(element instanceof HElement)) {
	// 	element = new HElement(element);
	// }
	parentStack.push(element);
	return element;
}

// Make the current parent the one used before this one was made a parent.
export function endparent() {
	parentStack.pop();
}

// Add the element to the current parent.
export function add(element) {
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

// Remove the element from its parent.
export function remove(element) {
	if (element instanceof HElement) {
		if (!element.parent) {
			throw new Error("Trying to remove element that already has no parent!");
		}
		if (element.parent) {
			element.parent.children.splice(element.parent.children.indexOf(element), 1);
			element.parent = null;
		}
		element.html.remove();
		callOnRemoveIfNotConnected(element);
	} else {
		element.remove();
	}
}

// Remove the element's children.
export function removeChildren(element) {
	if (element instanceof HElement) {
		for (const child of [...element.children]) {
			remove(child);
		}
	} else {
		element.replaceChildren();
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

//// ID generator for unique elements

let lastUniqueID = 0;

export function uniqueID() {
	return lastUniqueID++;
}

//// Helpers

export function setOnFileDropAsFileHandle(element, onSelectFile, multiple=false) {
	return setOnFileDrop(element, onSelectFile, multiple, true);
}

// Make a element be able to receive drops of files from anywhere.
export function setOnFileDrop(element, onSelectFile, multiple=false, asFileHandle=false) {
	element.addEventListener("dragover", e => {
		e.stopPropagation();
		e.preventDefault();
	});

	element.addEventListener("drop", async e => {
		e.preventDefault();
		e.stopPropagation();

		const files = Array.from(e.dataTransfer.items).filter(item => item.kind == "file");

		let fileOrFiles;

		if (multiple) {
			if (asFileHandle) {
				fileOrFiles = await Promise.all(files.map(async file => await file.getAsFileSystemHandle()))
				.filter(handle => (handle.kind == "file"));
				if (fileOrFiles == null) return;
			} else {
				fileOrFiles = files.map(file => file.getAsFile());
			}
		} else {
			if (asFileHandle) {
				fileOrFiles = await files[0]?.getAsFileSystemHandle();
				if (fileOrFiles?.kind != "file") return;
			} else {
				fileOrFiles = files[0].getAsFile();
			}
		}

		onSelectFile(fileOrFiles);
	});
}