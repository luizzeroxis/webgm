import Dispatcher from '../common/Dispatcher.js'
import Events from '../common/Events.js';
import {EngineException, ProjectErrorException, FatalErrorException, NonFatalErrorException, ExitException, StepStopException} from '../common/Exceptions.js';
import {Project} from '../common/Project.js';
import VariableHolder from '../common/VariableHolder.js';

import ActionsParser from './ActionsParser.js';
import BuiltInConstants from './BuiltInConstants.js';
import BuiltInGlobals from './BuiltInGlobals.js';
import GML from './GML.js';
import Instance from './Instance.js';

export class Game {

	constructor (project, canvas, input) {
		this.project = project;
		this.canvas = canvas;
		this.input = input;

		this.dispatcher = new Dispatcher();

		this.ctx = null;

		this.keyDownHandler = null;
		this.keyUpHandler = null;

		this.key = {};
		this.keyPressed = {};
		this.keyReleased = {};

		this.mouse = {};
		this.mousePressed = {};
		this.mouseReleased = {};
		this.mouseX = 0;
		this.mouseY = 0;
		this.mouseWheel = 0;

		this.globalVars = null;
		this.constants = null;

		this.instances = [];
		this.lastId = null;

		this.fps = 0;
		this.fpsFrameCount = 0;

		this.drawColor = 0;
		this.drawAlpha = 1;
		this.drawFont = -1;
		this.drawHAlign = 0;
		this.drawVAlign = 0;

		this.gml = null;
		this.preparedCodes = new Map();

		this.room = null;

		this.currentEvent = null;
		this.currentEventInstance = null;
		this.currentEventOther = null;
		this.currentEventActionNumber = null;

		this.timeout = null;
		this.fpsTimeout = null;

		this.mapEvents = null;

		this.stepStopAction = null;

	}

