import AbstractAudio from '../../common/AbstractAudio.js';
import {parent, endparent, add, HTextInput, HRangeInput, newElem, newButton} from '../../common/H.js'
import VirtualFileSystem from '../../common/VirtualFileSystem.js';
import HTMLWindow from '../HTMLWindow.js';

export default class HTMLWindowSound extends HTMLWindow {
	constructor(...args) {
		super(...args);
	}
	makeClient(sound) {
		this.htmlTitle.textContent = 'Edit Sound '+sound.name;

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-sound', 'div') ) )
				parent( add( newElem(null, 'div') ) )

					var paramSound = sound.sound;

					var inputName = add( new HTextInput('Name:', sound.name) )

					add( newButton(null, 'Load Sound', () => {

						VirtualFileSystem.openDialog('audio/*')
						.then(file => {
							paramSound = new AbstractAudio(file);
							audioPreview.src = paramSound.src;
						})

					}) )

					parent( add( newElem('preview', 'div') ) )

						var audioPreview = add( newElem(null, 'audio') )
						audioPreview.controls = true;
						audioPreview.loop = true;
						if (paramSound) {
							audioPreview.src = paramSound.src;
						}
						endparent()

					var inputVolume = add( new HRangeInput('Volume:', sound.volume, 1/70, 0, 1) )

					endparent()
				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(sound, inputName.getValue());
					sound.sound = paramSound;
					sound.volume = parseFloat(inputVolume.getValue());
					//
				},
				() => this.close()
			);
			endparent();

	}
}