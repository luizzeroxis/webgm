import {$, parent, endparent, add, newTextBox, newCheckBox, newSelect} from '../../common/H.js'
import HTMLWindow from '../HTMLWindow.js';

export default class HTMLWindowPreferences extends HTMLWindow {
	makeClient() {
		this.htmlTitle.textContent = 'Preferences';
		
		parent(this.htmlClient)

			var selectTheme = add( newSelect(null, 'Theme:', [
				{name: 'Auto', value: 'auto'},
				{name: 'Light', value: 'light'},
				{name: 'Dark', value: 'dark'},
			], this.editor.preferences.theme));

			var inputDefaultActionLibraryTab = add( newTextBox(null, 'Default action library tab:', this.editor.preferences.defaultActionLibraryTab) );

			var inputScrollToGameOnRun = add( newCheckBox(null, 'Scroll to game area on run', this.editor.preferences.scrollToGameOnRun) )
			var inputFocusCanvasOnRun = add( newCheckBox(null, 'Focus game canvas on run', this.editor.preferences.focusCanvasOnRun) )
			var inputClearCanvasOnStop = add( newCheckBox(null, 'Clear game canvas on stop', this.editor.preferences.clearCanvasOnStop) )

			this.makeApplyOkButtons(
				() => {
					this.editor.preferences.theme = $(selectTheme, 'select').value;
					this.editor.preferences.defaultActionLibraryTab = $(inputDefaultActionLibraryTab, 'input').value;
					this.editor.preferences.scrollToGameOnRun = $(inputScrollToGameOnRun, 'input').checked;
					this.editor.preferences.focusCanvasOnRun = $(inputFocusCanvasOnRun, 'input').checked;
					this.editor.preferences.clearCanvasOnStop = $(inputClearCanvasOnStop, 'input').checked;
					this.editor.savePreferences();
				},
				() => this.close()
			)

			endparent()
	}
}