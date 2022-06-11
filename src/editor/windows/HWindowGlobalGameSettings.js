import {parent, endparent, add, HElement, HTextInput, HMultilineTextInput, HCheckBoxInput, HColorInput,} from '../../common/H.js'
import HWindow from '../HWindow.js';
import HTabControl from '../HTabControl.js';

export default class HWindowGlobalGameSettings extends HWindow {

	constructor(editor, id, globalGameSettings) {
		super(editor, id);

		this.globalGameSettings = globalGameSettings;

		this.title.html.textContent = 'Global Game Settings';

		parent(this.client)

			this.tabControl = add( new HTabControl() )

			parent( this.tabControl.addTab('Graphics') )

				this.inputColor = add( new HColorInput('Color outside the room region:', globalGameSettings.colorOutsideRoom) )
				this.inputDisplayCursor = add( new HCheckBoxInput('Display the cursor', globalGameSettings.displayCursor) )

				endparent()

			// parent( this.tabControl.addTab('Resolution') )
			// 	endparent()

			parent( this.tabControl.addTab('Other') )

				this.inputKeyEscEndsGame = add( new HCheckBoxInput('Let <Esc> end the game', globalGameSettings.keyEscEndsGame) )
				this.inputKeyF4SwitchesFullscreen = add( new HCheckBoxInput('Let <F4> switch between screen modes', globalGameSettings.keyF4SwitchesFullscreen) )

				endparent()

			// parent( this.tabControl.addTab('Loading') )
			// 	endparent()

			// parent( this.tabControl.addTab('Errors') )
			// 	endparent()

			parent( this.tabControl.addTab('Info') )

				this.inputAuthor = add( new HTextInput('Author:', globalGameSettings.author) )
				this.inputVersion = add( new HTextInput('Version:', globalGameSettings.version) )
				this.inputInformation = add( new HMultilineTextInput('Information:', globalGameSettings.information) )

				endparent()

			this.makeApplyOkButtons(
				() => {
					globalGameSettings.colorOutsideRoom = this.inputColor.getValue();
					globalGameSettings.displayCursor = this.inputDisplayCursor.getChecked();
					globalGameSettings.keyEscEndsGame = this.inputKeyEscEndsGame.getChecked();
					globalGameSettings.keyF4SwitchesFullscreen = this.inputKeyF4SwitchesFullscreen.getChecked();

					globalGameSettings.author = this.inputAuthor.getValue();
					globalGameSettings.version = this.inputVersion.getValue();
					globalGameSettings.information = this.inputInformation.getValue();
				},
				() => this.close()
			);
			endparent();
	}
}