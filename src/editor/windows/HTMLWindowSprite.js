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

					this.buttonLoadSprite = add( newButton(null, 'Load Sprite', () => {

						VirtualFileSystem.openDialog('image/*', true)
						.then(files => {
							this.loadSpriteFromFiles(files);
						});

					}) )

					parent( add( newElem(null, 'div', 'Width: ')) )
						this.divWidth = add( newElem(null, 'span') )
						endparent()

					parent( add( newElem(null, 'div', 'Height: ')) )
						this.divHeight = add( newElem(null, 'span') )
						endparent()

					parent( add( newElem(null, 'div', 'Number of subimages: ')) )
						this.divSubimages = add( newElem(null, 'span') )
						endparent()

					this.showSubimage = 0;

					parent( add( newElem(null, 'div', 'Show: ')) )

						this.buttonShowSubimageLeft = add( newButton(null, '◀', () => {
							this.showSubimage -= 1;
							this.updateShow();
						}) )
						this.divShowSubimage = add( newElem(null, 'span') )
						this.buttonShowSubimageRight = add( newButton(null, '▶', () => {
							this.showSubimage += 1;
							this.updateShow();
						}) )

						endparent()

					parent( add( newElem(null, 'fieldset') ) )

						add( newElem(null, 'legend', 'Origin') )

						var inputOriginX = $( add( newNumberBox(null, 'X:', paramOriginX, 1, 0) ), 'input');
						var inputOriginY = $( add( newNumberBox(null, 'Y:', paramOriginY, 1, 0) ), 'input');
						
						add( newButton(null, 'Center', () => {
							var w=16, h=16;
							if (this.paramImages.length > 0) {
								w = Math.floor(this.paramImages[0].image.width / 2);
								h = Math.floor(this.paramImages[0].image.height / 2);
							}
							inputOriginX.value = w;
							inputOriginY.value = h;
						}) )

						endparent()

					endparent()

				parent( add( newElem('preview', 'div') ) )
					this.imgSprite = add( newImage() )
					endparent()

				this.updateAsImages();

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
		setOnFileDrop(this.html, files => this.loadSpriteFromFiles(files), true);

	}

	loadSpriteFromFiles(files) {
		this.buttonLoadSprite.disabled = true;

		var images = [];

		for (let file of files) {
			images.push(new AbstractImage(file));
		}

		// Update preview to show images being loaded
		// this.updateAsImages(images);

		Promise.all(images.map(x => x.promise)).then(() => {
			this.paramImages = images;
			this.updateAsImages();
		}).catch(e => {
			// this.updateAsImages();
			alert("Error when opening image");

		}).finally(() => {
			this.buttonLoadSprite.disabled = false;
		})

	}

	updateAsImages() {
		this.showSubimage = 0;

		if (this.paramImages.length > 0) {

			this.paramImages[0].promise.then(() => {
				this.divWidth.textContent = this.paramImages[0].image.width;
				this.divHeight.textContent = this.paramImages[0].image.height;
			})

		} else {
			this.imgSprite.removeAttribute('src');
			this.divWidth.textContent = '32';
			this.divHeight.textContent = '32';
		}

		this.divSubimages.textContent = this.paramImages.length.toString();

		this.updateShow();

	}

	updateShow() {

		if (this.paramImages.length > 0) {
			this.imgSprite.src = this.paramImages[this.showSubimage].image.src;
		}

		this.divShowSubimage.textContent = this.showSubimage.toString();
		this.buttonShowSubimageLeft.disabled = (this.showSubimage == 0);
		this.buttonShowSubimageRight.disabled = (this.showSubimage >= this.paramImages.length - 1);
	}

}