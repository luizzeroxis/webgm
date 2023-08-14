import seedrandom from "seedrandom";

import HMenuManager from "~/common/components/HMenuManager/HMenuManager.js";
import HWindowManager from "~/common/components/HWindowManager/HWindowManager.js";
import Dispatcher from "~/common/Dispatcher.js";
import Events from "~/common/Events.js";
import {HElement, parent, endparent, add} from "~/common/h";
import Project from "~/common/project/Project.js";
import WebGMException from "~/common/WebGMException.js";

import BuiltInConstants from "./BuiltInConstants.js";
import BuiltInGlobals from "./BuiltInGlobals.js";
import GameAudio from "./GameAudio.js";
import GameCollision from "./GameCollision.js";
import GameEvents from "./GameEvents.js";
import GameInput from "./GameInput.js";
import GameRender from "./GameRender.js";
import GML from "./GML.js";
import HErrorWindow from "./HErrorWindow.js";
import Instance from "./Instance.js";
import ProjectLoader from "./ProjectLoader.js";
import VariableHolder from "./VariableHolder.js";

import "./Game.scss";

export default class Game {
	constructor(options) {
		this.project = new Project(options.project);

		this.dispatcher = new Dispatcher();

		//
		this.render = new GameRender(this);
		this.input = new GameInput(this, this.render.canvas);
		this.audio = new GameAudio(this);
		this.collision = new GameCollision(this);
		this.events = new GameEvents(this);

		// Project
		this.loadedProject = new ProjectLoader(this, this.project);

		// Engine
		this.builtInGlobalVars = null;
		this.globalVars = null;
		this.globalObjectVars = null;

		this.constants = null;

		this.lastId = null;

		// GML
		this.gml = new GML(this);

		// Main loop
		this.timeout = null;
		this.stepStopAction = null;

		// FPS
		this.lastFPSCheck = null;
		this.fps = 0;
		this.fpsFrameCount = 0;

		// Room
		this.room = null;
		this.instances = [];

		// Random
		this.rngSeed = null;
		this.rng = null;
		this.setRandomSeed();

		// Transitions
		this.transitionKind = 0;
		this.transitionSteps = 80;

		// Score, lives, health
		this.score = 0;
		this.lives = -1;
		this.health = 100;

		this.showHealth = false;
		this.showLives = false;
		this.showScore = true;

		this.captionHealth = "Health: ";
		this.captionLives = "Lives: ";
		this.captionScore = "Score: ";

		// Errors
		this.errorOccurred = false;
		this.errorLast = "";
		this.errorMessages = "";

		// HTML
		this.div = parent( new HElement("div", {class: "game"}) );
			this.mainDiv = parent( add( new HElement("div", {class: "main"}) ) );
				add(this.render.canvasHElement);
				this.menuManager = add(new HMenuManager());
				endparent();

			this.windowManager = add(new HWindowManager(this.mainDiv)); // TODO should this be here?
			endparent(this.div);
	}

	// Starts the game.
	async start() {
		try {
			this.render.start();
			this.input.start();
			this.startEngine();
			this.audio.start();

			await this.loadedProject.loadProject();
			await this.loadFirstRoom();

			this.startMainLoop();
		} catch (e) {
			await this.catch(e);
		}
	}

	// Restarts the game.
	async restart() {
		this.audio.stopAllSounds();
		await this.loadFirstRoom();
		this.startMainLoop();
	}

	// Ends the game properly, calling events and such.
	async end() {
		// If one instance calls a step stop exception, then even the other event type doesn't run
		try {
			for (const instance of this.instances) {
				if (!instance.exists) continue;
				await this.events.runEventOfInstance("other", Events.OTHER_ROOM_END, instance);
			}

			for (const instance of this.instances) {
				if (!instance.exists) continue;
				await this.events.runEventOfInstance("other", Events.OTHER_GAME_END, instance);
			}
		} catch (e) {
			if (e instanceof StepStopException) {
				this.stepStopAction = null;
			} else {
				throw e;
			}
		}

		this.close();
	}

	// // Internals

	// Function to deal with exceptions when called during the main loop or room loading.
	async catch(e) {
		if (e instanceof EngineException) {
			this.close(e);
		} else if (e instanceof AbortException) {
			this.close();
		} else if (e instanceof StepStopException) {
			this.stepStopAction = null;
			try {
				await e.fn();
			} catch (e) {
				await this.catch(e);
			}
		} else {
			this.close();
			throw e;
		}
	}

