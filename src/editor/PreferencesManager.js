import Dispatcher from "../common/Dispatcher.js"

export default class PreferencesManager {
	constructor() {
		this.values = {
			theme: "auto",
			defaultActionLibraryTab: "move",
			scrollToGameOnRun: true,
			focusCanvasOnRun: true,
			clearCanvasOnStop: true,
			hintTextInAction: false,
		};

		this.dispatcher = new Dispatcher();

		this.load();
	}

	get(name) {
		return this.values[name];
	}

	setAll(newValues) {
		this.values = Object.assign(this.values, newValues);
		this.dispatcher.speak("change", newValues);
	}

	load() {
		let loadedValues;
		try {
			loadedValues = JSON.parse(window.localStorage.getItem("preferences"));
		} catch (e) {
			// SyntaxError
			console.log("Could not load preferences, clearing them", loadedValues);
			window.localStorage.clear();
			return;
		}

		if (loadedValues != null) {
			this.values = Object.assign(this.values, loadedValues);
			this.dispatcher.speak("change", this.values);
		}
	}

	save() {
		const valuesString = JSON.stringify(this.values);
		try {
			window.localStorage.setItem("preferences", valuesString);
		} catch (e) {
			// SecurityError
			console.log("Could not save preferences", this.values);
		}
	}
}