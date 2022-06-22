// H.js

//// HTML generation parent system

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

function classToAttr(_class) {
	if (Array.isArray(_class)) {
		return _class.join(' ');
	} else if (typeof _class == 'string') {
		return _class;
	} else {
		return null;
	}
}

function classToArray(_class) {
	if (typeof _class == 'string') {
		return _class.split(' ');
	} else if (Array.isArray(_class)) {
		return _class;
	} else {
		return [];
	}
}

//// Specific element creation helpers

export class HButton extends HElement {
	constructor(text, onClick, _class) {
		super('button', {class: classToAttr(_class)}, text)
		this.html.addEventListener('click', onClick);
	}

	setDisabled(disabled) {
		this.html.disabled = disabled;
	}
}

export class HCanvas extends HElement {
	constructor(width, height, _class) {
		super('canvas', {class: classToAttr(_class), width: width, height: height});
	}

	clear() {
		// Haxs for cleaning canvas
		const h = this.html.height;
		this.html.height = 0;
		this.html.height = h;
	}
}

export class HLabelAndInput extends HElement {
	constructor(type, label, value, _class) {
		parent( super('div', {class: classToAttr(classToArray(_class).concat(['h-label-and-input']))}) )
			const id = '_id_' + uniqueID();
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

export class HMultilineTextInput extends HElement {
	constructor(label, value, _class) {
		parent( super('div', {class: classToAttr(classToArray(_class).concat(['h-multiline-text-input']))}) )
			const id = '_id_' + uniqueID();
			this.label = add( new HElement('label', {for: id}, label) )
			this.textarea = add( new HElement('textarea', {id: id}) )
			this.textarea.html.value = value;
			endparent()
	}

	getValue() {
		return this.textarea.html.value;
	}
}

export class HNumberInput extends HLabelAndInput {
	constructor(label, value, step, min, max, _class) {
		super('number', label, value, _class);
		this.input.html.step = step;
		this.input.html.min = min;
		this.input.html.max = max;
	}
}

export class HRangeInput extends HLabelAndInput {
	constructor(label, value, step, min, max, _class) {
		super('range', label, value, _class);
		this.input.html.step = step;
		this.input.html.min = min;
		this.input.html.max = max;
	}
}

export class HColorInput extends HLabelAndInput {
	constructor(label, value, _class) {
		super('color', label, value, _class);
	}
}

export class HCheckBoxInput extends HElement {
	constructor(label, checked, _class) {
		parent( super('div', {class: classToAttr(_class)}) )
			const id = '_id_' + uniqueID();
			this.input = add( new HElement('input', {
				id: id, type: 'checkbox',
				...(checked ? {checked: 'checked'} : null),
			}) )
			this.label = add( new HElement('label', {for: id}, label) )
			endparent()
	}

	getChecked() {
		return this.input.html.checked;
	}

	setChecked(checked) {
		this.input.html.checked = checked;
	}

	setOnChange(onChange) {
		this.input.html.addEventListener('change', onChange);
	}
}

export class HRadioInput extends HElement {
	constructor(group, label, checked, _class) {
		parent( super('div', {class: classToAttr(_class)}) )
			const id = '_id_' + uniqueID();
			this.input = add( new HElement('input', {
				id: id, type: 'radio', name: group,
				...(checked ? {checked: 'checked'} : null),
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
		parent( super('div', {class: classToAttr(classToArray(_class).concat(['h-select']))}) )
			const id = '_id_' + uniqueID();
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
		super('option', {class: classToAttr(_class), value: value}, text)
	}
}

export class HSelectWithOptions extends HSelect {
	constructor(label, options, value, _class) {
		super(label, _class);

		parent(this.select)
			for (const option of options) {
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
		super('img', {class: classToAttr(_class), ...(src ? {src: src} : null)})
	}

	setSrc(src) {
		if (src != null) {
			this.html.src = src;
		} else {
			this.html.removeAttribute('src');
		}
	}
}

//// ID generator for unique elements

let lastUniqueID = 0;

export function uniqueID() {
	return lastUniqueID++;
}

//// Helpers

// Make a element be able to receive drops of files from anywhere.
export function setOnFileDrop(element, onSelectFile, multiple=false) {

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
			const file = e.dataTransfer.files[0];
			if (file != undefined) {
				if (!await onSelectFile(file)) {
					e.preventDefault();
				}
			}
		}
	})

}