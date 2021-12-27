import HTMLWindow from './HTMLWindow.js';

import {$, parent, endparent, add, newElem, newButton, newTextBox, newSlider} from '../common/H.js'

import VirtualFileSystem from '../common/VirtualFileSystem.js';

export default class HTMLWindowSound extends HTMLWindow {
	constructor(...args) {
		super(...args);
	}
	makeClient(sound) {
		this.htmlTitle.textContent = 'Edit Sound '+sound.name;

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-sound', 'div') ) )
				parent( add( newElem(null, 'div') ) )

					var inputName = $( add( newTextBox(null, 'Name:', sound.name) ), 'input');
					var paramSound;

					add( newButton(null, 'Load Sound', () => {
						VirtualFileSystem.openDialog('audio/*')
						.then(file => {
							//paramSound = new AbstractSound();
						})
					}) )

					// TODO slider?
					var inputVolume = $( add( newSlider(null, 'Volume:', sound.volume, 1/70, 0, 1) ), 'input');

					endparent()
				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(sound, inputName.value);
					sound.sound = paramSound;
					sound.volume = parseFloat(inputVolume.value);
					//
				},
				() => {
					this.editor.deleteResourceWindow(sound);
				}
			);
			endparent();

	}
}