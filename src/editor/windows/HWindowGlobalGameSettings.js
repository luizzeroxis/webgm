import {parent, endparent, add, HCheckBoxInput, HColorInput} from '../../common/H.js'
import HWindow from '../HWindow.js';

export default class HWindowGlobalGameSettings extends HWindow {

	constructor(editor, id, globalGameSettings) {
		super(editor, id);

		this.globalGameSettings = globalGameSettings;

		this.title.html.textContent = 'Global Game Settings';

		parent(this.client)

			this.inputColor = add( new HColorInput('Color outside the room region:', globalGameSettings.colorOutsideRoom) )

			this.inputDisplayCursor = add( new HCheckBoxInput('Display the cursor', globalGameSettings.displayCursor) )

			this.makeApplyOkButtons(
				() => {
					globalGameSettings.colorOutsideRoom = this.inputColor.getValue();
					globalGameSettings.displayCursor = this.inputDisplayCursor.getChecked();
				},
				() => this.close()
			);
			endparent();
	}
}