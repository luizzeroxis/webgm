import AbstractImage from '../../common/AbstractImage.js'
import {parent, endparent, add, HTextInput, newElem, newButton, newImage} from '../../common/H.js'
import VirtualFileSystem from '../../common/VirtualFileSystem.js'
import HWindow from '../HWindow.js';

export default class HWindowBackground extends HWindow {
	
	constructor(editor, id, background) {
		super(editor, id);

		this.background = background;

		this.title.html.textContent = 'Edit Background '+background.name;

		parent(this.client)
			parent( add( newElem('grid-resource resource-background', 'div') ) )
				parent( add( newElem(null, 'div') ) )

					var paramName = background.name;
					var paramImage = background.image;

					var inputName = add( new HTextInput('Name:', paramName) );

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
					this.editor.changeResourceName(background, inputName.getValue());
					this.editor.changeBackgroundImage(background, paramImage);
				},
				() => this.close()
			);
			endparent();
	}
}