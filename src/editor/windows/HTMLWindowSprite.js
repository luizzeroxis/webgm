import AbstractImage from '../../common/AbstractImage.js';
import {$, parent, endparent, add, newElem, newButton, newTextBox, newNumberBox, newImage, setOnFileDrop} from '../../common/H.js'
import VirtualFileSystem from '../../common/VirtualFileSystem.js';
import HTMLWindow from '../HTMLWindow.js';

export default class HTMLWindowSprite extends HTMLWindow {

	constructor(...args) {
		super(...args);
	}

	makeClient(sprite) {
		this.sprite = sprite;
		this.htmlTitle.textContent = 'Edit Sprite '+sprite.name;

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-sprite', 'div') ) )
				parent( add( newElem(null, 'div') ) )

					var paramName = sprite.name;
					this.paramImages = sprite.images;
					var paramOriginX = sprite.originx;
					var paramOriginY = sprite.originy;

					var inputName = $( add( newTextBox(null, 'Name:', paramName) ), 'input');

					add( newButton(null, 'Load Sprite', () => {

						VirtualFileSystem.openDialog('image/*')
						.then(file => {
							this.loadSpriteFromFile(file);
						});

					}) )

					parent( add( newElem(null, 'div', 'Width: ')) )
						this.divWidth = add( newElem(null, 'span', '32') )
						endparent()

					parent( add( newElem(null, 'div', 'Height: ')) )
						this.divHeight = add( newElem(null, 'span', '32') )
						endparent()

					if (sprite.images.length > 0) {
						sprite.images[0].promise.then(() => {
							this.divWidth.textContent = sprite.images[0].image.width;
							this.divHeight.textContent = sprite.images[0].image.height;
						})
					}

					parent( add( newElem(null, 'fieldset') ) )

						add( newElem(null, 'legend', 'Origin') )

						var inputOriginX = $( add( newNumberBox(null, 'X:', paramOriginX, 1, 0) ), 'input');
						var inputOriginY = $( add( newNumberBox(null, 'Y:', paramOriginY, 1, 0) ), 'input');
						
						add( newButton(null, 'Center', () => {
							var w=16, h=16;
							if (sprite.images.length > 0) {
								w = Math.floor(sprite.images[0].image.width / 2);
								h = Math.floor(sprite.images[0].image.height / 2);
							}
							inputOriginX.value = w;
							inputOriginY.value = h;
						}) )

						endparent()

					endparent()

				parent( add( newElem('preview', 'div') ) )
					this.imgSprite = add( newImage() )

					if (sprite.images.length > 0) {
						this.imgSprite.src = sprite.images[0].image.src;
					}
					endparent()

				endparent()

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(sprite, inputName.value);
					this.editor.changeSpriteImages(sprite, this.paramImages);
					this.editor.changeSpriteOrigin(sprite, parseInt(inputOriginX.value), parseInt(inputOriginY.value));
				},
				() => this.close()
			);

			endparent();

		// Open file if dropped in the window body
		setOnFileDrop(this.html, file => this.loadSpriteFromFile(file));

	}

	loadSpriteFromFile(file) {
		var image = new AbstractImage(file);

		this.imgSprite.src = image.image.src;

		image.promise.then(() => {
			this.paramImages[0] = image;
			this.divWidth.textContent = this.paramImages[0].image.width;
			this.divHeight.textContent = this.paramImages[0].image.height;
		}).catch(e => {
			if (this.sprite.images.length > 0) {
				this.imgSprite.src = this.sprite.images[0].image.src;
			} else {
				this.imgSprite.removeAttribute('src');
			}
			alert("Error when opening image");
		})
	}
}