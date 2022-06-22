import {parent, endparent, add, HTextInput, HCheckBoxInput, HSelectWithOptions} from "../../common/H.js"
import HWindow from "../HWindow.js";

export default class HWindowPreferences extends HWindow {
	constructor(editor, id) {
		super(editor, id);

		this.title.html.textContent = "Preferences";

		parent(this.client)

			const selectTheme = add( new HSelectWithOptions("Theme:", [
				{name: "Auto", value: "auto"},
				{name: "Light", value: "light"},
				{name: "Dark", value: "dark"},
			], this.editor.preferences.get("theme")));

			const inputDefaultActionLibraryTab = add( new HTextInput("Default action library tab:", this.editor.preferences.get("defaultActionLibraryTab")) )

			const inputHintTextInAction = add( new HCheckBoxInput("Use full tooltip text in action", this.editor.preferences.get("hintTextInAction")) )

			const inputScrollToGameOnRun = add( new HCheckBoxInput("Scroll to game area on run", this.editor.preferences.get("scrollToGameOnRun")) )
			const inputFocusCanvasOnRun = add( new HCheckBoxInput("Focus game canvas on run", this.editor.preferences.get("focusCanvasOnRun")) )
			const inputClearCanvasOnStop = add( new HCheckBoxInput("Clear game canvas on stop", this.editor.preferences.get("clearCanvasOnStop")) )

			this.makeApplyOkButtons(
				() => {
					this.editor.preferences.setAll({
						theme: selectTheme.getValue(),
						defaultActionLibraryTab: inputDefaultActionLibraryTab.getValue(),
						hintTextInAction: inputHintTextInAction.getChecked(),
						scrollToGameOnRun: inputScrollToGameOnRun.getChecked(),
						focusCanvasOnRun: inputFocusCanvasOnRun.getChecked(),
						clearCanvasOnStop: inputClearCanvasOnStop.getChecked(),
					});
					this.editor.preferences.save();
				},
				() => this.close(),
			)

			endparent()
	}
}