	// Stops the game as soon as possible.
	close(e) {
		// main loop
		this.endMainLoop();

		// canvas
		this.render.end();

		// input
		this.input.end();

		// audio
		this.audio.end();

		this.dispatcher.speak("close", e);
	}

	// Called by start, inits general engine stuff.
	startEngine() {
		this.builtInGlobalVars = new VariableHolder(this, BuiltInGlobals);
		this.globalVars = new VariableHolder(this);
		this.globalObjectVars = new VariableHolder(this);

		this.constants = BuiltInConstants.getList();

		// TODO Add user defined constants

		// Add resource names as constants
		Project.resourceTypes.forEach(type => {
			this.project.resources[type.getClassName()].forEach(x => { this.constants[x.name] = x.id; });
		});

		this.lastId = this.project.lastId;
	}

	// // Game running

	// Loads the first room of the game.
	async loadFirstRoom() {
		await this.loadRoom(this.project.resources.ProjectRoom[0], true);
	}

	// Run a step and set timeout for next step. With error catching.
	async mainLoopForTimeout() {
		this.timeout = setTimeout(async () => {
			await this.mainLoopPromise;
			this.mainLoopForTimeout();
		}, 1000 / this.room.speed);

		const timeoutStepStart = performance.now();

		// If one second has passed since last fps update, update it
		if ((timeoutStepStart - this.lastFPSCheck) >= 1000) {
			this.lastFPSCheck += 1000; // When it takes more than a second, it rolls over to the next check
			this.fps = this.fpsFrameCount;
			this.fpsFrameCount = 0;
		}

		try {
			// This is not an one liner (this.mainLoopPromise = await this.mainLoop()) because the timeout code above might execute before mainLoop finishes, so mainLoopPromise has to already be set by that point. Otherwise, the timeout will not wait for the current frame and add in a bunch of main calls.
			this.mainLoopPromise = this.mainLoop();
			await this.mainLoopPromise;

			++this.fpsFrameCount;
		} catch (e) {
			await this.catch(e);
		}
	}

	// Start running game steps.
	startMainLoop() {
		this.lastFPSCheck = performance.now();
		this.fps = 0;
		this.fpsFrameCount = 0;

		if (this.timeout != null) {
			this.endMainLoop();
		}

		this.mainLoopForTimeout();
	}

	// Stop running game steps.
	endMainLoop() {
		clearTimeout(this.timeout);
		this.timeout = null;
	}

	async mainLoopOnce() {
		try {
			await this.mainLoop();
		} catch (e) {
			await this.catch(e);
		}
	}

	// // Running steps and events

