import AbstractAudio from '../../common/AbstractAudio.js';
import {parent, endparent, add, HElement, HButton, HTextInput, HRangeInput} from '../../common/H.js'
import VirtualFileSystem from '../../common/VirtualFileSystem.js';
import HWindow from '../HWindow.js';

export default class HWindowSound extends HWindow {

	constructor(editor, id, sound) {
		super(editor, id);

		this.sound = sound;

		this.title.html.textContent = 'Edit Sound '+sound.name;

		parent(this.client)
			parent( add( new HElement('div', {class: 'grid-resource resource-sound'}) ) )
				parent( add( new HElement('div') ) )

					var paramSound = sound.sound;

					var inputName = add( new HTextInput('Name:', sound.name) )

					add( new HButton('Load Sound', () => {

						VirtualFileSystem.openDialog('audio/*')
						.then(file => {
							paramSound = new AbstractAudio(file);
							audioPreview.html.src = paramSound.src;
						})

					}) )

					parent( add( new HElement('div', {class: 'preview'}) ) )

						var audioPreview = add( new HElement('audio') )
						audioPreview.html.controls = true;
						audioPreview.html.loop = true;
						if (paramSound) {
							audioPreview.html.src = paramSound.src;
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