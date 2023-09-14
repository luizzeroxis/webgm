import AudioWrapper from "~/common/AudioWrapper.js";
import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HButton, HTextInput, HRangeInput} from "~/common/h";
import {ProjectSound} from "~/common/project/ProjectProperties.js";
import {openFile, setDeepOnUpdateOnElement} from "~/common/tools.js";

export default class HWindowSound extends HWindow {
	constructor(manager, editor, resource) {
		super(manager);
		this.editor = editor;
		this.resource = resource;

		this.modified = false;
		this.copyData();

		this.updateTitle();

		parent(this.client);
			parent( add( new HElement("div", {class: "window-sound"}) ) );
				this.inputName = add( new HTextInput("Name:", this.resource.name) );

				this.buttonLoadSound = add( new HButton("Load Sound", async () => {
					const file = await openFile("audio/*");
					await this.loadSound(file);
				}) );

				parent( add( new HElement("div", {class: "preview"}) ) );

					this.audioPreview = add( new HElement("audio") );
					this.audioPreview.html.controls = true;
					this.audioPreview.html.loop = true;
					if (this.resource.sound) {
						this.audioPreview.html.src = this.resource.sound.src;
					}
					endparent();

				this.inputVolume = add( new HRangeInput("Volume:", this.resource.volume, 1/70, 0, 1) );

				add( new HButton("OK", () => {
					this.modified = false;
					this.close();
				}) );

				endparent();

			endparent();

		setDeepOnUpdateOnElement(this.client, () => this.onUpdate());
	}

	copyData() {
		this.resourceCopy = new ProjectSound(this.resource);
	}

	saveData() {
		this.editor.project.changeResourceName(this.resource, this.inputName.getValue());
		this.updateTitle();

		this.resource.volume = parseFloat(this.inputVolume.getFloatValue());
	}

	restoreData() {
		Object.assign(this.resource, this.resourceCopy);

		this.editor.project.changeResourceName(this.resource, this.resourceCopy.name);
		this.updateTitle();
	}

	onUpdate() {
		this.modified = true;
		this.saveData();
	}

	updateTitle() {
		this.setTitle("Sound Properties: "+this.resource.name);
	}

	async loadSound(file) {
		this.buttonLoadSound.setDisabled(true);

		try {
			const sound = new AudioWrapper(file);
			await sound.promise;

			this.resource.sound = sound;

			const index = file.name.lastIndexOf(".");
			const type = (index < 1) ? "" : file.name.slice(index);
			this.resource.fileType = type;

			this.audioPreview.html.src = sound.src;

			this.onUpdate();
		} catch (e) {
			if (e.message == "Could not load audio") {
				alert("Error when opening audio");
			}
			throw e;
		} finally {
			this.buttonLoadSound.setDisabled(false);
		}
	}

	close() {
		if (this.modified) {
			if (!confirm(`Close without saving the changes to ${this.resource.name}?`)) return;
			this.restoreData();
		}
		super.close();
	}
}