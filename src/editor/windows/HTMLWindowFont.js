import {parent, endparent, add, HTextInput, HNumberInput, HCheckBoxInput, newElem} from '../../common/H.js'
import HTMLWindow from '../HTMLWindow.js';

export default class HTMLWindowFont extends HTMLWindow {

	constructor(...args) {
		super(...args);
	}

	makeClient(font) {
		this.htmlTitle.textContent = 'Edit Font '+font.name;

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-font', 'div') ) )
				parent( add( newElem(null, 'div') ) )

					this.inputName = add( new HTextInput('Name:', font.name) )
					this.inputFont = add( new HTextInput('Font:', font.font) )
					this.inputSize = add( new HNumberInput('Size', font.size, 1, 1) )
					this.inputBold = add( new HCheckBoxInput('Bold', font.bold) )
					this.inputItalic = add( new HCheckBoxInput('Italic', font.italic) )

					this.divPreview = add( newElem('preview', 'div', 'AaBbCcDd') );
					this.inputFont.input.html.oninput = () => this.updatePreview();
					this.inputSize.input.html.oninput = () => this.updatePreview();
					this.inputBold.input.html.oninput = () => this.updatePreview();
					this.inputItalic.input.html.oninput = () => this.updatePreview();

					this.updatePreview();

					endparent()
				endparent()

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(font, this.inputName.getValue());
					font.font = this.inputFont.getValue();
					font.size = parseInt(this.inputSize.getValue());
					font.bold = this.inputBold.getChecked();
					font.italic = this.inputItalic.getChecked();
					// changes here
				},
				() => this.close()
			);
			endparent();
	}

	updatePreview() {
		this.divPreview.style.fontFamily = this.inputFont.getValue();
		this.divPreview.style.fontSize = this.inputSize.getValue() + 'pt';
		this.divPreview.style.fontWeight = (this.inputBold.getChecked() ? 'bold' : null);
		this.divPreview.style.fontStyle = (this.inputItalic.getChecked() ? 'italic' : null);
	}
}