	// Run a step and set timeout for next step. Don't call this directly, use mainLoopForTimeout.
	async mainLoop() {
		if (this.stepStopAction != null) {
			throw new StepStopException(this.stepStopAction);
		}

		/*
			Begin step events
			Alarm events
			Keyboard, Key press, and Key release events
			Mouse events
			Normal step events
			(now all instances are set to their new positions)
			Collision events
			End step events
			Draw events
		*/

		// Get all events
		this.events.makeMapOfEvents();

		// Begin step
		for (const {event, instance} of this.events.getEventsOfTypeAndSubtype("step", "begin")) {
			if (!instance.exists) continue;
			await this.events.runEvent(event, instance);
		}

		// Time line
		for (const instance of this.instances) {
			if (!instance.timeline) continue;
			if (!instance.timelineRunning) continue;

			// Calculate which steps to execute
			const from = instance.timelinePosition;
			const till = instance.timelinePosition + instance.timelineSpeed;
			instance.timelinePosition = till;

			if (instance.timelineSpeed > 0) {
				for (const moment of instance.timeline.moments) {
					if (moment.step >= from && moment.step < till) {
						await this.events.runMoment(moment, instance.timeline, instance);
					}
				}
				if (instance.timelineLoop && (till > (instance.timeline.moments[instance.timeline.moments.length-1]?.step ?? 0))) {
					instance.timelinePosition = 0;
				}
			} else if (instance.timelineSpeed < 0) {
				for (const moment of instance.timeline.moments.toReversed()) {
					if (moment.step <= from && moment.step > till) {
						await this.events.runMoment(moment, instance.timeline, instance);
					}
				}
				if (instance.timelineLoop && till < 0) {
					instance.timelinePosition = instance.timeline.moments[instance.timeline.moments.length-1]?.step ?? 0;
				}
			}
		}

		// Alarm
		for (const [subtype, list] of this.events.getEventsOfType("alarm")) {
			for (const {event, instance} of list) {
				if (!instance.exists) continue;

				// Update alarm (decrease by one) here, before running event
				// Alarm stays 0 until next alarm check, where it becomes -1 forever (that's doom as heck)

				if (instance.alarms[subtype] >= 0) {
					instance.alarms[subtype] -= 1;
				}
				if (instance.alarms[subtype] == 0) {
					await this.events.runEvent(event, instance);
				}
			}
		}

		// Keyboard
		for (const [subtype, list] of this.events.getEventsOfType("keyboard")) {
			for (const {event, instance} of list) {
				if (!instance.exists) continue;
				if (this.input.getKey(subtype, this.input.key)) {
					await this.events.runEvent(event, instance);
				}
			}
		}

		for (const [subtype, list] of this.events.getEventsOfType("keypress")) {
			for (const {event, instance} of list) {
				if (!instance.exists) continue;
				if (this.input.getKey(subtype, this.input.keyPressed)) {
					await this.events.runEvent(event, instance);
				}
			}
		}

		for (const [subtype, list] of this.events.getEventsOfType("keyrelease")) {
			for (const {event, instance} of list) {
				if (!instance.exists) continue;
				if (this.input.getKey(subtype, this.input.keyReleased)) {
					await this.events.runEvent(event, instance);
				}
			}
		}

		// Mouse

		// TODO other mouse events

		for (const [subtype, list] of this.events.getEventsOfType("mouse")) {
			for (const {event, instance} of list) {
				if (!instance.exists) continue;

				let execute = false;
				const eventInfo = Events.listMouseSubtypes.find(x => x.id == subtype);
				if (eventInfo == null) return;

				if (eventInfo.kind == "button") {
					const dict = {
						"mouse": this.input.mouse,
						"mousePressed": this.input.mousePressed,
						"mouseReleased": this.input.mouseReleased,
					}[eventInfo.when]; // wacky

					execute = this.input.getMouse(eventInfo.button, dict);

					if (execute && !eventInfo.global) {
						// check if mouse is hovering over instance
						execute = this.collision.instanceOnPoint(instance, {x: this.input.mouseXInCurrentView, y: this.input.mouseYInCurrentView});
					}
				} else
				if (eventInfo.kind == "enter-leave") {
					// TODO check when this check is done
					if (instance.mouseInChanged == null) {
						const mouseIn = this.collision.instanceOnPoint(instance, {x: this.input.mouseXInCurrentView, y: this.input.mouseYInCurrentView});

						instance.mouseInChanged = (instance.mouseIn != mouseIn);
						instance.mouseIn = mouseIn;
					}

					execute = (instance.mouseInChanged == true && instance.mouseIn == eventInfo.isEnter);
				} else
				if (eventInfo.kind == "wheel-up") {
					execute = (this.input.mouseWheel < 0);
				} else
				if (eventInfo.kind == "wheel-down") {
					execute = (this.input.mouseWheel > 0);
				}

				if (execute) {
					await this.events.runEvent(event, instance);
				}
			}
		}

		// Step
		for (const {event, instance} of this.events.getEventsOfTypeAndSubtype("step", "normal")) {
			if (!instance.exists) continue;
			await this.events.runEvent(event, instance);
		}

		// Update instance variables and positions

		for (const instance of this.instances) {
			if (!instance.exists) continue;

			instance.xPrevious = instance.x;
			instance.yPrevious = instance.y;

			await this.updateInstancePosition(instance);
		}

		// Outside room and intersect boundary
		for (const {event, instance} of this.events.getEventsOfTypeAndSubtype("other", Events.OTHER_OUTSIDE_ROOM)) {
			if (!instance.exists) continue;

			const boundingBox = instance.getBoundingBox();

			if (boundingBox.x1 >= this.room.width
				|| boundingBox.x2 < 0
				|| boundingBox.y1 >= this.room.height
				|| boundingBox.y2 < 0) {
				await this.events.runEvent(event, instance);
			}
		}

		for (const {event, instance} of this.events.getEventsOfTypeAndSubtype("other", Events.OTHER_INTERSECT_BOUNDARY)) {
			if (!instance.exists) continue;

			const boundingBox = instance.getBoundingBox();

			if (boundingBox.x1 < 0
				|| boundingBox.x2 >= this.room.width
				|| boundingBox.y1 < 0
				|| boundingBox.y2 >= this.room.height) {
				await this.events.runEvent(event, instance);
			}
		}

		// Collisions
		for (const [subtype, list] of this.events.getEventsOfType("collision")) {
			for (const {event, instance} of list) {
				// TODO test what happens when colliding with multiple instances at once
				for (const other of this.instances) {
					if (!instance.exists) continue;
					if (!other.exists) continue;
					if (!(other.objectIndex == subtype)) continue;
					if (this.collision.instanceOnInstance(instance, other)) {
						if (other.solid) {
							// Move instance back
							instance.x = instance.xPrevious;
							instance.y = instance.yPrevious;
							if (instance.path) {
								instance.pathPosition = instance.pathPreviousPosition;
							}
						}

						await this.events.runEvent(event, instance, other);

						// Yes, the event can change solid variable
						if (other.solid) {
							// Move to new position
							if (!instance.exists) continue;
							await this.updateInstancePosition(instance);

							// Check collision again, if still collides, keep previous position.
							if (!other.exists) continue;
							if (this.collision.instanceOnInstance(instance, other)) {
								instance.x = instance.xPrevious;
								instance.y = instance.yPrevious;
								if (instance.path) {
									instance.pathPosition = instance.pathPreviousPosition;
								}
							}
						}
					}
				}
			}
		}

		// End step

		for (const {event, instance} of this.events.getEventsOfTypeAndSubtype("step", "end")) {
			if (!instance.exists) continue;
			await this.events.runEvent(event, instance);
		}

		// Update mouse position in view
		this.input.updateMousePositionInCurrentView();

		// Draw
		await this.render.drawViews();

		// Update some global variables
		for (const roomBackground of this.room.backgrounds) {
			if (!roomBackground) continue;
			roomBackground.x += roomBackground.horizontalSpeed;
			roomBackground.y += roomBackground.verticalSpeed;
		}

		// Update some instance variables
		for (const instance of this.instances) {
			if (!instance.exists) continue;

			instance.xPrevious = instance.x;
			instance.yPrevious = instance.y;

			instance.imageIndex += instance.imageSpeed;

			const imageNumber = instance.sprite?.images.length ?? 0;
			if (instance.imageIndex >= imageNumber) {
				instance.imageIndex -= imageNumber;

				await this.events.runEventOfInstance("other", Events.OTHER_ANIMATION_END, instance);
			}

			instance.mouseInChanged = null;
		}

		// Check global game settings default keys
		if (this.project.globalGameSettings.keyEscEndsGame) {
			if (this.input.getKey(27, this.input.keyPressed)) {
				this.stepStopAction = async () => {
					await this.end();
				};
			}
		}
		// if (this.project.globalGameSettings.keyF1ShowsGameInformation) {
		// 	if (this.input.getKey(112, this.input.keyPressed)) {
		// 		// this.showGameInformation();
		// 		// console.log('f1 pressed');
		// 	}
		// }
		if (this.project.globalGameSettings.keyF4SwitchesFullscreen) {
			if (this.input.getKey(115, this.input.keyPressed)) {
				this.render.setFullscreen(!this.render.getFullscreen());
			}
		}
		// if (this.project.globalGameSettings.keyF5SavesF6Loads) {
		// 	if (this.input.getKey(116, this.input.keyPressed)) {
		// 		// this.saveGame();
		// 		// console.log('f5 pressed');
		// 	}
		// 	if (this.input.getKey(117, this.input.keyPressed)) {
		// 		// this.loadGame();
		// 		// console.log('f6 pressed');
		// 	}
		// }
		// if (this.project.globalGameSettings.keyF9Screenshots) {
		// 	if (this.input.getKey(120, this.input.keyPressed)) {
		// 		// this.screenshotGame();
		// 		// console.log('f9 pressed');
		// 	}
		// }

		// Reset keyboard/mouse states
		this.input.clearStep();

		// Delete instances
		this.instances = this.instances.filter(instance => instance.exists);
	}

