import Dispatcher from '../common/Dispatcher.js'
import Events from '../common/Events.js';
import {EngineException, ProjectErrorException, FatalErrorException, NonFatalErrorException, ExitException, StepStopException} from '../common/Exceptions.js';
import {Project} from '../common/Project.js';
import {makeCSSFont} from '../common/tools.js';
import VariableHolder from '../common/VariableHolder.js';

import ActionsParser from './ActionsParser.js';
import BuiltInConstants from './BuiltInConstants.js';
import BuiltInGlobals from './BuiltInGlobals.js';
import GML from './GML.js';
import Instance from './Instance.js';

export class Game {

	constructor (project, canvas, input) {
		this.project = new Project(project);
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

		this.lastFPSCheck = null;
		this.fps = 0;
		this.fpsFrameCount = 0;

		this.drawColor = 0;
		this.drawAlpha = 1;
		this.drawFont = -1;
		this.drawHAlign = 0;
		this.drawVAlign = 0;

		this.cssFontsCache = {
			"-1": makeCSSFont("Arial", 12, false, false),
		};

		this.gml = null;
		this.gmlCache = new Map();
		this.actionsCache = new Map();

		this.room = null;

		this.currentEvent = null;
		this.currentEventInstance = null;
		this.currentEventOther = null;
		this.currentEventActionNumber = null;

		this.timeout = null;

		this.mapEvents = null;

		this.stepStopAction = null;

		this.cursorSprite = null;
		this.cursorImageIndex = 0;

		this.audioContext = null;
		this.sounds = new Map();

	}

