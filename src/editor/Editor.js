//The editor class

import Dispatcher from "../common/Dispatcher.js";
import {WebGMException, UnserializeException} from "../common/Exceptions.js";
import {parent, endparent, add, HElement, setOnFileDrop, setOnFileDropAsFileHandle} from "../common/H.js";
import {
	Project,
	ProjectAction,
} from "../common/Project.js";
import ProjectSerializer from "../common/ProjectSerializer.js";
import {openFile, saveFile, readFileAsText} from "../common/tools.js";
import Game from "../game/Game.js";

import HAreaMenu from "./areas/HAreaMenu.js";
import HAreaResources from "./areas/HAreaResources.js";
import HAreaWindows from "./areas/HAreaWindows.js";
import BuiltInLibraries from "./BuiltInLibraries.js";
import HMenuManager from "./HMenuManager.js";
import PreferencesManager from "./PreferencesManager.js";
import ThemeManager from "./ThemeManager.js";
import HWindowGame from "./windows/HWindowGame.js";

import "./style.css";

export default class Editor {
	constructor() {
		if ("serviceWorker" in navigator) {
			window.addEventListener("load", () => {
				navigator.serviceWorker.register("service-worker.js");
			});
		}

		this.project = new Project();
		this.game = null;
		this.projectName = "game";

		this.dispatcher = new Dispatcher();

		this.preferences = new PreferencesManager();
		this.themeManager = new ThemeManager(this);

		this.projectFileHandle = null;

		this.clipboard = {};

		this.gameWindow = null;

		// Libraries
		this.libraries = BuiltInLibraries.getList();

		// WIP warning
		add( new HElement("div", {class: "warning"},
				"Work In Progress: Some features may not work as expected, or at all. Work may be lost, use it at your own discretion!") );

		// Areas
		this.div = parent( new HElement("div", {class: "editor"}) );

			this.titlebar = add( new HElement("div", {class: "titlebar"}, "<new game> - webgm") );

			this.menuArea = add( new HAreaMenu(this) );

			parent( add( new HElement("div", {class: "horizontal"}) ) );
				this.resourcesArea = add( new HAreaResources(this) );
				this.windowsArea = add( new HAreaWindows(this) );
				endparent();

			this.menuManager = add( new HMenuManager() );

			endparent();

		// Open file if dropped in the editor body
		if ("showOpenFilePicker" in window) {
			setOnFileDropAsFileHandle(this.div.html, async handle => {
				if (!confirm("Game may have been changed. Continue?")) return;
				this.projectFileHandle = handle;
				this.openProjectFromFile(await this.projectFileHandle.getFile());
			});
		} else {
			setOnFileDrop(this.div.html, file => {
				if (!confirm("Game may have been changed. Continue?")) return;
				this.openProjectFromFile(file);
			});
		}

		this.updateProjectName();

		// Actually add to the DOM
		add(this.div);
	}

	// Resource management

	createResource(type) {
		const resource = this.project.createResource(type);
		this.dispatcher.speak("createResource", resource);
		return resource;
	}

	moveResource(resource, toIndex) {
		const list = this.project.resources[resource.constructor.getClassName()];
		const fromIndex = list.indexOf(resource);
		if (fromIndex == -1) throw new Error("Resource doesn't exist.");
		list.splice(toIndex, 0, ...list.splice(fromIndex, 1));
		this.dispatcher.speak("moveResource", resource, toIndex);
		// this.resourcesArea.refresh();
	}

	duplicateResource(oldResource) {
		const resource = this.project.duplicateResource(oldResource);
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
		if (!confirm("Game may have been changed. Continue?")) return;

		this.project = new Project();
		this.projectFileHandle = null;
		this.updateProjectName(null);

		this.resourcesArea.refresh();
		this.windowsArea.clear();
	}

	// Called from HAreaMenu
	async openProject() {
		let file;
		if ("showOpenFilePicker" in window) {
			try {
				[this.projectFileHandle] = await window.showOpenFilePicker({
					types: [
						{
							description: "webgm project files",
							accept: {
								"application/zip": [".zip"],
								"application/json": [".json"],
							},
						},
					],
				});

				file = await this.projectFileHandle.getFile();
			} catch (e) {
				if (e instanceof DOMException) {
					if (e.name == "AbortError") {
						return;
					} else if (e.name == "NotAllowedError") {
						alert("Error: Not allowed to read from this file.");
						return;
					}
				}
				throw e;
			}
		} else {
			file = await openFile("application/zip,application/json");
		}

		this.openProjectFromFile(file);
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
		} catch (e) {
			if (e instanceof UnserializeException) {
				alert("Error: " + e.message);
				return;
			}
			throw e;
		}

		this.resourcesArea.refresh();
		this.windowsArea.clear();

		this.updateProjectName(file.name);
	}

	updateProjectName(filename) {
		if (filename != null) {
			const dotPosition = filename.lastIndexOf(".");
			if (dotPosition != -1) {
				this.projectName = filename.substring(0, dotPosition);
			} else {
				this.projectName = filename;
			}
			this.titlebar.html.textContent = filename + " - webgm";
		} else {
			this.projectName = "game";
			this.titlebar.html.textContent = "<new game> - webgm";
		}
		document.querySelector("title").textContent = this.titlebar.html.textContent;
	}

	// Called from HAreaMenu
	async saveProject() {
		if ("showOpenFilePicker" in window) {
			if (!this.projectFileHandle) {
				this.saveProjectAs();
			} else {
				this.saveProjectToFileHandle();
			}
		} else {
			const blob = await ProjectSerializer.serializeZIP(this.project);
			saveFile(blob, this.projectName + ".zip");
		}
	}

	// Called from HAreaMenu
	async saveProjectAs() {
		if ("showOpenFilePicker" in window) {
			try {
				this.projectFileHandle = await window.showSaveFilePicker({
					suggestedName: (this.projectName ?? "game") + ".zip",
					types: [
						{
							description: "webgm project files",
							accept: {
								"application/zip": [".zip"],
							},
						},
					],
				});
			} catch (e) {
				if (e instanceof DOMException) {
					if (e.name == "AbortError") {
						return;
					}
				}
				throw e;
			}

			this.updateProjectName(this.projectFileHandle.name);
			this.saveProjectToFileHandle();
		} else {
			throw new Error("Not supposed to call saveProjectAs when the File System Access API is not supported!");
		}
	}

	async saveProjectToFileHandle() {
		if ("showOpenFilePicker" in window) {
			const blob = await ProjectSerializer.serializeZIP(this.project);

			try {
				const writableStream = await this.projectFileHandle.createWritable();
				await writableStream.write(blob);
				await writableStream.close();
			} catch (e) {
				if (e instanceof DOMException) {
					if (e.name == "NotAllowedError") {
						alert("Error: Not allowed to write to this file.");
						return;
					}
				}
				throw e;
			}
		} else {
			throw new Error("Not supposed to call saveProjectToFileHandle when the File System Access API is not supported!");
		}
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

		this.game = new Game({
			project: this.project,
			canvas: this.gameWindow.canvas.html,
			input: this.gameWindow.canvas.html,
			menuManager: this.gameWindow.menuManager,
		});

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