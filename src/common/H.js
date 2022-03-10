// H.js

// HTML query selector - usage: $(query) or $(element, query)
export function $(...args) {
	if (args.length == 1) {
		let [query] = args;
		return document.querySelector(query);
	}
	if (args.length == 2) {
		let [element, query] = args;
		return element.querySelector(query);
	}
	throw new Error('too many arguments for function $');
}

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
			this.html = html(tag, attributes, text);
		}

		this.children = [];

	}
	// onRemove() {}
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
	// if (!(element instanceof HElement)) {
	// 	element = new HElement(element);
	// }
	const parent = parentStack[parentStack.length - 1];
	if (parent instanceof HElement) {
		parent.children.push(element);
		if (element instanceof HElement) {
			parent.html.append(element.html);
		} else {
			parent.html.append(element);
		}
	} else {
		if (element instanceof HElement) {
			parent.append(element.html);
		} else {
			parent.append(element);
		}
	}
	return element;
}

// Remove the element from its parent.
export function remove(element) {
	if (element instanceof HElement) {
		element.html.remove();
		element.html = null;

		if (element.onRemove) {
			element.onRemove();
		}

		for (const child of element.children) {
			remove(child);
		}

		element.children = [];

	} else {
		element.remove(); // Element.remove
	}
}

//Makes a new element.
export function html(tag, attributes, text) {
	var e = document.createElement(tag);

	if (attributes) {
		for (let [name, value] of Object.entries(attributes)) {
			if (value != null) {
				e.setAttribute(name, value);
			}
		}
	}

	if (text) {
		e.textContent = text;
	}

	return e;
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
			this.label = add( html('label', {for: id}, label) )
			this.input = add( html('input', {id: id, type: type, value: value}) )
			endparent()
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
			this.input = add( html('input', {id: id, type: 'checkbox',
				...(checked ? {checked: 'checked'} : null)
			}) )
			this.label = add( html('label', {for: id}, label) )
			endparent()
	}
}

export class HRadioInput extends HElement {
	constructor(group, label, checked, _class) {
		parent( super('div', {class: _class}) )
			let id = '_id_' + uniqueID();
			this.input = add( html('input', {id: id, type: 'radio', name: group,
				...(checked ? {checked: 'checked'} : null)
			}) )
			this.label = add( html('label', {for: id}, label) )
			endparent()
	}
}

export class HSelect extends HElement {
	constructor(label, _class) {
		parent( super('div', {class: _class}) )
			let id = '_id_' + uniqueID();
			this.label = add( html('label', {for: id}, label) )
			this.select = add( html('select', {id: id}) )
			endparent()
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
			this.select.value = value;
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
	return html(tag, {class: classes}, content);
}

// <button><button>
export function newButton(classes, content, onclick) {
	return new HButton(content, onclick, classes).html;
}

// <canvas></canvas>
export function newCanvas(classes, width, height) {
	return new HCanvas(width, height, classes).html;
}

// <input type=text />
export function newTextBox(classes, labelcontent, value) {
	return new HTextInput(labelcontent, value, classes).html;
}

// <input type=number />
export function newNumberBox(classes, labelcontent, value, step, min, max) {
	return new HNumberInput(labelcontent, value, step, min, max, classes).html;
}

// <input type=range />
export function newSlider(classes, labelcontent, value, step, min, max) {
	return new HRangeInput(labelcontent, value, step, min, max, classes).html;
}

// <input type=color />
export function newColorBox(classes, labelcontent, value) {
	return new HColorInput(labelcontent, value, classes).html;
}

// <input type=checkbox />
export function newCheckBox(classes, labelcontent, checked) {
	return new HCheckBoxInput(labelcontent, checked, classes).html;
}

// <input type=radio />
export function newRadioBox(classes, labelcontent, groupname, checked) {
	return new HRadioInput(groupname, labelcontent, checked, classes).html;
}

// <select> <option /> </select>
export function newSelect(classes, labelcontent, options, value) {
	if (options) {
		return new HSelectWithOptions(labelcontent, options, value, classes).html;
	} else {
		return new HSelect(labelcontent, classes).html;
	}
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