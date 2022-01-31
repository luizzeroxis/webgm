import Dispatcher from '../common/Dispatcher.js'

import {EngineException, ProjectErrorException, FatalErrorException, NonFatalErrorException, ExitException} from '../common/Exceptions.js';

import {Project} from '../common/Project.js';

import VariableHolder from '../common/VariableHolder.js';
import Events from '../common/Events.js';

import GML from './GML.js';
import ActionsParser from './ActionsParser.js';
import BuiltInLocals from './BuiltInLocals.js';
import BuiltInGlobals from './BuiltInGlobals.js';
import BuiltInConstants from './BuiltInConstants.js';
import Collision from './Collision.js';

export class Game {

	constructor (project, canvas, input) {
		this.project = project;
		this.canvas = canvas;
		this.input = input;

		this.dispatcher = new Dispatcher();
		this.collision = new Collision(this);

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
		this.existingInstances = [];
		this.destroyedInstances = [];

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
		this.currentInstance = null;
		this.currentOther = null;
		this.currentActionNumber = null;

		this.timeout = null;
		this.fpsTimeout = null;

		this.mapEvents = null;

	}

	start() {

		try {
			this.startCanvas();
			this.startInput();
			this.startEngine();

			this.loadProject()
			.then(() => {
				this.loadFirstRoom();
				this.startMainLoop();
			})
			.catch(e => {this.catch(e)});
		} catch (e) {
			this.catch(e);
		}
		
	}

	end() {
		// canvas
		this.canvas.classList.remove("no-cursor");

		// input
		this.input.removeEventListener('keydown', this.keyDownHandler)
		this.input.removeEventListener('keyup', this.keyUpHandler)
		this.input.removeEventListener('mousedown', this.mouseDownHandler)
		this.input.removeEventListener('mouseup', this.mouseUpHandler)
		this.input.removeEventListener('mousemove', this.mouseMoveHandler)
		this.input.removeEventListener('wheel', this.wheelHandler)

		// main loop
		this.endMainLoop();
	}

	startCanvas() {
		this.ctx = this.canvas.getContext('2d');
		this.ctx.imageSmoothingEnabled = false;

		if (!this.project.globalGameSettings.displayCursor) {
			this.canvas.classList.add("no-cursor");
		}
	}

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

	startEngine() {
		this.globalVars = new VariableHolder(this, BuiltInGlobals)
		this.constants = BuiltInConstants.getList();

		// TODO Add user defined constants

		// Add resource names as constants
		Project.getTypes().forEach(type => {
			this.project.resources[type.getClassName()].forEach(x => {this.constants[x.name] = x.id});
		});

	}

	loadProject() {
		var promises = [
			this.loadSprites(),
			this.loadBackgrounds(), // TODO
			this.loadSounds(), // TODO
		];

		this.loadGML();

		return Promise.all(promises);
	}

	loadSprites() {
		var promises = [];
		this.project.resources.ProjectSprite.forEach(sprite => {
			sprite.images.forEach((image, imageNumber) => {
				promises.push(image.promise
					.catch(e => {
						throw new EngineException("Could not load image " + imageNumber.toString() + " in sprite " + sprite.name);
					}));
			})
		})
		return Promise.all(promises);
	}

	loadBackgrounds() {} // TODO
	loadSounds() {} // TODO

	loadGML() {
		this.gml = new GML(this);

		this.loadGMLScripts();
		this.loadGMLTimelines(); // TODO
		this.loadGMLObjects();
		this.loadGMLRooms();
	}

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

	loadGMLTimelines() {} // TODO

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

	///// START ERROR THROWING

	// TODO put all info in the exception itself, then show error on catch
	// TODO make the message more like the one from GM

	makeError(isFatal, ...args) {
		if (isFatal) {
			return this.makeFatalError(...args);
		} else {
			return this.makeNonFatalError(...args);
		}
	}

	makeFatalError(...args) {
		return new FatalErrorException(this.makeErrorOptions(true, ...args));
	}