	// Starts the game.
	async start() {

		try {
			this.startCanvas();
			this.startInput();
			this.startEngine();

			await this.loadProject();
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
			for (let instance of this.instances) {
				if (!instance.exists) continue;
				var OTHER_ROOM_END = 5;
				await this.doEvent(this.getEventOfInstance(instance, 'other', OTHER_ROOM_END), instance);
			}

			for (let instance of this.instances) {
				if (!instance.exists) continue;
				var OTHER_GAME_END = 3;
				await this.doEvent(this.getEventOfInstance(instance, 'other', OTHER_GAME_END), instance);
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
		this.input.removeEventListener('keydown', this.keyDownHandler)
		this.input.removeEventListener('keyup', this.keyUpHandler)
		this.input.removeEventListener('mousedown', this.mouseDownHandler)
		this.input.removeEventListener('mouseup', this.mouseUpHandler)
		this.input.removeEventListener('mousemove', this.mouseMoveHandler)
		this.input.removeEventListener('wheel', this.wheelHandler)

		this.dispatcher.speak('close', e);
	}

	// Called by start, inits the canvas.
	startCanvas() {
		this.ctx = this.canvas.getContext('2d');
		this.ctx.imageSmoothingEnabled = false;

		if (!this.project.globalGameSettings.displayCursor) {
			this.canvas.classList.add("no-cursor");
		}
	}

	// Called by start, inits the input system.
	startInput() {
		// Keyboard
		this.keyDownHandler = (e) => {
			this.key[e.which] = true;
			this.keyPressed[e.which] = true;
			e.preventDefault();
		}
		this.input.addEventListener('keydown', this.keyDownHandler);

		this.keyUpHandler = (e) => {
			this.key[e.which] = false;
			this.keyReleased[e.which] = true;
			e.preventDefault();
		}
		this.input.addEventListener('keyup', this.keyUpHandler);

		// Mouse

		var toEngineButton = button => {
			return button == 1 ? 3 // middle button
				: button == 2 ? 2 // right button
				: button + 1; // every other button
		}

		this.mouseDownHandler = (e) => {
			this.mouse[toEngineButton(e.button)] = true;
			this.mousePressed[toEngineButton(e.button)] = true;
			e.preventDefault();
		}
		this.input.addEventListener('mousedown', this.mouseDownHandler);

		this.mouseUpHandler = (e) => {
			this.mouse[toEngineButton(e.button)] = false;
			this.mouseReleased[toEngineButton(e.button)] = true;
			e.preventDefault();
		}
		this.input.addEventListener('mouseup', this.mouseUpHandler);

		this.mouseMoveHandler = (e) => {
			this.mouseX = e.offsetX;
			this.mouseY = e.offsetY;

			this.globalVars.setForce('mouse_x', this.mouseX);
			this.globalVars.setForce('mouse_y', this.mouseY);
		}
		this.input.addEventListener('mousemove', this.mouseMoveHandler);

		this.wheelHandler = (e) => {
			this.mouseWheel += e.deltaY;
			e.preventDefault();
		}
		this.input.addEventListener('wheel', this.wheelHandler);
	}

	// Called by start, inits general engine stuff.
	startEngine() {
		this.globalVars = new VariableHolder(this, BuiltInGlobals)
		this.constants = BuiltInConstants.getList();

		// TODO Add user defined constants

		// Add resource names as constants
		Project.getTypes().forEach(type => {
			this.project.resources[type.getClassName()].forEach(x => {this.constants[x.name] = x.id});
		});

		this.lastId = this.project.lastId;

	}

	// // Project loading

	// Makes sure all resources are loaded, and parses GML code.
	loadProject() {
		var promises = [
			this.loadSprites(),
			this.loadBackgrounds(), // TODO
			this.loadSounds(), // TODO
		];

		this.loadGML();

		return Promise.all(promises);
	}

	// Return a list of promises of loading sprite images.
	loadSprites() {
		var promises = [];
		this.project.resources.ProjectSprite.forEach(sprite => {
			sprite.images.forEach((image, imageNumber) => {
				image.load();
				promises.push(image.promise
					.catch(e => {
						throw new EngineException("Could not load image " + imageNumber.toString() + " in sprite " + sprite.name);
					}));
			})
		})
		return Promise.all(promises);
	}

	// Returns a list of promises of loading background images.
	loadBackgrounds() {} // TODO

	// Returns a list of promises of loading sounds.
	loadSounds() {} // TODO

	// Prepares all GML code, parsing it and checking for errors.
	loadGML() {
		this.gml = new GML(this);

		this.loadGMLScripts();
		this.loadGMLTimelines(); // TODO
		this.loadGMLObjects();
		this.loadGMLRooms();
	}

	// Prepares all GML inside of scripts.
	loadGMLScripts() {
		this.project.resources.ProjectScript.every(script => {
			return this.prepareGML(script.code, script, matchResult => {

				throw new FatalErrorException({
					type: 'compilation',
					location: 'script',
					locationScript: script,
					matchResult: matchResult,
					text:
						`\n___________________________________________\n`
						+ `COMPILATION ERROR in Script: ` + script.name + `\n\n`
						+ matchResult.message + `\n`,
				});

			});
		})
	}

	// Prepares all GML inside time lines.
	loadGMLTimelines() {} // TODO

	// Prepares all GML inside objects.
	loadGMLObjects() {
		this.project.resources.ProjectObject.every(object => {
			return object.events.every(event => {
				return event.actions.every((action, actionNumber) => {

					if (action.typeKind == 'code') {
						
						return this.prepareGML(action.args[0].value, action, matchResult => {

							throw this.makeFatalError({
									type: 'compilation',
									locationIsActionTypeLibrary: false,
									matchResult: matchResult,
								},
								`COMPILATION ERROR in code action:\n` + matchResult.message + `\n`,
								object, event, actionNumber
							);

						});

					} else if (action.typeKind == 'normal' && action.typeExecution == 'code') {

						return this.prepareGML(action.args[0].value, action, matchResult => {

							throw this.makeFatalError({
									type: 'compilation',
									locationIsActionTypeLibrary: true,
									matchResult: matchResult,
								},
								`COMPILATION ERROR in code action (this was inside the action type in a library):\n` + matchResult.message + `\n`,
								object, event, actionNumber
							);

						});

					}
					return true;
				})
			})
		})
	}

	// Prepares all GML inside rooms.
	loadGMLRooms() {
		this.project.resources.ProjectRoom.every(room => {

			if (!room.instances.every(instance => {
				return this.prepareGML(instance.creationCode, instance, matchResult => {

					throw new FatalErrorException({
						type: 'compilation',
						location: 'instanceCreationCode',
						locationInstance: instance,
						locationRoom: room,
						matchResult: matchResult,
						text:
							`\n___________________________________________\n`
							+ `COMPILATION ERROR in creation code for instance ` + instance.id + ` in room ` + room.name + `\n\n`
							+ matchResult.message + `\n`,
					});

				});
			})) return false;

			return this.prepareGML(room.creationCode, room, matchResult => {

				throw new FatalErrorException({
					type: 'compilation',
					location: 'roomCreationCode',
					locationRoom: room,
					matchResult: matchResult,
					text:
						`\n___________________________________________\n`
						+ `COMPILATION ERROR in creation code of room ` + room.name + `\n\n`
						+ matchResult.message + `\n`,
				});

			});
		})
	}

	// Prepares a GML code string. mapKey is the key used to access it later in the preparedCodes map.
	prepareGML(gml, mapKey, failureFunction) {
		var preparedCode = this.gml.prepare(gml);

		if (preparedCode.succeeded()) {
			this.preparedCodes.set(mapKey, preparedCode);
			return true;
		} else {
			failureFunction(preparedCode);
			return false;
		}
	}

	// // Game running

	// Loads the first room of the game.
	async loadFirstRoom() {
		await this.loadRoom(this.project.resources.ProjectRoom[0]);
	}

	// Run a step and set timeout for next step. With error catching.
	async mainLoopForTimeout() {

		try {
			var timeoutStepStart = performance.now();
			await this.mainLoop();
			var timeoutStepEnd = performance.now();

			this.setMainLoopTimeout((timeoutStepEnd - timeoutStepStart) / 1000);
		} catch (e) {
			await this.catch(e);
		}

	}

	setMainLoopTimeout(timeoutStepTime) {
		// Run main loop again, after a frame of time has passed.
		// This means the game will slow down if a loop takes too much time.

		// var timeoutStepEnd = performance.now() / 1000;
		// var timeoutStepTime = timeoutStepEnd - timeoutStepStart;
		var timeoutStepMinTime = 1 / this.globalVars.get('room_speed');
		var timeoutWaitTime = Math.max(0, timeoutStepMinTime - timeoutStepTime);

		this.timeout = setTimeout(() => this.mainLoopForTimeout(), timeoutWaitTime * 1000);

		// var timeoutTotalStepTime = timeoutStepTime + timeoutWaitTime;
		// console.log("------");
		// console.log("StepTime", timeoutStepTime);
		// console.log("StepMinTime", timeoutStepMinTime);
		// console.log("WaitTime", timeoutWaitTime);
		// console.log("TotalStepTime", timeoutTotalStepTime);
		// console.log(1/timeoutTotalStepTime, "fps");
	}

	// Start running game steps.
	startMainLoop() {
		if (this.timeout == null) {
			this.mainLoopForTimeout();
		}

		if (this.fpsTimeout == null) {
			this.fpsTimeout = setInterval(() => this.updateFps(), 1000);
		}
	}

	// Stop running game steps.
	endMainLoop() {
		clearTimeout(this.timeout);
		this.timeout = null;

		clearInterval(this.fpsTimeout);
		this.fpsTimeout = null;
	}

	// Continue running game steps, in case you stopped it by using StepStopException.
	continueMainLoop() {
		this.mainLoopForTimeout();
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

		++this.fpsFrameCount;

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

		// Do some stuff
		this.globalVars.setForce('fps', this.fps);

		// Begin step
		for (let {event, instance} of this.getEventsOfTypeAndSubtype('step', 'begin')) {
			if (!instance.exists) continue;
			await this.doEvent(event, instance);
		}

		// Alarm
		for (let [subtype, list] of this.getEventsOfType('alarm')) {
			for (let {event, instance} of list) {
				if (!instance.exists) continue;

				// Update alarm (decrease by one) here, before running event
				// Alarm stays 0 until next alarm check, where it becomes -1 forever

				if (instance.vars.get('alarm', [subtype]) >= 0) {
					instance.vars.setAdd('alarm', -1, [subtype]);
				}

				if (instance.vars.get('alarm', [subtype]) == 0) {
					await this.doEvent(event, instance);
				}

			}
		}

		// Keyboard
		for (let [subtype, list] of this.getEventsOfType('keyboard')) {
			for (let {event, instance} of list) {
				if (!instance.exists) continue;
				if (this.getKey(subtype, this.key)) {
					await this.doEvent(event, instance);
				}
			}
		}

		for (let [subtype, list] of this.getEventsOfType('keypress')) {
			for (let {event, instance} of list) {
				if (!instance.exists) continue;
				if (this.getKey(subtype, this.keyPressed)) {
					await this.doEvent(event, instance);
				}
			}
		}

		for (let [subtype, list] of this.getEventsOfType('keyrelease')) {
			for (let {event, instance} of list) {
				if (!instance.exists) continue;
				if (this.getKey(subtype, this.keyReleased)) {
					await this.doEvent(event, instance);
				}
			}
		}

		// Mouse

		// TODO other mouse events

		for (let [subtype, list] of this.getEventsOfType('mouse')) {
			for (let {event, instance} of list) {
				if (!instance.exists) continue;
				var execute = false;
				var eventInfo = Events.listMouseSubtypes.find(x => x.id == subtype);
				if (eventInfo == null) return;

				if (eventInfo.kind == 'button') {
					var dict = {
						'mouse': this.mouse,
						'mousePressed': this.mousePressed,
						'mouseReleased': this.mouseReleased,
					}[eventInfo.when]; // wacky

					execute = this.getMouse(eventInfo.button, dict);

					if (execute && !eventInfo.global) {
						// check if mouse is hovering over instance
						if (false) { // TODO
							execute = true;
						}
					}

				}
				if (eventInfo.kind == 'enter-release') {
					// TODO not implemented
				}
				if (eventInfo.kind == 'wheel-up') {
					execute = (this.mouseWheel < 0);
				}
				if (eventInfo.kind == 'wheel-down') {
					execute = (this.mouseWheel > 0);
				}

				if (execute) {
					await this.doEvent(event, instance);
				}

			}
		}

		// Step
		for (let {event, instance} of this.getEventsOfTypeAndSubtype('step', 'normal')) {
			if (!instance.exists) continue;
			await this.doEvent(event, instance);
		}

		// Update instance variables and positions

		for (let instance of this.instances) {
			if (!instance.exists) continue;

			instance.vars.setAdd('x', instance.vars.get('hspeed'));
			instance.vars.setAdd('y', instance.vars.get('vspeed'));

			if (instance.vars.get('friction') != 0) {
				var direction = instance.vars.get('direction') * (Math.PI / 180);

				var hspeedOld = instance.vars.get('hspeed');
				if (hspeedOld != 0) {
					var hspeedNew = hspeedOld - Math.cos(direction) * instance.vars.get('friction');
					if (Math.sign(hspeedNew) != Math.sign(hspeedOld)) { // If changed sign, that is, going in the opposite direction, don't do that
						hspeedNew = 0;
					}
					instance.vars.set('hspeed', hspeedNew);
				}

				var vspeedOld = instance.vars.get('vspeed');
				if (vspeedOld != 0) {
					var vspeedNew = vspeedOld - -Math.sin(direction) * instance.vars.get('friction');
					if (Math.sign(vspeedNew) != Math.sign(vspeedOld)) {
						vspeedNew = 0;
					}
					instance.vars.set('vspeed', vspeedNew);
				}

			}

			// gravity
			if (instance.vars.get('gravity') != 0) {
				instance.vars.setAdd('hspeed', Math.cos(instance.vars.get('gravity_direction') * (Math.PI / 180)) * instance.vars.get('gravity'));
				instance.vars.setAdd('vspeed', -Math.sin(instance.vars.get('gravity_direction') * (Math.PI / 180)) * instance.vars.get('gravity'));
			}

			// TODO paths??

		}

		// Collisions
		for (let [subtype, list] of this.getEventsOfType('collision')) {
			for (let {event, instance} of list) {
				if (!instance.exists) continue;
				var others = this.instances.filter(x => x.object_index == subtype);
				for (let other of others) {
					if (this.collisionInstanceOnInstance(instance, other)) {
						// TODO collision shenanigans
						await this.doEvent(event, instance, other);
					}
				}
			}
		}

		// End step

		for (let {event, instance} of this.getEventsOfTypeAndSubtype('step', 'end')) {
			if (!instance.exists) continue;
			await this.doEvent(event, instance);
		}

		// Draw
		await this.drawViews();

		// Update some instance variables
		for (let instance of this.instances) {
			instance.vars.set('xprevious', instance.vars.get('x'));
			instance.vars.set('yprevious', instance.vars.get('y'));

			var i = instance.vars.get('image_index') + instance.vars.get('image_speed');
			if (i >= instance.vars.get('image_number')) {
				i -= instance.vars.get('image_number');
			}
			instance.vars.set('image_index', i);
		}

		// Reset keyboard/mouse states
		this.clearIO();

		// Delete instances
		this.instances = this.instances.filter(instance => instance.exists);

	}
	
	// Draw all the views of the current room.
	async drawViews() {
		// Currently there are no views. But the following should happen for every view.

		// Draw background color
		this.ctx.fillStyle = this.room.backgroundColor;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		// this.ctx.fillStyle = "black";

		// TODO Draw background images
		// TODO Draw tiles

		// Draw instances

		var instances_by_depth = this.instances
			.filter(x => x.exists)
			.sort((a, b) => a.vars.get('depth') - b.vars.get('depth'));

		for (let instance of instances_by_depth) {
			if (!instance.exists) continue;

			// Only draw if visible
			if (instance.vars.get('visible')) {
				var drawEvent = this.getEventOfInstance(instance, 'draw');

				if (drawEvent) {
					await this.doEvent(drawEvent, instance); 
				} else {
					// No draw event, draw sprite if it has one.
					var index = instance.vars.get('sprite_index');
					if (index >= 0) {
						var sprite = this.getResourceById('ProjectSprite', index);
						if (sprite) {
							var image = sprite.images[instance.getImageIndex()];
							if (image) {
								this.ctx.save();
								this.ctx.translate(-sprite.originx, -sprite.originy);
								this.ctx.drawImage(image.image, instance.vars.get('x'), instance.vars.get('y'));
								this.ctx.restore();
							} else {
								// no image index
							}
						} else {
							// no sprite indexs
						}
					}
				}
			}

		}
	}

	// Execute a event.
	async doEvent(event, instance, other=null) {
		if (event == null) return;

		var previousEvent = this.currentEvent;
		var previousInstance = this.currentEventInstance;
		var previousOther = this.currentEventOther;

		this.currentEvent = event;
		this.currentEventInstance = instance;
		this.currentEventOther = other || instance;

		var parsedActions = new ActionsParser(event.actions).parse();

		for (let treeAction of parsedActions) {
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
		this.currentEventActionNumber = treeAction.actionNumber;

		if (treeAction.appliesTo != undefined) {
			var applyToInstances = this.getApplyToInstances(treeAction.appliesTo);
			var otherInstance = this.currentEventOther;
			if (treeAction.appliesTo == -2) { // other
				otherInstance = this.currentEventInstance;
			}
		}

		switch (treeAction.type) {
			case 'executeFunction':
			case 'executeCode':

				{
					let result = true;
					for (let applyToInstance of applyToInstances) {
						if (!applyToInstance.exists) continue;

						var args = [];
						for (let [i, x] of treeAction.args.entries()) {
							args.push(await this.parseActionArg(x, i));
						}

						var currentResult;
						if (treeAction.type == 'executeFunction') {
							currentResult = await this.gml.builtInFunction(treeAction.function, applyToInstance, otherInstance, args, treeAction.relative);
						} else {
							currentResult = await this.gml.execute(this.preparedCodes.get(treeAction.action), applyToInstance, otherInstance, args, treeAction.relative);
						}

						if (typeof currentResult !== "number" || currentResult < 0.5) {
							result = false;
						}

					}

					return result;
				}

			case 'if':
				{
					let result = await this.doTreeAction(treeAction.condition);
					if (result) {
						await this.doTreeAction(treeAction.ifTrue);
					} else {
						await this.doTreeAction(treeAction.ifFalse);
					}
					break;
				}

			case 'block':
				for (let blockTreeAction of treeAction) {
					await this.doTreeAction(blockTreeAction);
				}
				break;

			case 'exit':
				throw new ExitException();

			case 'repeat':
				var times = await this.parseActionArg(treeAction.times, 0);
				for (let i=0; i<times; i++) {
					await this.doTreeAction(treeAction.treeAction);
				}
				break;

			case 'variable': // TODO
				for (let applyToInstance of applyToInstances) {
					if (!applyToInstance.exists) continue;

					var name = treeAction.name.value;
					var value = treeAction.value.value; 
					var assignSymbol = treeAction.relative ? " += " : " = ";

					var matchResult = this.gml.prepare(name + assignSymbol + value);
					if (!matchResult.succeeded()) {
						throw this.makeFatalError({
								type: 'compilation',
								matchResult: matchResult,
							},
							`COMPILATION ERROR in code action\n` + matchResult.message + `\n`,
						);
					}

					await this.gml.execute(matchResult, applyToInstance, otherInstance);
				}
				break;

			case 'code':
				for (let applyToInstance of applyToInstances) {
					if (!applyToInstance.exists) continue;
					await this.gml.execute(this.preparedCodes.get(treeAction.action), applyToInstance, otherInstance);
				}
				break;
		}
	}

	// Interpret a action argument to it's final value.
	async parseActionArg(arg, argNumber) {
		if (arg.kind == 'both') {
			if (arg.value[0] != `'` && arg.value[0] != `"`) {
				return arg.value;
			}
		}
		if (arg.kind == 'both' || arg.kind == 'expression') {
			// TODO check if this is really what gm is doing
			// TODO maybe prepare all these codes beforehand

			var matchResult = this.gml.prepare(arg.value, "Expression");
			if (!matchResult.succeeded()) {
				throw this.makeFatalError({
						type: 'compilation',
						matchResult: matchResult,
					},
					`COMPILATION ERROR in argument `+ argNumber.toString() +`\n` + matchResult.message + `\n`,
				);
			}
			
			return await this.gml.execute(matchResult, this.currentEventInstance, this.currentEventOther);
		}
		return arg.value;
	}

	// Update the fps counter.
	updateFps() {
		this.fps = this.fpsFrameCount;
		this.fpsFrameCount = 0;
	}

	// // Actions execution

	// Loads a room. Only use this inside the stepStopAction function, or at the beginning of the game.
	async loadRoom(room) {

		var isFirstRoom = (this.room == null);

		if (!isFirstRoom) {
			// If one instance calls a step stop exception, then the entire chain stops
			try {
				for (let instance of this.instances) {
					if (!instance.exists) continue;
					var OTHER_ROOM_END = 5;
					await this.doEvent(this.getEventOfInstance(instance, 'other', OTHER_ROOM_END), instance);
				}
			} catch (e) {
				if (e instanceof StepStopException) {
					this.stepStopAction = null;
				} else {
					throw e;
				}
			}

			this.instances = this.instances.filter(instance => instance.vars.get('persistent'))
		}

		this.room = room;

		this.canvas.width = room.width;
		this.canvas.height = room.height;

		this.globalVars.setNoCall('room', room.id);
		this.globalVars.setForce('room_width', room.width);
		this.globalVars.setForce('room_height', room.height);
		this.globalVars.setForce('room_speed', room.speed);

		// TODO set background and views variables

		this.clearIO();

		// TODO Check if room is persistent
		for (let roomInstance of room.instances) {
			await this.instanceCreate(roomInstance.id, roomInstance.x, roomInstance.y, roomInstance.object_index);
		}

		if (isFirstRoom) {
			for (let instance of this.instances) {
				if (!instance.exists) continue;
				var OTHER_GAME_START = 2;
				await this.doEvent(this.getEventOfInstance(instance, 'other', OTHER_GAME_START), instance);
			}
		}

		// TODO run room creation code

		for (let instance of this.instances) {
			if (!instance.exists) continue;
			var OTHER_ROOM_START = 4;
			await this.doEvent(this.getEventOfInstance(instance, 'other', OTHER_ROOM_START), instance);
		}

		await this.drawViews();

	}

	// Create an instance in the room.
	async instanceCreate(id, x, y, object) {
		if (id == null) {
			this.lastId += 1;
			id = this.lastId;
		}

		var instance = new Instance(id, x, y, object, this);
		this.instances.push(instance);

		// TODO run instance creation code

		await this.doEvent(this.getEventOfInstance(instance, 'create'), instance);

		return instance.vars.get('id');
	}

	// Check if for every type there is an item. If so, return the list of items in the order of the list of types. If not, return null.
	checkCorresponds(items, types, isItemOfType) {
		if (!isItemOfType) isItemOfType = (item, type) => item == type;

		var sortedItems = [];

		for (let type of types) {
			var index = items.findIndex(x => isItemOfType(x, type));
			if (index == -1) return null;
			sortedItems.push(items[index]);
			items.splice(index, 1);
		}

		return sortedItems;
	}

	// Check if two instances are colliding.
	collisionInstanceOnInstance(instanceA, instanceB, x, y) {

		// TODO masks
		// TODO solid

		var colA = {
			instance: instanceA,
			sprite: this.getResourceById('ProjectSprite', instanceA.vars.get('sprite_index'))
		};
		var colB = {
			instance: instanceB,
			sprite: this.getResourceById('ProjectSprite', instanceB.vars.get('sprite_index'))
		};

		if (colA.sprite == null || colA.sprite.images.length == 0) return false;
		if (colB.sprite == null || colB.sprite.images.length == 0) return false;

		// TODO collision masks, will assume rectangle now
		// spriteA.boundingBox == 'fullimage';
		// spriteA.shape = 'rectangle';

		var collisions = [
			{shapes: ['precise', 'precise'], func: this.collisionRectangleOnRectangle},
			{shapes: ['rectangle', 'rectangle'], func: this.collisionRectangleOnRectangle},
			{shapes: ['precise', 'rectangle'], func: this.collisionRectangleOnRectangle},
		];

		for (let collision of collisions) {
			let cols = this.checkCorresponds([colA, colB], collision.shapes,
				(item, type) => item.sprite.shape == type);
			if (cols) {
				return collision.func(...cols, x, y);
			}
		}

		return false;

	}

	collisionRectangleOnRectangle(a, b, aX, aY, bX, bY) {
		aX = (aX == null) ? a.instance.vars.get('x') : aX;
		aY = (aY == null) ? a.instance.vars.get('y') : aY;
		let aX1 = aX - a.sprite.originx;
		let aY1 = aY - a.sprite.originy
		let aImage = a.sprite.images[a.instance.getImageIndex()]

		bX = (bX == null) ? b.instance.vars.get('x') : bX;
		bY = (bY == null) ? b.instance.vars.get('y') : bY;
		let bX1 = bX - b.sprite.originx
		let bY1 = bY - b.sprite.originy
		let bImage = b.sprite.images[b.instance.getImageIndex()]

		return (
			aX1 <= bX1 + bImage.image.width &&
			bX1 <= aX1 + aImage.image.width &&
			aY1 <= bY1 + bImage.image.height &&
			bY1 <= aY1 + aImage.image.height
		);
	}

	collisionInstanceOnInstances(instance, otherInstances, x, y, solidOnly=false) {
		// place_free / place_empty / place_meeting
		for (let otherInstance of otherInstances) {
			if (!otherInstance.exists) continue;
			if (solidOnly && (otherInstance.vars.get('solid') == 0)) continue;
			var c = this.collisionInstanceOnInstance(instance, otherInstance, x, y);
			if (c) return true;
		}
		return false;
	}

	// Get state of a key. dict should be key, keyPressed or keyReleased.
	getKey(key, dict) {
		if (key == 0) { // vk_nokey
			return Object.entries(dict).every(([key, value]) => !value);
		}
		if (key == 1) { // vk_anykey
			return Object.entries(dict).some(([key, value]) => value);
		}
		return dict[key];
	}

	// Get state of a mouse button. dict should be mouse, mousePressed or mouseReleased.
	getMouse(numb, dict) {
		if (numb == -1) { // mb_any
			return Object.entries(dict).some(([key, value]) => value);
		}
		if (numb == 0) { // mb_none
			return Object.entries(dict).every(([key, value]) => !value);
		}
		return dict[numb];
	}

	// Clears the state of per step input variables.
	clearIO() {
		this.keyPressed = {};
		this.keyReleased = {};
		this.mousePressed = {};
		this.mouseReleased = {};
		this.mouseWheel = 0;
	}

	// Prepare and execute GML string.
	async executeString(gml, instance, other, args) {
		var matchResult = this.gml.prepare(gml);
		if (!matchResult.succeeded()) {
			throw new NonFatalErrorException({
					type: 'compilation',
					location: 'executeString',
					matchResult: matchResult,
					text: `COMPILATION ERROR in string to be executed\n` + matchResult.message + `\n`
				},
			);
		}

		return await this.gml.execute(matchResult, instance, other, args);
	}

	// // Helper functions

	// Get event of type and subtype (optional) of an instance.
	getEventOfInstance(instance, type, subtype) {
		var object = this.getResourceById('ProjectObject', instance.object_index);
		var event = object.events.find(x => (x.type == type) && (subtype ? (x.subtype == subtype) : true));
		return event;
	}

	// Returns a map containg all event-instance pairs that exist currently. It is structured like so:
	// Map(<event type>, Map(<event subtype>, {event, instance}))
	getMapOfEvents() {
		var map = new Map();

		for (let instance of this.instances) {
			if (!instance.exists) continue;
			var object = this.getResourceById('ProjectObject', instance.object_index);

			object.events.forEach(event => {

				var subtypes = map.get(event.type);
				if (subtypes == undefined) {
					subtypes = new Map();
					map.set(event.type, subtypes);
				}

				var eventInstancePairs = subtypes.get(event.subtype);
				if (eventInstancePairs == undefined) {
					eventInstancePairs = [];
					subtypes.set(event.subtype, eventInstancePairs);
				}

				eventInstancePairs.push({event: event, instance: instance});

			})
		}

		return map;
	}

	// From the map of events, get a list of event-instance pairs of that type and subtype.
	getEventsOfTypeAndSubtype(type, subtype) {
		var subtypes = this.mapEvents.get(type);
		if (!subtypes) return [];
		var list = subtypes.get(subtype);
		if (!list) return [];
		return list;
	}

	// From the map of events, get a list of event-instance pairs of that type, regardless of subtype.
	getEventsOfType(type) {
		var subtypes = this.mapEvents.get(type);
		if (!subtypes) return [];
		return [...subtypes.entries()];
	}

	// Get a project resource by its type and id.
	getResourceById(type, id) {
		return this.project.resources[type].find(x => x.id == id);
	}

	// Interpret apply to option, returns a list of instances that should be applied to.
	getApplyToInstances(appliesTo) {
		// -1 = self, -2 = other, 0>= = object index
		switch (appliesTo) {
			case -1:
				return [this.currentEventInstance];
			case -2:
				return [this.currentEventOther];
			default:
				return this.instances.filter(x => x.exists && x.object_index == appliesTo);
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

		var _object = object==null ? this.getResourceById('ProjectObject', this.currentEventInstance.object_index) : object;
		var _event = event==null ? this.currentEvent : event;
		var _actionNumber = actionNumber==null ? this.currentEventActionNumber : actionNumber;

		var base = {text:
			`\n___________________________________________\n`
			+ (isFatal ? `FATAL ` : ``) + `ERROR in\n`
			+ `action number ` + _actionNumber.toString() + `\n`
			+ `of ` + Events.getEventName(_event) + ` Event\n`
			+ `for object ` + _object.name + `:\n\n`
			+ extraText,

			location: 'object',
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