	//
	async updateInstancePosition(instance) {
		if (instance.path == null) {
			const hspeedOld = instance.hSpeed;
			const vspeedOld = instance.vSpeed;

			let hspeedNew = hspeedOld;
			let vspeedNew = vspeedOld;

			instance.x += hspeedOld;
			instance.y += vspeedOld;

			if (instance.friction != 0) {
				const direction = instance.direction * (Math.PI / 180);

				if (hspeedOld != 0) {
					hspeedNew = hspeedOld - Math.cos(direction) * instance.friction;
					if (Math.sign(hspeedNew) != Math.sign(hspeedOld)) { // If changed sign, that is, going in the opposite direction, don't do that
						hspeedNew = 0;
					}
				}

				if (vspeedOld != 0) {
					vspeedNew = vspeedOld - -Math.sin(direction) * instance.friction;
					if (Math.sign(vspeedNew) != Math.sign(vspeedOld)) {
						vspeedNew = 0;
					}
				}
			}

			if (instance.gravity != 0) {
				hspeedNew += Math.cos(instance.gravityDirection * (Math.PI / 180)) * instance.gravity;
				vspeedNew += -Math.sin(instance.gravityDirection * (Math.PI / 180)) * instance.gravity;
			}

			instance.setHspeedAndVspeed(hspeedNew, vspeedNew);
		} else {
			const length = instance.path.getLength();
			const sp = instance.path.getPosSp(instance.pathPosition);

			instance.pathPreviousPosition = instance.pathPosition;
			instance.pathPosition += (instance.pathSpeed * (sp / 100)) / length;

			let {x, y, direction} = instance.path.getPosInfo(instance.pathPosition);

			[x, y] = [x * instance.pathScale, y * instance.pathScale];

			const a = instance.pathOrientation * Math.PI/180;
			const cos = Math.cos(a);
			const sin = -Math.sin(a);
			[x, y] = [cos*x - sin*y, sin*x + cos*y];

			instance.x = instance.pathStartPosition.x + x;
			instance.y = instance.pathStartPosition.y + y;

			instance.direction = direction;

			instance.speed = 0;
			instance.hSpeed = 0;
			instance.vSpeed = 0;

			const stoppedForward = (instance.pathPosition >= 1) && (instance.pathSpeed > 0);
			const stoppedReverse = (instance.pathPosition <= 0) && (instance.pathSpeed < 0);

			if (stoppedForward || stoppedReverse) {
				switch (instance.pathEndAction) {
					case 0: // stop
						instance.path = null;
						break;
					case 1: // restart start
						instance.pathPosition = (stoppedForward ? 0 : 1);
						break;
					case 2: // restart current
						instance.pathPosition = (stoppedForward ? 0 : 1);
						instance.pathStartPosition = {x: instance.x, y: instance.y};
						break;
					case 3: // reverse
						instance.pathPosition = (stoppedForward ? 1 : 0);
						instance.pathSpeed *= -1;
						break;
					default:
						instance.path = null;
				}

				await this.events.runEventOfInstance("other", Events.OTHER_END_OF_PATH, instance);
			}
		}
	}

