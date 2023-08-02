import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HButton, HTextInput, HMultilineTextInput, HCheckBoxInput, HColorInput} from "~/common/h";
import {ProjectGlobalGameSettings} from "~/common/project/ProjectProperties.js";
import {setDeepOnUpdateOnElement} from "~/common/tools.js";
import HTabControl from "~/editor/components/HTabControl/HTabControl.js";

export default class HWindowGlobalGameSettings extends HWindow {
	constructor(manager, editor, resource) {
		super(manager);
		this.editor = editor;
		this.resource = resource;

		this.modified = false;
		this.copyData();

		this.setTitle("Global Game Settings");

		parent(this.client);

			parent( add( new HElement("div", {class: "window-global-game-settings"}) ) );

				this.tabControl = add( new HTabControl() );

				const tabGraphics = parent( this.tabControl.addTab("Graphics") );
					this.tabControl.setSelectedContent(tabGraphics);

					this.inputFullScreen = add( new HCheckBoxInput("Start in full-screen mode", this.resource.startInFullScreen) );
					this.inputColor = add( new HColorInput("Color outside the room region:", this.resource.colorOutsideRoom) );
					this.inputDisplayCursor = add( new HCheckBoxInput("Display the cursor", this.resource.displayCursor) );

					setDeepOnUpdateOnElement(tabGraphics, () => this.onUpdate());
					endparent();

				// const tabResolution = parent( this.tabControl.addTab('Resolution') )
				// 	endparent()

				const tabOther = parent( this.tabControl.addTab("Other") );

					this.inputKeyEscEndsGame = add( new HCheckBoxInput("Let <Esc> end the game", this.resource.keyEscEndsGame) );
					this.inputKeyF4SwitchesFullscreen = add( new HCheckBoxInput("Let <F4> switch between screen modes", this.resource.keyF4SwitchesFullscreen) );

					setDeepOnUpdateOnElement(tabOther, () => this.onUpdate());
					endparent();

				// const tabLoading = parent( this.tabControl.addTab('Loading') )
				// 	endparent()

				// const tabErrors = parent( this.tabControl.addTab('Errors') )
				// 	endparent()

				const tabInfo = parent( this.tabControl.addTab("Info") );

					this.inputAuthor = add( new HTextInput("Author:", this.resource.author) );
					this.inputVersion = add( new HTextInput("Version:", this.resource.version) );
					this.inputInformation = add( new HMultilineTextInput("Information:", this.resource.information) );

					setDeepOnUpdateOnElement(tabInfo, () => this.onUpdate());
					endparent();

					add( new HButton("OK", () => {
						this.modified = false;
						this.close();
					}) );

				endparent();
			endparent();

		setDeepOnUpdateOnElement(this.client, () => this.onUpdate());
	}

	copyData() {
		this.resourceCopy = new ProjectGlobalGameSettings(this.resource);
	}

	saveData() {
		this.resource.startInFullScreen = this.inputFullScreen.getChecked();
		this.resource.colorOutsideRoom = this.inputColor.getValue();
		this.resource.displayCursor = this.inputDisplayCursor.getChecked();

		this.resource.keyEscEndsGame = this.inputKeyEscEndsGame.getChecked();
		this.resource.keyF4SwitchesFullscreen = this.inputKeyF4SwitchesFullscreen.getChecked();

		this.resource.author = this.inputAuthor.getValue();
		this.resource.version = this.inputVersion.getValue();
		this.resource.information = this.inputInformation.getValue();
	}

	restoreData() {
		Object.assign(this.resource, this.resourceCopy);
	}

	onUpdate() {
		this.modified = true;
		this.saveData();
	}

	close() {
		if (this.modified) {
			if (!confirm("Close without saving the changes to global game settings?")) return;
			this.restoreData();
		}
		super.close();
	}
}