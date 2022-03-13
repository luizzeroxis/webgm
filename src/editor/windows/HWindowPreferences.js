import {parent, endparent, add, HTextInput, HCheckBoxInput, HSelectWithOptions} from '../../common/H.js'
import HWindow from '../HWindow.js';

export default class HWindowPreferences extends HWindow {

	constructor(editor, id) {
		super(editor, id);

		this.title.html.textContent = 'Preferences';
		
		parent(this.client)

			var selectTheme = add( new HSelectWithOptions('Theme:', [
				{name: 'Auto', value: 'auto'},
				{name: 'Light', value: 'light'},
				{name: 'Dark', value: 'dark'},
			], this.editor.preferences.theme));

			var inputDefaultActionLibraryTab = add( new HTextInput('Default action library tab:', this.editor.preferences.defaultActionLibraryTab) )

			var inputHintTextInAction = add( new HCheckBoxInput('Use full tooltip text in action', this.editor.preferences.hintTextInAction) )

			var inputScrollToGameOnRun = add( new HCheckBoxInput('Scroll to game area on run', this.editor.preferences.scrollToGameOnRun) )
			var inputFocusCanvasOnRun = add( new HCheckBoxInput('Focus game canvas on run', this.editor.preferences.focusCanvasOnRun) )
			var inputClearCanvasOnStop = add( new HCheckBoxInput('Clear game canvas on stop', this.editor.preferences.clearCanvasOnStop) )

			this.makeApplyOkButtons(
				() => {
					this.editor.preferences.theme = selectTheme.getValue();

					this.editor.preferences.defaultActionLibraryTab = inputDefaultActionLibraryTab.getValue();

					this.editor.preferences.hintTextInAction = inputHintTextInAction.getChecked();

					this.editor.preferences.scrollToGameOnRun = inputScrollToGameOnRun.getChecked();
					this.editor.preferences.focusCanvasOnRun = inputFocusCanvasOnRun.getChecked();
					this.editor.preferences.clearCanvasOnStop = inputClearCanvasOnStop.getChecked();
					
					this.editor.savePreferences();
				},
				() => this.close()
			)

			endparent()
	}
}