	// // Actions execution

	// Loads a room. Only use this inside the stepStopAction function, or at the beginning of the game.
	// isGameStart is set when it's the first room loaded or the game is restarted.
	async loadRoom(room, isGameStart=false) {
		if (!isGameStart) {
			// If one instance calls a step stop exception, then the entire chain stops
			try {
				for (const instance of this.instances) {
					if (!instance.exists) continue;
					await this.events.runEventOfInstance("other", Events.OTHER_ROOM_END, instance);
				}
			} catch (e) {
				if (e instanceof StepStopException) {
					this.stepStopAction = null;
				} else {
					throw e;
				}
			}

			this.instances = this.instances.filter(instance => instance.exists && instance.persistent);
		} else {
			this.instances = []; // TODO check if when it restarts it calls destroy events
		}

		this.room = {
			resource: room,
			width: room.width,
			height: room.height,
			caption: room.caption,
			speed: room.speed,
			persistent: room.persistent,
			backgroundShowColor: room.drawBackgroundColor,
			backgroundColor: room.backgroundColor,
			viewsEnabled: room.enableViews,

			backgrounds: room.backgrounds.map(roomBackground => {
				if (!roomBackground) return null;

				let xScale = 1;
				let yScale = 1;
				if (roomBackground.stretch) {
					const backgroundImage = this.project.getResourceById("ProjectBackground", roomBackground.backgroundIndex)?.image;
					if (backgroundImage) {
						xScale = room.width / backgroundImage.width;
						yScale = room.height / backgroundImage.height;
					}
				}
				return {
					visible: roomBackground.visibleAtStart,
					isForeground: roomBackground.isForeground,
					backgroundIndex: roomBackground.backgroundIndex,
					tileHorizontally: roomBackground.tileHorizontally,
					tileVertically: roomBackground.tileVertically,
					x: roomBackground.x,
					y: roomBackground.y,
					horizontalSpeed: roomBackground.horizontalSpeed,
					verticalSpeed: roomBackground.verticalSpeed,

					xScale: xScale,
					yScale: yScale,
					blend: 16777215, // TODO
					alpha: 1,
				};
			}),

			// TODO tiles

			views: room.views.map(view => {
				if (!view) return null;

				return {
					visible: view.visibleAtStart,
					viewX: view.viewX,
					viewY: view.viewY,
					viewW: view.viewW,
					viewH: view.viewH,
					portX: view.portX,
					portY: view.portY,
					portW: view.portW,
					portH: view.portH,
					objectFollowIndex: view.objectFollowIndex, // TODO
					objectFollowHorizontalBorder: view.objectFollowHorizontalBorder,
					objectFollowVerticalBorder: view.objectFollowVerticalBorder,
					objectFollowHorizontalSpeed: view.objectFollowHorizontalSpeed,
					objectFollowVerticalSpeed: view.objectFollowVerticalSpeed,

					angle: 0,
				};
			}),
		};

		if (room.enableViews) {
			let w = 0;
			let h = 0;
			for (const view of room.views) {
				if (!view) continue;
				w = Math.max(w, view.portX + view.portW);
				h = Math.max(h, view.portY + view.portH);
			}
			this.render.setSize(w, h);
		} else {
			this.render.setSize(room.width, room.height);
		}

		this.input.clear();

		// TODO Check if room is persistent

		const createdInstances = [];
		for (const roomInstance of room.instances) {
			createdInstances.push(this.instanceCreateNoEvents(roomInstance.id, roomInstance.x, roomInstance.y, roomInstance.object_index, false));
		}

		for (const instance of createdInstances) {
			// TODO run instance creation code
			await this.events.runEventOfInstance("create", null, instance);
		}

		if (isGameStart) {
			for (const instance of this.instances) {
				if (!instance.exists) continue;
				await this.events.runEventOfInstance("other", Events.OTHER_GAME_START, instance);
			}
		}

		// TODO run room creation code

		for (const instance of this.instances) {
			if (!instance.exists) continue;
			await this.events.runEventOfInstance("other", Events.OTHER_ROOM_START, instance);
		}

		// Update mouse position in view
		this.input.updateMousePositionInCurrentView();

		await this.render.drawViews();
	}

