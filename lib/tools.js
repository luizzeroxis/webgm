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
				e.addEventListener(event, events[event], /*{passive: true}*/);
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
		var theid = '_id_'+uniqueID();

		var e = parent( html('div', {class: classes}) )
			if (labelcontent) {
				add( html('label', {for: theid}, null, labelcontent) )
			}
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
		var theid = '_id_'+uniqueID();

		var e = parent( html('div', {class: classes}) )

			add( html('input', {id: theid, type: 'checkbox', ...( checked ? {checked: 'checked'} : null )}, null, null) )
			add( html('label', {for: theid}, null, labelcontent) )
			
			endparent()

		return e;
	}

	//
	newRadioBox = (classes, labelcontent, groupname, checked) => {
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

	//
	newSelect = (classes, labelcontent, options) => {
		var theid = '_id_'+uniqueID();

		var e = parent( html('div', {class: classes}) )
			add( html('label', {for: theid}, null, labelcontent) )

			var selectObject = parent( add( html('select', {id: theid}) ) )
				
				if (options) {
					options.forEach(x => {
						add( html('option', {value: x.value}, null, x.name) );
					})
				}

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
	return lastUniqueID-1;
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

decimalColorToRGBValues = (color) => {
	return {
		r: color % 256,
		g: Math.floor(color % (256*256) / 256),
		b: Math.floor(color % (256*256*256) / (256*256))
	}
}

rgbValuesToDecimalColor = (rgb) => {
	return rgb.r + rgb.g * 256 + rgb.b * 256*256;
}

decimalColorToHSVValues = (color) => {
	var {r, g, b} = decimalColorToRGBValues(color);
	
	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, v = max;

	var d = max - min;
	s = max == 0 ? 0 : Math.floor(255 * d / max);

	if (max == min) {
		h = 0; // achromatic
	} else {
		switch (max) {
			case r: h = (g - b) / d * 42 + (g < b ? 256 : 0); break;
			case g: h = (b - r) / d * 42 + 85; break;
			case b: h = (r - g) / d + 42 + 170; break;
		}
		h = Math.floor(h);
	}

	return { h, s, v };
}

decimalColorToRGB = (color) => {
	var c = decimalColorToRGBValues(color);
	return 'rgb('+c.r+','+c.g+','+c.b+')';
}

decimalColorAndAlphaToRGBA = (color, alpha) => {
	var c = decimalColorToRGBValues(color);
	return 'rgba('+c.r+','+c.g+','+c.b+','+alpha+')'
}

makeCSSFont = (family, size, bold, italic) => {
	return (italic ? 'italic ' : '') + (bold ? 'bold ' : '') + size + 'pt "' + family + '"';
}

collision2Rectangles = (a, b) => {
	return (
		a.x1 <= b.x2 &&
		b.x1 <= a.x2 &&
		a.y1 <= b.y2 &&
		b.y1 <= a.y2
	);
}

parseArrowString = (string) => {
	var values = [];

	for (var i = 0; i < 9; ++i) {
		if (string[i] != "0") {
			values.push(true);
		} else {
			values.push(false);
		}
	}

	return values;
}

stringifyArrowValues = (values) => {
	var string = "";

	for (var i = 0; i < 9; ++i) {
		if (values[i]) {
			string += "1";
		} else {
			string += "0";
		}
	}

	return string;
}