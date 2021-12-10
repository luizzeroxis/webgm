import Dispatcher from '../common/Dispatcher.js'

import {EngineException, CompilationException, FatalErrorException, NonFatalErrorException, ExitException} from '../common/Exceptions.js';

import {Project} from '../common/Project.js';

import VariableHolder from '../common/VariableHolder.js';
import Events from '../common/Events.js';

import GML from './GML.js';
import ActionsParser from './ActionsParser.js';
import BuiltInLocals from './BuiltInLocals.js';
import BuiltInGlobals from './BuiltInGlobals.js';
import BuiltInConstants from './BuiltInConstants.js';

import {collision2Rectangles} from '../common/tools.js';

export class Game {

	constructor (project, canvas, input) {

		//Store arguments
		this.project = project;
		this.canvas = canvas;
		this.input = input;

		// Dispatcher
		this.dispatcher = new Dispatcher();

	}

	init() {
		try {
			this.initNoCatch();
		} catch (e) {
			this.dealWithException(e);
		}
	}

	dealWithException(e) {
		if (e instanceof EngineException) {
			this.close(e);
		} else if (e instanceof CompilationException || e instanceof FatalErrorException) {
			this.close();
		} else {
			throw e;
		}
	}

	initNoCatch() {

		// Init
		this.initRender();
		this.initInput();

		var promises = [];
		promises.push(this.loadSprites());
		// promises.push(this.loadBackgrounds());  // TODO
		// promises.push(this.loadSounds());  // TODO

		this.initGML();

		// Other things
		this.globalVars = new VariableHolder(this, BuiltInGlobals)
		this.constants = BuiltInConstants.getList();

		// Add resources names as global variables
		Project.getTypes().forEach(type => {
			this.project.resources[type.getClassName()].forEach(x => {this.globalVars.set(x.name, x.id)});
		})

		// Initialize game vars
		this.drawColor = 0;
		this.drawAlpha = 1;
		this.drawFont = -1;
		this.drawHAlign = 0;
		this.drawVAlign = 0;
		this.shouldDestroyInstances = [];
		this.instances = [];
		this.fps = 0;
		this.fpsFrameCount = 0;

		//Load first room
		this.loadFirstRoom();

		//Only start when all async processes finished.
		this.promise = Promise.all(promises).then(() => {
			console.log("Loaded.")
			this.initTimeout();
		}).catch(e => {
			this.dealWithException(e);
		});

	}

	close(e) {
		console.log('Closing game.');

		this.closeRender();
		this.closeInput();

		this.closeTimeout();

		this.dispatcher.speak('close', e);
	}

	initRender() {
		this.ctx = this.canvas.getContext('2d');
		this.ctx.imageSmoothingEnabled = false;

		if (!this.project.globalGameSettings.displayCursor) {
			this.canvas.classList.add("no-cursor");
		}
	}

	closeRender() {
		this.canvas.classList.remove("no-cursor");
	}

	initInput() {
		this.key = {};
		this.keyPressed = {};
		this.keyReleased = {};

		this.input.addEventListener('keydown', (e) => {
			this.key[e.which] = true;
			this.keyPressed[e.which] = true;
			e.preventDefault();
		});
		this.input.addEventListener('keyup', (e) => {
			this.key[e.which] = false;
			this.keyReleased[e.which] = true;
			e.preventDefault();
		})
	}

	closeInput() {
		// remove event listeners?
	}

	loadSprites() {
		var promises = [];
		this.project.resources.ProjectSprite.forEach(sprite => {
			sprite.images.forEach((image, imageNumber) => {
				promises.push(image.promise.catch(e => {
					throw new EngineException("Could not load image " + imageNumber.toString() + " in sprite " + sprite.name);
				}));
			})
		})
		return Promise.all(promises);
	}

