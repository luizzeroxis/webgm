// H.js

//// HTML generation parent system

export class HElement {
	constructor(...args) {

		if (args.length == 1) {
			let [html] = args;
			if (html instanceof Element) {
				this.html = html;
			}
		}

		if (this.html == null) {
			let [tag, attributes, text] = args;

			this.html = document.createElement(tag);

			if (attributes) {
				for (let [name, value] of Object.entries(attributes)) {
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
	onAdd() {}
	onRemove() {}
}

let parentStack = [document.body];

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

// Remove the element from its parent.
export function remove(element) {
	if (element instanceof HElement) {
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

function callOnAddIfConnected(element) {
	if (element.html.isConnected) {
		for (const child of element.children) {
			if (child instanceof HElement) {
				callOnAddIfConnected(child);
			}
		}
		element.onAdd();
	}
}

function callOnRemoveIfNotConnected(element) {
	if (!element.html.isConnected) {
		for (const child of element.children) {
			if (child instanceof HElement) {
				callOnRemoveIfNotConnected(child);
			}
		}
		element.onRemove();
	}
}

// Remove the element's children.
export function removeChildren(element) {
	if (element instanceof HElement) {
		for (const child of element.children) {
			remove(child);
		}
	} else {
		element.replaceChildren();
	}
}

//// Specific element creation helpers

export class HButton extends HElement {
	constructor(text, onClick, _class) {
		super('button', {class: _class}, text)
		this.html.addEventListener('click', onClick);
	}
}

export class HCanvas extends HElement {
	constructor(width, height, _class) {
		super('canvas', {class: _class, width: width, height: height});
	}
}

export class HLabelAndInput extends HElement {
	constructor(type, label, value, _class) {
		parent( super('div', {class: _class}) )
			let id = '_id_' + uniqueID();
			this.label = add( new HElement('label', {for: id}, label) )
			this.input = add( new HElement('input', {id: id, type: type, value: value}) )
			endparent()
	}
	getValue() {
		return this.input.html.value;
	}
	setValue(value) {
		this.input.html.value = value;
	}
	setOnChange(onChange) {
		this.input.html.addEventListener('change', onChange);
	}
}

export class HTextInput extends HLabelAndInput {
	constructor(label, value, _class) {
		super('text', label, value, _class);
	}
}

export class HNumberInput extends HLabelAndInput {
	constructor(label, value, step, min, max, _class) {
		super('number', label, value, _class);
		this.input.step = step;
		this.input.min = min;
		this.input.max = max;
	}
}

export class HRangeInput extends HLabelAndInput {
	constructor(label, value, step, min, max, _class) {
		super('range', label, value, _class);
		this.input.step = step;
		this.input.min = min;
		this.input.max = max;
	}
}

export class HColorInput extends HLabelAndInput {
	constructor(label, value, _class) {
		super('color', label, value, _class);
	}
}

export class HCheckBoxInput extends HElement {
	constructor(label, checked, _class) {
		parent( super('div', {class: _class}) )
			let id = '_id_' + uniqueID();
			this.input = add( new HElement('input', {id: id, type: 'checkbox',
				...(checked ? {checked: 'checked'} : null)
			}) )
			this.label = add( new HElement('label', {for: id}, label) )
			endparent()
	}
	getChecked() {
		return this.input.html.checked;
	}
	setOnChange(onChange) {
		this.input.html.addEventListener('change', onChange);
	}
}

export class HRadioInput extends HElement {
	constructor(group, label, checked, _class) {
		parent( super('div', {class: _class}) )
			let id = '_id_' + uniqueID();
			this.input = add( new HElement('input', {id: id, type: 'radio', name: group,
				...(checked ? {checked: 'checked'} : null)
			}) )
			this.label = add( new HElement('label', {for: id}, label) )
			endparent()
	}
	getChecked() {
		return this.input.html.checked;
	}
	setOnClick(onClick) {
		this.input.html.addEventListener('click', onClick);
	}
}

export class HSelect extends HElement {
	constructor(label, _class) {
		parent( super('div', {class: _class}) )
			let id = '_id_' + uniqueID();
			this.label = add( new HElement('label', {for: id}, label) )
			this.select = add( new HElement('select', {id: id}) )
			endparent()
	}
	getValue() {
		return this.select.html.value;
	}
	setValue(value) {
		this.select.html.value = value;
	}
	getSelectedIndex() {
		return this.select.html.selectedIndex;
	}
	setSelectedIndex(index) {
		this.select.html.selectedIndex = index;
	}
	setOnChange(onChange) {
		this.select.html.addEventListener('change', onChange);
	}
	removeOptions() {
		removeChildren(this.select);
	}
}

export class HOption extends HElement {
	constructor(text, value, _class) {
		super('option', {class: _class, value: value}, text)
	}
}

export class HSelectWithOptions extends HSelect {
	constructor(label, options, value, _class) {
		super(label, _class);

		parent(this.select)
			for (let option of options) {
				add( new HOption(option.name, option.value) )
			}
			endparent()

		if (value) {
			this.setValue(value);
		}
	}
}

export class HImage extends HElement {
	constructor(src, _class) {
		super('img', {class: _class, ...(src ? {src: src} : null)})
	}
}

////

// Create any element.
export function newElem(classes, tag, content) {
	return new HElement(tag, {class: classes}, content).html;
}

// <button><button>
export function newButton(classes, content, onclick) {
	return new HButton(content, onclick, classes).html;
}

// <canvas></canvas>
export function newCanvas(classes, width, height) {
	return new HCanvas(width, height, classes).html;
}

// <option />
export function newOption(classes, value, text) {
	return new HOption(text, value, classes).html;
}

// <img />
export function newImage(classes, src) {
	return new HImage(src, classes).html;
}


//// ID generator for unique elements

var lastUniqueID = 0;

export function uniqueID() {
	return lastUniqueID++;
}

//// Helpers

// Sets a html attribute unless the value provided is null, in which case it removes it
export var setAttributeExceptNull = (element, attr, value) => {
	if (value != null) {
		element.setAttribute(attr, value);
	} else {
		element.removeAttribute(attr);
	}
}

// Make a element be able to receive drops of files from anywhere.
export var setOnFileDrop = (element, onSelectFile, multiple=false) => {

	element.addEventListener('dragover', e => {
		e.stopPropagation();
		e.preventDefault();
	})

	element.addEventListener('drop', async e => {
		e.stopPropagation();
		if (multiple) {
			if (!await onSelectFile(e.dataTransfer.files)) {
				e.preventDefault();
			}
		} else {
			var file = e.dataTransfer.files[0];
			if (file != undefined) {
				if (!await onSelectFile(file)) {
					e.preventDefault();
				}
			}
		}
	})

}