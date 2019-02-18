//Bunch of random functions that make my life easier

//jQuery-esc element query
$ = q => document.querySelector(q);
HTMLElement.prototype.$ = function(q) {return this.querySelector(q)};

//= HTML parented editing system =
let theparentstack = [document.body];

	//Makes the element the parent of newly added elements.
	parent = (element) => {
		theparentstack.push(element);
		return element;
	}

	//Makes the current parent the one used before this one was made a parent.
	endparent = () => {
		theparentstack.pop();
	}

	//Adds element to the current parent.
	add = (element) => {
		theparentstack[theparentstack.length - 1].appendChild(element);
		return element;
	}

	//Remove element from its parent.
	remove = (element) => {
		return element.parentElement.removeChild(element);
	}

//= Element makers =

	//Makes a new element.
	html = (tag, attributes, events, content) => {
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
				e.addEventListener(event, events[event], {passive: true});
			});
		}

		if (content) {
			e.appendChild(document.createTextNode(content));
		}

		return e;
	}

	//
	text = (content) => {
		return document.createTextNode(content);
	}

	//Makes a new element.
	newElem = (classes, tag, content) => {
		var e = html(tag, {class: classes}, null, content);
		return e;
	}

	//Makes a new button.
	newButton = (classes, content, onclick) => {
		var e = html('button', {class: classes}, {click: onclick}, content);
		return e;
	}

	//Makes a new canvas.
	newCanvas = (classes, width, height) => {
		var e = html('canvas', {class: classes, width: width, height: height}, null, null);
		return e;
	}

	//
	newTextBox = (classes, labelcontent, value) => {
		var theid = uniqueID();

		var e = parent( html('div', {class: classes}) )
			add( html('label', {for: theid}, null, labelcontent) )
			add( html('input', {id: theid, type: 'text', value: value}, null, null) )
			
			endparent()

		return e;
	}

	newNumberBox = (classes, labelcontent, value, step, min, max) => {
		var e = newTextBox(classes, labelcontent, value)
		e.$('input').type = 'number';
		e.$('input').step = step;
		e.$('input').min = min;
		e.$('input').max = max;
		return e;
	}

	//
	newCheckBox = (classes, labelcontent, checked) => {
		var theid = uniqueID();

		var e = parent( html('div', {class: classes}) )

			add( html('input', {id: theid, type: 'checkbox', ...( checked ? {checked: 'checked'} : null )}, null, null) )
			add( html('label', {for: theid}, null, labelcontent) )
			
			endparent()

		return e;
	}

	//
	newSelect = (classes, labelcontent) => {
		var theid = uniqueID();

		var e = parent( html('div', {class: classes}) )
			add( html('label', {for: theid}, null, labelcontent) )

			var selectObject = parent( add( html('select', {id: theid}) ) )
				
				endparent()
			endparent()

		return e;
	}

	//
	newColorBox = (classes, labelcontent, value) => {
		var e = newTextBox(classes, labelcontent, value)
		e.$('input').type = 'color';
		return e;
	}

	newImage = (classes, src) => {
		var e = html('img', {class: classes})
		if (src) {
			e.src = src;
		}
		return e;
	}


//= ID generator=
var lastUniqueID = 0;
uniqueID = () => {
	lastUniqueID++;
	return '_id_'+(lastUniqueID-1);
}

//= Base 64 =
base64ToBlob = (base64Data, contentType) => {
	contentType = contentType || '';
	var sliceSize = 1024;
	var byteCharacters = atob(base64Data);
	var bytesLength = byteCharacters.length;
	var slicesCount = Math.ceil(bytesLength / sliceSize);
	var byteArrays = new Array(slicesCount);

	for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
		var begin = sliceIndex * sliceSize;
		var end = Math.min(begin + sliceSize, bytesLength);

		var bytes = new Array(end - begin);
		for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
			bytes[i] = byteCharacters[offset].charCodeAt(0);
		}
		byteArrays[sliceIndex] = new Uint8Array(bytes);
	}
	return new Blob(byteArrays, { type: contentType });
}

blobToBase64 = (blobData) => {

	return new Promise((resolve, reject) => {
		var reader = new FileReader();
		reader.onload = () => resolve(reader.result.substr(reader.result.indexOf(',') + 1));
		reader.onerror = () => reject();
		reader.readAsDataURL(blobData)
	})

}

// sets a html attribute unless the value provided is null, in which case it removes it
setAttributeExceptNull = (element, attr, value) => {
	if (value != null) {
		element.setAttribute(attr, value);
	} else {
		element.removeAttribute(attr);
	}
}