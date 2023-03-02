//The editor class

import Dispatcher from "../common/Dispatcher.js";
import {WebGMException, UnserializeException} from "../common/Exceptions.js";
import {HElement, parent, endparent, add, setOnFileDrop, setOnFileDropAsFileHandle} from "../common/H.js";
import {
	Project,
	ProjectAction,
} from "../common/Project.js";
import ProjectSerializer from "../common/ProjectSerializer.js";
import {openFile, saveFile, readFileAsText} from "../common/tools.js";
import Game from "../game/Game.js";

import HAreaMenuBar from "./areas/HAreaMenuBar.js";
import HAreaResources from "./areas/HAreaResources.js";
import HAreaToolBar from "./areas/HAreaToolBar.js";
import HAreaWindows from "./areas/HAreaWindows.js";
import BuiltInLibraries from "./BuiltInLibraries.js";
import HMenuManager from "./HMenuManager.js";
import HWIPWarning from "./HWIPWarning.js";
import PreferencesManager from "./PreferencesManager.js";
import ThemeManager from "./ThemeManager.js";

import "./Editor.scss";

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
		this.libraries = BuiltInLibraries.list;

		this.menuManager = new HMenuManager();

		// Areas
		this.div = parent( new HElement("div", {class: "editor"}) );

			this.wipWarning = add( new HWIPWarning(this) );

			this.menuBarArea = add( new HAreaMenuBar(this) );

			this.toolBarArea = add( new HAreaToolBar(this) );

			parent( add( new HElement("div", {class: "horizontal"}) ) );
				this.resourcesArea = add( new HAreaResources(this) );
				this.windowsArea = add( new HAreaWindows(this) );
				endparent();

			add( this.menuManager );

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

	newProject() {
		if (!confirm("Game may have been changed. Continue?")) return;

		const project = new Project();
		project.dispatcher = this.project.dispatcher;
		this.project = project;

		this.projectFileHandle = null;
		this.updateProjectName(null);

		this.resourcesArea.refresh();
		this.windowsArea.clearProject();
	}

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

	async openProjectFromFile(file) {
		try {
			let project;
			if (file.type == "application/json") {
				const json = readFileAsText(file);
				project = await ProjectSerializer.unserializeV1(json);
			} else {
				project = await ProjectSerializer.unserializeZIP(file);
			}
			project.dispatcher = this.project.dispatcher;
			this.project = project;
		} catch (e) {
			if (e instanceof UnserializeException) {
				alert("Error: " + e.message);
				return;
			}
			throw e;
		}

		this.resourcesArea.refresh();
		this.windowsArea.clearProject();

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
			document.querySelector("title").textContent = filename + " - webgm";
		} else {
			this.projectName = "game";
			document.querySelector("title").textContent = "<new game> - webgm";
		}
	}

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

	findResource() {
		const name = prompt("Resource name:");
		if (name) {
			for (const type of Project.resourceTypes) {
				const resource = this.project.resources[type.getClassName()].find(resource => resource.name == name);
				if (resource) {
					this.windowsArea.openResource(resource);
					return;
				}
			}
			alert("Cannot find resource");
		}
	}

	async runGame() {
		await this.stopGame();

		if (this.project.resources.ProjectRoom.length <= 0) {
			alert("A game must have at least one room to run.");
			return;
		}

		this.gameWindow = this.windowsArea.openGame();

		this.toolBarArea.runButton.setDisabled(true);
		this.toolBarArea.stopButton.setDisabled(false);

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

				this.toolBarArea.runButton.setDisabled(false);
				this.toolBarArea.stopButton.setDisabled(true);

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

	stopGame() {
		if (this.game) {
			this.toolBarArea.stopButton.setDisabled(true);

			return new Promise((resolve) => {
				const gameListeners = this.game.dispatcher.listen({
					close: () => {
						if (this.game) {
							this.game.dispatcher.stopListening(gameListeners);
						}

						resolve();
					},
				});
				this.game.stepStopAction = async () => await this.game.end();
			});
		}
		return Promise.resolve();
	}

	showAbout() {
		alert("WebGM"
			+ "\nVersion: 0.0.0"
			+ "\nCommit hash: " + CONSTANTS.COMMITHASH
			+ "\nCommit time: " + CONSTANTS.LASTCOMMITDATETIME
			+ "\nGitHub: https://github.com/luizeldorado/webgm",
		);
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