// Bunch of random functions that make my life easier

import {HElement} from "./h";

// Math

export function mod(n, d) {
	return ((n % d) + d) % d;
}

export function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

export function sortByType(array, ascending) {
	array.sort((a, b) => {
		if (typeof a == "number" && typeof b == "number") {
			return ascending ? a-b : b-a;
		} else if (typeof a == "string" && typeof b == "string") {
			return ascending ? a.localeCompare(b) : b.localeCompare(a);
		} else if (typeof a == "number" && typeof b == "string") {
			return ascending ? -1 : 1;
		} else if (typeof a == "string" && typeof b == "number") {
			return ascending ? 1 : -1;
		}
		return 0;
	});
}

// Open and save files

export function openFile(accept, multiple=false) {
	return new Promise((resolve) => {
		const f = new HElement("input");
		f.html.accept = accept;
		f.html.type = "file";
		if (multiple) {
			f.html.multiple = true;
		}
		f.html.addEventListener("change", () => {
			if (multiple) {
				resolve(f.html.files);
			} else {
				resolve(f.html.files[0]);
			}
		});
		f.html.click();
	});
}

export function saveFile(blob, name) {
	const a = new HElement("a");
	a.html.href = URL.createObjectURL(blob);
	a.html.download = name;
	a.html.click();
}

export function readFileAsText(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener("load", () => {
			resolve(reader.result);
		});
		reader.addEventListener("error", (e) => {
			reject(e);
		});
		reader.readAsText(file);
	});
}

// decimal -> rgb
export function decimalToRGB(color) {
	return {
		r: color % 256,
		g: Math.floor(color % (256*256) / 256),
		b: Math.floor(color % (256*256*256) / (256*256)),
	};
}

// rgb -> decimal
export function rgbToDecimal(rgb) {
	return rgb.r + rgb.g * 256 + rgb.b * 256*256;
}

// decimal -> hex
export function decimalToHex(color) {
	const {r, g, b} = decimalToRGB(color);
	const hr = r.toString(16).padStart(2, "0");
	const hg = g.toString(16).padStart(2, "0");
	const hb = b.toString(16).padStart(2, "0");
	return "#" + hr + hg + hb;
}

// hex -> decimal
export function hexToDecimal(hex) {
	const r = parseInt(hex.substr(1+2*0, 2), 16);
	const g = parseInt(hex.substr(1+2*1, 2), 16);
	const b = parseInt(hex.substr(1+2*2, 2), 16);
	return rgbToDecimal({r, g, b});
}

// decimal -> hsv
export function decimalToHSV(color) {
	return rgbToHSV(decimalToRGB(color));
}

// rgb -> hsv
export function rgbToHSV(rgb) {
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

	return {h, s, v};
}

// rgb string stuff

export function decimalToHexAlpha(color, alpha) {
	return decimalToHex(color) + Math.round(alpha * 255).toString(16).padStart(2, "0");
}

export function hexAlphaToDecimal(hex) {
	return {
		color: hexToDecimal(hex),
		alpha: (parseInt(hex.substr(1+2*3, 2), 16) / 255),
	};
}

export function makeCSSFont(family, size, bold, italic) {
	return (italic ? "italic " : "") + (bold ? "bold " : "") + size + "pt \"" + family + "\"";
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
	if (typeof value != "string") {
		return value.toString();
	}
	return value;
}

export function forceString(value) {
	if (typeof value != "string") {
		return "";
	}
	return value;
}

export function forceReal(value) {
	if (typeof value != "number") {
		return 0;
	}
	return value;
}

export function forceInteger(value) {
	return toInteger(forceReal(value));
}

export function forceBool(value) {
	return (forceReal(value) > 0.5);
}

export function forceUnit(value) {
	return Math.max(0, Math.min(forceReal(value), 1));
}

export function forceChar(value) {
	const string = forceString(value);
	return string != "" ? string[0] : "\0";
}

export function toInteger(value) {
	if (Math.abs(value % 1) == 0.5) {
		const integer = Math.trunc(value);
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

// Elements

// Make a element be able to receive drops of files from anywhere, but returns a file handle
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