	makeNonFatalError(...args) {
		return new NonFatalErrorException(this.makeErrorOptions(false, ...args));
	}

	makeErrorOptions(isFatal, options, extraText, object=null, event=null, actionNumber=null) {

		var _object = object==null ? this.getResourceById('ProjectObject', this.currentInstance.object_index) : object;
		var _event = event==null ? this.currentEvent : event;
		var _actionNumber = actionNumber==null ? this.currentActionNumber : actionNumber;

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

	showError(exception) {
		console.log(exception.text);
		this.showErrorBox(exception.text);
	}

	showErrorBox(message) {
		this.endMainLoop();
		alert(message);
		this.startMainLoop();
	}


	///// END ERROR THROWING

	loadFirstRoom() {
		this.loadRoom(this.project.resources.ProjectRoom[0]);
	}

	loadRoom(room) {

		var isFirstRoom = (this.room == null);

		if (!isFirstRoom) {
			this.existingInstances.forEach(instance => {
				var OTHER_ROOM_END = 5;
				this.doEvent(this.getEventOfInstance(instance, 'other', OTHER_ROOM_END), instance);
			})

			this.instances = this.instances.filter(instance => instance.vars.get('persistent'))
			this.existingInstances = this.instances.slice();
			this.destroyedInstances = [];
		}

		this.room = room;

		this.canvas.width = room.width;
		this.canvas.height = room.height;

		this.globalVars.setForce('room_width', room.width);
		this.globalVars.setForce('room_height', room.height);
		this.globalVars.setForce('room_speed', room.speed);

		// TODO Check if room is persistent
		room.instances.forEach(roomInstance => {
			this.instanceCreate(roomInstance.x, roomInstance.y, roomInstance.object_index);
		})

		if (isFirstRoom) {
			this.instances.forEach(instance => {
				var OTHER_GAME_START = 2;
				this.doEvent(this.getEventOfInstance(instance, 'other', OTHER_GAME_START), instance);
			})
		}

		// TODO run room creation code

		this.instances.forEach(instance => {
			var OTHER_GAME_START = 4;
			this.doEvent(this.getEventOfInstance(instance, 'other', OTHER_GAME_START), instance);
		})

	}

	instanceCreate(x, y, object) {
		var instance = new Instance(x, y, object, this);
		this.instances.push(instance);
		this.existingInstances.push(instance);

		// TODO run instance creation code

		this.doEvent(this.getEventOfInstance(instance, 'create'), instance);

		// TODO set id?
		return instance.vars.get('id');
	}

	instanceExists(instance) {
		return (this.existingInstances.find(x => x == instance) != null);
	}

	getResourceById(type, id) {
		return this.project.resources[type].find(x => x.id == id);
	}

	getEventOfInstance(instance, type, subtype) {
		var object = this.getResourceById('ProjectObject', instance.object_index);
		var event = object.events.find(x => (x.type == type) && (subtype ? (x.subtype == subtype) : true));
		return event;
	}

	//

	doEvent(event, instance, other=null) {
		if (event == null) return;

		this.currentEvent = event;
		this.currentInstance = instance;
		this.currentOther = other || instance;

		var parsedActions = new ActionsParser(event.actions).parse();

		return parsedActions.every(treeAction => {
			try {
				this.doTreeAction(treeAction);
			} catch (e) {
				if (e instanceof ExitException) {
					return false;
				} if (e instanceof NonFatalErrorException) {
					this.showError(e);
				} else {
					throw e;
				}
			}
			return true;
		})

	}

	doTreeAction(treeAction) {
		this.currentActionNumber = treeAction.actionNumber;

		if (treeAction.appliesTo != undefined) {
			var applyToInstances = this.getApplyToInstances(treeAction.appliesTo);
		}

		switch (treeAction.type) {
			case 'executeFunction':
			case 'executeCode':

				{
					let result = true;
					applyToInstances.forEach(applyToInstance => {

						var args = treeAction.args.map(x => this.parseActionArg(x));

						var currentResult;
						if (treeAction.type == 'executeFunction') {
							currentResult = this.gml.builtInFunction(treeAction.function, applyToInstance, args, treeAction.relative);
						} else {
							currentResult = this.gml.execute(this.preparedCodes.get(treeAction.action), applyToInstance, args, treeAction.relative);
						}

						if (typeof currentResult !== "number" || currentResult < 0.5) {
							result = false;
						}

					});

					return result;
				}

			case 'if':
				{
					let result = this.doTreeAction(treeAction.condition);
					if (result) {
						this.doTreeAction(treeAction.ifTrue);
					} else {
						this.doTreeAction(treeAction.ifFalse);
					}
					break;
				}

			case 'block':
				treeAction.actions.forEach(blockTreeAction => {
					this.doTreeAction(blockTreeAction);
				});
				break;

			case 'exit':
				throw new ExitException();

			case 'repeat':
				var times = this.parseActionArg(treeAction.times);
				for (var i=0; i<times; i++) {
					this.doTreeAction(treeAction.treeAction);
				}
				break;

			case 'variable': // TODO
				break;

			case 'code':
				applyToInstances.forEach(applyToInstance => {
					this.gml.execute(this.preparedCodes.get(treeAction.action), applyToInstance);
				});
				break;
		}
	}

	getApplyToInstances(appliesTo) {
		// -1 = self, -2 = other, 0>= = object index
		switch (appliesTo) {
			case -1:
				return [this.currentInstance];
			case -2:
				return [this.currentOther];
			default:
				return this.instances.filter(x => x.object_index == appliesTo);
		}
	}

	parseActionArg(arg) {
		if (arg.kind == 'both') {
			if (arg.value[0] != `'` && arg.value[0] != `"`) {
				return arg.value;
			}
		}
		if (arg.kind == 'both' || arg.kind == 'expression') {
			return this.gml.executeStringExpression(arg.value, this.currentInstance);
		}
		return arg.value;
	}

	//

	startMainLoop() {
		if (this.timeout == null) {
			this.timeout = setTimeout(() => this.mainLoop(), 0);
		}

		if (this.fpsTimeout == null) {
			this.fpsTimeout = setInterval(() => this.updateFps(), 1000);
		}
	}

	endMainLoop() {
		clearTimeout(this.timeout);
		this.timeout = null;

		clearInterval(this.fpsTimeout);
		this.fpsTimeout = null;
	}

	mainLoop() {

		var timeoutStepStart = performance.now() / 1000;
		++this.fpsFrameCount;

		/*
			Begin step events 
			Alarm events 
			Keyboard, Key press, and Key release events 
			Mouse events 
			Normal step events 
			(now all instances are set to their new positions) 
			Collision events 
			End step events 
			Draw events // LIE!!!!!!!!1111111
		*/

				// Get all events
		this.mapEvents = this.getMapOfEvents();

		// Draw
		this.drawViews();

		// Do some stuff
		this.globalVars.setForce('fps', this.fps);

		// Begin step
		this.getEventsOfTypeAndSubtype('step', 'begin').forEach(({event, instance}) => {
			this.doEvent(event, instance);
		});

		// Alarm
		this.getEventsOfType('alarm').forEach(([subtype, list]) => {
			list.forEach(({event, instance}) => {

				// Update alarm (decrease by one) here, before running event
				// Alarm stays 0 until next alarm check, where it becomes -1 forever

				if (instance.vars.get('alarm', [subtype]) >= 0) {
					instance.vars.setAdd('alarm', -1, [subtype]);
				}

				if (instance.vars.get('alarm', [subtype]) == 0) {
					this.doEvent(event, instance);
				}

			});
		});

		// Keyboard
		this.getEventsOfType('keyboard').forEach(([subtype, list]) => {
			list.forEach(({event, instance}) => {
				if (this.getKey(subtype, this.key)) {
					this.doEvent(event, instance);
				}
			});
		});

		this.getEventsOfType('keypress').forEach(([subtype, list]) => {
			list.forEach(({event, instance}) => {
				if (this.getKey(subtype, this.keyPressed)) {
					this.doEvent(event, instance);
				}
			});
		});

		this.getEventsOfType('keyrelease').forEach(([subtype, list]) => {
			list.forEach(({event, instance}) => {
				if (this.getKey(subtype, this.keyReleased)) {
					this.doEvent(event, instance);
				}
			});
		});

		// Mouse

		// TODO other mouse events

		this.getEventsOfType('mouse').forEach(([subtype, list]) => {
			list.forEach(({event, instance}) => {
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
					this.doEvent(event, instance);
				}

			})
		})

		// Step
		this.getEventsOfTypeAndSubtype('step', 'normal').forEach(({event, instance}) => {
			this.doEvent(event, instance);
		});

		// Update instance variables and positions

		this.instances.forEach(instance => {

			instance.vars.set('xprevious', instance.vars.get('x'));
			instance.vars.set('yprevious', instance.vars.get('y'));

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

		});

		// Collisions
		this.getEventsOfType('collision').forEach(([subtype, list]) => {
			list.forEach(({event, instance}) => {
				var others = this.instances.filter(x => x.object_index == subtype);
				others.forEach(other => {
					if (this.checkCollision(instance, other)) {
						this.doEvent(event, instance, other);
					}
				})
			});
		});

		// End step
		this.getEventsOfTypeAndSubtype('step', 'end').forEach(({event, instance}) => {
			this.doEvent(event, instance);
		});

		// Reset keyboard/mouse states
		this.keyPressed = {};
		this.keyReleased = {};
		this.mousePressed = {};
		this.mouseReleased = {};
		this.mouseWheel = 0;

		// Delete instances
		this.destroyedInstances.forEach(instance => {
			var index = this.instances.findIndex(x => x == instance);
			this.instances.splice(index, 1);
		})
		this.destroyedInstances = [];

		// Run main loop again, after a frame of time has passed.
		// This means the game will slow down if a loop takes too much time.

		var timeoutStepEnd = performance.now() / 1000;
		var timeoutStepTime = timeoutStepEnd - timeoutStepStart;
		var timeoutStepMinTime = 1 / this.globalVars.get('room_speed');
		var timeoutWaitTime = Math.max(0, timeoutStepMinTime - timeoutStepTime);

		this.timeout = setTimeout(() => this.mainLoop(), timeoutWaitTime * 1000);

		// var timeoutTotalStepTime = timeoutStepTime + timeoutWaitTime;
		// console.log("------");
		// console.log("StepTime", timeoutStepTime);
		// console.log("StepMinTime", timeoutStepMinTime);
		// console.log("WaitTime", timeoutWaitTime);
		// console.log("TotalStepTime", timeoutTotalStepTime);
		// console.log(1/timeoutTotalStepTime, "fps");
	}

