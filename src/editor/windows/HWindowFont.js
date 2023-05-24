import {parent, endparent, add, HElement, HTextInput, HNumberInput, HCheckBoxInput} from "~/common/H.js";
import HWindow from "~/editor/HWindow.js";

export default class HWindowFont extends HWindow {
	constructor(editor, id, font) {
		super(editor, id);

		this.font = font;

		this.updateTitle();

		parent(this.client);
			parent( add( new HElement("div", {class: "window-font"}) ) );

				this.inputName = add( new HTextInput("Name:", font.name) );
				this.inputFont = add( new HTextInput("Font:", font.font) );
				this.inputSize = add( new HNumberInput("Size", font.size, 1, 1) );
				this.inputBold = add( new HCheckBoxInput("Bold", font.bold) );
				this.inputItalic = add( new HCheckBoxInput("Italic", font.italic) );

				this.divPreview = add( new HElement("div", {class: "preview"}, "AaBbCcDd") );
				this.inputFont.input.html.oninput = () => this.updatePreview();
				this.inputSize.input.html.oninput = () => this.updatePreview();
				this.inputBold.input.html.oninput = () => this.updatePreview();
				this.inputItalic.input.html.oninput = () => this.updatePreview();

				this.updatePreview();

				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.project.changeResourceName(font, this.inputName.getValue());
					font.font = this.inputFont.getValue();
					font.size = parseInt(this.inputSize.getValue());
					font.bold = this.inputBold.getChecked();
					font.italic = this.inputItalic.getChecked();

					this.updateTitle();
				},
				() => this.close(),
			);
			endparent();
	}

	updateTitle() {
		this.title.html.textContent = "Font Properties: "+this.font.name;
	}

	updatePreview() {
		this.divPreview.html.style.fontFamily = this.inputFont.getValue();
		this.divPreview.html.style.fontSize = this.inputSize.getValue() + "pt";
		this.divPreview.html.style.fontWeight = (this.inputBold.getChecked() ? "bold" : null);
		this.divPreview.html.style.fontStyle = (this.inputItalic.getChecked() ? "italic" : null);
	}
}