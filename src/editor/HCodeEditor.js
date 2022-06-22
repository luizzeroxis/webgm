import {parent, endparent, add, HElement} from '../common/H.js'

export default class HCodeEditor extends HElement {
	constructor(code) {
		super('div')

		this.nextElem = null;

		parent(this)

			this.textareaCode = add( new HElement('textarea', {class: 'code'}, code) )
			this.textareaCode.html.title = "Press Esc to continue keyboard navigation!";
			this.textareaCode.html.addEventListener('keydown', e => {
				if (e.code == "Tab" && e.shiftKey == false) {
					e.preventDefault();
					this.textareaCode.html.setRangeText('\t', this.textareaCode.html.selectionStart, this.textareaCode.html.selectionEnd, 'end');
				} else if (e.code == "Escape") {
					this.nextElem.html.focus();
				}
			})

			endparent()
	}

	setNextElem(nextElem) {
		this.nextElem = nextElem;
	}

	getValue() {
		return this.textareaCode.html.value;
	}
}