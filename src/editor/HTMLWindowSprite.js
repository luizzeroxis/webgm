import HTMLWindow from './HTMLWindow.js';

import { parent, endparent, add, newElem, newButton, newTextBox, newNumberBox, newImage} from '../common/tools.js'

import VirtualFileSystem from '../common/VirtualFileSystem.js';
import AbstractImage from '../common/AbstractImage.js';

export default class HTMLWindowSprite extends HTMLWindow {

	constructor(...args) {
		super(...args);
	}

	makeClient(sprite) {
		this.htmlTitle.textContent = 'Edit Sprite '+sprite.name;

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-sprite', 'div') ) )
				parent( add( newElem(null, 'div') ) )

					var paramName = sprite.name;
					var paramImages = sprite.images;
					var paramOriginX = sprite.originx;
					var paramOriginY = sprite.originy;

					var inputName = add( newTextBox(null, 'Name:', paramName) ).$('input');

					add( newButton(null, 'Load Sprite', () => {

						VirtualFileSystem.openDialog('image/*')
						.then(file => {

							paramImages[0] = new AbstractImage(file);
							// TODO check if there is errors or something

							imgSprite.src = paramImages[0].image.src;

							paramImages[0].promise.then(() => {
								divWidth.textContent = paramImages[0].image.width;
								divHeight.textContent = paramImages[0].image.height;
							})

						});

					}) )

					parent( add( newElem(null, 'div', 'Width: ')) )
						var divWidth = add( newElem(null, 'span', '32') )
						endparent()

					parent( add( newElem(null, 'div', 'Height: ')) )
						var divHeight = add( newElem(null, 'span', '32') )
						endparent()

					if (sprite.images.length > 0) {
						sprite.images[0].promise.then(() => {
							divWidth.textContent = sprite.images[0].image.width;
							divHeight.textContent = sprite.images[0].image.height;
						})
					}

					parent( add( newElem(null, 'fieldset') ) )

						add( newElem(null, 'legend', 'Origin') )

						var inputOriginX = add( newNumberBox(null, 'X:', paramOriginX, 1, 0) ).$('input');
						var inputOriginY = add( newNumberBox(null, 'Y:', paramOriginY, 1, 0) ).$('input');

						endparent()

					endparent()

				parent( add( newElem('preview', 'div') ) )
					var imgSprite = add( newImage() )

					if (sprite.images.length > 0) {
						imgSprite.src = sprite.images[0].image.src;
					}
					endparent()

				endparent()

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(sprite, inputName.value);
					this.editor.changeSpriteImages(sprite, paramImages);
					this.editor.changeSpriteOrigin(sprite, parseInt(inputOriginX.value), parseInt(inputOriginY.value));
				},
				() => {
					this.editor.deleteWindow(this);
				}
			);

			endparent();

	}
}