	// Starts the game.
	async start() {

		try {
			this.startCanvas();
			this.startInput();
			this.startEngine();
			this.startAudio();

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

		// audio
		this.stopAllSounds();

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
			var rect = this.input.getBoundingClientRect();
			this.mouseX = Math.floor(Math.max(0, Math.min(e.clientX - rect.left, this.room.width || 0)));
			this.mouseY = Math.floor(Math.max(0, Math.min(e.clientY - rect.top, this.room.height || 0)));

			this.globalVars.setBuiltIn('mouse_x', this.mouseX);
			this.globalVars.setBuiltIn('mouse_y', this.mouseY);
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

	startAudio() {
		if (!this.audioContext) {
			this.audioContext = new AudioContext();
		} else {
			if (this.audioContext.state == 'suspended') {
				this.audioContext.resume();
			}
		}
	}

	// // Project loading

	// Makes sure all resources are loaded, and parses GML code.
	loadProject() {
		var promises = [
			this.loadSprites(),
			this.loadBackgrounds(), // TODO
			this.loadSounds(),
		];

		this.loadFonts();

		this.loadActions();
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
	loadSounds() {
		var promises = [];
		this.project.resources.ProjectSound.forEach(sound => {
			if (!sound.sound) return;
			sound.sound.load();
			promises.push(sound.sound.promise
				.catch(e => {
					throw new EngineException("Could not load audio in sound " + sound.name);
				}));

			this.sounds.set(sound, {volume: sound.volume, audioNodes: []})
		})
		return Promise.all(promises);
	}

	// Loads all fonts.
	loadFonts() {
		this.project.resources.ProjectFont.forEach(font => {
			this.cssFontsCache[font.id] = makeCSSFont(font.font, font.size, font.bold, font.italic);
		})
	}

	// Parse all action lists in events and timeline moments into action trees.
	loadActions() {
		this.loadActionsTimelines(); // TODO
		this.loadActionsObjects();
	}

	// Parse all action lists in timelines.
	loadActionsTimelines() {} // TODO

	// Parse all action lists in objects.
	loadActionsObjects() {
		this.project.resources.ProjectObject.every(object => {
			return object.events.every(event => {
				var parsedActions = new ActionsParser().parse(event.actions);
				this.actionsCache.set(event, parsedActions);
				return true;
			})
		})
	}

	// Compile all GML code, parsing it and checking for errors.
	loadGML() {
		this.gml = new GML(this);

		this.loadGMLScripts();
		this.loadGMLTimelines(); // TODO
		this.loadGMLObjects();
		this.loadGMLRooms();
	}

	// Compile all GML inside of scripts.
	loadGMLScripts() {
		this.project.resources.ProjectScript.every(script => {
			return this.compileGMLAndCache(script.code, script, matchResult => {

				throw new FatalErrorException({
					type: 'compilation',
					location: 'script',
					locationScript: script,
					matchResult: matchResult,
					text:
						'\n___________________________________________\n'
						+ 'COMPILATION ERROR in Script: ' + script.name + '\n\n'
						+ matchResult.message + '\n',
				});

			});
		})
	}

	// Compile all GML inside time lines.
	loadGMLTimelines() {} // TODO

	// Compile all GML inside objects.
	loadGMLObjects() {
		this.project.resources.ProjectObject.every(object => {
			return object.events.every(event => {
				return event.actions.every((action, actionNumber) => {

					if (action.typeKind == 'code') {
						
						return this.compileGMLAndCache(action.args[0].value, action, matchResult => {

							throw this.makeFatalError({
									type: 'compilation',
									matchResult: matchResult,
								},
								'COMPILATION ERROR in code action:\n' + matchResult.message + '\n',
								object, event, actionNumber
							);

						});

					} else if (action.typeKind == 'normal' && action.typeExecution == 'code') {

						return this.compileGMLAndCache(action.args[0].value, action, matchResult => {

							throw this.makeFatalError({
									type: 'compilation',
									matchResult: matchResult,
								},
								'COMPILATION ERROR in code action (in action type in a library):\n' + matchResult.message + '\n',
								object, event, actionNumber
							);

						});

					} else if (action.typeKind == 'variable') {

						var name = action.args[0].value;
						var value = action.args[1].value;
						var assignSymbol = action.relative ? " += " : " = ";
						var code = name + assignSymbol + value;

						return this.compileGMLAndCache(code, action, matchResult => {

							throw this.makeFatalError({
									type: 'compilation',
									matchResult: matchResult,
								},
								'COMPILATION ERROR in code action (in variable set):\n' + matchResult.message + '\n',
								object, event, actionNumber
							);

						})

					}
					return true;
				})
			})
		})
	}

	// Compile all GML inside rooms.
	loadGMLRooms() {
		this.project.resources.ProjectRoom.every(room => {

			if (!room.instances.every(instance => {
				return this.compileGMLAndCache(instance.creationCode, instance, matchResult => {

					throw new FatalErrorException({
						type: 'compilation',
						location: 'instanceCreationCode',
						locationInstance: instance,
						locationRoom: room,
						matchResult: matchResult,
						text:
							'\n___________________________________________\n'
							+ 'COMPILATION ERROR in creation code for instance ' + instance.id + ' in room ' + room.name + '\n\n'
							+ matchResult.message + '\n',
					});

				});
			})) return false;

			return this.compileGMLAndCache(room.creationCode, room, matchResult => {

				throw new FatalErrorException({
					type: 'compilation',
					location: 'roomCreationCode',
					locationRoom: room,
					matchResult: matchResult,
					text:
						'\n___________________________________________\n'
						+ 'COMPILATION ERROR in creation code of room ' + room.name + '\n\n'
						+ matchResult.message + '\n',
				});

			});
		})
	}

	// Compiles a GML code string and stores the result in a cache. mapKey is used when accessing gmlCache.
	compileGMLAndCache(code, mapKey, failureFunction) {
		var result = this.gml.compile(code);
		if (result.succeeded) {
			this.gmlCache.set(mapKey, result.ast);
			return true;
		} else {
			failureFunction(result.matchResult);
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
		var timeoutStepStart = performance.now();

		// If one second has passed since last fps update, update it
		if ((timeoutStepStart - this.lastFPSCheck) >= 1000) {
			this.lastFPSCheck += 1000; // When it takes more than a second, it rolls over to the next check
			this.fps = this.fpsFrameCount;
			this.fpsFrameCount = 0;
		}

		try {
			await this.mainLoop();

			++this.fpsFrameCount;

			// Run main loop again, after a frame of time has passed.
			// This means the game will slow down if a loop takes too much time.
			
			var timeoutStepMinTime = 1000 / this.globalVars.getBuiltIn('room_speed');

			var timeoutStepEnd = performance.now();

			var timeoutStepTime = (timeoutStepEnd - timeoutStepStart);
			var timeoutWaitTime = timeoutStepMinTime - timeoutStepTime;

			this.timeout = setTimeout(() => this.mainLoopForTimeout(), timeoutWaitTime);

			// var timeoutTotalStepTime = timeoutStepTime + timeoutWaitTime;
			// console.log("------");
			// console.log("StepTime", timeoutStepTime);
			// console.log("StepMinTime", timeoutStepMinTime);
			// console.log("WaitTime", timeoutWaitTime);
			// console.log("TotalStepTime", timeoutTotalStepTime);
			// console.log(1/timeoutTotalStepTime, "fps");

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
		for (let {event, instance} of this.getEventsOfTypeAndSubtype('step', 'begin')) {
			if (!instance.exists) continue;
			await this.doEvent(event, instance);
		}

		// Alarm
		for (let [subtype, list] of this.getEventsOfType('alarm')) {
			for (let {event, instance} of list) {
				if (!instance.exists) continue;

				// Update alarm (decrease by one) here, before running event
				// Alarm stays 0 until next alarm check, where it becomes -1 forever (that's doom as heck)

				var alarm = instance.vars.getBuiltInArray('alarm', [subtype]);
				if (alarm >= 0) {
					instance.vars.setBuiltInArray('alarm', [subtype], alarm - 1);
				}
				if (instance.vars.getBuiltInArray('alarm', [subtype]) == 0) {
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
						execute = this.collisionInstanceOnPoint(instance, {x: this.mouseX, y: this.mouseY});
					}

				} else
				if (eventInfo.kind == 'enter-release') {
					// TODO not implemented
				} else
				if (eventInfo.kind == 'wheel-up') {
					execute = (this.mouseWheel < 0);
				} else
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

			var hspeedOld = instance.vars.getBuiltIn('hspeed');
			var vspeedOld = instance.vars.getBuiltIn('vspeed');

			var hspeedNew = hspeedOld;
			var vspeedNew = vspeedOld;

			instance.vars.setBuiltIn('x', instance.vars.getBuiltIn('x') + hspeedOld);
			instance.vars.setBuiltIn('y', instance.vars.getBuiltIn('y') + vspeedOld);

			if (instance.vars.getBuiltIn('friction') != 0) {
				var direction = instance.vars.getBuiltIn('direction') * (Math.PI / 180);

				if (hspeedOld != 0) {
					hspeedNew = hspeedOld - Math.cos(direction) * instance.vars.getBuiltIn('friction');
					if (Math.sign(hspeedNew) != Math.sign(hspeedOld)) { // If changed sign, that is, going in the opposite direction, don't do that
						hspeedNew = 0;
					}
				}

				if (vspeedOld != 0) {
					vspeedNew = vspeedOld - -Math.sin(direction) * instance.vars.getBuiltIn('friction');
					if (Math.sign(vspeedNew) != Math.sign(vspeedOld)) {
						vspeedNew = 0;
					}
				}

			}

			if (instance.vars.getBuiltIn('gravity') != 0) {
				hspeedNew += Math.cos(instance.vars.getBuiltIn('gravity_direction') * (Math.PI / 180)) * instance.vars.getBuiltIn('gravity');
				vspeedNew += -Math.sin(instance.vars.getBuiltIn('gravity_direction') * (Math.PI / 180)) * instance.vars.getBuiltIn('gravity');
			}

			instance.setHspeedAndVspeed(hspeedNew, vspeedNew);

			// TODO paths?

		}

		// Collisions
		for (let [subtype, list] of this.getEventsOfType('collision')) {
			for (let {event, instance} of list) {
				if (!instance.exists) continue;
				for (let other of this.instances) {
					if (!other.exists) continue;
					if (!(other.object_index == subtype)) continue;
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
			if (!instance.exists) continue;
			instance.vars.setBuiltIn('xprevious', instance.vars.getBuiltIn('x'));
			instance.vars.setBuiltIn('yprevious', instance.vars.getBuiltIn('y'));

			var imageNumber = (instance.sprite ? instance.sprite.images.length : 0);

			var i = instance.vars.getBuiltIn('image_index') + instance.vars.getBuiltIn('image_speed');
			if (i >= imageNumber) {
				i -= imageNumber;
			}
			instance.vars.setBuiltIn('image_index', i);
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

		// Draw background backgrounds

		for (let roomBackground of this.room.backgrounds) {
			if (!roomBackground) continue;
			if (roomBackground.isForeground == true) continue;
			this.drawRoomBackground(roomBackground);
		}

		// TODO Draw tiles

		// Draw instances

		var instances_by_depth = this.instances
			.filter(x => x.exists)
			.sort((a, b) => a.vars.getBuiltIn('depth') - b.vars.getBuiltIn('depth'));

		for (let instance of instances_by_depth) {
			if (!instance.exists) continue;

			// Only draw if visible
			if (instance.vars.getBuiltIn('visible')) {
				var drawEvent = this.getEventOfInstance(instance, 'draw');

				if (drawEvent) {
					await this.doEvent(drawEvent, instance); 
				} else {
					// No draw event, draw sprite if it has one.
					if (instance.sprite) {
						this.drawSprite(instance.sprite, instance.getImageIndex(), instance.vars.getBuiltIn('x'), instance.vars.getBuiltIn('y'));
					}
				}
			}

		}

		// Draw foreground backgrounds

		for (let roomBackground of this.room.backgrounds) {
			if (!roomBackground) continue;
			if (roomBackground.isForeground == false) continue;
			this.drawRoomBackground(roomBackground);
		}

		// Draw mouse cursor

		if (this.cursorSprite) {
			this.drawSprite(this.cursorSprite, this.cursorImageIndex, this.globalVars.getBuiltIn('mouse_x'), this.globalVars.getBuiltIn('mouse_y'));
			this.cursorImageIndex = ((++this.cursorImageIndex) % this.cursorSprite.images.length);
		}

	}

	drawRoomBackground(roomBackground) {
		if (!roomBackground.visibleAtStart) return false;

		var background = this.getResourceById('ProjectBackground', roomBackground.backgroundIndex);
		if (!background) return false;

		var image = background.image;
		if (!image) return false;

		// TODO tileHorizontally, tileVertically, stretch, horizontalSpeed, verticalSpeed

		this.ctx.drawImage(image.image, roomBackground.x, roomBackground.y);
		return true;
	}

	// Execute a event.
	async doEvent(event, instance, other=null) {
		if (event == null) return;

		var previousEvent = this.currentEvent;
		var previousInstance = this.currentEventInstance;
		var previousOther = this.currentEventOther;

		this.currentEvent = event;
		this.currentEventInstance = instance;
		this.currentEventOther = other;

		var parsedActions = this.actionsCache.get(event);

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

		if (treeAction == null) return;

		this.currentEventActionNumber = treeAction.actionNumber;

		if (treeAction.appliesTo != undefined) {
			var applyToInstances = this.getApplyToInstances(treeAction.appliesTo);
			var otherInstance = this.currentEventOther || this.currentEventInstance;
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
							currentResult = await this.gml.execute(this.gmlCache.get(treeAction.action), applyToInstance, otherInstance, args, treeAction.relative);
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

			case 'variable':
				for (let applyToInstance of applyToInstances) {
					if (!applyToInstance.exists) continue;
					await this.gml.execute(this.gmlCache.get(treeAction.action), applyToInstance, otherInstance);
				}
				break;

			case 'code':
				for (let applyToInstance of applyToInstances) {
					if (!applyToInstance.exists) continue;
					await this.gml.execute(this.gmlCache.get(treeAction.action), applyToInstance, otherInstance);
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
			// TODO maybe compile all these codes beforehand

			var result = this.gml.compile(arg.value, "Expression");
			if (!result.succeeded) {
				throw this.makeFatalError({
						type: 'compilation',
						matchResult: result.matchResult,
					},
					'COMPILATION ERROR in argument '+ argNumber.toString() +'\n' + result.matchResult.message + '\n',
				);
			}
			
			return await this.gml.execute(result.ast, this.currentEventInstance, this.currentEventOther || this.currentEventInstance);
		}
		return arg.value;
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

			this.instances = this.instances.filter(instance => instance.exists && instance.vars.getBuiltIn('persistent'))
		}

		this.room = room;

		this.canvas.width = room.width;
		this.canvas.height = room.height;

		this.globalVars.setBuiltIn('room', room.id);
		this.globalVars.setBuiltIn('room_speed', room.speed);

		// TODO set background and views variables

		this.clearIO();

		// TODO Check if room is persistent

		var createdInstances = [];
		for (let roomInstance of room.instances) {
			createdInstances.push(this.instanceCreateNoEvents(roomInstance.id, roomInstance.x, roomInstance.y, roomInstance.object_index, false));
		}

		for (let instance of createdInstances) {
			// TODO run instance creation code
			await this.doEvent(this.getEventOfInstance(instance, 'create'), instance);
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
		var instance = this.instanceCreateNoEvents(id, x, y, object);
		
		await this.doEvent(this.getEventOfInstance(instance, 'create'), instance);

		return instance.id;
	}

	instanceCreateNoEvents(id, x, y, object) {
		if (id == null) {
			this.lastId += 1;
			id = this.lastId;
		}

		var instance = new Instance(id, x, y, object, this);
		this.instances.push(instance);

		return instance;
	}

	// Check if two instances are colliding.
	collisionInstanceOnInstance(instanceA, instanceB, x, y) {

		// TODO masks
		// TODO solid

		if (instanceA.sprite == null || instanceA.sprite.images.length == 0) return false;
		if (instanceB.sprite == null || instanceB.sprite.images.length == 0) return false;

		// TODO collision masks, will assume rectangle now
		// spriteA.boundingBox == 'fullimage';
		// spriteA.shape = 'rectangle';

		var collisions = [
			{shape1: 'precise', shape2: 'precise', func: this.collisionInstancePreciseOnInstancePrecise},
			{shape1: 'precise', shape2: 'rectangle', func: this.collisionInstanceRectangleOnInstanceRectangle},
			// {shape1: 'precise', shape2: 'disk', func: this.collisionInstanceRectangleOnInstanceRectangle},
			// {shape1: 'precise', shape2: 'diamond', func: this.collisionInstanceRectangleOnInstanceRectangle},
			{shape1: 'rectangle', shape2: 'rectangle', func: this.collisionInstanceRectangleOnInstanceRectangle},
			// {shape1: 'rectangle', shape2: 'disk', func: this.collisionInstanceRectangleOnInstanceRectangle},
			// {shape1: 'rectangle', shape2: 'diamond', func: this.collisionInstanceRectangleOnInstanceRectangle},
			// {shape1: 'disk', shape2: 'disk', func: this.collisionInstanceRectangleOnInstanceRectangle},
			// {shape1: 'disk', shape2: 'diamond', func: this.collisionInstanceRectangleOnInstanceRectangle},
			// {shape1: 'diamond', shape2: 'diamond', func: this.collisionInstanceRectangleOnInstanceRectangle},
		];

		for (let collision of collisions) {
			if (instanceA.sprite.shape == collision.shape1 && instanceB.sprite.shape == collision.shape2) {
				return collision.func(instanceA, instanceB, x, y);
			} else
			if (instanceA.sprite.shape == collision.shape2 && instanceB.sprite.shape == collision.shape1) {
				return collision.func(instanceB, instanceA, x, y);
			}
		}

		return false;

	}

	// Check if an instance is colliding with any of otherInstances.
	collisionInstanceOnInstances(instance, otherInstances, x, y, solidOnly=false) {
		// place_free / place_empty / place_meeting
		for (let otherInstance of otherInstances) {
			if (!otherInstance.exists) continue;
			if (solidOnly && (otherInstance.vars.getBuiltIn('solid') == 0)) continue;
			var c = this.collisionInstanceOnInstance(instance, otherInstance, x, y);
			if (c) return true;
		}
		return false;
	}

	// Check if instance is colliding with point.
	collisionInstanceOnPoint(instance, point) {
		if (instance.sprite == null || instance.sprite.images.length == 0) return false;

		var collisions = [
			{shape: 'precise', func: this.collisionInstanceRectangleOnPoint},
			{shape: 'rectangle', func: this.collisionInstanceRectangleOnPoint},
			// {shape: 'disk', func: this.collisionInstanceRectangleOnPoint},
			// {shape: 'diamond', func: this.collisionInstanceRectangleOnPoint},
		];

		for (let collision of collisions) {
			if (instance.sprite.shape == collision.shape) {
				return collision.func(instance, point);
			}
		}
	}

	// Check if two instances, with precise shape, are colliding.
	collisionInstancePreciseOnInstancePrecise(a, b, aX, aY, bX, bY) {
		aX = (aX == null) ? Math.floor(a.vars.getBuiltIn('x')) : aX;
		aY = (aY == null) ? Math.floor(a.vars.getBuiltIn('y')) : aY;
		let aImage = a.sprite.images[a.getImageIndex()];
		let aX1 = aX - a.sprite.originx;
		let aY1 = aY - a.sprite.originy;
		let aX2 = aX1 + aImage.image.width;
		let aY2 = aY1 + aImage.image.height;

		bX = (bX == null) ? Math.floor(b.vars.getBuiltIn('x')) : bX;
		bY = (bY == null) ? Math.floor(b.vars.getBuiltIn('y')) : bY;
		let bImage = b.sprite.images[b.getImageIndex()];
		let bX1 = bX - b.sprite.originx;
		let bY1 = bY - b.sprite.originy;
		let bX2 = bX1 + bImage.image.width;
		let bY2 = bY1 + bImage.image.height;

		let rectCol = (
			aX1 <= bX1 + bImage.image.width &&
			bX1 <= aX1 + aImage.image.width &&
			aY1 <= bY1 + bImage.image.height &&
			bY1 <= aY1 + aImage.image.height
		)

		if (!rectCol) return false;

		let offscreen = new OffscreenCanvas(aImage.image.width + bImage.image.width,
			Math.max(aImage.image.height, bImage.image.height));

		let offscreenCtx = offscreen.getContext('2d');
		offscreenCtx.drawImage(aImage.image, 0, 0);
		offscreenCtx.drawImage(bImage.image, aImage.image.width, 0);

		let aData = offscreenCtx.getImageData(0, 0, aImage.image.width, aImage.image.height);
		let bData = offscreenCtx.getImageData(aImage.image.width, 0, bImage.image.width, bImage.image.height);

		let gX1 = Math.max(aX1, bX1);
		let gY1 = Math.max(aY1, bY1);
		let gX2 = Math.min(aX2, bX2);
		let gY2 = Math.min(aY2, bY2);

		for (let gX = gX1; gX < gX2; ++gX)
		for (let gY = gY1; gY < gY2; ++gY) {
			let aDataX = gX - aX1;
			let aDataY = gY - aY1;
			let aCol = (aData.data[(aDataY * aData.width + aDataX) * 4 + 3]) >= (255-a.sprite.alphaTolerance);
			if (!aCol) continue;

			let bDataX = gX - bX1;
			let bDataY = gY - bY1;
			let bCol = (bData.data[(bDataY * bData.width + bDataX) * 4 + 3]) >= (255-b.sprite.alphaTolerance);
			if (bCol) {
				return true;
			}
		}
	}

	// Check if two instances, with rectangular shape, are colliding.
	collisionInstanceRectangleOnInstanceRectangle(a, b, aX, aY, bX, bY) {
		aX = (aX == null) ? a.vars.getBuiltIn('x') : aX;
		aY = (aY == null) ? a.vars.getBuiltIn('y') : aY;
		let aX1 = aX - a.sprite.originx;
		let aY1 = aY - a.sprite.originy
		let aImage = a.sprite.images[a.getImageIndex()]

		bX = (bX == null) ? b.vars.getBuiltIn('x') : bX;
		bY = (bY == null) ? b.vars.getBuiltIn('y') : bY;
		let bX1 = bX - b.sprite.originx
		let bY1 = bY - b.sprite.originy
		let bImage = b.sprite.images[b.getImageIndex()]

		return (
			aX1 <= bX1 + bImage.image.width &&
			bX1 <= aX1 + aImage.image.width &&
			aY1 <= bY1 + bImage.image.height &&
			bY1 <= aY1 + aImage.image.height
		);
	}

	// Check if an instance, with rectangular shape, and a point are colliding.
	collisionInstanceRectangleOnPoint(instance, point) {
		var instanceX = instance.vars.getBuiltIn('x') - instance.sprite.originx;
		var instanceY = instance.vars.getBuiltIn('y') - instance.sprite.originy;
		var instanceImage = instance.sprite.images[instance.getImageIndex()];

		return (
			point.x >= instanceX &&
			point.x < instanceX + instanceImage.image.width &&
			point.y >= instanceY &&
			point.y < instanceY + instanceImage.image.height
		);
	}

	// Draw a sprite with the image index at x and y.
	drawSprite(sprite, imageIndex, x, y) {
		var image = sprite.images[imageIndex];
		if (image == null) return false;

		this.ctx.drawImage(image.image, x-sprite.originx, y-sprite.originy);

		return true;
	}

	// Play a sound, on loop or not.
	playSound(sound, loop) {
		this.startAudio();
		var audioNode = this.audioContext.createMediaElementSource(new Audio(sound.sound.src));
		audioNode.connect(this.audioContext.destination);
		audioNode.mediaElement.volume = this.sounds.get(sound).volume;
		audioNode.mediaElement.loop = loop;
		audioNode.mediaElement.play();

		this.sounds.get(sound).audioNodes.push(audioNode);
	}

	// Stop all playing sounds from a sound resource.
	stopSound(sound) {
		for (let audioNode of this.sounds.get(sound).audioNodes) {
			audioNode.mediaElement.pause();
			audioNode.disconnect();
		}
		this.sounds.get(sound).audioNodes = [];
	}

	// Stop all sounds being played.
	stopAllSounds() {
		for (let [sound, value] of this.sounds) {
			for (let audioNode of value.audioNodes) {
				audioNode.mediaElement.pause();
				audioNode.disconnect();
			}
			value.audioNodes = [];
		}
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

	// Compile and execute GML string.
	async executeString(gml, instance, other, args) {
		var result = this.gml.compile(gml);
		if (!result.succeeded) {
			throw new NonFatalErrorException({
					type: 'compilation',
					location: 'executeString',
					matchResult: result.matchResult,
					text: 'COMPILATION ERROR in string to be executed\n' + result.matchResult.message + '\n'
				},
			);
		}

		return await this.gml.execute(result.ast, instance, other, args);
	}

	// // Helper functions

	// Get event of type and subtype (optional) of an instance.
	getEventOfInstance(instance, type, subtype) {
		return instance.object.events.find(x => (x.type == type) && (subtype ? (x.subtype == subtype) : true));
	}

	// Returns a map containg all event-instance pairs that exist currently. It is structured like so:
	// Map(<event type>, Map(<event subtype>, {event, instance}))
	getMapOfEvents() {
		var map = new Map();

		for (let instance of this.instances) {
			if (!instance.exists) continue;

			instance.object.events.forEach(event => {

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
				return [this.currentEventOther || this.currentEventInstance];
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

		var _object = object==null ? this.currentEventInstance.object : object;
		var _event = event==null ? this.currentEvent : event;
		var _actionNumber = actionNumber==null ? this.currentEventActionNumber : actionNumber;

		var base = {text:
			'\n___________________________________________\n'
			+ (isFatal ? 'FATAL ' : '') + 'ERROR in\n'
			+ 'action number ' + _actionNumber.toString() + '\n'
			+ 'of ' + Events.getEventName(_event) + ' Event\n'
			+ 'for object ' + _object.name + ':\n\n'
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