	updateFps() {
		this.fps = this.fpsFrameCount;
		this.fpsFrameCount = 0;
	}

	getMapOfEvents() {
		var map = new Map();

		this.instances.forEach(instance => {
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
		})

		return map;
	}

	drawViews() {
		// Currently there are no views. But the following should happen for every view.

		// Draw background color
		this.ctx.fillStyle = this.room.backgroundColor;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		// this.ctx.fillStyle = "black";

		// TODO Draw background images
		// TODO Draw tiles

		// Draw instances

		var instances_by_depth = [...this.instances].sort(
			(a, b) => a.vars.get('depth') - b.vars.get('depth')
		);

		instances_by_depth.forEach(instance => {
			var object = this.getResourceById('ProjectObject', instance.object_index);

			// Only draw if visible
			if (instance.vars.get('visible')) {
				var drawEvent = this.getEventOfInstance(instance, 'draw');

				if (drawEvent) {
					this.doEvent(drawEvent, instance); 
				} else {
					// No draw event, draw sprite if it has one.
					var index = instance.vars.get('sprite_index');
					if (index >= 0) {
						var sprite = this.getResourceById('ProjectSprite', index);
						if (sprite) {
							var image = sprite.images[instance.vars.get('image_index')];
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

		});
	}

	getEventsOfTypeAndSubtype(type, subtype) {
		var subtypes = this.mapEvents.get(type);
		if (!subtypes) return [];
		var list = subtypes.get(subtype);
		if (!list) return [];
		return list;
	}

	getEventsOfType(type) {
		var subtypes = this.mapEvents.get(type);
		if (!subtypes) return [];
		return [...subtypes.entries()];
	}

	checkCollision(self, other) {

		// TODO masks
		// TODO solid

		var selfSprite = this.getResourceById('ProjectSprite', self.vars.get('sprite_index'));
		var selfImage = selfSprite.images[self.vars.get('image_index')];

		var otherSprite = this.getResourceById('ProjectSprite', other.vars.get('sprite_index'));
		var otherImage = otherSprite.images[other.vars.get('image_index')];

		// TODO collision masks, will assume rectangle now
		// selfSprite.boundingbox == 'fullimage';
		// selfSprite.shape = 'rectangle';

		var c = Collision.rectOnRect({
			x1: self.vars.get('x') - selfSprite.originx,
			y1: self.vars.get('y') - selfSprite.originy,
			x2: self.vars.get('x') - selfSprite.originx + selfImage.image.width,
			y2: self.vars.get('y') - selfSprite.originy + selfImage.image.height
		}, {
			x1: other.vars.get('x') - otherSprite.originx,
			y1: other.vars.get('y') - otherSprite.originy,
			x2: other.vars.get('x') - otherSprite.originx + otherImage.image.width,
			y2: other.vars.get('y') - otherSprite.originy + otherImage.image.height
		})

		return c;

	}

	getKey(key, dict) { // dict should be key, keyPressed or keyReleased
		if (key == 0) { // vk_nokey
			return Object.entries(dict).every(([key, value]) => !value);
		}
		if (key == 1) { // vk_anykey
			return Object.entries(dict).some(([key, value]) => value);
		}
		return dict[key];
	}

	getMouse(numb, dict) { // dict should be mouse, mousePressed or mouseReleased
		if (numb == -1) { // mb_any
			return Object.entries(dict).some(([key, value]) => value);
		}
		if (numb == 0) { // mb_none
			return Object.entries(dict).every(([key, value]) => !value);
		}
		return dict[numb];
	}

	catch(e) {
		if (e instanceof EngineException) {
			this.close(e);
		} else if (e instanceof ProjectErrorException) {

			this.showError(e);
			this.close();

		} else {
			throw e;
		}
	}

	close(e) {
		console.log('Closing game.');
		this.end();

		this.dispatcher.speak('close', e);
	}

	gameEnd () {
		console.log('Stopping game.')
		this.end();

		this.dispatcher.speak('gameEnd');
	}

}

export class Instance {

	constructor (x, y, object_index, game) {

		this.object_index = object_index;
		this.game = game;

		this.vars = new VariableHolder(this, BuiltInLocals);

		// Id
		this.vars.setForce('id', 100001);

		// Set by constructor
		this.vars.setForce('x', x);
		this.vars.setForce('y', y);
		
		// Inherited from object
		var obj = game.getResourceById('ProjectObject', this.object_index);

		this.vars.setForce('object_index', obj.id);
		this.vars.setForce('sprite_index', obj.sprite_index);
		this.vars.setForce('visible', obj.visible);
		this.vars.setForce('solid', obj.solid);
		this.vars.setForce('depth', obj.depth);
		this.vars.setForce('persistent', obj.persistent);
		this.vars.setForce('mask_index', obj.mask);
		
		//
		this.vars.setForce('xprevious', x);
		this.vars.setForce('yprevious', y);
		this.vars.setForce('xstart', x);
		this.vars.setForce('ystart', y);

	}

}