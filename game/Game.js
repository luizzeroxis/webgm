class Game {

	constructor (project, canvas, input) {

		//Store arguments
		this.project = project;
		this.canvas = canvas;
		this.input = input;

		this.initRender();
		this.initInput();

		var promises = [];
		promises.push(this.loadSprites());
		// promises.push(this.loadBackgrounds());  // TODO
		// promises.push(this.loadSounds());  // TODO

		this.prepareGML();

		// Other things
		this.globalVariables = BuiltInGlobals.getList();
		this.constants = BuiltInConstants.getList();

		// Add resources names as global variables
		Project.getTypes().forEach(type => {
			this.project.resources[type.name].forEach(x => {this.globalVariables[x.name] = x.id});
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
		Promise.all(promises).then(() => {

			this.timeout = setTimeout(() => this.mainLoop(), 0);
			this.fpsTimeout = setInterval(() => this.updateFps(), 1000);

			console.log("Loaded.")

		});

	}

	initRender() {
		this.ctx = this.canvas.getContext('2d');
		this.ctx.imageSmoothingEnabled = false;

		if (!this.project.globalGameSettings.displayCursor) {
			this.canvas.classList.add("no-cursor");
		}
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

	loadSprites() {
		var promises = [];
		for (var i = 0; i < this.project.resources.ProjectSprite.length; i++) {
			for (var j = 0; j < this.project.resources.ProjectSprite[i].images.length; j++) {
				promises.push(this.project.resources.ProjectSprite[i].images[j].promise);
			}
		}
		return Promise.all(promises);
	}

	prepareGML() {
		this.gml = new GML();
		this.gml.game = this;

		this.preparedCodes = new Map();

		this.project.resources.ProjectScript.forEach(script => {
			var preparedCode = this.gml.prepare(script.code);
			if (preparedCode.succeeded()) {
				this.preparedCodes.set(script, preparedCode);
			} else {
				// console.log(preparedCode.message);
				this.throwFatalError("FATAL COMPILATION ERROR in script "+script.name+'\n'+preparedCode.message);
			}
		})

		// TODO prepare timeline codes

		this.project.resources.ProjectObject.forEach(object => {
			object.events.forEach(event => {
				event.actions.forEach((action, actionNumber) => {

					if (action.typeKind == 'code') {
						var preparedCode = this.gml.prepare(action.args[0]);

						if (preparedCode.succeeded()) {
							this.preparedCodes.set(action, preparedCode);
						} else {
							// console.log(preparedCode.message);
							this.throwFatalError("FATAL COMPILATION ERROR in action "+actionNumber.toString()+" in event "+event.getName()+" in object "+object.name+'\n'+preparedCode.message);
						}
					}

				})
			})
		});
	}

	loadFirstRoom() {
		this.room = this.project.resources.ProjectRoom[0];
		this.loadRoom(this.room);
	}

	drawViews() {
		// Currently there are no views.

		// Draw background color
		this.ctx.fillStyle = this.room.background_color;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		// this.ctx.fillStyle = "black";

		// TODO Draw background images
		// TODO Draw tiles

		// Draw instances

		var instances_by_depth = [...this.instances].sort(
			(a, b) => a.variables.depth - b.variables.depth
		);

		instances_by_depth.forEach(instance => {
			var object = this.getResourceById('ProjectObject', instance.object_index);

			// Only draw if visible
			if (instance.variables.visible) {
				var drawEvent = object.events.find(x => x.type == 'draw');

				if (drawEvent) {
					this.doEvent(drawEvent, instance);
				} else {
					// No draw event, draw sprite if it has one.
					var index = instance.variables.sprite_index;
					if (index >= 0) {
						var sprite = this.getResourceById('ProjectSprite', index);
						if (sprite) {
							var image = sprite.images[instance.variables.image_index];
							if (image) {
								this.ctx.save();
								this.ctx.translate(-sprite.originx, -sprite.originy);
								this.ctx.drawImage(image.image, instance.variables.x, instance.variables.y);
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
		this.globalVariables.fps = this.fps;

		// Begin step
		this.getEventsOfTypeAndSubtype('step', 'begin').some(({event, instance}) => {
			return this.doEvent(event, instance);
		});

		// Alarm
		this.getEventsOfType('alarm').some(([subtype, list]) => {
			return list.some(({event, instance}) => {

				// Update alarm (decrease by one) here, before running event
				// Alarm stays 0 until next alarm check, where it becomes -1 forever

				if (instance.variables.alarm[subtype] >= 0) {
					instance.variables.alarm[subtype] -= 1;
				}

				if (instance.variables.alarm[subtype] == 0) {
					return this.doEvent(event, instance);
				}

			});
		});

		// Keyboard
		this.getEventsOfType('keyboard').some(([subtype, list]) => {
			return list.some(({event, instance}) => {
				if (this.key[subtype]) {
					return this.doEvent(event, instance);
				}
			});
		});

		this.getEventsOfType('keypress').some(([subtype, list]) => {
			return list.some(({event, instance}) => {
				if (this.keyPressed[subtype]) {
					return this.doEvent(event, instance);
				}
			});
		});

		this.getEventsOfType('keyrelease').some(([subtype, list]) => {
			return list.some(({event, instance}) => {
				if (this.keyReleased[subtype]) {
					return this.doEvent(event, instance);
				}
			});
		});

		// Mouse
		// TODO

		// Step
		this.getEventsOfTypeAndSubtype('step', 'normal').some(({event, instance}) => {
			return this.doEvent(event, instance);
		});

		// Update instance variables and positions

		this.instances.forEach(instance => {

			instance.variables.x += Math.cos(instance.variables.direction
				* this.constants.pi / 180) * instance.variables.speed;
			instance.variables.y -= Math.sin(instance.variables.direction
				* this.constants.pi / 180) * instance.variables.speed;

			instance.variables.speed -= instance.variables.friction;

		});

		// Collisions
		this.getEventsOfType('collision').some(([subtype, list]) => {
			return list.some(({event, instance}) => {
				var others = this.instances.filter(x => x.object_index == subtype);
				others.some(other => {
					if (this.checkCollision(instance, other)) {
						this.doEvent(event, instance, other);
					}
				})
			});
		});

		// End step
		this.getEventsOfTypeAndSubtype('step', 'end').some(({event, instance}) => {
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
		this.timeoutStepMinTime = 1 / this.globalVariables.room_speed;
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

		var selfSprite = this.getResourceById('ProjectSprite', self.variables.sprite_index);
		var selfImage = selfSprite.images[self.variables.image_index];

		var otherSprite = this.getResourceById('ProjectSprite', other.variables.sprite_index);
		var otherImage = otherSprite.images[other.variables.image_index];

		// TODO collision masks, will assume rectangle now
		// selfSprite.boundingbox == 'fullimage';
		// selfSprite.shape = 'rectangle';

		var c = collision2Rectangles({
			x1: self.variables.x - selfSprite.originx,
			y1: self.variables.y - selfSprite.originy,
			x2: self.variables.x - selfSprite.originx + selfImage.image.width,
			y2: self.variables.y - selfSprite.originy + selfImage.image.height
		}, {
			x1: other.variables.x - otherSprite.originx,
			y1: other.variables.y - otherSprite.originy,
			x2: other.variables.x - otherSprite.originx + otherImage.image.width,
			y2: other.variables.y - otherSprite.originy + otherImage.image.height
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

		this.globalVariables.room_width = room.width;
		this.globalVariables.room_height = room.height;
		this.globalVariables.room_speed = room.speed;

		var insts = room.instances;
		for (var i = 0; i < insts.length; i++) {
			this.instanceCreate(insts[i].x, insts[i].y, insts[i].object_index);
		}

	}

	doEvent(event, instance, other=null) {
		this.currentEvent = event;
		this.currentInstance = instance;
		this.currentOther = other || instance;

		return event.actions.some((action, actionNumber) => {
			this.currentActionNumber = actionNumber;

			var applyToInstances;
			// -1 = self, -2 = other, 0>= = object index
			switch (action.appliesTo) {
				case -1:
					applyToInstances = [instance];
					break;
				case -2:
					applyToInstances = [other];
					break;
				default:
					applyToInstances = this.instances.filter(x => x.object_index == action.appliesTo);
					break;
			}

			// normal, begin group, end group, else, exit, repeat, variable, code
			switch (action.typeKind) {
				case 'normal':
					// typeIsQuestion
					// appliesTo
					// relative
					// not

					// none, function, code
					switch (action.typeExecution) {
						case 'function':
							// TODO get result for question
							applyToInstances.forEach(applyToInstance => {
								var result = this.gml.builtInFunction(action.typeExecutionFunction, action.args, applyToInstance, action.relative);
							});
							break;

						case 'code':
							break;
					}
					break;

				case 'begin group':
					break;
				case 'end group':
					break;
				case 'else':
					break;
				case 'exit':
					return true;
					break;
				case 'repeat':
					break;
				case 'variable':
					applyToInstances.forEach(applyToInstance => {
						var [varName, varValue] = action.args;
						this.evaluateExpression
						applyToInstance.variables[action.args[0]];
					});
					break;
				case 'code':
					applyToInstances.forEach(applyToInstance => {
						this.gml.execute(this.preparedCodes.get(action), applyToInstance);
					});
					break;
			}

			if (this.shouldEnd) {
				return true;
			}

		});
	}

	error(message, node) {

		console.log(node);

		var objectName = this.getResourceById('ProjectObject', this.currentInstance.object_index).name;

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

		this.showError(`
___________________________________________
ERROR in
action number ` + this.currentActionNumber + `
of ` + Events.getEventName(this.currentEvent) + ` Event
for object ` + objectName + `

Error in code at line ` + lineNumber + `:
` + gmlLine + `
` + arrowString + `
at position ` + position + `: ` + message + `
`);

	}

	throwFatalError(message) {
		this.showError(message);
		this.gameEnd();
		throw message;
	}

	showError(message) {
		alert(message);
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

		return instance.variables.id;
	}

	instanceDestroy (instance) {

		var index = this.instances.findIndex(x => x == instance);
		this.instances.splice(index, 1);

	}

	gameEnd () {

		console.log('Stopping game.')

		clearTimeout(this.timeout);
		clearInterval(this.fpsTimeout);

		this.canvas.classList.remove("no-cursor");

		delete this; //delet tis

		//TODO: add event system so that editor can know when game ends
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

class Instance {

	constructor (x, y, object, game) {

		this.object_index = object;

		var obj = game.getResourceById('ProjectObject', this.object_index);
		
		// BuiltInLocals

		this.variables = {
			// Id
			id: 100001,

			// Inherited from object
			object_index: obj.id,
			sprite_index: obj.sprite_index,
			visible: obj.visible,
			solid: obj.solid,
			depth: obj.depth,
			persistent: obj.persistent,
			parent: obj.parent,
			mask: obj.mask,

			// Set by constructor
			x: x,
			y: y,

			// All others
			alarm: new Array(12).fill(0),
			direction: 0,
			friction: 0,
			image_index: 0,
			speed: 0

		};

	}

	getLocalVariable(variableName) {
		var variable = this.variables[variableName];
		if (variable == undefined) {
			// variable not set
		} else if (variable.get) {
			return variable.get();
		} else {
			return variable.value;
		}
	}

	setLocalVariable(variableName, value) {
		var variable = this.variables[variableName];
		if (variable == undefined) {
			this.variables[variableName] = {value: value};
		} else {
			if (variable.readOnly) {
				// variable read only
				return;
			}
			if (variable.set) {
				return variable.set(value);
			} else {
				variable.value = value;
			}
		}

	}

}