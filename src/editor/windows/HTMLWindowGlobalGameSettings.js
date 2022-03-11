import {parent, endparent, add, HCheckBoxInput, HColorInput} from '../../common/H.js'
import HTMLWindow from '../HTMLWindow.js';

export default class HTMLWindowGlobalGameSettings extends HTMLWindow {

	constructor(...args) {
		super(...args);
	}

	makeClient(globalGameSettings) {
		this.htmlTitle.textContent = 'Global Game Settings';

		parent(this.htmlClient)

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