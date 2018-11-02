//
class SpriteWindow extends Window {

	constructor(/**/) {
		super(...arguments);
	}

	makeClient() {

		parent( add( newElem('grid-sprite', 'div') ) )
			parent( add( newElem(null, 'div') ) )

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

				// TODO: This is a workaround, will be replaced by Edit Sprite, where you can remove individual subsprites.
				add( newButton(null, 'Remove Sprite', () => {
					this.changes.sprite = null;
					this.imgSprite.src = '';
				}) );

				parent( add( newElem(null, 'div', 'Width: ')) )
					this.divWidth = add( newElem(null, 'span', '32') )
					endparent()

				parent( add( newElem(null, 'div', 'Height: ')) )
					this.divHeight = add( newElem(null, 'span', '32') )
					endparent()

				parent( add( newElem(null, 'fieldset') ) )

					add( newElem(null, 'legend', 'Origin') )

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

					endparent()

				endparent()

			parent( add( newElem(null, 'div') ) )
				this.imgSprite = add( html('img') )
				this.imgSprite.addEventListener('load', () => {
					this.divWidth.innerText = this.imgSprite.width;
					this.divHeight.innerText = this.imgSprite.height;
				})
				endparent()

			endparent()

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