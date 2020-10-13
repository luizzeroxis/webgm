class Game {

	constructor (project, canvas, input) {

		//Store arguments
		this.project = project;
		this.canvas = canvas;
		this.input = input;

		// Draws
		this.ctx = this.canvas.getContext('2d');
		this.ctx.imageSmoothingEnabled = false;

		// Input system
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

		// Execution system
		this.globalVariables = {
			argument: [],
			argument0: 0,
			argument1: 0,
			argument10: 0,
			argument11: 0,
			argument12: 0,
			argument13: 0,
			argument14: 0,
			argument15: 0,
			argument2: 0,
			argument3: 0,
			argument4: 0,
			argument5: 0,
			argument6: 0,
			argument7: 0,
			argument8: 0,
			argument9: 0,
			argument_relative: 0,
			background_alpha: 1,
			background_blend: 16777215,
			background_color: 12632256,
			background_foreground: 0,
			background_height: 0,
			background_hspeed: 0,
			background_htiled: 1,
			background_index: -1,
			background_showcolor: 1,
			background_visible: 0,
			background_vspeed: 0,
			background_vtiled: 1,
			background_width: 0,
			background_x: 0,
			background_xscale: 1,
			background_y: 0,
			background_yscale: 1,
			caption_health: "Health: ",
			caption_lives: "Lives: ",
			caption_score: "Score: ",
			current_day: 0,
			current_hour: 0,
			current_minute: 0,
			current_month: 0,
			current_second: 0,
			current_time: 0,
			current_weekday: 0,
			current_year: 0,
			cursor_sprite: -1,
			debug_mode: 0,
			error_last: "",
			error_occurred: 0,
			event_action: 0,
			event_number: 0,
			event_object: 0,
			event_type: 11,
			fps: 0,
			game_id: 0,
			gamemaker_pro: 1,
			gamemaker_registered: 1,
			gamemaker_version: 800,
			health: 100,
			instance_count: 1,
			instance_id: [],
			keyboard_key: 0,
			keyboard_lastchar: "",
			keyboard_lastkey: 0,
			keyboard_string: "",
			lives: -1,
			mouse_button: 0,
			mouse_lastbutton: 0,
			mouse_x: 0,
			mouse_y: 0,
			program_directory: "",
			room: 0,
			room_caption: "",
			room_first: 0,
			room_height: 480,
			room_last: 0,
			room_persistent: 0,
			room_speed: 30,
			room_width: 640,
			score: 0,
			secure_mode: 0,
			show_health: 0,
			show_lives: 0,
			show_score: 1,
			temp_directory: "",
			transition_kind: 0,
			transition_steps: 80,
			view_angle: [],
			view_current: 0,
			view_enabled: 0,
			view_hborder: [],
			view_hport: [],
			view_hspeed: [],
			view_hview: [],
			view_object: [],
			view_vborder: [],
			view_visible: [],
			view_vspeed: [],
			view_wport: [],
			view_wview: [],
			view_xport: [],
			view_xview: [],
			view_yport: [],
			view_yview: [],
			working_directory: "",
		}

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

		this.constants = BuiltInConstants.getList();

		// Loading system

		//Promises to load before starting
		var promises = [];

		// TODO maybe somehow find which things have to be loaded instead of checking each type

		//Check all sprite images are loaded
		for (var i = 0; i < this.project.resources.ProjectSprite.length; i++) {
			for (var j = 0; j < this.project.resources.ProjectSprite[i].images.length; j++) {
				promises.push(this.project.resources.ProjectSprite[i].images[j].promise);
			};
		}

		// TODO Check all backgrounds are loaded

		//Check all sounds are loaded
		// for (var i = 0; i < this.project.resources.ProjectSound.length; i++) {
		// 	promises.push(this.project.resources.ProjectSound[i].sound.promise);
		// }

		//Prepare all GML codes

		this.gml = new GML();
		this.gml.game = this;

		this.preparedCodes = new Map();

		this.project.resources.ProjectScript.forEach(script => {
			var preparedCode = this.gml.prepare(script.code);
			if (preparedCode.succeeded()) {
				this.preparedCodes.set(script, preparedCode);
			} else {
				console.log(preparedCode.message);
				this.showError("FATAL COMPILATION ERROR in script "+script.name+'\n'+preparedCode.message);
			}
		})

		// TODO prepare timeline codes

		this.project.resources.ProjectObject.forEach(object => {
			object.events.forEach(event => {
				event.actions.forEach(action => {

					if (action.type.kind == 'code') {
						var preparedCode = this.gml.prepare(action.args[0]);

						if (preparedCode.succeeded()) {
							this.preparedCodes.set(action, preparedCode);
						} else {
							console.log(preparedCode.message);
							this.showError("FATAL COMPILATION ERROR in action "+action.getName()+" in event "+event.getName()+" in object "+object.name+'\n'+preparedCode.message);
						}
					}

				})
			})
		});

		console.log(this.preparedCodes)

		//Load first room
		this.instances = [];
		this.room = this.project.resources.ProjectRoom[0];
		this.loadRoom(this.room);

		//Only start when all async processes finished.
		Promise.all(promises).then(() => {

			this.timeout = setTimeout(() => this.mainLoop(), 1000 / this.room.roomSpeed);
			this.timeoutPreviousTime = performance.now();

			console.log("Loaded.")

		});

	}

	mainLoop () {

		// Draw

		// First, draw the background of the room.

		this.ctx.fillStyle = this.room.background_color;
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
		this.ctx.fillStyle = "black";

		// Draw instances by depth.
		var instances_by_depth = [...this.instances].sort(
			(a, b) => a.depth - b.depth
		);

		for (var i = 0; i < instances_by_depth.length; i++) {

			var inst = instances_by_depth[i];
			var obj = this.project.resources.ProjectObject.find(x => x.id == inst.object_index);

			// Draw events are executed every frame, if object is visible.
			var draw = obj.events.find((x) => x.type == 'draw');
			if (draw) {
				if (inst.variables.visible) {
					this.doActions(draw.actions, inst);
				}
			} else {
				// In case there's no draw event, draw the sprite of object, if there's one.
				var index = inst.variables.sprite_index;
				if (index >= 0) {

					var sprite = this.project.resources.ProjectSprite.find(x => x.id == index);
					if (sprite) {
						var image = sprite.images[inst.variables.image_index];
						if (image) {
							this.ctx.save();
							this.ctx.translate(-sprite.originx, -sprite.originy);
							this.ctx.drawImage(image.image, inst.variables.x, inst.variables.y);
							this.ctx.restore();
						}
					} else {
						console.log('Project corruption: no such sprite of index' + index)
					}

				}
			}
		}

		// Get all events
		var eventsToRun = {};

		this.instances.forEach(instance => {
			 var object = this.project.resources.ProjectObject.find(x => x.id == instance.object_index);

			 object.events.forEach(event => {

			 	if (eventsToRun[event.type] == null) {
			 		eventsToRun[event.type] = {};
			 	}
			 	if (eventsToRun[event.type][event.subtype] == null) {
			 		eventsToRun[event.type][event.subtype] = [];
			 	}
			 	eventsToRun[event.type][event.subtype].push({event: event, instance: instance})

			 })
		})

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

		// Run all events, in order

		// Begin step
		if (eventsToRun['step'] && eventsToRun['step']['begin']) {
			eventsToRun['step']['begin'].some(event => {
				return this.doActions(event.event.actions, event.instance);
			})
		}

		// Alarms
		if (eventsToRun['alarm']) {
			Object.entries(eventsToRun['alarm']).some(([subtype, listevents]) => {
				return listevents.some(event => {

					// should i update alarm here? well yes, but actually no

					if (event.instance.variables.alarm[subtype] == 0) {
						return this.doActions(event.event.actions, event.instance);
					}
				})
			})
		}

		// Keyboard
		if (eventsToRun['keyboard']) {
			Object.entries(eventsToRun['keyboard']).some(([subtype, listevents]) => {
				return listevents.some(event => {
					if (this.key[subtype]) {
						return this.doActions(event.event.actions, event.instance);
					}
				})
			})
		}

		if (eventsToRun['keypress']) {
			Object.entries(eventsToRun['keypress']).some(([subtype, listevents]) => {
				return listevents.some(event => {
					if (this.keyPressed[subtype]) {
						return this.doActions(event.event.actions, event.instance);
					}
				})
			})
		}

		if (eventsToRun['keyrelease']) {
			Object.entries(eventsToRun['keyrelease']).some(([subtype, listevents]) => {
				return listevents.some(event => {
					if (this.keyReleased[subtype]) {
						return this.doActions(event.event.actions, event.instance);
					}
				})
			})
		}

		// Mouse
		// TODO

		// Step
		if (eventsToRun['step'] && eventsToRun['step']['normal']) {
			eventsToRun['step']['normal'].some(event => {
				return this.doActions(event.event.actions, event.instance);
			})
		}

		/* UPDATE INSTANCE POSITIONS */

		this.instances.forEach(instance => {
			
			// instance.variables.x += Math.cos(instance.variables.direction
			// 	* this.constants.pi / 180) * instance.variables.speed;
			// instance.variables.y += Math.sin(instance.variables.direction
			// 	* this.constants.pi / 180) * instance.variables.speed;

			instance.variables.speed -= instance.variables.friction;

		});

		// Collisions
		if (eventsToRun['collision']) {
			Object.entries(eventsToRun['collision']).some(([subtype, listevents]) => {
				return listevents.some(event => {

					// TODO this whole thing should probably be somewhere else

					var selfInstance = event.instance;

					var otherInstances = this.instances.filter(x => x.object_index == subtype);

					otherInstances.forEach(otherInstance => {
						// TODO masks

						var selfSprite  = this.project.resources.ProjectSprite
							.find(x => x.id == selfInstance.variables.sprite_index);
						var selfImage = selfSprite.images[selfInstance.variables.image_index];

						var otherSprite = this.project.resources.ProjectSprite
							.find(x => x.id == otherInstance.variables.sprite_index);
						var otherImage = otherSprite.images[otherInstance.variables.image_index];

						// TODO collision masks, will assume rectangle now
						// selfSprite.boundingbox == 'fullimage';
						// selfSprite.shape = 'rectangle';

						var c = collision2Rectangles({
							x1: selfInstance.variables.x - selfSprite.originx,
							y1: selfInstance.variables.y - selfSprite.originy,
							x2: selfInstance.variables.x - selfSprite.originx + selfImage.image.width,
							y2: selfInstance.variables.y - selfSprite.originy + selfImage.image.height
						}, {
							x1: otherInstance.variables.x - otherSprite.originx,
							y1: otherInstance.variables.y - otherSprite.originy,
							x2: otherInstance.variables.x - otherSprite.originx + otherImage.image.width,
							y2: otherInstance.variables.y - otherSprite.originy + otherImage.image.height
						})

						if (c) {
							return this.doActions(event.event.actions, event.instance);
						}

					})

				})
			})
		}

		// End step
		if (eventsToRun['step'] && eventsToRun['step']['end']) {
			eventsToRun['step']['end'].some(event => {
				return this.doActions(event.event.actions, event.instance);
			})
		}

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
		// TODO: check if gm still runs fine if frame takes less than frame of time
		// It seems like so

		var currentTime = performance.now()
		var deltaTime = currentTime - this.timeoutPreviousTime;
		var waitTime = Math.max(0, (1000 / this.globalVariables.room_speed) - deltaTime);
		this.timeoutPreviousTime = currentTime;

		this.timeout = setTimeout(() => this.mainLoop(), waitTime);
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

	doActions(actions, instance) {
		return actions.some(action => {

			this.doAction(action, instance);

			if (this.shouldEnd) {
				return true;
			}

		})
	}

	doAction(action, instance) {

		//var object = this.project.objects.find(x => x.id == instance.variables.object_index);

		switch (action.type.kind) {
			case 'code':
				this.gml.execute(this.preparedCodes.get(action), instance);
				break;
			default:
			//case 'gmfunction':
				//action.appliesTo
				//action.not
				this.gml.builtInFunction(action.type.gmfunction, action.args, instance, action.relative);
				break;
		}

	}

	throwError(message) {
		this.showError(message);
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

		var obj = this.project.resources.ProjectObject.find(x => x.id == instance.object_index);
		var create = obj.events.find((x) => x.type == 'create');
		if (create) {
			this.doActions(create.actions, instance);
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
		delete this; //delet tis

		//TODO: add event system so that editor can know when game ends
	}

}

class Instance {

	constructor (x, y, object, game) {

		this.object_index = object;

		var obj = game.project.resources.ProjectObject.find(x => x.id == this.object_index);

		this.variables = {
			id: 100001,
			//object_index: object,
			x: x,
			y: y,
			sprite_index: obj.sprite_index,
			image_index: 0,
			visible: obj.visible,
			solid: obj.solid,
			depth: obj.depth,
			persistent: obj.persistent,
			parent: obj.parent,
			mask: obj.mask,
			direction: 0,
			speed: 0
		};

	}

}