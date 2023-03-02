import {HElement, parent, endparent, add, classToAttr, classToArray, uniqueID, removeChildren} from "./HCore.js";

import "./HComponents.scss";

export class HButton extends HElement {
	constructor(text, onClick, _class) {
		super("button", {class: classToAttr(_class)}, text);
		this.html.addEventListener("click", onClick);
	}

	setDisabled(disabled) {
		this.html.disabled = disabled;
	}
}

export class HCanvas extends HElement {
	constructor(width, height, _class) {
		super("canvas", {class: classToAttr(_class), width: width, height: height});
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
		parent( super("div", {class: classToAttr([...classToArray(_class), "h-label-and-input"])}) );
			const id = "_id_" + uniqueID();
			if (label) {
				this.label = add( new HElement("label", {for: id}, label) );
			}
			this.input = add( new HElement("input", {id: id, type: type, value: value}) );
			endparent();
	}

	getValue() {
		return this.input.html.value;
	}

	setValue(value) {
		this.input.html.value = value;
	}

	setOnChange(onChange) {
		this.input.html.addEventListener("change", e => onChange.apply(this, [this, e]));
	}
}

export class HTextInput extends HLabelAndInput {
	constructor(label, value, _class) {
		super("text", label, value, _class);
	}
}

export class HMultilineTextInput extends HElement {
	constructor(label, value, _class) {
		parent( super("div", {class: classToAttr([...classToArray(_class), "h-multiline-text-input"])}) );
			const id = "_id_" + uniqueID();
			if (label) {
				this.label = add( new HElement("label", {for: id}, label) );
			}
			this.textarea = add( new HElement("textarea", {id: id}) );
			this.textarea.html.value = value;
			endparent();
	}

	getValue() {
		return this.textarea.html.value;
	}
}

export class HNumberInput extends HLabelAndInput {
	constructor(label, value, step, min, max, _class) {
		super("number", label, value, _class);
		if (this.input.html.step != null) this.input.html.step = step;
		if (this.input.html.min != null) this.input.html.min = min;
		if (this.input.html.max != null) this.input.html.max = max;
	}

	getIntValue(def=0) {
		const value = parseInt(this.input.html.value);
		if (Number.isNaN(value)) return def;
		return value;
	}

	getFloatValue(def=0) {
		const value = parseFloat(this.input.html.value);
		if (Number.isNaN(value)) return def;
		return value;
	}
}

export class HRangeInput extends HLabelAndInput {
	constructor(label, value, step, min, max, _class) {
		super("range", label, value, _class);
		this.input.html.step = step;
		this.input.html.min = min;
		this.input.html.max = max;
	}
}

export class HColorInput extends HLabelAndInput {
	constructor(label, value, _class) {
		super("color", label, value, [...classToArray(_class), "h-color-input"]);
	}
}

export class HCheckBoxInput extends HElement {
	constructor(label, checked, _class) {
		parent( super("div", {class: classToAttr(_class)}) );
			const id = "_id_" + uniqueID();
			this.input = add( new HElement("input", {
				id: id, type: "checkbox",
				...(checked ? {checked: "checked"} : null),
			}) );
			if (label) {
				this.label = add( new HElement("label", {for: id}, label) );
			}
			endparent();
	}

	getChecked() {
		return this.input.html.checked;
	}

	setChecked(checked) {
		this.input.html.checked = checked;
	}

	setOnChange(onChange) {
		this.input.html.addEventListener("change", onChange);
	}
}

export class HRadioInput extends HElement {
	constructor(group, label, checked, _class) {
		parent( super("div", {class: classToAttr(_class)}) );
			const id = "_id_" + uniqueID();
			this.input = add( new HElement("input", {
				id: id, type: "radio", name: group,
				...(checked ? {checked: "checked"} : null),
			}) );
			if (label) {
				this.label = add( new HElement("label", {for: id}, label) );
			}
			endparent();
	}

	getChecked() {
		return this.input.html.checked;
	}

	setOnClick(onClick) {
		this.input.html.addEventListener("click", onClick);
	}
}

export class HSelect extends HElement {
	constructor(label, _class) {
		parent( super("div", {class: classToAttr([...classToArray(_class), "h-select"])}) );
			const id = "_id_" + uniqueID();
			if (label) {
				this.label = add( new HElement("label", {for: id}, label) );
			}
			this.select = add( new HElement("select", {id: id}) );
			endparent();
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

	getSelectedIndexes() {
		return Array.from(this.select.html.selectedOptions).map(option => option.index);
	}

	setSelectedIndexes(indexes) {
		for (const option of this.select.html.options) {
			option.selected = indexes.includes(option.index);
		}
	}

	setOnChange(onChange) {
		this.select.html.addEventListener("change", onChange);
	}

	removeOptions() {
		removeChildren(this.select);
	}
}

export class HOption extends HElement {
	constructor(text, value, _class) {
		super("option", {class: classToAttr(_class), value: value}, text);
	}
}

export class HSelectWithOptions extends HSelect {
	constructor(label, options, value, _class) {
		super(label, _class);

		parent(this.select);
			for (const option of options) {
				add( new HOption(option.name, option.value) );
			}
			endparent();

		if (value) {
			this.setValue(value);
		}
	}
}

export class HImage extends HElement {
	constructor(src, _class) {
		super("img", {class: classToAttr(_class), ...(src ? {src: src} : null)});
	}

	setSrc(src) {
		if (src != null) {
			this.html.src = src;
		} else {
			this.html.removeAttribute("src");
		}
	}
}