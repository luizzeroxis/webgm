class HTMLWindowCode extends HTMLWindow {

	constructor(...args) {
		super(...args);
	}

	makeClient(action, object) {

		this.action = action;
		this.object = object;

		this.htmlTitle.textContent = 'Execute code';

		parent(this.htmlClient)
			add( newElem(null, 'div', action.getName()) )

			this.textareaCode = add( newElem(null, 'textarea', action.args[0]) )

			// parent( add( newElem('grid-resource resource-font', 'div') ) )
			// 	parent( add( newElem(null, 'div') ) )

			// 		this.inputName = add( newTextBox(null, 'Name:', font.name) ).$('input');
			// 		this.inputFont = add( newTextBox(null, 'Font:', font.font) ).$('input');
			// 		this.inputSize = add( newNumberBox(null, 'Size', font.size, 1, 1) ).$('input');
			// 		this.inputBold = add( newCheckBox(null, 'Bold', font.bold) ).$('input');
			// 		this.inputItalic = add( newCheckBox(null, 'Italic:', font.italic) ).$('input');

			// 		this.divPreview = add( newElem('preview', 'div', 'AaBbCcDd') );
			// 		this.inputFont.oninput = () => this.updatePreview();
			// 		this.inputSize.oninput = () => this.updatePreview();
			// 		this.inputBold.oninput = () => this.updatePreview();
			// 		this.inputItalic.oninput = () => this.updatePreview();

			// 		this.updatePreview();

			// 		endparent()
			// 	endparent()

			this.makeApplyOkButtons(
				() => {
					this.apply()
				},
				() => this.editor.deleteWindow(this)
			);
			endparent();
	}

	apply() {
		this.action.args[0] = this.textareaCode.value;
	}

	close() {
		this.object.deleteActionWindow(this);
	}
}