import {parent, endparent, add, newElem} from '../common/H.js'

export default class HTMLCodeEditor {

	constructor(code) {

		this.nextElem = null;

		this.html = parent( add( newElem(null, 'div') ) )

			this.textareaCode = add( newElem('code', 'textarea', code) )
			this.textareaCode.title = "Press Esc to continue keyboard navigation!";
			this.textareaCode.addEventListener('keydown', e => {
				if (e.code == "Tab" && e.shiftKey == false) {
					e.preventDefault();
					this.textareaCode.setRangeText('\t', this.textareaCode.selectionStart, this.textareaCode.selectionEnd, 'end');
				} else if (e.code == "Escape") {
					this.nextElem.focus();
				}
			})

			endparent()
	}

	setNextElem(nextElem) {
		this.nextElem = nextElem;
	}

	getValue() {
		return this.textareaCode.value;
	}

}