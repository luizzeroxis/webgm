import HTMLWindow from './HTMLWindow.js';

import {parent, endparent, add, newCheckBox, newColorBox} from '../common/tools.js'

export default class HTMLWindowGlobalGameSettings extends HTMLWindow {

	constructor(...args) {
		super(...args);
	}

	makeClient(globalGameSettings) {
		this.htmlTitle.textContent = 'Global Game Settings';

		parent(this.htmlClient)

			this.inputColor = add( newColorBox(null, 'Color outside the room region:', globalGameSettings.colorOutsideRoom) ).$('input')

			this.inputDisplayCursor = add( newCheckBox(null, 'Display the cursor', globalGameSettings.displayCursor) ).$('input');

			this.makeApplyOkButtons(
				() => {
					globalGameSettings.colorOutsideRoom = this.inputColor.value;
					globalGameSettings.displayCursor = this.inputDisplayCursor.checked;
				},
				() => this.editor.deleteWindow(this)
			);
			endparent();
	}
}