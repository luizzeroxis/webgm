//Bunch of random functions that make my life easier

//= Base 64 =
export function base64ToBlob (base64Data, contentType) {
	contentType = contentType || '';
	const sliceSize = 1024;
	const byteCharacters = atob(base64Data);
	const bytesLength = byteCharacters.length;
	const slicesCount = Math.ceil(bytesLength / sliceSize);
	const byteArrays = new Array(slicesCount);

	for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
		const begin = sliceIndex * sliceSize;
		const end = Math.min(begin + sliceSize, bytesLength);

		const bytes = new Array(end - begin);
		for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
			bytes[i] = byteCharacters[offset].charCodeAt(0);
		}
		byteArrays[sliceIndex] = new Uint8Array(bytes);
	}
	return new Blob(byteArrays, { type: contentType });
}

// decimal -> rgb
export function decimalColorToRGBValues(color) {
	return {
		r: color % 256,
		g: Math.floor(color % (256*256) / 256),
		b: Math.floor(color % (256*256*256) / (256*256)),
	}
}

// rgb -> decimal
export function rgbValuesToDecimalColor(rgb) {
	return rgb.r + rgb.g * 256 + rgb.b * 256*256;
}

// decimal -> hex
export function decimalColorToHexColor(color) {
	const {r, g, b} = decimalColorToRGBValues(color);
	const hr = r.toString(16).padStart(2, '0');
	const hg = g.toString(16).padStart(2, '0');
	const hb = b.toString(16).padStart(2, '0');
	return "#" + hr + hg + hb;
}

// hex -> decimal
export function hexColorToDecimalColor(hex) {
	const r = parseInt(hex.substr(1+2*0, 2), 16);
	const g = parseInt(hex.substr(1+2*1, 2), 16);
	const b = parseInt(hex.substr(1+2*2, 2), 16);
	return rgbValuesToDecimalColor({r, g, b})
}

// decimal -> hsv
export function decimalColorToHSVValues(color) {
	return rgbValuesToHSVValues(decimalColorToRGBValues(color))
}

// rgb -> hsv
export function rgbValuesToHSVValues(rgb) {
	const {r, g, b} = rgb;
	
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);

	const d = max - min;

	let h;
	const s = (max == 0) ? 0 : Math.floor(255 * d / max);
	const v = max;

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

export function decimalColorToRGB(color) {
	const c = decimalColorToRGBValues(color);
	return 'rgb('+c.r+','+c.g+','+c.b+')';
}

export function decimalColorAndAlphaToRGBA(color, alpha) {
	const c = decimalColorToRGBValues(color);
	return 'rgba('+c.r+','+c.g+','+c.b+','+alpha+')'
}

export function makeCSSFont(family, size, bold, italic) {
	return (italic ? 'italic ' : '') + (bold ? 'bold ' : '') + size + 'pt "' + family + '"';
}

export function parseArrowString(string) {
	const values = [];

	for (let i = 0; i < 9; ++i) {
		if (string[i] != "0") {
			values.push(true);
		} else {
			values.push(false);
		}
	}

	return values;
}

export function stringifyArrowValues(values) {
	let string = "";

	for (let i = 0; i < 9; ++i) {
		if (values[i]) {
			string += "1";
		} else {
			string += "0";
		}
	}

	return string;
}

export function asString(value) {
	if (typeof value != 'string') {
		return value.toString();
	}
	return value;
}

export function forceString(value) {
	if (typeof value != 'string') {
		return "";
	}
	return value;
}

export function forceReal(value) {
	if (typeof value != 'number') {
		return 0;
	}
	return value;
}

export function forceInteger(value) {
	return toInteger(forceReal(value));
}

export function forceBool(value) {
	return (forceReal(value) > 0.5) ? 1 : 0;
}

export function forceUnit(value) {
	return Math.max(0, Math.min(forceReal(value), 1));
}

export function forceChar(value) {
	const string = forceString(value);
	return string != '' ? string[0] : '\0';
}

export function toInteger(value) {
	if (Math.abs(value % 1) == 0.5) {
		const integer = Math.trunc(value)
		if (integer % 2 == 0) {
			return integer;
		} else {
			return integer + Math.sign(integer);
		}
	} else {
		return Math.round(value);
	}
}

export function parseNewLineHash(string) {
	// Replace # without backslash before and \r with \n, then replace \# with #.
	return string.replaceAll(/(?<!\\)#|\r/g, "\n").replaceAll("\\#", "#");
}