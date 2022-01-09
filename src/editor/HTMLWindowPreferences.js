import HTMLWindow from './HTMLWindow.js';

import {$, parent, endparent, add, newCheckBox} from '../common/H.js'

export default class HTMLWindowPreferences extends HTMLWindow {
	makeClient() {
		this.htmlTitle.textContent = 'Preferences';
		
		parent(this.htmlClient)

			var inputClearCanvasOnStop = add( newCheckBox(null, 'Clear game canvas on stop', this.editor.preferences.clearCanvasOnStop) )

			this.makeApplyOkButtons(
				() => {
					// changes here
					this.editor.preferences.clearCanvasOnStop = $(inputClearCanvasOnStop, 'input').checked;
					this.editor.savePreferences();
				},
				() => this.editor.deleteWindow(this)
			)

			endparent()
	}
}