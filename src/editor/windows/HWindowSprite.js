import AbstractImage from '../../common/AbstractImage.js';
import {parent, endparent, add, HElement, HButton, HTextInput, HNumberInput, HImage, HCheckBoxInput, setOnFileDrop} from '../../common/H.js'
import VirtualFileSystem from '../../common/VirtualFileSystem.js';
import HWindow from '../HWindow.js';

export default class HWindowSprite extends HWindow {

	constructor(editor, id, sprite) {
		super(editor, id);

		this.sprite = sprite;
		
		this.title.html.textContent = 'Edit Sprite '+sprite.name;

		parent(this.client)
			parent( add( new HElement('div', {class: 'grid-resource resource-sprite'}) ) )
				parent( add( new HElement('div') ) )

					const paramName = sprite.name;
					this.paramImages = sprite.images;
					const paramOriginX = sprite.originx;
					const paramOriginY = sprite.originy;

					const inputName = add( new HTextInput('Name:', paramName) )

					this.buttonLoadSprite = add( new HButton('Load Sprite', () => {

						VirtualFileSystem.openDialog('image/*', true)
						.then(files => {
							this.loadSpriteFromFiles(files);
						});

					}) )

					parent( add( new HElement('div', {}, 'Width: ')) )
						this.divWidth = add( new HElement('span') )
						endparent()

					parent( add( new HElement('div', {}, 'Height: ')) )
						this.divHeight = add( new HElement('span') )
						endparent()

					parent( add( new HElement('div', {}, 'Number of subimages: ')) )
						this.divSubimages = add( new HElement('span') )
						endparent()

					this.showSubimage = 0;

					parent( add( new HElement('div', {}, 'Show: ')) )

						this.buttonShowSubimageLeft = add( new HButton('◀', () => {
							this.showSubimage -= 1;
							this.updateShow();
						}) )
						this.divShowSubimage = add( new HElement('span') )
						this.buttonShowSubimageRight = add( new HButton('▶', () => {
							this.showSubimage += 1;
							this.updateShow();
						}) )

						endparent()

					parent( add( new HElement('fieldset') ) )

						add( new HElement('legend', {}, 'Origin') )

						const inputOriginX = add( new HNumberInput('X:', paramOriginX, 1, 0) )
						const inputOriginY = add( new HNumberInput('Y:', paramOriginY, 1, 0) )
						
						add( new HButton('Center', () => {
							let w=16, h=16;
							if (this.paramImages.length > 0) {
								w = Math.floor(this.paramImages[0].image.width / 2);
								h = Math.floor(this.paramImages[0].image.height / 2);
							}
							inputOriginX.setValue(w);
							inputOriginY.setValue(h);
						}) )

						endparent()

					endparent()

				parent( add( new HElement('div', {class: 'mask'}) ) )
					parent( add( new HElement('fieldset') ) )
						add( new HElement('legend', {}, 'Collision Checking') )

						const inputPreciseCollisionChecking = add( new HCheckBoxInput('Precise collision checking', (sprite.shape == 'precise')) )

						endparent()
					endparent()

				parent( add( new HElement('div', {class: 'preview'}) ) )
					this.imgSprite = add( new HImage() )
					endparent()

				this.updateImageInfo();

				endparent()

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(sprite, inputName.getValue());
					this.editor.changeSpriteImages(sprite, this.paramImages);
					this.editor.changeSpriteOrigin(sprite, parseInt(inputOriginX.getValue()), parseInt(inputOriginY.getValue()));

					sprite.shape = inputPreciseCollisionChecking.getChecked() ? 'precise' : 'rectangle';
				},
				() => this.close(),
			);

			endparent();

		// Open file if dropped in the window body
		setOnFileDrop(this.html, files => this.loadSpriteFromFiles(files), true);

	}

	loadSpriteFromFiles(files) {
		this.buttonLoadSprite.setDisabled(true);

		const images = [];

		for (const file of files) {
			images.push(new AbstractImage(file));
		}

		Promise.all(images.map(x => x.promise)).then(() => {
			this.paramImages = images;
			this.updateImageInfo();
		}).catch(e => {
			// this.updateImageInfo();
			alert("Error when opening image");

		}).finally(() => {
			this.buttonLoadSprite.setDisabled(false);
		})

	}

	updateImageInfo() {
		this.showSubimage = 0;

		if (this.paramImages.length > 0) {

			this.paramImages[0].promise.then(() => {
				this.divWidth.textContent = this.paramImages[0].image.width;
				this.divHeight.textContent = this.paramImages[0].image.height;
			})

		} else {
			this.imgSprite.setSrc(null);
			this.divWidth.textContent = '32';
			this.divHeight.textContent = '32';
		}

		this.divSubimages.textContent = this.paramImages.length.toString();

		this.updateShow();

	}

	updateShow() {

		if (this.paramImages.length > 0) {
			this.imgSprite.setSrc(this.paramImages[this.showSubimage].image.src);
		}

		this.divShowSubimage.textContent = this.showSubimage.toString();
		this.buttonShowSubimageLeft.setDisabled(this.showSubimage == 0);
		this.buttonShowSubimageRight.setDisabled(this.showSubimage >= this.paramImages.length - 1);
	}

}