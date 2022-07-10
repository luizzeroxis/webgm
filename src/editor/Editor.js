//The editor class

import Dispatcher from "../common/Dispatcher.js";
import {WebGMException, UnserializeException} from "../common/Exceptions.js";
import {parent, endparent, add, HElement, setOnFileDrop} from "../common/H.js";
import {
	Project,
	ProjectAction,
} from "../common/Project.js";
import ProjectSerializer from "../common/ProjectSerializer.js";
import {saveFile, readFileAsText} from "../common/tools.js";
import Game from "../game/Game.js";

import HAreaMenu from "./areas/HAreaMenu.js";
import HAreaResources from "./areas/HAreaResources.js";
import HAreaWindows from "./areas/HAreaWindows.js";
import BuiltInLibraries from "./BuiltInLibraries.js";
import PreferencesManager from "./PreferencesManager.js";
import ThemeManager from "./ThemeManager.js";
import HWindowGame from "./windows/HWindowGame.js";

import "./style.css";

export default class Editor {
	constructor() {
		this.project = new Project();
		this.game = null;
		this.projectName = "game";

		this.dispatcher = new Dispatcher();

		this.preferences = new PreferencesManager();
		this.themeManager = new ThemeManager(this);

		this.gameWindow = null;

		// Libraries
		this.libraries = BuiltInLibraries.getList();

		// Areas
		this.div = parent( new HElement("div", {class: "editor"}) );

			add( new HElement("div", {class: "warning"},
				"Work In Progress: Some features may not work as expected, or at all. Work may be lost, use it at your own discretion!") );

			this.menuArea = add( new HAreaMenu(this) );

			parent( add( new HElement("div", {class: "horizontal"}) ) );
				this.resourcesArea = add( new HAreaResources(this) );
				this.windowsArea = add( new HAreaWindows(this) );
				endparent();

			endparent();

		// Open file if dropped in the editor body
		setOnFileDrop(this.div.html, file => this.openProjectFromFile(file));

		// Actually add to the DOM
		add(this.div);
	}

	// Resource management

	createResource(type) {
		const resource = this.project.createResource(type);
		this.dispatcher.speak("createResource", resource);
		return resource;
	}

	deleteResource(resource) {
		if (confirm("You are about to delete "+resource.name+". This will be permanent. Continue?")) {
			this.project.deleteResource(resource);
			this.dispatcher.speak("deleteResource", resource);
		}
	}

	changeResourceName(resource, name) {
		resource.name = name;
		this.dispatcher.speak("changeResourceName", resource);
	}

	changeSpriteImages(sprite, images) {
		sprite.images = images;
		this.dispatcher.speak("changeSpriteImages", sprite);
	}

	changeSpriteOrigin(sprite, originx, originy) {
		sprite.originx = originx;
		sprite.originy = originy;
		this.dispatcher.speak("changeSpriteOrigin", sprite);
	}

	changeBackgroundImage(background, image) {
		background.image = image;
		this.dispatcher.speak("changeBackgroundImage", background);
	}

	changeObjectSprite(object, sprite) {
		object.sprite_index = sprite;
		this.dispatcher.speak("changeObjectSprite", object);
	}

	// Called from HAreaMenu
	newProject() {
		this.project = new Project();

		this.resourcesArea.refresh();
		this.windowsArea.clear();
	}

	// Called from HAreaMenu
	async openProjectFromFile(file) {
		try {
			if (file.type == "application/json") {
				const json = readFileAsText(file);
				this.project = await ProjectSerializer.unserializeV1(json);
			} else {
				this.project = await ProjectSerializer.unserializeZIP(file);
			}

			this.resourcesArea.refresh();
			this.windowsArea.clear();

			this.projectName = file.name.substring(0, file.name.lastIndexOf("."));
		} catch (e) {
			if (e instanceof UnserializeException) {
				alert("Error reading file: " + e.message);
			} else {
				throw e;
			}
		}
	}

	// Called from HAreaMenu
	async saveProject() {
		const blob = await ProjectSerializer.serializeZIP(this.project);
		saveFile(blob, this.projectName + ".zip");
	}

	// Called from HAreaMenu
	runGame() {
		this.stopGame();

		if (this.project.resources.ProjectRoom.length <= 0) {
			alert("A game must have at least one room to run.");
			return;
		}

		this.gameWindow = this.windowsArea.open(HWindowGame, "game");

		this.menuArea.runButton.setDisabled(true);
		this.menuArea.stopButton.setDisabled(false);

		if (this.preferences.get("scrollToGameOnRun")) {
			this.gameWindow.html.scrollIntoView();
		}
		if (this.preferences.get("focusCanvasOnRun")) {
			this.gameWindow.canvas.html.focus({preventScroll: true});
		}

		this.game = new Game(this.project, this.gameWindow.canvas.html, this.gameWindow.canvas.html);

		const gameListeners = this.game.dispatcher.listen({
			close: e => {
				if (e instanceof WebGMException) {
					alert("An error has ocurred when trying to run the game:\n" + e.message);
				}

				this.menuArea.runButton.setDisabled(false);
				this.menuArea.stopButton.setDisabled(true);

				if (this.preferences.get("clearCanvasOnStop")) {
					this.gameWindow.canvas.clear();
				}

				if (this.gameWindow.userClosed) {
					this.windowsArea.delete(this.gameWindow);
				}

				this.game.dispatcher.stopListening(gameListeners);

				this.game = null;

				if (e) {
					throw e;
				}
			},
		});

		this.game.start();
	}

	// Called from HAreaMenu and runGame
	stopGame() {
		if (this.game) {
			this.game.stepStopAction = async () => await this.game.end();
		}
	}

	// getActionType(action)
	// getActionType(actionTypeLibrary, actionTypeId)
	getActionType(...args) {
		let actionTypeLibrary, actionTypeId;

		const [action] = args;
		if (action instanceof ProjectAction) {
			actionTypeLibrary = action.typeLibrary;
			actionTypeId = action.typeId;
		} else {
			[actionTypeLibrary, actionTypeId] = args;
		}

		const library = this.libraries.find(x => x.name == actionTypeLibrary);
		const actionType = library.items.find(x => x.id == actionTypeId);
		return actionType;
	}
}