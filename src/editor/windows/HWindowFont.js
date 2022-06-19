import {parent, endparent, add, HElement, HTextInput, HNumberInput, HCheckBoxInput} from '../../common/H.js'
import HPropertiesWindow from '../HPropertiesWindow.js';

export default class HWindowFont extends HPropertiesWindow {

	constructor(manager, id, editor) {
		super(manager, id, editor);

		this.font = id;

		this.title.html.textContent = 'Edit Font '+this.font.name;

		parent(this.client)
			parent( add( new HElement('div', {class: 'grid-resource resource-font'}) ) )
				parent( add( new HElement('div') ) )

					this.inputName = add( new HTextInput('Name:', this.font.name) )
					this.inputFont = add( new HTextInput('Font:', this.font.font) )
					this.inputSize = add( new HNumberInput('Size', this.font.size, 1, 1) )
					this.inputBold = add( new HCheckBoxInput('Bold', this.font.bold) )
					this.inputItalic = add( new HCheckBoxInput('Italic', this.font.italic) )

					this.divPreview = add( new HElement('div', {class: 'preview'}, 'AaBbCcDd') );
					this.inputFont.input.html.oninput = () => this.updatePreview();
					this.inputSize.input.html.oninput = () => this.updatePreview();
					this.inputBold.input.html.oninput = () => this.updatePreview();
					this.inputItalic.input.html.oninput = () => this.updatePreview();

					this.updatePreview();

					endparent()
				endparent()

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(this.font, this.inputName.getValue());
					this.font.font = this.inputFont.getValue();
					this.font.size = parseInt(this.inputSize.getValue());
					this.font.bold = this.inputBold.getChecked();
					this.font.italic = this.inputItalic.getChecked();
					// changes here
				},
				() => this.close()
			);
			endparent();
	}

	updatePreview() {
		this.divPreview.html.style.fontFamily = this.inputFont.getValue();
		this.divPreview.html.style.fontSize = this.inputSize.getValue() + 'pt';
		this.divPreview.html.style.fontWeight = (this.inputBold.getChecked() ? 'bold' : null);
		this.divPreview.html.style.fontStyle = (this.inputItalic.getChecked() ? 'italic' : null);
	}
}