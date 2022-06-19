import AbstractAudio from '../../common/AbstractAudio.js';
import {parent, endparent, add, HElement, HButton, HTextInput, HRangeInput} from '../../common/H.js'
import VirtualFileSystem from '../../common/VirtualFileSystem.js';
import HPropertiesWindow from '../HPropertiesWindow.js';

export default class HWindowSound extends HPropertiesWindow {

	constructor(manager, id, editor) {
		super(manager, id, editor);

		this.sound = id;

		this.title.html.textContent = 'Edit Sound '+this.sound.name;

		parent(this.client)
			parent( add( new HElement('div', {class: 'grid-resource resource-sound'}) ) )
				parent( add( new HElement('div') ) )

					let paramSound = this.sound.sound;

					const inputName = add( new HTextInput('Name:', this.sound.name) )

					add( new HButton('Load Sound', () => {

						VirtualFileSystem.openDialog('audio/*')
						.then(file => {
							paramSound = new AbstractAudio(file);
							audioPreview.html.src = paramSound.src;
						})

					}) )

					parent( add( new HElement('div', {class: 'preview'}) ) )

						const audioPreview = add( new HElement('audio') )
						audioPreview.html.controls = true;
						audioPreview.html.loop = true;
						if (paramSound) {
							audioPreview.html.src = paramSound.src;
						}
						endparent()

					const inputVolume = add( new HRangeInput('Volume:', this.sound.volume, 1/70, 0, 1) )

					endparent()
				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(this.sound, inputName.getValue());
					this.sound.sound = paramSound;
					this.sound.volume = parseFloat(inputVolume.getValue());
					//
				},
				() => this.close()
			);
			endparent();

	}
}