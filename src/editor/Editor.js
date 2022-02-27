//The editor class

import BuiltInLibraries from '../common/BuiltInLibraries.js'
import Dispatcher from '../common/Dispatcher.js'
import {WebGMException, UnserializeException} from '../common/Exceptions.js';
import {parent, endparent, add, newElem, setOnFileDrop} from '../common/H.js'
import {
	Project,
	ProjectAction,
	ProjectSprite,
	ProjectSound,
	ProjectBackground,
	ProjectPath,
	ProjectScript,
	ProjectFont,
	ProjectTimeline,
	ProjectObject,
	ProjectRoom
} from '../common/Project.js';
import ProjectSerializer from '../common/ProjectSerializer.js';
import VirtualFileSystem from '../common/VirtualFileSystem.js';
import {Game} from '../game/Game.js';

import GameArea from './areas/GameArea.js';
import MenuArea from './areas/MenuArea.js';
import ResourcesArea from './areas/ResourcesArea.js';
import WindowsArea from './areas/WindowsArea.js';
import DefaultProjectFontIcon from './img/default-ProjectFont-icon.png';
import DefaultProjectPathIcon from './img/default-ProjectPath-icon.png';
import DefaultProjectRoomIcon from './img/default-ProjectRoom-icon.png';
import DefaultProjectScriptIcon from './img/default-ProjectScript-icon.png';
import DefaultProjectSoundIcon from './img/default-ProjectSound-icon.png';
import DefaultProjectTimelineIcon from './img/default-ProjectTimeline-icon.png';
import HTMLWindowBackground from './windows/HTMLWindowBackground.js';
import HTMLWindowFont from './windows/HTMLWindowFont.js';
import HTMLWindowObject from './windows/HTMLWindowObject.js';
import HTMLWindowPath from './windows/HTMLWindowPath.js';
import HTMLWindowRoom from './windows/HTMLWindowRoom.js';
import HTMLWindowScript from './windows/HTMLWindowScript.js';
import HTMLWindowSound from './windows/HTMLWindowSound.js';
import HTMLWindowSprite from './windows/HTMLWindowSprite.js';
import HTMLWindowTimeline from './windows/HTMLWindowTimeline.js';

import './style.css';

export default class Editor {

	static resourceTypesInfo = [
		{class: ProjectSprite,     windowClass: HTMLWindowSprite,     resourceIcon: null                      },
		{class: ProjectSound,      windowClass: HTMLWindowSound,      resourceIcon: DefaultProjectSoundIcon   },
		{class: ProjectBackground, windowClass: HTMLWindowBackground, resourceIcon: null                      },
		{class: ProjectPath,       windowClass: HTMLWindowPath,       resourceIcon: DefaultProjectPathIcon    },
		{class: ProjectScript,     windowClass: HTMLWindowScript,     resourceIcon: DefaultProjectScriptIcon  },
		{class: ProjectFont,       windowClass: HTMLWindowFont,       resourceIcon: DefaultProjectFontIcon    },
		{class: ProjectTimeline,   windowClass: HTMLWindowTimeline,   resourceIcon: DefaultProjectTimelineIcon},
		{class: ProjectObject,     windowClass: HTMLWindowObject,     resourceIcon: null                      },
		{class: ProjectRoom,       windowClass: HTMLWindowRoom,       resourceIcon: DefaultProjectRoomIcon    },
	];

	constructor() {

		//this.editor = this;
		this.project = new Project();
		this.game = null;
		this.projectName = 'game';

		this.dispatcher = new Dispatcher();

		//Preferences
		this.preferences = {
			theme: 'auto',
			defaultActionLibraryTab: 'move',
			scrollToGameOnRun: true,
			focusCanvasOnRun: true,
			clearCanvasOnStop: true,
		}

		this.autoTheme = 'light';

		this.loadPreferences();

		//Libraries
		this.libraries = BuiltInLibraries.getList();

		//Areas

		this.html = parent( add( newElem('editor', 'div') ))

			add( newElem(null, 'div', 'Work In Progress: Some features may not work as expected, or at all. Work may be lost, use it at your own discretion!') )

			parent( add( newElem('grid', 'div') ) )

				this.menuArea = new MenuArea(this);
				this.resourcesArea = new ResourcesArea(this);
				this.windowsArea = new WindowsArea(this);
				this.gameArea = new GameArea();

				endparent()

			endparent()

		// Open file if dropped in the editor body
		setOnFileDrop(this.html, file => this.openProjectFromFile(file));

		// Update theme if on auto to match system
		var media = window.matchMedia('(prefers-color-scheme: dark)');
		media.addEventListener('change', e => this.updateAutoTheme(e));
		this.updateAutoTheme(media);
	}

	updateAutoTheme(mediaQueryList) {
		this.autoTheme = mediaQueryList.matches ? 'dark' : 'light';
		this.applyTheme();
	}

	loadPreferences() {
		var preferences;
		try {
			preferences = JSON.parse(window.localStorage.getItem('preferences'));
			if (preferences != null) {
				this.preferences = Object.assign(this.preferences, preferences);
				this.applyPreferences();
			}
		} catch (e) {
			// SyntaxError
			console.log('Could not load preferences, clearing them', preferences);
			window.localStorage.clear();
		}
	}