	initGML() {
		this.gml = new GML(this);

		this.preparedCodes = new Map();

		// Prepare script resource GML
		this.project.resources.ProjectScript.every(script => {

			return this.prepareGML(script.code, script, matchResult => {
				this.throwCompilationErrorInScript(script, matchResult.message);
			});

		})

		// TODO prepare timeline resource GML

		// Prepare object resource GML
		this.project.resources.ProjectObject.every(object => {
			return object.events.every(event => {
				return event.actions.every((action, actionNumber) => {

					if (action.typeKind == 'code') {
						
						return this.prepareGML(action.args[0].value, action, matchResult => {
							this.throwErrorInObject(object, event, actionNumber,
								`COMPILATION ERROR in code action:\n` + matchResult.message, true);
							console.log(matchResult);
						});

					} else if (action.typeKind == 'normal' && action.typeExecution == 'code') {

						return this.prepareGML(action.args[0].value, action, matchResult => {

							this.throwErrorInObject(object, event, actionNumber,
								`COMPILATION ERROR in code action:\n` + matchResult.message
								+ `\n(this was inside the action type in a library)`, true);

						});

					}

					return true;
				})
			})
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

	throwCompilationErrorInScript(script, message) {
		// TODO make the message more like the one from GM
		this.showErrorBox(`
___________________________________________
COMPILATION ERROR in Script: ` + script.name + `

` + message + `
`);

		throw new CompilationException();
	}

	throwErrorInObject(object, event, actionNumber, message, isFatal=false) {
		this.showErrorBox(`
___________________________________________
` + (isFatal ? "FATAL " : "") + `ERROR in
action number ` + actionNumber.toString() + `
of ` + Events.getEventName(event) + ` Event
for object ` + object.name + `:

` + message + `
`)

		if (isFatal) {
			throw new FatalErrorException();
		} else {
			throw new NonFatalErrorException();
		}
	}

	throwErrorInCurrent(message, isFatal=false) {
		var object = this.getResourceById(this.currentInstance.object_index);
		this.throwErrorInObject(object.name, this.currentEvent, this.currentActionNumber, message, isFatal);
	}

	throwErrorInGMLNode(message, node, isFatal=false) {

		console.log(node);

		var index = node.source.startIdx;
		var lines = node.source.sourceString.split('\n');
		var totalLength = 0;

		for (var i = 0; i < lines.length; ++i) {
			var lineLength = lines[i].length + 1;
			totalLength += lineLength;
			if (totalLength >= index) {

				var lineNumber = i + 1;
				var gmlLine = lines[i];
				var position = (index - (totalLength - lineLength)) + 1;
				var arrowString = " ".repeat(position-1) + "^";

				break;
			}
		}

		this.throwErrorInCurrent(
`Error in code at line ` + lineNumber + `:
` + gmlLine + `
` + arrowString + `
at position ` + position + `: ` + message + `
`, isFatal);

	}

	loadFirstRoom() {
		this.room = this.project.resources.ProjectRoom[0];
		this.loadRoom(this.room);
	}

	closeTimeout() {
		clearTimeout(this.timeout);
		this.timeout = null;

		clearInterval(this.fpsTimeout);
		this.fpsTimeout = null;
	}

	initTimeout() {
		if (this.timeout == null) {
			this.timeout = setTimeout(() => this.mainLoop(), 0);
		}

		if (this.fpsTimeout == null) {
			this.fpsTimeout = setInterval(() => this.updateFps(), 1000);
		}
	}

	gameEnd () {
		console.log('Stopping game.')

		this.closeTimeout();
		this.canvas.classList.remove("no-cursor");

		this.dispatcher.speak('gameEnd');
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
				var drawEvent = object.events.find(x => x.type == 'draw');

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

	mainLoop () {

		this.timeoutStepStart = performance.now() / 1000;
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
		this.getEventsOfTypeAndSubtype('step', 'begin').every(({event, instance}) => {
			return this.doEvent(event, instance);
		});

		// Alarm
		this.getEventsOfType('alarm').every(([subtype, list]) => {
			return list.every(({event, instance}) => {

				// Update alarm (decrease by one) here, before running event
				// Alarm stays 0 until next alarm check, where it becomes -1 forever

				if (instance.vars.get('alarm', [subtype]) >= 0) {
					instance.vars.setAdd('alarm', -1, [subtype]);
				}

				if (instance.vars.get('alarm', [subtype]) == 0) {
					return this.doEvent(event, instance);
				}

			});
		});

		// Keyboard
		this.getEventsOfType('keyboard').every(([subtype, list]) => {
			return list.every(({event, instance}) => {
				if (this.key[subtype]) {
					return this.doEvent(event, instance);
				}
			});
		});

		this.getEventsOfType('keypress').every(([subtype, list]) => {
			return list.every(({event, instance}) => {
				if (this.keyPressed[subtype]) {
					return this.doEvent(event, instance);
				}
			});
		});

		this.getEventsOfType('keyrelease').every(([subtype, list]) => {
			return list.every(({event, instance}) => {
				if (this.keyReleased[subtype]) {
					return this.doEvent(event, instance);
				}
			});
		});

		// Mouse
		// TODO

		// Step
		this.getEventsOfTypeAndSubtype('step', 'normal').every(({event, instance}) => {
			return this.doEvent(event, instance);
		});

		// Update instance variables and positions

		this.instances.forEach(instance => {

			instance.vars.setAdd('x', Math.cos(instance.vars.get('direction')
				* this.constants.pi / 180) * instance.vars.get('speed'));
			instance.vars.setAdd('y', - Math.sin(instance.vars.get('direction')
				* this.constants.pi / 180) * instance.vars.get('speed'));

			instance.vars.setAdd('speed', - instance.vars.get('friction'));

		});

		// Collisions
		this.getEventsOfType('collision').every(([subtype, list]) => {
			return list.every(({event, instance}) => {
				var others = this.instances.filter(x => x.object_index == subtype);
				others.every(other => {
					if (this.checkCollision(instance, other)) {
						this.doEvent(event, instance, other);
					}
				})
			});
		});

		// End step
		this.getEventsOfTypeAndSubtype('step', 'end').every(({event, instance}) => {
			return this.doEvent(event, instance);
		});

		// Reset keyboard states
		this.keyPressed = {};
		this.keyReleased = {};

		// Delete instances
		this.shouldDestroyInstances.forEach(x => {
			this.instanceDestroy(x);
		})
		this.shouldDestroyInstances = [];

		// Run main loop again, after a frame of time has passed.
		// This means the game will slow down if a loop takes too much time.

		this.timeoutStepEnd = performance.now() / 1000;
		this.timeoutStepTime = this.timeoutStepEnd - this.timeoutStepStart;
		this.timeoutStepMinTime = 1 / this.globalVars.get('room_speed');
		this.timeoutWaitTime = Math.max(0, this.timeoutStepMinTime - this.timeoutStepTime);
		this.timeout = setTimeout(() => this.mainLoop(), this.timeoutWaitTime * 1000);

		this.timeoutTotalStepTime = this.timeoutStepTime + this.timeoutWaitTime;

		// console.log("------");
		// console.log("StepTime", this.timeoutStepTime);
		// console.log("StepMinTime", this.timeoutStepMinTime);
		// console.log("WaitTime", this.timeoutWaitTime);
		// console.log("TotalStepTime", this.timeoutTotalStepTime);
		// console.log(1/this.timeoutTotalStepTime, "fps");

	}

	checkCollision(self, other) {

		// TODO masks

		var selfSprite = this.getResourceById('ProjectSprite', self.vars.get('sprite_index'));
		var selfImage = selfSprite.images[self.vars.get('image_index')];

		var otherSprite = this.getResourceById('ProjectSprite', other.vars.get('sprite_index'));
		var otherImage = otherSprite.images[other.vars.get('image_index')];

		// TODO collision masks, will assume rectangle now
		// selfSprite.boundingbox == 'fullimage';
		// selfSprite.shape = 'rectangle';

		var c = collision2Rectangles({
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

	updateFps() {
		this.fps = this.fpsFrameCount;
		this.fpsFrameCount = 0;
	}
 
	loadRoom(room) {

		//Empty room
		//TODO: keep persistent objects
		//TODO: save current room if it's persistent
		this.instances = [];

		this.canvas.width = room.width;
		this.canvas.height = room.height;

		this.globalVars.setForce('room_width', room.width);
		this.globalVars.setForce('room_height', room.height);
		this.globalVars.setForce('room_speed', room.speed);

		var insts = room.instances;
		for (var i = 0; i < insts.length; i++) {
			this.instanceCreate(insts[i].x, insts[i].y, insts[i].object_index);
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

	doEvent(event, instance, other=null) {
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
				} else {
					throw e;
				}
			}
			return true;
		})

	}

	doTreeAction(treeAction) {

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
							currentResult = this.gml.builtInFunction(treeAction.function, args, applyToInstance, treeAction.relative);
						} else {
							// TODO send arguments and argument_relative
							currentResult = this.gml.execute(this.preparedCodes.get(treeAction.action), applyToInstance);
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

	showErrorBox(message) {
		this.closeTimeout();
		alert(message);
		this.initTimeout();
	}

	instanceCreate (x, y, object) {

		// Adds instance into room.

		var instance = new Instance(x, y, object, this);
		this.instances.push(instance);

		var obj = this.getResourceById('ProjectObject', instance.object_index)
		var create = obj.events.find((x) => x.type == 'create');
		if (create) {
			this.doEvent(create, instance);
		}

		return instance.vars.get('id');
	}

	instanceDestroy (instance) {

		var index = this.instances.findIndex(x => x == instance);
		this.instances.splice(index, 1);

	}

	getResourceById(type, id) {
		return this.project.resources[type].find(x => x.id == id);
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

}

export class Instance {

	constructor (x, y, object_index, game) {

		this.object_index = object_index;
		this.game = game;

		this.vars = new VariableHolder(this, BuiltInLocals);

		// Id
		this.vars.setForce('id', 100001);
		
		// Inherited from object
		var obj = game.getResourceById('ProjectObject', this.object_index);

		this.vars.setForce('object_index', obj.id);
		this.vars.setForce('sprite_index', obj.sprite_index);
		this.vars.setForce('visible', obj.visible);
		this.vars.setForce('solid', obj.solid);
		this.vars.setForce('depth', obj.depth);
		this.vars.setForce('persistent', obj.persistent);
		this.vars.setForce('parent', obj.parent);
		this.vars.setForce('mask', obj.mask);

		// Set by constructor
		this.vars.setForce('x', x);
		this.vars.setForce('y', y);

	}

}