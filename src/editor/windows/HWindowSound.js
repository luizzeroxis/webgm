import AbstractAudio from "../../common/AbstractAudio.js";
import {parent, endparent, add, HElement, HButton, HTextInput, HRangeInput} from "../../common/H.js";
import {openFile} from "../../common/tools.js";
import HWindow from "../HWindow.js";

export default class HWindowSound extends HWindow {
	constructor(editor, id, sound) {
		super(editor, id);

		this.sound = sound;

		this.updateTitle();

		parent(this.client);
			parent( add( new HElement("div", {class: "window-sound"}) ) );
				parent( add( new HElement("div") ) );

					this.paramSound = sound.sound;

					const inputName = add( new HTextInput("Name:", sound.name) );

					this.buttonLoadSound = add( new HButton("Load Sound", async () => {
						const file = await openFile("audio/*");
						this.loadSoundFromFile(file);
					}) );

					parent( add( new HElement("div", {class: "preview"}) ) );

						this.audioPreview = add( new HElement("audio") );
						this.audioPreview.html.controls = true;
						this.audioPreview.html.loop = true;
						if (this.paramSound) {
							this.audioPreview.html.src = this.paramSound.src;
						}
						endparent();

					const inputVolume = add( new HRangeInput("Volume:", sound.volume, 1/70, 0, 1) );

					endparent();
				endparent();

			this.makeApplyOkButtons(
				() => {
					this.editor.project.changeResourceName(sound, inputName.getValue());
					sound.sound = this.paramSound;
					sound.volume = parseFloat(inputVolume.getValue());

					this.updateTitle();
				},
				() => this.close(),
			);
			endparent();
	}

	updateTitle() {
		this.title.html.textContent = "Edit Sound "+this.sound.name;
	}

	loadSoundFromFile(file) {
		this.buttonLoadSound.setDisabled(true);

		const sound = new AbstractAudio(file);

		sound.promise
		.then(() => {
			this.paramSound = sound;
			this.audioPreview.html.src = sound.src;
		})
		.catch(() => {
			alert("Error when opening audio");
		})
		.finally(() => {
			this.buttonLoadSound.setDisabled(false);
		});
	}
}