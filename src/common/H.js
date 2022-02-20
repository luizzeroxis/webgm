// H.js

/*
import {$, parent, endparent, add, remove, html, text,
	newElem, newButton, newCanvas, newTextBox, newNumberBox, newCheckBox, newRadioBox, newSelect, newColorBox, newImage,
	uniqueID, setAttributeExceptNull
	} from '../common/H.js';
*/

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

let parentStack = [document.body];

//Makes the element the parent of newly added elements.
export function parent(element) {
	parentStack.push(element);
	return element;
}

//Makes the current parent the one used before this one was made a parent.
export function endparent() {
	parentStack.pop();
}

//Adds element to the current parent.
export function add(element) {
	parentStack[parentStack.length - 1].appendChild(element);
	return element;
}

//Remove element from its parent.
export function remove(element) {
	if (element.parentElement) {
		return element.parentElement.removeChild(element);
	}
}

//Makes a new element.
export function html(tag, attributes, events, content) {
	var e = document.createElement(tag);

	if (attributes) {
		Object.keys(attributes).forEach((attribute) => {
			if (attributes[attribute] != null) {
				e.setAttribute(attribute, attributes[attribute]);
			}
		});
	}

	if (events) {
		Object.keys(events).forEach((event) => {
			e.addEventListener(event, events[event], /*{passive: true}*/);
		});
	}

	if (content) {
		e.appendChild(document.createTextNode(content));
	}

	return e;
}

// Makes a new text node.
export function text(content) {
	return document.createTextNode(content);
}

//// Specific element creation helpers

// Create any element.
export function newElem(classes, tag, content) {
	var e = html(tag, {class: classes}, null, content);
	return e;
}

// <button><button>
export function newButton(classes, content, onclick) {
	var e = html('button', {class: classes}, {click: onclick}, content);
	return e;
}

// <canvas></canvas>
export function newCanvas(classes, width, height) {
	var e = html('canvas', {class: classes, width: width, height: height}, null, null);
	return e;
}

// <input type=text />
export function newTextBox(classes, labelcontent, value) {
	var theid = '_id_'+uniqueID();

	var e = parent( html('div', {class: classes}) )
		if (labelcontent) {
			add( html('label', {for: theid}, null, labelcontent) )
		}
		add( html('input', {id: theid, type: 'text', value: value}, null, null) )
		
		endparent()

	return e;
}

// <input type=number />
export function newNumberBox(classes, labelcontent, value, step, min, max) {
	var e = newTextBox(classes, labelcontent, value)
	$(e, 'input').type = 'number';
	$(e, 'input').step = step;
	$(e, 'input').min = min;
	$(e, 'input').max = max;
	return e;
}

// <input type=range />
export function newSlider(classes, labelcontent, value, step, min, max) {
	var e = newTextBox(classes, labelcontent, value)
	$(e, 'input').type = 'range';
	$(e, 'input').step = step;
	$(e, 'input').min = min;
	$(e, 'input').max = max;
	return e;
}

// <input type=checkbox />
export function newCheckBox(classes, labelcontent, checked) {
	var theid = '_id_'+uniqueID();

	var e = parent( html('div', {class: classes}) )

		add( html('input', {id: theid, type: 'checkbox', ...( checked ? {checked: 'checked'} : null )}, null, null) )
		add( html('label', {for: theid}, null, labelcontent) )
		
		endparent()

	return e;
}

// <input type=radio />
export function newRadioBox(classes, labelcontent, groupname, checked) {
	var theid = '_id_'+uniqueID();

	var e = parent( html('div', {class: classes}) )

		add( html('input', {
			id: theid,
			type: 'radio',
			name: groupname,
			...( checked ? {checked: 'checked'} : null ),
		}, null, null) )
		add( html('label', {for: theid}, null, labelcontent) )
		
		endparent()

	return e;
}

// <select> <option /> </select>
export function newSelect(classes, labelcontent, options) {
	var theid = '_id_'+uniqueID();

	var e = parent( html('div', {class: classes}) )
		add( html('label', {for: theid}, null, labelcontent) )

		parent( add( html('select', {id: theid}) ) )
			
			if (options) {
				options.forEach(x => {
					add( html('option', {value: x.value}, null, x.name) );
				})
			}

			endparent()
		endparent()

	return e;
}

// <input type=color />
export function newColorBox(classes, labelcontent, value) {
	var e = newTextBox(classes, labelcontent, value)
	$(e, 'input').type = 'color';
	return e;
}

// <img />
export function newImage(classes, src) {
	var e = html('img', {class: classes})
	if (src) {
		e.src = src;
	}
	return e;
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