	savePreferences() {
		var preferences = JSON.stringify(this.preferences);
		try {
			window.localStorage.setItem('preferences', preferences);
			this.applyPreferences();
		} catch (e) {
			// SecurityError
			console.log('Could not save preferences', this.preferences);
		}
	}

	applyPreferences() {
		this.applyTheme();
	}

	applyTheme() {

		var theme = this.preferences.theme;
		if (theme == 'auto') {
			theme = this.autoTheme;
		}

		if (theme == 'dark') {
			document.documentElement.classList.remove('light');
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
			document.documentElement.classList.add('light');
		}

	}

	// Resource management

	createResource(type) {

		var resource = new type();
		resource.id = this.project.counter[type.getClassName()];
		resource.name = type.getName() + this.project.counter[type.getClassName()];

		this.project.counter[type.getClassName()]++;
		this.project.resources[type.getClassName()].push(resource);

		this.dispatcher.speak('createResource', resource);

		return resource;

	}

	deleteResource(resource) {

		if (confirm('You are about to delete '+resource.name+'. This will be permanent. Continue?')) {
			var index = this.project.resources[resource.constructor.getClassName()].findIndex(x => x == resource);
			this.project.resources[resource.constructor.getClassName()].splice(index, 1);

			this.dispatcher.speak('deleteResource', resource);
		}

	}

	changeResourceName(resource, name) {
		resource.name = name;
		this.dispatcher.speak('changeResourceName', resource);
	}
	changeSpriteImages(sprite, images) {
		sprite.images = images;
		this.dispatcher.speak('changeSpriteImages', sprite);
	}
	changeSpriteOrigin(sprite, originx, originy) {
		sprite.originx = originx;
		sprite.originy = originy;
		this.dispatcher.speak('changeSpriteOrigin', sprite);
	}
	changeBackgroundImage(background, image) {
		background.image = image;
		this.dispatcher.speak('changeBackgroundImage', background);
	}
	changeObjectSprite(object, sprite) {
		object.sprite_index = sprite;
		this.dispatcher.speak('changeObjectSprite', object);
	}

	// Called from MenuArea
	newProject() {
		this.project = new Project();

		this.resourcesArea.refresh();
		this.windowsArea.clear();
	}

	// Called from MenuArea
	openProjectFromFile(file) {

		var promise;

		if (file.type == 'application/json') {
			promise = VirtualFileSystem.readEntireFile(file)
			.then(json => ProjectSerializer.unserializeV1(json))
		} else {
			promise = ProjectSerializer.unserializeZIP(file);
		}

		promise.then(project => {
			if (project) {
				this.project = project;

				this.resourcesArea.refresh();
				this.windowsArea.clear();

				this.projectName = file.name.substring(0, file.name.lastIndexOf('.'));

			} else {
				alert('Error Loading: File seems to be corrupt.');
				return;
			}
		}).catch(e => {
			if (e instanceof UnserializeException) {
				alert("Error reading file: " + e.message);
			} else {
				throw e;
			}
		})
	}

	// Called from MenuArea
	saveProject() {

		ProjectSerializer.serializeZIP(this.project)
		.then(blob => {
			VirtualFileSystem.save(blob, this.projectName+".zip");
		})
		
	}

	// Called from MenuArea
	runGame() {

		this.stopGame();

		if (this.project.resources.ProjectRoom.length <= 0) {
			alert('A game must have at least one room to run.');
			return;
		}

		this.menuArea.runButton.disabled = true;
		this.menuArea.stopButton.disabled = false;

		if (this.preferences.scrollToGameOnRun) {
			this.gameArea.scrollIntoView();
		}
		if (this.preferences.focusCanvasOnRun) {
			this.gameArea.focus();
		}

		this.game = new Game(this.project, this.gameArea.canvas, this.gameArea.canvas);

		this.game.dispatcher.listen({
			close: e => {

				if (e instanceof WebGMException) {
					alert("An error has ocurred when trying to run the game:\n" + e.message);
				}

				this.menuArea.runButton.disabled = false;
				this.menuArea.stopButton.disabled = true;

				if (this.preferences.clearCanvasOnStop) {
					this.gameArea.clearCanvas();
				}

				this.game = null;

				if (e) {
					throw e;
				}
			}
		})

		this.game.start();
				
	}

	// Called from MenuArea and runGame
	stopGame () {
		if (this.game) {
			this.game.stepStopAction = async () => await this.game.end();
		}
	}

	// getActionType(action)
	// getActionType(actionTypeLibrary, actionTypeId)
	getActionType(...args) {
		var actionTypeLibrary, actionTypeId;

		var [action] = args;
		if (action instanceof ProjectAction) {
			actionTypeLibrary = action.typeLibrary;
			actionTypeId = action.typeId;
		} else {
			[actionTypeLibrary, actionTypeId] = args;
		}

		var library = this.libraries.find(x => x.name == actionTypeLibrary);
		var actionType = library.items.find(x => x.id == actionTypeId);
		return actionType;
	}

}