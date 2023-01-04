import Dispatcher from "../common/Dispatcher.js";
import Events from "../common/Events.js";
import {EngineException, ProjectErrorException, FatalErrorException, NonFatalErrorException, ExitException, StepStopException} from "../common/Exceptions.js";
import {Project} from "../common/Project.js";
import VariableHolder from "../common/VariableHolder.js";

import BuiltInConstants from "./BuiltInConstants.js";
import BuiltInGlobals from "./BuiltInGlobals.js";
import GameAudio from "./GameAudio.js";
import GameCollision from "./GameCollision.js";
import GameInput from "./GameInput.js";
import GML from "./GML.js";
import Instance from "./Instance.js";
import ProjectLoader from "./ProjectLoader.js";

export default class Game {
	constructor(options) {
		this.project = new Project(options.project);
		this.canvas = options.canvas;
		// this.input = options.input;
		this.menuManager = options.menuManager;

		this.dispatcher = new Dispatcher();

		//
		this.input = new GameInput(this, options.input);
		this.audio = new GameAudio(this);
		this.collision = new GameCollision(this);

		// Canvas
		this.ctx = null;

		// Project
		this.loadedProject = new ProjectLoader(this, this.project);

		// Engine
		this.builtInGlobalVars = null;
		this.globalVars = null;
		this.globalObjectVars = null;

		this.constants = null;

		this.lastId = null;

		// Events and actions
		this.currentEvent = null;
		this.currentEventInstance = null;
		this.currentEventOther = null;
		this.currentEventActionNumber = null;

		// GML
		this.gml = new GML(this);

		this.arguments = [];
		this.argumentRelative = false;

		// Main loop
		this.timeout = null;
		this.mapEvents = null;
		this.stepStopAction = null;

		// FPS
		this.lastFPSCheck = null;
		this.fps = 0;
		this.fpsFrameCount = 0;

		// Room
		this.room = null;
		this.instances = [];

		// Cursor
		this.cursorSprite = null;
		this.cursorImageIndex = 0;

		// Transitions
		this.transitionKind = 0;
		this.transitionSteps = 80;

		// Draw functions
		this.drawColorAlpha = "#000000ff";
		this.drawFont = -1;
		this.drawHAlign = 0;
		this.drawVAlign = 0;

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
	}

