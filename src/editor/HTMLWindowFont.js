import HTMLWindow from './HTMLWindow.js';

import {$, parent, endparent, add, newElem, newTextBox, newNumberBox, newCheckBox} from '../common/H.js'

export default class HTMLWindowFont extends HTMLWindow {

	constructor(...args) {
		super(...args);
	}

	makeClient(font) {
		this.htmlTitle.textContent = 'Edit Font '+font.name;

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-font', 'div') ) )
				parent( add( newElem(null, 'div') ) )

					this.inputName = $( add( newTextBox(null, 'Name:', font.name) ), 'input');
					this.inputFont = $( add( newTextBox(null, 'Font:', font.font) ), 'input');
					this.inputSize = $( add( newNumberBox(null, 'Size', font.size, 1, 1) ), 'input');
					this.inputBold = $( add( newCheckBox(null, 'Bold', font.bold) ), 'input');
					this.inputItalic = $( add( newCheckBox(null, 'Italic', font.italic) ), 'input');

					this.divPreview = add( newElem('preview', 'div', 'AaBbCcDd') );
					this.inputFont.oninput = () => this.updatePreview();
					this.inputSize.oninput = () => this.updatePreview();
					this.inputBold.oninput = () => this.updatePreview();
					this.inputItalic.oninput = () => this.updatePreview();

					this.updatePreview();

					endparent()
				endparent()

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(font, this.inputName.value);
					font.font = this.inputFont.value;
					font.size = parseInt(this.inputSize.value);
					font.bold = this.inputBold.checked;
					font.italic = this.inputItalic.checked;
					// changes here
				},
				() => this.editor.deleteWindow(this)
			);
			endparent();
	}

	updatePreview() {
		//this.divPreview.style.font = makeCSSFont(this.inputFont.value, this.inputSize.value, this.inputBold.checked, this.inputItalic.checked);
		this.divPreview.style.fontFamily = this.inputFont.value;
		this.divPreview.style.fontSize = this.inputSize.value + 'pt';
		this.divPreview.style.fontWeight = (this.inputBold.checked ? 'bold' : null);
		this.divPreview.style.fontStyle = (this.inputItalic.checked ? 'italic' : null);
	}
}