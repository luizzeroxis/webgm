import {parent, endparent, add, HElement} from "~/common/H.js";
import HWindowBackground from "~/editor/windows/HWindowBackground.js";
import HWindowFont from "~/editor/windows/HWindowFont.js";
import HWindowGame from "~/editor/windows/HWindowGame.js";
import HWindowGameInformation from "~/editor/windows/HWindowGameInformation.js";
import HWindowGlobalGameSettings from "~/editor/windows/HWindowGlobalGameSettings.js";
import HWindowObject from "~/editor/windows/HWindowObject.js";
import HWindowPath from "~/editor/windows/HWindowPath.js";
import HWindowPreferences from "~/editor/windows/HWindowPreferences.js";
import HWindowRoom from "~/editor/windows/HWindowRoom.js";
import HWindowScript from "~/editor/windows/HWindowScript.js";
import HWindowSound from "~/editor/windows/HWindowSound.js";
import HWindowSprite from "~/editor/windows/HWindowSprite.js";
import HWindowTimeline from "~/editor/windows/HWindowTimeline.js";

export default class HAreaWindows extends HElement {
	static resourceTypesWindowClasses = {
		"ProjectSprite": HWindowSprite,
		"ProjectSound": HWindowSound,
		"ProjectBackground": HWindowBackground,
		"ProjectPath": HWindowPath,
		"ProjectScript": HWindowScript,
		"ProjectFont": HWindowFont,
		"ProjectTimeline": HWindowTimeline,
		"ProjectObject": HWindowObject,
		"ProjectRoom": HWindowRoom,
	};

	constructor(editor) {
		super("div", {class: "windows-area"});

		this.editor = editor;
		this.windows = [];

		this.cascadeDiff = 24;
	}

	onAdd() {
		this.listeners = this.editor.project.dispatcher.listen({
			createResource: i => {
				this.openResource(i);
			},
			deleteResource: i => {
				this.deleteId(i);
			},
		});
	}

	// onRemove() {
	// 	this.editor.project.dispatcher.stopListening(this.listeners);
	// }

	// Open a new window or focus on a existing one. windowClass is class that extends HWindow. It will send id, the editor and ...clientArgs as arguments. If a window with the same id is opened, it will focus on it, and return null. Otherwise it returns the newly created instance.
	open(windowClass, id, ...clientArgs) {
		let w = this.getId(id);
		if (w) {
			this.focus(id);
		} else {
			parent(this);
				w = add( new windowClass(this.editor, id, ...clientArgs) );
				endparent();

			this.windows.unshift(w);
			this.organize();
		}
		return w;
	}

	// Open or focus on a resource window.
	openResource(resource) {
		const windowClass = HAreaWindows.resourceTypesWindowClasses[resource.constructor.getClassName()];
		return this.open(windowClass, resource, resource);
	}

	// Open or focus on the game information window.
	openGameInformation() {
		return this.open(HWindowGameInformation, "game-information", this.editor.project.gameInformation);
	}

	// Open or focus on the global game settings window.
	openGlobalGameSettings() {
		return this.open(HWindowGlobalGameSettings, "global-game-settings", this.editor.project.globalGameSettings);
	}

	// Open or focus on the preferences window.
	openPreferences() {
		return this.open(HWindowPreferences, "preferences");
	}

	// Open or focus on the game window.
	openGame() {
		return this.open(HWindowGame, "game");
	}

	// Get window by id.
	getId(id) {
		return this.windows.find(x => x.id == id);
	}

	// Delete window instance.
	delete(w) {
		const index = this.windows.findIndex(x => x == w);
		if (index>=0) {
			this.windows[index].remove();
			this.windows.splice(index, 1);
			this.organize();
			return true;
		}
		return false;
	}

	// Delete window by id.
	deleteId(id) {
		const index = this.windows.findIndex(x => x.id == id);
		if (index>=0) {
			this.windows[index].remove();
			this.windows.splice(index, 1);
			this.organize();
			return true;
		}
		return false;
	}

	// Remove all windows.
	clear() {
		for (const w of this.windows) {
			w.remove();
		}
		this.windows = [];
	}

	// Remove all windows related to the project (that is, not of the global editor).
	clearProject() {
		this.windows = this.windows.filter(w => {
			const isProject = !([HWindowGame, HWindowPreferences].includes(w.constructor));
			if (isProject) { w.remove(); }
			return !isProject;
		});
	}

	// Move window with id to the top of the screen.
	focus(id) {
		const index = this.windows.findIndex(x => x.id == id);

		// Move the window to the top of the array.
		this.windows.unshift(this.windows.splice(index, 1)[0]);

		this.organize();
	}

	// Visually orders windows in the order of the array.
	organize() {
		this.windows.forEach((w, i) => {
			w.html.style.zIndex = this.windows.length - i;
		});
	}

	// Moves all windows into a cascanding pattern.
	cascade() {
		let x = 0;
		let y = 0;

		for (const w of [...this.windows].reverse()) {
			w.setPosition(x, y);
			x += this.cascadeDiff;
			y += this.cascadeDiff;
		}
	}
}