import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add, HElement, HButton, HTextInput, HCheckBoxInput, HSelectWithOptions} from "~/common/h";
import {setDeepOnUpdateOnElement} from "~/common/tools.js";

export default class HWindowPreferences extends HWindow {
	constructor(manager, editor) {
		super(manager);
		this.editor = editor;

		this.setTitle("Preferences");

		parent(this.client);

			this.selectTheme = add( new HSelectWithOptions("Theme:", [
				{name: "Auto", value: "auto"},
				{name: "Light", value: "light"},
				{name: "Dark", value: "dark"},
			], this.editor.preferences.get("theme")));

			this.inputDefaultActionLibraryTab = add( new HTextInput("Default action library tab:", this.editor.preferences.get("defaultActionLibraryTab")) );

			this.inputHintTextInAction = add( new HCheckBoxInput("Use full tooltip text in action", this.editor.preferences.get("hintTextInAction")) );

			this.inputScrollToGameOnRun = add( new HCheckBoxInput("Scroll to game area on run", this.editor.preferences.get("scrollToGameOnRun")) );
			this.inputFocusCanvasOnRun = add( new HCheckBoxInput("Focus game canvas on run", this.editor.preferences.get("focusCanvasOnRun")) );

			this.inputShowWIPWarning = add( new HCheckBoxInput("Show \"Work In Progress\" warning", this.editor.preferences.get("showWIPWarning")) );

			parent( add( new HElement("div") ) );
				add( new HButton("OK", () => {
					this.close();
				}) );
				endparent();

			endparent();

		setDeepOnUpdateOnElement(this.client, () => this.onUpdate());
	}

	saveData() {
		this.editor.preferences.setAll({
			theme: this.selectTheme.getValue(),
			defaultActionLibraryTab: this.inputDefaultActionLibraryTab.getValue(),
			hintTextInAction: this.inputHintTextInAction.getChecked(),
			scrollToGameOnRun: this.inputScrollToGameOnRun.getChecked(),
			focusCanvasOnRun: this.inputFocusCanvasOnRun.getChecked(),
			showWIPWarning: this.inputShowWIPWarning.getChecked(),
		});
		this.editor.preferences.save();
	}

	onUpdate() {
		this.saveData();
	}
}