	// Starts the game.
	async start() {
		try {
			this.startCanvas();
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

	// Ends the game properly, calling events and such.
	async end() {
		// If one instance calls a step stop exception, then even the other event type doesn't run
		try {
			for (const instance of this.instances) {
				if (!instance.exists) continue;
				const OTHER_ROOM_END = 5;
				await this.doEventOfInstance("other", OTHER_ROOM_END, instance);
			}

			for (const instance of this.instances) {
				if (!instance.exists) continue;
				const OTHER_GAME_END = 3;
				await this.doEventOfInstance("other", OTHER_GAME_END, instance);
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
		} else if (e instanceof ProjectErrorException) {
			this.showError(e);
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
		this.canvas.classList.remove("no-cursor");

		// input
		this.input.end();

		// audio
		this.audio.end();

		this.dispatcher.speak("close", e);
	}

	// Called by start, inits the canvas.
	startCanvas() {
		this.ctx = this.canvas.getContext("2d", {alpha: false});
		this.setCanvasProperties();

		if (!this.project.globalGameSettings.displayCursor) {
			this.canvas.classList.add("no-cursor");
		}
	}

	setCanvasProperties() {
		this.ctx.imageSmoothingEnabled = false;
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
		this.mapEvents = this.getMapOfEvents();

		// Begin step
		for (const {event, instance} of this.getEventsOfTypeAndSubtype("step", "begin")) {
			if (!instance.exists) continue;
			await this.doEvent(event, instance);
		}

		// Alarm
		for (const [subtype, list] of this.getEventsOfType("alarm")) {
			for (const {event, instance} of list) {
				if (!instance.exists) continue;

				// Update alarm (decrease by one) here, before running event
				// Alarm stays 0 until next alarm check, where it becomes -1 forever (that's doom as heck)

				if (instance.alarms[subtype] >= 0) {
					instance.alarms[subtype] -= 1;
				}
				if (instance.alarms[subtype] == 0) {
					await this.doEvent(event, instance);
				}
			}
		}

		// Keyboard
		for (const [subtype, list] of this.getEventsOfType("keyboard")) {
			for (const {event, instance} of list) {
				if (!instance.exists) continue;
				if (this.input.getKey(subtype, this.input.key)) {
					await this.doEvent(event, instance);
				}
			}
		}

		for (const [subtype, list] of this.getEventsOfType("keypress")) {
			for (const {event, instance} of list) {
				if (!instance.exists) continue;
				if (this.input.getKey(subtype, this.input.keyPressed)) {
					await this.doEvent(event, instance);
				}
			}
		}

		for (const [subtype, list] of this.getEventsOfType("keyrelease")) {
			for (const {event, instance} of list) {
				if (!instance.exists) continue;
				if (this.input.getKey(subtype, this.input.keyReleased)) {
					await this.doEvent(event, instance);
				}
			}
		}

		// Mouse

		// TODO other mouse events

		for (const [subtype, list] of this.getEventsOfType("mouse")) {
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
						execute = this.collision.instanceOnPoint(instance, {x: this.input.mouseX, y: this.input.mouseY});
					}
				} else
				if (eventInfo.kind == "enter-leave") {
					// TODO check when this check is done
					if (instance.mouseInChanged == null) {
						const mouseIn = this.collision.instanceOnPoint(instance, {x: this.input.mouseX, y: this.input.mouseY});

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
					await this.doEvent(event, instance);
				}
			}
		}

		// Step
		for (const {event, instance} of this.getEventsOfTypeAndSubtype("step", "normal")) {
			if (!instance.exists) continue;
			await this.doEvent(event, instance);
		}

		// Update instance variables and positions

		for (const instance of this.instances) {
			if (!instance.exists) continue;

			instance.xPrevious = instance.x;
			instance.yPrevious = instance.y;

			this.updateInstancePosition(instance);
		}

		// Outside room and intersect boundary
		const OTHER_OUTSIDE = 0;
		for (const {event, instance} of this.getEventsOfTypeAndSubtype("other", OTHER_OUTSIDE)) {
			if (!instance.exists) continue;

			const image = instance.getImage();

			// TODO use sprite bounding box (probably should use this in a lot of places)
			const offsetLeft = image ? -instance.sprite.originx : 0;
			const offsetRight = image ? -instance.sprite.originx + image.width : 0;
			const offsetTop = image ? -instance.sprite.originy : 0;
			const offsetBottom = image ? -instance.sprite.originy + image.height : 0;

			if (instance.x + offsetRight < 0
				|| instance.x + offsetLeft >= this.room.width
				|| instance.y + offsetBottom < 0
				|| instance.y + offsetTop >= this.room.height) {
				await this.doEvent(event, instance);
			}
		}

		const OTHER_BOUNDARY = 1;
		for (const {event, instance} of this.getEventsOfTypeAndSubtype("other", OTHER_BOUNDARY)) {
			if (!instance.exists) continue;

			const image = instance.getImage();

			// TODO use sprite bounding box (probably should use this in a lot of places)
			const offsetLeft = image ? -instance.sprite.originx : 0;
			const offsetRight = image ? -instance.sprite.originx + image.width : 0;
			const offsetTop = image ? -instance.sprite.originy : 0;
			const offsetBottom = image ? -instance.sprite.originy + image.height : 0;

			if (instance.x + offsetLeft < 0
				|| instance.x + offsetRight >= this.room.width
				|| instance.y + offsetTop < 0
				|| instance.y + offsetBottom >= this.room.height) {
				await this.doEvent(event, instance);
			}
		}

		// Collisions
		for (const [subtype, list] of this.getEventsOfType("collision")) {
			for (const {event, instance} of list) {
				// TODO test what happens when colliding with multiple instances at once
				for (const other of this.instances) {
					if (!instance.exists) continue;
					if (!other.exists) continue;
					if (!(other.objectIndex == subtype)) continue;
					if (this.collision.instanceOnInstance(instance, other)) {
						// Collision shenanigans
						if (other.solid) {
							// Move instance back
							instance.x = instance.xPrevious;
							instance.y = instance.yPrevious;
						}

						await this.doEvent(event, instance, other);

						// Yes, the event can change solid variable
						if (other.solid) {
							// Move to new position
							if (!instance.exists) continue;
							this.updateInstancePosition(instance);

							// Check collision again, if still collides, keep previous position.
							if (!other.exists) continue;
							if (this.collision.instanceOnInstance(instance, other)) {
								instance.x = instance.xPrevious;
								instance.y = instance.yPrevious;
							}
						}
					}
				}
			}
		}

		// End step

		for (const {event, instance} of this.getEventsOfTypeAndSubtype("step", "end")) {
			if (!instance.exists) continue;
			await this.doEvent(event, instance);
		}

		// Draw
		await this.drawViews();

		// Update some global variables
		for (const roomBackground of this.room.backgrounds) {
			roomBackground.x += roomBackground.horizontalSpeed;
			roomBackground.y += roomBackground.verticalSpeed;
		}

		// Update some instance variables
		for (const instance of this.instances) {
			if (!instance.exists) continue;

			instance.xPrevious = instance.x;
			instance.yPrevious = instance.y;

			const imageNumber = (instance.sprite ? instance.sprite.images.length : 0);

			let i = instance.imageIndex + instance.imageSpeed;
			if (i >= imageNumber) {
				i -= imageNumber;
			}
			instance.imageIndex = i;

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
				this.setFullscreen(!this.getFullscreen());
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
	updateInstancePosition(instance) {
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

		// TODO paths?
	}

	// Draw all the views of the current room.
	async drawViews() {
		// Currently there are no views. But the following should happen for every view.

		// Draw background color
		if (this.room.backgroundShowColor) {
			this.ctx.fillStyle = this.room.backgroundColor;
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}
		// this.ctx.fillStyle = "black";

		// Draw background backgrounds

		for (const roomBackground of this.room.backgrounds) {
			if (!roomBackground) continue;
			if (roomBackground.isForeground == true) continue;
			this.drawRoomBackground(roomBackground);
		}

		// TODO Draw tiles

		// Draw instances

		const instances_by_depth = this.instances
			.filter(x => x.exists)
			.sort((a, b) => b.depth - a.depth);

		for (const instance of instances_by_depth) {
			if (!instance.exists) continue;

			// Only draw if visible
			if (instance.visible) {
				const drawEvent = this.getEventOfInstance(instance, "draw");

				if (drawEvent) {
					await this.doEvent(drawEvent, instance);
				} else {
					// No draw event, draw sprite if it has one.
					if (instance.sprite) {
						this.drawSpriteExt(instance.sprite, instance.getImageIndex(), instance.x, instance.y, instance.imageXScale, instance.imageYScale, instance.imageAngle, instance.imageBlend, instance.imageAlpha);
					}
				}
			}
		}

		// Draw foreground backgrounds

		for (const roomBackground of this.room.backgrounds) {
			if (!roomBackground) continue;
			if (roomBackground.isForeground == false) continue;
			this.drawRoomBackground(roomBackground);
		}

		// Draw mouse cursor

		if (this.cursorSprite) {
			this.drawSprite(this.cursorSprite, this.cursorImageIndex, this.mouseX, this.mouseY);
			this.cursorImageIndex = ((++this.cursorImageIndex) % this.cursorSprite.images.length);
		}
	}

	drawRoomBackground(roomBackground) {
		if (!roomBackground.visible) return false;

		const background = this.project.getResourceById("ProjectBackground", roomBackground.backgroundIndex);
		if (!background) return false;

		const image = background.image;
		if (!image) return false;

		// TODO blend

		let xStart = roomBackground.x;
		let yStart = roomBackground.y;

		const width = background.image.width * roomBackground.xScale;
		const height = background.image.height * roomBackground.yScale;

		if (roomBackground.tileHorizontally) {
			xStart = (roomBackground.x % width) - width;
		}
		if (roomBackground.tileVertically) {
			yStart = (roomBackground.y % height) - height;
		}

		for (let x = xStart; x < this.room.width; x += width) {
			for (let y = yStart; y < this.room.height; y += height) {
				this.ctx.globalAlpha = roomBackground.alpha;
				this.ctx.drawImage(image.image, x, y, width, height);
				this.ctx.globalAlpha = 1;

				if (!roomBackground.tileVertically) {
					break;
				}
			}
			if (!roomBackground.tileHorizontally) {
				break;
			}
		}

		return true;
	}

	// Execute a event.
	async doEvent(event, instance, other=null) {
		if (event == null) return;

		const previousEvent = this.currentEvent;
		const previousInstance = this.currentEventInstance;
		const previousOther = this.currentEventOther;

		this.currentEvent = event;
		this.currentEventInstance = instance;
		this.currentEventOther = other;

		const parsedActions = this.loadedProject.actionsCache.get(event);

		for (const treeAction of parsedActions) {
			try {
				await this.doTreeAction(treeAction);

				if (this.stepStopAction != null) {
					throw new StepStopException(this.stepStopAction);
				}
			} catch (e) {
				if (e instanceof ExitException) {
					break;
				} if (e instanceof NonFatalErrorException) {
					this.showError(e);
					this.errorOccurred = true;
					this.errorLast = e.text;
				} else {
					throw e;
				}
			}
		}

		this.currentEvent = previousEvent;
		this.currentEventInstance = previousInstance;
		this.currentEventOther = previousOther;
	}

	// Execute a node of the parsed actions tree.
	async doTreeAction(treeAction) {
		if (treeAction == null) return null;

		this.currentEventActionNumber = treeAction.actionNumber;

		let applyToInstances;
		let otherInstance;

		if (treeAction.appliesTo != undefined) {
			applyToInstances = this.getApplyToInstances(treeAction.appliesTo);
			otherInstance = this.currentEventOther || this.currentEventInstance;
			if (treeAction.appliesTo == -2) { // other
				otherInstance = this.currentEventInstance;
			}
		}

		switch (treeAction.type) {
			case "executeFunction":
			case "executeCode":

				{
					let result = true;
					for (const applyToInstance of applyToInstances) {
						if (!applyToInstance.exists) continue;

						const args = [];
						for (const [i, x] of treeAction.args.entries()) {
							args.push(await this.parseActionArg(x, i));
						}

						let currentResult;
						if (treeAction.type == "executeFunction") {
							currentResult = await this.gml.builtInFunction(treeAction.function, applyToInstance, otherInstance, args, treeAction.relative);
						} else {
							currentResult = await this.gml.execute(this.loadedProject.gmlCache.get(treeAction.action), applyToInstance, otherInstance, args, treeAction.relative);
						}

						if (typeof currentResult !== "number" || currentResult < 0.5) {
							result = false;
						}
					}

					return result;
				}

			case "if":
				{
					const result = await this.doTreeAction(treeAction.condition);
					if (result) {
						await this.doTreeAction(treeAction.ifTrue);
					} else {
						await this.doTreeAction(treeAction.ifFalse);
					}
					break;
				}

			case "block":
				for (const blockTreeAction of treeAction.actions) {
					await this.doTreeAction(blockTreeAction);
				}
				break;

			case "exit":
				throw new ExitException();

			case "repeat":
				{
					const times = await this.parseActionArg(treeAction.times, 0);
					for (let i=0; i<times; i++) {
						await this.doTreeAction(treeAction.treeAction);
					}
					break;
				}

			case "variable":
				for (const applyToInstance of applyToInstances) {
					if (!applyToInstance.exists) continue;
					await this.gml.execute(this.loadedProject.gmlCache.get(treeAction.action), applyToInstance, otherInstance);
				}
				break;

			case "code":
				for (const applyToInstance of applyToInstances) {
					if (!applyToInstance.exists) continue;
					await this.gml.execute(this.loadedProject.gmlCache.get(treeAction.action), applyToInstance, otherInstance);
				}
				break;
		}

		return null;
	}

	// Interpret a action argument to it's final value.
	async parseActionArg(arg, argNumber) {
		if (arg.kind == "both") {
			if (arg.value[0] != "'" && arg.value[0] != "\"") {
				return arg.value;
			}
		}
		if (arg.kind == "both" || arg.kind == "expression") {
			// TODO check if this is really what gm is doing
			// TODO maybe compile all these codes beforehand

			const result = this.gml.compile(arg.value, "Expression");
			if (!result.succeeded) {
				throw this.makeFatalError({
						type: "compilation",
						matchResult: result.matchResult,
					},
					"COMPILATION ERROR in argument "+ argNumber.toString() +"\n" + result.matchResult.message + "\n",
				);
			}

			return await this.gml.execute(result.ast, this.currentEventInstance, this.currentEventOther || this.currentEventInstance);
		}
		return arg.value;
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
					const OTHER_ROOM_END = 5;
					await this.doEventOfInstance("other", OTHER_ROOM_END, instance);
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

			// tiles

			views: room.views.map(view => ({
				visible: view.visibleAtStart,
				viewX: view.viewX,
				viewY: view.viewY,
				viewW: view.viewW,
				viewH: view.viewH,
				portX: view.portX,
				portY: view.portY,
				portW: view.portW,
				portH: view.portH,
				objectFollowIndex: view.objectFollowIndex,
				objectFollowHorizontalBorder: view.objectFollowHorizontalBorder,
				objectFollowVerticalBorder: view.objectFollowVerticalBorder,
				objectFollowHorizontalSpeed: view.objectFollowHorizontalSpeed,
				objectFollowVerticalSpeed: view.objectFollowVerticalSpeed,

				angle: 0,
			})),
		};

		this.canvas.width = room.width;
		this.canvas.height = room.height;

		this.setCanvasProperties();

		this.input.clear();

		// TODO Check if room is persistent

		const createdInstances = [];
		for (const roomInstance of room.instances) {
			createdInstances.push(this.instanceCreateNoEvents(roomInstance.id, roomInstance.x, roomInstance.y, roomInstance.object_index, false));
		}

		for (const instance of createdInstances) {
			// TODO run instance creation code
			await this.doEventOfInstance("create", null, instance);
		}

		if (isGameStart) {
			for (const instance of this.instances) {
				if (!instance.exists) continue;
				const OTHER_GAME_START = 2;
				await this.doEventOfInstance("other", OTHER_GAME_START, instance);
			}
		}

		// TODO run room creation code

		for (const instance of this.instances) {
			if (!instance.exists) continue;
			const OTHER_ROOM_START = 4;
			await this.doEventOfInstance("other", OTHER_ROOM_START, instance);
		}

		await this.drawViews();
	}

	// Create an instance in the room.
	async instanceCreate(id, x, y, object) {
		const instance = this.instanceCreateNoEvents(id, x, y, object);

		await this.doEventOfInstance("create", null, instance);

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

	// Draw a sprite with the image index at x and y.
	drawSprite(sprite, imageIndex, x, y) {
		const image = sprite?.images[Math.floor(Math.floor(imageIndex) % sprite.images.length)]?.image;
		if (!image) return;

		this.ctx.drawImage(image, x - sprite.originx, y - sprite.originy);
	}

	// Draw a sprite with extra options.
	drawSpriteExt(sprite, imageIndex, x, y, xScale, yScale, angle, blend, alpha) {
		// TODO blend

		const image = sprite?.images[Math.floor(Math.floor(imageIndex) % sprite.images.length)]?.image;
		if (!image) return;

		this.ctx.save();

		this.ctx.translate(x, y);
		this.ctx.rotate(angle * Math.PI/180);
		this.ctx.scale(xScale, yScale);

		this.ctx.globalAlpha = alpha;
		this.ctx.drawImage(image, -sprite.originx, -sprite.originy);
		this.ctx.globalAlpha = 1;

		this.ctx.restore();
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

	// Set the fullscreen status.
	async setFullscreen(fullscreen) {
		if (fullscreen) {
			try {
				await this.canvas.requestFullscreen();
			} catch (e) {
				console.log("window_set_fullscreen failed");
			}
		} else {
			if (document.fullscreenElement) {
				await document.exitFullscreen();
			}
		}
	}

	// Get the fullscreen status.
	getFullscreen() {
		return (document.fullscreenElement != null);
	}

	// Sets the lives variable, calling the relevant events.
	async setLives(value) {
		const previous = this.lives;
		this.lives = value;

		if (value <= 0 && previous > 0) {
			const OTHER_NO_MORE_LIVES = 6;
			for (const instance of this.instances) {
				if (!instance.exists) continue;
				await this.doEventOfInstance("other", OTHER_NO_MORE_LIVES, instance);
			}
		}
	}

	// Sets the health variable, calling the relevant events.
	async setHealth(value) {
		const previous = this.health;
		this.health = value;

		if (value <= 0 && previous > 0) {
			const OTHER_NO_MORE_HEALTH = 9;
			for (const instance of this.instances) {
				if (!instance.exists) continue;
				await this.doEventOfInstance("other", OTHER_NO_MORE_HEALTH, instance);
			}
		}
	}

	// Compile and execute a GML string.
	async executeString(gml, instance, other, args) {
		const result = this.gml.compile(gml);
		if (!result.succeeded) {
			throw new NonFatalErrorException({
					type: "compilation",
					location: "executeString",
					matchResult: result.matchResult,
					text: "COMPILATION ERROR in string to be executed\n" + result.matchResult.message + "\n",
				},
			);
		}

		return await this.gml.execute(result.ast, instance, other, args);
	}

	// // Helper functions

	// Do the event of a type and subtype (optional) of an instance.
	doEventOfInstance(type, subtype, instance) {
		return this.doEvent(this.getEventOfInstance(instance, type, subtype), instance);
	}

	// Get event of type and subtype (optional) of an instance.
	getEventOfInstance(instance, type, subtype) {
		return instance.object.events.find(x => (x.type == type) && (subtype ? (x.subtype == subtype) : true));
	}

	// Returns a map containg all event-instance pairs that exist currently. It is structured like so:
	// Map(<event type>, Map(<event subtype>, {event, instance}))
	getMapOfEvents() {
		const map = new Map();

		for (const instance of this.instances) {
			if (!instance.exists) continue;

			instance.object.events.forEach(event => {
				let subtypes = map.get(event.type);
				if (subtypes == undefined) {
					subtypes = new Map();
					map.set(event.type, subtypes);
				}

				let eventInstancePairs = subtypes.get(event.subtype);
				if (eventInstancePairs == undefined) {
					eventInstancePairs = [];
					subtypes.set(event.subtype, eventInstancePairs);
				}

				eventInstancePairs.push({event: event, instance: instance});
			});
		}

		return map;
	}

	// From the map of events, get a list of event-instance pairs of that type and subtype.
	getEventsOfTypeAndSubtype(type, subtype) {
		const subtypes = this.mapEvents.get(type);
		if (!subtypes) return [];
		const list = subtypes.get(subtype);
		if (!list) return [];
		return list;
	}

	// From the map of events, get a list of event-instance pairs of that type, regardless of subtype.
	getEventsOfType(type) {
		const subtypes = this.mapEvents.get(type);
		if (!subtypes) return [];
		return [...subtypes.entries()];
	}

	// Interpret apply to option, returns a list of instances that should be applied to.
	getApplyToInstances(appliesTo) {
		// -1 = self, -2 = other, 0>= = object index
		switch (appliesTo) {
			case -1:
				return [this.currentEventInstance];
			case -2:
				return [this.currentEventOther || this.currentEventInstance];
			default:
				return this.instances.filter(x => x.exists && x.objectIndex == appliesTo);
		}
	}

	// // Game error checking and throwing

	// TODO put all info in the exception itself, then show error on catch
	// TODO make the message more like the one from GM

	// Make a fatal error exception.
	makeFatalError(...args) {
		return new FatalErrorException(this.makeErrorOptions(true, ...args));
	}

	// Make a non fatal error exception.
	makeNonFatalError(...args) {
		return new NonFatalErrorException(this.makeErrorOptions(false, ...args));
	}

	// Make a fatal or non fatal error exception.
	makeError(isFatal, ...args) {
		if (isFatal) {
			return this.makeFatalError(...args);
		} else {
			return this.makeNonFatalError(...args);
		}
	}

	// Make the object to be sent to a ProjectErrorException to be the exception's properties.
	// options can be an object to add additional properties to the exception.
	// extraText will be added after the main information.
	// object, event and actionNumber can be null to use the current values.
	makeErrorOptions(isFatal, options, extraText, object=null, event=null, actionNumber=null) {
		const _object = object==null ? this.currentEventInstance.object : object;
		const _event = event==null ? this.currentEvent : event;
		const _actionNumber = actionNumber==null ? this.currentEventActionNumber : actionNumber;

		const base = {text:
			"\n___________________________________________\n"
			+ (isFatal ? "FATAL " : "") + "ERROR in\n"
			+ "action number " + _actionNumber.toString() + "\n"
			+ "of " + Events.getEventName(_event, this.project) + " Event\n"
			+ "for object " + _object.name + ":\n\n"
			+ extraText,

			location: "object",
			locationActionNumber: _actionNumber,
			locationEvent: _event,
			locationObject: _object,
		};

		return Object.assign(base, options);
	}

	// Display a error messsage using the text property.
	showError(exception) {
		console.log(exception.text);
		alert(exception.text);
	}
}