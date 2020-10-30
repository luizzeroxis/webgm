class Game {

	constructor (project, canvas, input) {

		//Store arguments
		this.project = project;
		this.canvas = canvas;
		this.input = input;

		// Dispatcher
		this.dispatcher = new Dispatcher();

		// Init
		this.initRender();
		this.initInput();

		var promises = [];
		promises.push(this.loadSprites());
		// promises.push(this.loadBackgrounds());  // TODO
		// promises.push(this.loadSounds());  // TODO

		if (!this.initGML()) {
			return;
		}

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
			this.gameResume();
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

	initGML() {
		this.gml = new GML(this);

		this.preparedCodes = new Map();

		// Prepare script resource GML
		if (!this.project.resources.ProjectScript.every(script => {

			return this.prepareGML(script.code, script, matchResult => {
				this.throwCompilationErrorInScript(script, matchResult.message);
			});

		})) {
			return false;
		}

		// TODO prepare timeline resource GML

		// Prepare object resource GML
		if (!this.project.resources.ProjectObject.every(object => {
			return object.events.every(event => {
				return event.actions.every((action, actionNumber) => {

					if (action.typeKind == 'code') {
						
						return this.prepareGML(action.args[0], action, matchResult => {
							this.throwErrorInObject(object, event, actionNumber,
								`COMPILATION ERROR in code action:\n` + matchResult.message, true);
							console.log(matchResult);
						});

					} else if (action.typeKind == 'normal' && action.typeExecution == 'code') {

						return this.prepareGML(action.args[0], action, matchResult => {

							this.throwErrorInObject(object, event, actionNumber,
								`COMPILATION ERROR in code action:\n` + matchResult.message
								+ `\n(this was inside the action type in a library)`, true);

						});

					}

					return true;
				})
			})
		})) {
			return false;
		}

		return true;
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
		this.gameEnd();
		this.showErrorBox(`
___________________________________________
COMPILATION ERROR in Script: ` + script.name + `

` + message + `
`);
	}

	throwErrorInObject(object, event, actionNumber, message, isFatal=false) {
		this.gamePause();
		this.showErrorBox(`
___________________________________________
` + (isFatal ? "FATAL " : "") + `ERROR in
action number ` + actionNumber.toString() + `
of ` + Events.getEventName(event) + ` Event
for object ` + object.name + `:

` + message + `
`)
		if (isFatal) {
			this.gameEnd();
		} else {
			this.gameResume();
		}
	}

	throwErrorInCurrent(message, isFatal=false) {
		var object = this.getResourceById(this.currentInstance.object_index);
		return this.throwErrorInObject(object.name, this.currentEvent, this.currentActionNumber, message, isFatal);
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

		throw "exit";

	}

	loadFirstRoom() {
		this.room = this.project.resources.ProjectRoom[0];
		this.loadRoom(this.room);
	}

	gamePause() {
		clearTimeout(this.timeout);
		this.timeout = null;

		clearInterval(this.fpsTimeout);
		this.fpsTimeout = null;
	}

	gameResume() {
		if (this.timeout == null) {
			this.timeout = setTimeout(() => this.mainLoop(), 0);
		}

		if (this.fpsTimeout == null) {
			this.fpsTimeout = setInterval(() => this.updateFps(), 1000);
		}
	}

	gameEnd () {
		console.log('Stopping game.')

		this.gamePause();
		this.canvas.classList.remove("no-cursor");

		this.dispatcher.speak('gameEnd');
	}

	drawViews() {
		// Currently there are no views. But the following should happen for every view.

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
		this.getEventsOfTypeAndSubtype('step', 'begin').every(({event, instance}) => {
			return this.doEvent(event, instance);
		});

		// Alarm
		this.getEventsOfType('alarm').every(([subtype, list]) => {
			return list.every(({event, instance}) => {

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

			instance.variables.x += Math.cos(instance.variables.direction
				* this.constants.pi / 180) * instance.variables.speed;
			instance.variables.y -= Math.sin(instance.variables.direction
				* this.constants.pi / 180) * instance.variables.speed;

			instance.variables.speed -= instance.variables.friction;

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

		var actionIndex = 0;

		while (actionIndex < event.actions.length) {
			this.currentActionNumber = actionIndex + 1;

			var action = event.actions[actionIndex];
			var applyToInstances = this.getApplyToInstances(action.appliesTo);

			// normal, begin group, end group, else, exit, repeat, variable, code
			switch (action.typeKind) {
				case 'normal':
					// typeIsQuestion
					// appliesTo
					// relative
					// not

					var finalResult = false;

					// none, function, code
					switch (action.typeExecution) {
						case 'function':

							finalResult = true;

							applyToInstances.forEach(applyToInstance => {
								var result = this.gml.builtInFunction(action.typeExecutionFunction, action.args, applyToInstance, action.relative);
								if (typeof result !== "number" || result < 0.5) {
									finalResult = false;
								}
							});
							break;

						case 'code':

							finalResult = true;

							applyToInstances.forEach(applyToInstance => {
								var result = this.gml.execute(this.preparedCodes.get(action), applyToInstance);
								if (typeof result !== "number" || result < 0.5) {
									finalResult = false;
								}
							});
							break;
					}

					if (action.not) {
						finalResult = !finalResult;
					}

					if (action.typeIsQuestion) {
						if (finalResult) {
							//this.doIfTrue();
						} else {
							//this.doIfFalse();
						}
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

			actionIndex++;
		}

		return true;

	}

	showErrorBox(message) {
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
		this.game = game;

		this.variables = {};
		for (var name in BuiltInLocals) {
			if (typeof BuiltInLocals[name].default == "function") {
				this.variables[name] = BuiltInLocals[name].default.call(this);
			} else {
				this.variables[name] = BuiltInLocals[name].default || 0;
			}
		}

		// Id
		this.variables.id = 100001;

		// Inherited from object
		var obj = game.getResourceById('ProjectObject', this.object_index);
		
		this.variables.object_index = obj.id;
		this.variables.sprite_index = obj.sprite_index;
		this.variables.visible = obj.visible;
		this.variables.solid = obj.solid;
		this.variables.depth = obj.depth;
		this.variables.persistent = obj.persistent;
		this.variables.parent = obj.parent;
		this.variables.mask = obj.mask;

		// Set by constructor
		this.variables.x = x;
		this.variables.y = y;

	}

	getVar(name) {
		var variable = this.variables[name];
		if (variable == undefined) {
			return null; // variable doesn't exist
		} else {
			if (BuiltInLocals[name])
			if (BuiltInLocals[name].get) {
				return BuiltInLocals[name].get.call(this);
			}
			return variable.value;
		}
	}

	setVar(name, value) {
		var variable = this.variables[name];
		if (variable == undefined) {
			this.variables[name] = value;
		} else {
			if (BuiltInLocals[name]) {
				if (BuiltInLocals[name].readOnly) {
					return false; // variable is read only
				} else if (BuiltInLocals[name].set) {
					this.variables[name] = BuiltInLocals[name].set.call(this, value);
				}
			}
			this.variables[name] = value;
		}
		return true;
	}

}