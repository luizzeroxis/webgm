// export {$, parent, endparent, add, remove, html, text,
// 	newElem, newButton, newCanvas, newTextBox, newNumberBox, newCheckBox, newRadioBox, newSelect, newColorBox, newImage,
// 	uniqueID, setAttributeExceptNull
// 	} from '../common/H.js';

//Bunch of random functions that make my life easier

//= Base 64 =
export var base64ToBlob = (base64Data, contentType) => {
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

// decimal -> rgb
export var decimalColorToRGBValues = (color) => {
	return {
		r: color % 256,
		g: Math.floor(color % (256*256) / 256),
		b: Math.floor(color % (256*256*256) / (256*256))
	}
}

// rgb -> decimal
export var rgbValuesToDecimalColor = (rgb) => {
	return rgb.r + rgb.g * 256 + rgb.b * 256*256;
}

// decimal -> hex
export var decimalColorToHexColor = (color) => {
	var {r, g, b} = decimalColorToRGBValues(color);
	var hr = r.toString(16).padStart(2, '0');
	var hg = g.toString(16).padStart(2, '0');
	var hb = b.toString(16).padStart(2, '0');
	return "#" + hr + hg + hb;
}

// hex -> decimal
export var hexColorToDecimalColor = (hex) => {
	var r = parseInt(hex.substr(1+2*0,2), 16);
	var g = parseInt(hex.substr(1+2*1,2), 16);
	var b = parseInt(hex.substr(1+2*2,2), 16);
	return rgbValuesToDecimalColor({r, g, b})
}

// decimal -> hsv
export var decimalColorToHSVValues = (color) => {
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

// rgb string stuff

export var decimalColorToRGB = (color) => {
	var c = decimalColorToRGBValues(color);
	return 'rgb('+c.r+','+c.g+','+c.b+')';
}

export var decimalColorAndAlphaToRGBA = (color, alpha) => {
	var c = decimalColorToRGBValues(color);
	return 'rgba('+c.r+','+c.g+','+c.b+','+alpha+')'
}

export var makeCSSFont = (family, size, bold, italic) => {
	return (italic ? 'italic ' : '') + (bold ? 'bold ' : '') + size + 'pt "' + family + '"';
}

export var collision2Rectangles = (a, b) => {
	return (
		a.x1 <= b.x2 &&
		b.x1 <= a.x2 &&
		a.y1 <= b.y2 &&
		b.y1 <= a.y2
	);
}

export var parseArrowString = (string) => {
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

export var stringifyArrowValues = (values) => {
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

export var forceString = (value) => {
	if (typeof value != 'string') {
		return value.toString();
	}
	return value;
}

export var forceReal = (value) => {
	if (typeof value != 'number') {
		return 0;
	}
	return value;
}