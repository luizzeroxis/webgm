import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HTextInput, HCheckBoxInput, HSelectWithOptions} from "~/common/h";

export default class HWindowPreferences extends HWindow {
	constructor(manager, editor) {
		super(manager);
		this.editor = editor;
		this.setTitle("Preferences");

		parent(this.client);

			const selectTheme = add( new HSelectWithOptions("Theme:", [
				{name: "Auto", value: "auto"},
				{name: "Light", value: "light"},
				{name: "Dark", value: "dark"},
			], this.editor.preferences.get("theme")));

			const inputDefaultActionLibraryTab = add( new HTextInput("Default action library tab:", this.editor.preferences.get("defaultActionLibraryTab")) );

			const inputHintTextInAction = add( new HCheckBoxInput("Use full tooltip text in action", this.editor.preferences.get("hintTextInAction")) );

			const inputScrollToGameOnRun = add( new HCheckBoxInput("Scroll to game area on run", this.editor.preferences.get("scrollToGameOnRun")) );
			const inputFocusCanvasOnRun = add( new HCheckBoxInput("Focus game canvas on run", this.editor.preferences.get("focusCanvasOnRun")) );
			const inputClearCanvasOnStop = add( new HCheckBoxInput("Clear game canvas on stop", this.editor.preferences.get("clearCanvasOnStop")) );

			const inputShowWIPWarning = add( new HCheckBoxInput("Show \"Work In Progress\" warning", this.editor.preferences.get("showWIPWarning")) );

			this.makeApplyOkButtons(
				() => {
					this.editor.preferences.setAll({
						theme: selectTheme.getValue(),
						defaultActionLibraryTab: inputDefaultActionLibraryTab.getValue(),
						hintTextInAction: inputHintTextInAction.getChecked(),
						scrollToGameOnRun: inputScrollToGameOnRun.getChecked(),
						focusCanvasOnRun: inputFocusCanvasOnRun.getChecked(),
						clearCanvasOnStop: inputClearCanvasOnStop.getChecked(),
						showWIPWarning: inputShowWIPWarning.getChecked(),
					});
					this.editor.preferences.save();
				},
				() => this.close(),
			);

			endparent();
	}
}