	// Loads a room after the current step
	loadRoomAtStepStop(roomIndex) {
		const room = this.project.getResourceById("ProjectRoom", roomIndex);
		if (room == null) {
			throw this.makeError({fatal: true, text: `Unexisting room number: ${roomIndex}`});
		}
		this.stepStopAction = async () => {
			await this.loadRoom(room);
			this.startMainLoop();
		};
	}

	// Create an instance in the room.
	async instanceCreate(id, x, y, object) {
		const instance = this.instanceCreateNoEvents(id, x, y, object);

		await this.events.runEventOfInstance("create", null, instance);

		return instance.id;
	}

	instanceCreateNoEvents(id, x, y, object) {
		if (id == null) {
			this.lastId += 1;
			id = this.lastId;
		}

		const instance = new Instance(id, x, y, object, this);
		this.instances.push(instance);

		return instance;
	}

	// Destroy an instance in the room.
	async instanceDestroy(instance) {
		await this.events.runEventOfInstance("destroy", null, instance);
		instance.exists = false;
	}

	// Get a room background. If it doesn't exist, create one with default parameters.
	getRoomBackground(index) {
		if (this.room.backgrounds[index] == null) {
			this.room.backgrounds[index] = {
				visible: false,
				isForeground: false,
				backgroundIndex: -1,
				tileHorizontally: true,
				tileVertically: true,
				x: 0,
				y: 0,
				horizontalSpeed: 0,
				verticalSpeed: 0,
				xScale: 1,
				yScale: 1,
				blend: 16777215,
				alpha: 1,
			};
		}
		return this.room.backgrounds[index];
	}

