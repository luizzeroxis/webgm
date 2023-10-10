import HWindowManager from "~/common/components/HWindowManager/HWindowManager.js";
import {parent, endparent, add, HElement} from "~/common/h";
import HConstantsEditorWindow from "~/editor/windows/HConstantsEditorWindow.js";
import HGameInformationEditorWindow from "~/editor/windows/HGameInformationEditorWindow.js";
import HGlobalGameSettingsEditorWindow from "~/editor/windows/HGlobalGameSettingsEditorWindow.js";
import HPreferencesWindow from "~/editor/windows/HPreferencesWindow.js";
import HWindowBackground from "~/editor/windows/HWindowBackground.js";
import HWindowFont from "~/editor/windows/HWindowFont.js";
import HWindowGame from "~/editor/windows/HWindowGame.js";
import HWindowObject from "~/editor/windows/HWindowObject.js";
import HWindowPath from "~/editor/windows/HWindowPath.js";
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
		parent(super("div", {class: "windows-area"}));
			this.manager = add(new HWindowManager());
			endparent();

		this.editor = editor;
	}

	onAdd() {
		this.listeners = this.editor.project.dispatcher.listen({
			createResource: i => {
				this.openResource(i);
			},
			deleteResource: i => {
				this.closeResource(i);
			},
		});
	}

	// onRemove() {
	// 	this.editor.project.dispatcher.stopListening(this.listeners);
	// }

	// Open or focus on a resource window.
	openResource(resource) {
		const windowClass = HAreaWindows.resourceTypesWindowClasses[resource.constructor.getClassName()];
		return this.manager.open(windowClass, w => w.resource == resource, this.editor, resource);
	}

	closeResource(resource) {
		const windowClass = HAreaWindows.resourceTypesWindowClasses[resource.constructor.getClassName()];
		this.manager.delete(this.manager.find(windowClass, w => w.resource == resource));
	}

	// Open or focus on the game information window.
	openGameInformation() {
		return this.manager.open(HGameInformationEditorWindow, null, this.editor, this.editor.project.gameInformation);
	}

	// Open or focus on the global game settings window.
	openGlobalGameSettings() {
		return this.manager.open(HGlobalGameSettingsEditorWindow, null, this.editor, this.editor.project.globalGameSettings);
	}

	openConstants() {
		return this.manager.open(HConstantsEditorWindow, null, this.editor, this.editor.project.constants);
	}

	// Open or focus on the preferences window.
	openPreferences() {
		return this.editor.windowManager.open(HPreferencesWindow, null, this.editor);
	}

	// Open or focus on the game window.
	openGame() {
		return this.manager.open(HWindowGame, null, this.editor);
	}

	// Remove all windows related to the project (that is, not of the global editor).
	clearProject() {
		// this.manager.clear();
		for (const w of [...this.manager.windows]) {
			if (!([HPreferencesWindow].includes(w.constructor))) {
				w.forceClose();
			}
		}
	}
}