import {parent, endparent, add, HElement} from "~/common/h";

import "./HCodeEditor.scss";

export default class HCodeEditor extends HElement {
	constructor(code) {
		super("div", {class: "h-code-editor"});

		this.tabEnabled = false;

		parent(this);

			this.textareaCode = add( new HElement("textarea", {class: "h-code"}, code) );
			this.textareaCode.html.spellcheck = false;
			this.textareaCode.html.addEventListener("keydown", e => {
				if (e.code == "Tab" && e.shiftKey == false) {
					if (this.tabEnabled) {
						e.preventDefault();
						this.textareaCode.html.setRangeText("\t", this.textareaCode.html.selectionStart, this.textareaCode.html.selectionEnd, "end");
					}
				} else if (e.code == "Escape") {
					this.tabEnabled = false;
				} else {
					this.tabEnabled = true;
				}
			});
			this.textareaCode.html.addEventListener("mousedown", () => {
				this.tabEnabled = true;
			});
			this.textareaCode.html.addEventListener("focusout", () => {
				this.tabEnabled = false;
			});

			endparent();
	}

	onAdd() {
		this.textareaCode.html.focus();
	}

	getValue() {
		return this.textareaCode.html.value;
	}
}