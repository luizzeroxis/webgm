import AudioWrapper from "~/common/AudioWrapper.js";
import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HButton, HTextInput, HRangeInput, HRadioInput, uniqueID} from "~/common/h";
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

				parent( add( new HElement("fieldset") ) );
					add( new HElement("legend", {}, "Kind") );

					const kindGroup = "_radio_"+uniqueID();
					this.radioKindNormal = add( new HRadioInput(kindGroup, "Normal sound", (this.resource.kind == "normal")) );
					// this.radioKindBackground = add( new HRadioInput(kindGroup, "Background music", (this.resource.kind == "background")) );
					// this.radioKind3D = add( new HRadioInput(kindGroup, "3D sound", (this.resource.kind == "3d")) );
					this.radioKindMedia = add( new HRadioInput(kindGroup, "Use multimedia player", (this.resource.kind == "media")) );

					endparent();

				this.inputVolume = add( new HRangeInput("Volume:", this.resource.volume, 1/70, 0, 1) );
				this.inputPan = add( new HRangeInput("Pan:", this.resource.pan, 1/50, -1, 1) );

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

		this.resource.kind = (
			this.radioKindNormal.getChecked() ? "normal"
			: this.radioKindMedia.getChecked() ? "media"
			: null
		);
		this.resource.volume = parseFloat(this.inputVolume.getFloatValue());
		this.resource.pan = parseFloat(this.inputPan.getFloatValue());
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