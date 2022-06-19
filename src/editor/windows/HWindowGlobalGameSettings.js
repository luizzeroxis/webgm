import {parent, endparent, add, HTextInput, HMultilineTextInput, HCheckBoxInput, HColorInput,} from '../../common/H.js'
import HTabControl from '../HTabControl.js';
import HPropertiesWindow from '../HPropertiesWindow.js';

export default class HWindowGlobalGameSettings extends HPropertiesWindow {

	constructor(manager, id, editor) {
		super(manager, id, editor);

		this.globalGameSettings = id;

		this.title.html.textContent = 'Global Game Settings';

		parent(this.client)

			this.tabControl = add( new HTabControl() )

			parent( this.tabControl.addTab('Graphics') )

				this.inputColor = add( new HColorInput('Color outside the room region:', this.globalGameSettings.colorOutsideRoom) )
				this.inputDisplayCursor = add( new HCheckBoxInput('Display the cursor', this.globalGameSettings.displayCursor) )

				endparent()

			// parent( this.tabControl.addTab('Resolution') )
			// 	endparent()

			parent( this.tabControl.addTab('Other') )

				this.inputKeyEscEndsGame = add( new HCheckBoxInput('Let <Esc> end the game', this.globalGameSettings.keyEscEndsGame) )
				this.inputKeyF4SwitchesFullscreen = add( new HCheckBoxInput('Let <F4> switch between screen modes', this.globalGameSettings.keyF4SwitchesFullscreen) )

				endparent()

			// parent( this.tabControl.addTab('Loading') )
			// 	endparent()

			// parent( this.tabControl.addTab('Errors') )
			// 	endparent()

			parent( this.tabControl.addTab('Info') )

				this.inputAuthor = add( new HTextInput('Author:', this.globalGameSettings.author) )
				this.inputVersion = add( new HTextInput('Version:', this.globalGameSettings.version) )
				this.inputInformation = add( new HMultilineTextInput('Information:', this.globalGameSettings.information) )

				endparent()

			this.makeApplyOkButtons(
				() => {
					this.globalGameSettings.colorOutsideRoom = this.inputColor.getValue();
					this.globalGameSettings.displayCursor = this.inputDisplayCursor.getChecked();
					this.globalGameSettings.keyEscEndsGame = this.inputKeyEscEndsGame.getChecked();
					this.globalGameSettings.keyF4SwitchesFullscreen = this.inputKeyF4SwitchesFullscreen.getChecked();

					this.globalGameSettings.author = this.inputAuthor.getValue();
					this.globalGameSettings.version = this.inputVersion.getValue();
					this.globalGameSettings.information = this.inputInformation.getValue();
				},
				() => this.close()
			);
			endparent();
	}
}