	// Get a room view. If it doesn't exist, create one with default parameters.
	getRoomView(index) {
		if (this.room.views[index] == null) {
			this.room.views[index] = {
				visible: false,
				viewX: 0,
				viewY: 0,
				viewW: 640,
				viewH: 480,
				portX: 0,
				portY: 0,
				portW: 640,
				portH: 480,
				objectFollowIndex: -1,
				objectFollowHorizontalBorder: 32,
				objectFollowVerticalBorder: 32,
				objectFollowHorizontalSpeed: -1,
				objectFollowVerticalSpeed: -1,

				angle: 0,
			};
		}
		return this.room.views[index];
	}

	// Sets the random seed used by the game. If null, make random one.
	setRandomSeed(seed) {
		this.rngSeed = seed ?? Math.floor(((Math.random() - 0.5) * (2 ** 32))); // 32 bit signed int
		this.rng = seedrandom(this.rngSeed);
	}

	// Sets the lives variable, calling the relevant events.
	async setLives(value) {
		const previous = this.lives;
		this.lives = value;

		if (value <= 0 && previous > 0) {
			for (const instance of this.instances) {
				if (!instance.exists) continue;
				await this.events.runEventOfInstance("other", Events.OTHER_NO_MORE_LIVES, instance);
			}
		}
	}

	// Sets the health variable, calling the relevant events.
	async setHealth(value) {
		const previous = this.health;
		this.health = value;

		if (value <= 0 && previous > 0) {
			for (const instance of this.instances) {
				if (!instance.exists) continue;
				await this.events.runEventOfInstance("other", Events.OTHER_NO_MORE_HEALTH, instance);
			}
		}
	}

	// // Helper functions

	// If parent is an ancestor of child, by index.
	objectIsAncestorByIndex(parentIndex, childIndex) {
		const parent = this.project.getResourceById("ProjectObject", parentIndex);
		const child = this.project.getResourceById("ProjectObject", childIndex);
		return this.objectIsAncestor(parent, child);
	}

	// If parent is an ancestor of child.
	objectIsAncestor(parent, child) {
		if (child.parent_index >= 0) {
			if (child.parent_index == parent.id) return true;

			const childParent = this.project.getResourceById("ProjectObject", child.parent_index);
			return this.objectIsAncestor(parent, childParent);
		}
		return false;
	}

	// // Game error checking and throwing

	// options {text, fatal: false, header: true, actionNumber, event, object}
	makeError(options) {
		const event = options.event ?? this.events.state.event;
		const moment = options.moment ?? this.events.state.moment;

		const args = {
			text:
				((options.header !== false) ? (
					`\n`
					+ `___________________________________________\n`
					+ `${options.fatal ? "FATAL " : ""}ERROR in\n`
					+ `action number ${options.actionNumber ?? this.events.actionNumber}\n`
					+ (
						event ? (
							`of ${Events.getEventName(event.type, event.subtype, this.project)}\n`
							+ `for object ${options.object?.name ?? this.events.state.object.name}:\n`
						) : moment ? (
							`at time step ${moment.step}\n`
							+ `of time line ${options.timeline?.name ?? this.events.state.timeline.name}:\n`
						) : ``
					)
					+ `\n`
				) : ``)
				+ options.text,
		};

		if (options.fatal) {
			return new FatalErrorException(args);
		} else {
			return new NonFatalErrorException(args);
		}
	}

	// TODO make the message more like the one from GM

	// Display a error message using the text property.
	async showError(e) {
		console.error(e.text);

		this.errorOccurred = true;
		this.errorLast = e.text;
		this.errorMessages += e.text + "\n";

		const result = await this.windowManager.openModal(HErrorWindow, this, e).promise;

		if (result.abort == true) {
			throw new AbortException();
		}
	}
}

// Errors related to webgm itself (editor or runner catches it)
export class EngineException extends WebGMException {}

// Errors in the user project
export class ProjectErrorException extends WebGMException {}

// Errors in the game that are fatal
export class FatalErrorException extends ProjectErrorException {}
// Errors in the game that are not fatal
export class NonFatalErrorException extends ProjectErrorException {}

// Used in exit statement and exit action
export class ExitException extends WebGMException {}

// Used when calling functions that require stopping the current step
export class StepStopException extends WebGMException {
	constructor(fn, ...args) {
		super(...args);
		this.fn = fn;
	}
}

// Used when aborting errors
export class AbortException extends WebGMException {}