import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HTextInput, HMultilineTextInput, HCheckBoxInput, HColorInput} from "~/common/h";
import HTabControl from "~/editor/components/HTabControl/HTabControl.js";

export default class HWindowGlobalGameSettings extends HWindow {
	constructor(manager, editor, globalGameSettings) {
		super(manager);
		this.editor = editor;
		this.globalGameSettings = globalGameSettings;

		this.title.html.textContent = "Global Game Settings";

		parent(this.client);

			parent( add( new HElement("div", {class: "window-global-game-settings"}) ) );

				this.tabControl = add( new HTabControl() );

				parent( this.tabControl.addTab("Graphics") );

					this.inputFullScreen = add( new HCheckBoxInput("Start in full-screen mode", globalGameSettings.startInFullScreen) );
					this.inputColor = add( new HColorInput("Color outside the room region:", globalGameSettings.colorOutsideRoom) );
					this.inputDisplayCursor = add( new HCheckBoxInput("Display the cursor", globalGameSettings.displayCursor) );

					endparent();

				// parent( this.tabControl.addTab('Resolution') )
				// 	endparent()

				parent( this.tabControl.addTab("Other") );

					this.inputKeyEscEndsGame = add( new HCheckBoxInput("Let <Esc> end the game", globalGameSettings.keyEscEndsGame) );
					this.inputKeyF4SwitchesFullscreen = add( new HCheckBoxInput("Let <F4> switch between screen modes", globalGameSettings.keyF4SwitchesFullscreen) );

					endparent();

				// parent( this.tabControl.addTab('Loading') )
				// 	endparent()

				// parent( this.tabControl.addTab('Errors') )
				// 	endparent()

				parent( this.tabControl.addTab("Info") );

					this.inputAuthor = add( new HTextInput("Author:", globalGameSettings.author) );
					this.inputVersion = add( new HTextInput("Version:", globalGameSettings.version) );
					this.inputInformation = add( new HMultilineTextInput("Information:", globalGameSettings.information) );

					endparent();

				endparent();

			this.makeApplyOkButtons(
				() => {
					globalGameSettings.startInFullScreen = this.inputFullScreen.getChecked();
					globalGameSettings.colorOutsideRoom = this.inputColor.getValue();
					globalGameSettings.displayCursor = this.inputDisplayCursor.getChecked();
					globalGameSettings.keyEscEndsGame = this.inputKeyEscEndsGame.getChecked();
					globalGameSettings.keyF4SwitchesFullscreen = this.inputKeyF4SwitchesFullscreen.getChecked();

					globalGameSettings.author = this.inputAuthor.getValue();
					globalGameSettings.version = this.inputVersion.getValue();
					globalGameSettings.information = this.inputInformation.getValue();
				},
				() => this.close(),
			);
			endparent();
	}
}