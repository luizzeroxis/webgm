//
class ObjectWindow extends Window {

	constructor(/**/) {
		super(...arguments);
	}

	makeClient() {

		this.inputName = add( newTextBox(null, 'Name:') ).$('input');
		this.inputName.addEventListener('input', (e) => { this.isModified = true;
			this.changes.name = e.target.value;
		});

		this.selectSpriteIndex = add( newResourceSelect(null, 'Sprite:', 'sprite', this.editor) )
		this.selectSpriteIndex.$('select').addEventListener('input', (e) => { this.isModified = true;
			this.changes.sprite_index = e.target.value;
		});

		this.inputVisible = add( newCheckBox(null, 'Visible') )
		this.inputVisible.$('input').addEventListener('input', (e) => { this.isModified = true;
			this.changes.visible = e.target.checked;
		});

	}

	resetChanges() {
		super.resetChanges();
		this.inputName.value = this.resource.name;
		if (this.resource.sprite_index >= 0) {
			this.selectSpriteIndex.$('select').value = this.resource.sprite_index;
		} else {
			this.selectSpriteIndex.$('select').selectedIndex = 0;
		}
		this.inputVisible.$('input').checked = this.resource.visible;
	}

}