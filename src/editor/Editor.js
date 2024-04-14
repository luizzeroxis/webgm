//The editor class

import HMenuManager from "~/common/components/HMenuManager/HMenuManager.js";
import HWindowManager from "~/common/components/HWindowManager/HWindowManager.js";
import Dispatcher from "~/common/Dispatcher.js";
import {HElement, parent, endparent, add} from "~/common/h";
import Project from "~/common/project/Project.js";
import {ProjectAction} from "~/common/project/ProjectProperties.js";
import ProjectSerializer, {UnserializeException} from "~/common/project/ProjectSerializer.js";
import {openFile, saveFile, setOnFileDrop, setOnFileDropAsFileHandle} from "~/common/tools.js";
import HSplitter from "~/editor/components/HSplitter/HSplitter.js";

import HAreaMenuBar from "./areas/HAreaMenuBar.js";
import HAreaResources from "./areas/HAreaResources.js";
import HAreaToolBar from "./areas/HAreaToolBar.js";
import HAreaWindows from "./areas/HAreaWindows.js";
import BuiltInLibraries from "./BuiltInLibraries.js";
import HWIPWarning from "./HWIPWarning.js";
import PreferencesManager from "./PreferencesManager.js";
import StandAloneBuilder from "./StandAloneBuilder.js";
import ThemeManager from "./ThemeManager.js";

import "./Editor.scss";

export default class Editor {
	constructor() {
		if ("serviceWorker" in navigator) {
			window.addEventListener("load", () => {
				navigator.serviceWorker.register("service-worker.js")
				.catch(() => {
					//
				});
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
			this.mainDiv = parent( add( new HElement("div", {class: "main"}) ) );
				this.wipWarning = add( new HWIPWarning(this) );
				this.menuBarArea = add( new HAreaMenuBar(this) );
				this.toolBarArea = add( new HAreaToolBar(this) );

				this.resourcesArea = new HAreaResources(this);
				this.windowsArea = new HAreaWindows(this);

				add( new HSplitter(this.resourcesArea, this.windowsArea) );

				endparent();

			this.windowManager = new HWindowManager(this.mainDiv);
			add( this.windowManager );

			add( this.menuManager );

			endparent();

		// Open file if dropped in the editor body
		const zipType = t => t == "application/zip" || t == "application/x-zip-compressed";
		if ("showOpenFilePicker" in window) {
			setOnFileDropAsFileHandle(this.div.html, zipType, async handle => {
				if (!confirm("Game may have been changed. Continue?")) return;
				this.projectFileHandle = handle;
				this.openProjectFromFile(await this.projectFileHandle.getFile());
			});
		} else {
			setOnFileDrop(this.div.html, zipType, file => {
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
			const project = await ProjectSerializer.unserializeZIP(file);
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

	createStandAlone() {
		if (this.project.resources.ProjectRoom.length <= 0) {
			alert("A game must have at least one room to run.");
			return;
		}

		StandAloneBuilder.build(this.project, this.projectName + "-build");
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

	runGame() {
		if (this.project.resources.ProjectRoom.length <= 0) {
			alert("A game must have at least one room to run.");
			return;
		}

		if (this.gameWindow) {
			this.gameWindow.forceClose();
		}
		this.gameWindow = this.windowsArea.openGame();
	}

	stopGame() {
		this.gameWindow.forceClose();
	}

	showAbout() {
		alert("WebGM"
			+ "\nVersion: 0.0.0"
			+ "\nCommit hash: " + CONSTANTS.COMMITHASH
			+ "\nCommit time: " + CONSTANTS.LASTCOMMITDATETIME
			+ "\nGitHub: https://github.com/luizzeroxis/webgm",
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