//
class FontWindow extends ResourceWindow {

	constructor(/**/) {
		super(...arguments);
	}

	makeResourceClient() {

		this.inputName = add( newTextBox(null, 'Name:') ).$('input');
		this.inputName.addEventListener('input', (e) => { this.isModified = true;
			this.changes.name = e.target.value;
		});

		this.inputFont = add( newTextBox(null, 'Font:') ).$('input');
		this.inputFont.addEventListener('input', (e) => { this.isModified = true;
			this.changes.font = e.target.value;
			this.divPreview.style.fontFamily = e.target.value;
		});

		this.inputSize = add( newNumberBox(null, 'Size:', null, 1, 1, 99) ).$('input');
		this.inputSize.addEventListener('input', (e) => { this.isModified = true;
			this.changes.size = e.target.value;
			this.divPreview.style.fontSize = e.target.value + 'pt';
		});

		this.inputBold = add( newCheckBox(null, 'Bold') ).$('input')
		this.inputBold.addEventListener('input', (e) => { this.isModified = true;
			this.changes.bold = e.target.checked;
			this.divPreview.style.fontWeight = (e.target.checked) ? 'bold' : 'normal';
		});

		this.inputItalic = add( newCheckBox(null, 'Italic') ).$('input')
		this.inputItalic.addEventListener('input', (e) => { this.isModified = true;
			this.changes.italic = e.target.checked;
			this.divPreview.style.fontStyle = (e.target.checked) ? 'italic' : 'normal';
		});

		this.divPreview = add( newElem('preview', 'div', 'AaBbCcDd') )

		this.makeApplyOkButtons();

	}

	resetChanges() {
		super.resetChanges();
		this.inputName.value = this.resource.name;

		this.inputFont.value = this.resource.font;
		this.divPreview.style.fontFamily = this.resource.font;

		this.inputSize.value = this.resource.size;
		this.divPreview.style.fontSize = this.resource.size + 'pt';

		this.inputBold.value = this.resource.bold;
		this.divPreview.style.fontWeight = (this.resource.bold) ? 'bold' : 'normal';

		this.inputItalic.value = this.resource.italic;
		this.divPreview.style.fontStyle = (this.resource.italic) ? 'italic' : 'normal';
	}

}