//
class SpriteWindow extends Window {

	constructor(/**/) {
		super(...arguments);
	}

	makeClient() {

		this.inputName = add( newTextBox(null, 'Name:') ).$('input');
		this.inputName.addEventListener('input', (e) => {
			this.isModified = true;
			this.changes.name = e.target.value;
		});

		add( newButton(null, 'Load Sprite', () => {
			vfs.openDialog('image/*', (file) => {
				if (file) {
					this.isModified = true;
					this.changes.sprite = file;
					this.imgSprite.src = URL.createObjectURL(file);
				}
			});
		}) )

		parent( add( html('div') ) )
			this.imgSprite = add( html('img') )
			endparent()



		this.inputOriginX = add( newNumberBox(null, 'X:', 1, 0) ).$('input');
		this.inputOriginX.addEventListener('input', (e) => {
			this.isModified = true;
			this.changes.originx = e.target.value;
		});

		this.inputOriginY = add( newNumberBox(null, 'Y:', 1, 0) ).$('input');
		this.inputOriginY.addEventListener('input', (e) => {
			this.isModified = true;
			this.changes.originy = e.target.value;
		});

	}

	resetChanges() {
		super.resetChanges();
		this.inputName.value = this.resource.name;
		if (this.resource.sprite instanceof Blob) {
			this.imgSprite.src = URL.createObjectURL(this.resource.sprite);
		}
		this.inputOriginX.value = this.resource.originx;
		this.inputOriginY.value = this.resource.originy;
	}

}