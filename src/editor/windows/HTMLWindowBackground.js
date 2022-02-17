import AbstractImage from '../../common/AbstractImage.js'
import {$, parent, endparent, add, newElem, newButton, newTextBox, newImage} from '../../common/H.js'
import VirtualFileSystem from '../../common/VirtualFileSystem.js'
import HTMLWindow from '../HTMLWindow.js';

export default class HTMLWindowBackground extends HTMLWindow {
	
	constructor(...args) {
		super(...args);
	}

	makeClient(background) {
		this.htmlTitle.textContent = 'Edit Background '+background.name;

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-background', 'div') ) )
				parent( add( newElem(null, 'div') ) )

					var paramName = background.name;
					var paramImage = background.image;

					var inputName = $( add( newTextBox(null, 'Name:', paramName) ), 'input');

					add( newButton(null, 'Load Background', () => {

						VirtualFileSystem.openDialog('image/*')
						.then(file => {

							paramImage = new AbstractImage(file);
							// TODO check if there is errors or something

							imgBackground.src = paramImage.image.src;

							paramImage.promise.then(() => {
								divWidth.textContent = paramImage.image.width;
								divHeight.textContent = paramImage.image.height;
							})

						});

					}) )

					parent( add( newElem(null, 'div', 'Width: ')) )
						var divWidth = add( newElem(null, 'span', '0') )
						endparent()

					parent( add( newElem(null, 'div', 'Height: ')) )
						var divHeight = add( newElem(null, 'span', '0') )
						endparent()

					if (background.image) {
						background.image.promise.then(() => {
							divWidth.textContent = background.image.image.width;
							divHeight.textContent = background.image.image.height;
						})
					}
					
					endparent()

				parent( add( newElem('preview', 'div') ) )
					var imgBackground = add( newImage() )

					if (background.image) {
						imgBackground.src = background.image.image.src;
					}
					endparent()

				endparent()

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(background, inputName.value);
					this.editor.changeBackgroundImage(background, paramImage);
				},
				() => this.close()
			);
			endparent();
	}
}