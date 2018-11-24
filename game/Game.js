class Game {

	constructor (project, canvas, input, extensions) {

		//Store arguments
		this.project = project;
		this.canvas = canvas;
		this.input = input;
		this.extensions = extensions;

		this.gml = new GML();
		this.gml.game = this;

		this.ctx = this.canvas.getContext('2d');

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

		this.globalVariables = {
			room_width: null,
			room_height: null,
		}

		this.constants = {
			vk_right: 39,
			vk_left: 37,
			vk_down: 40,
			vk_up: 38,
		}

		//Promises to load before starting
		var promises = [];

		//Load sprites into this.images
		this.images = [];
		for (var i = 0; i < this.project.sprites.length; i++) {
			promises.push(new Promise((resolve, reject) => {

				//If there is a actual sprite, it loads it, otherwise promise is imediatelly resolved.
				if (this.project.sprites[i].sprite) {

					var img = new Image();
					img.addEventListener('load', () => {
						resolve();
					})
					img.src = URL.createObjectURL(this.project.sprites[i].sprite);
					this.images[this.project.sprites[i].id] = img;

				} else {
					resolve();
				}

			}));
		}

		//Prepare all GML codes

		this.project.objects.forEach((object) => {
			object.events.forEach((event) => {
				event.actions.forEach((action) => {
					if (action.type == 'execute_string') {
						action.arg0 = this.gml.prepare(action.arg0);
						if (!action.arg0.succeeded()) {
							console.log(action.arg0.message)
							throw "Some error was found in the GML!!!"
						}
					}
				})
			})
		})

		//Load first room
		this.instances = [];
		this.room = this.project.rooms[0];
		this.loadRoom(this.room);

		//Only start when all async processes finished.
		Promise.all(promises).then(() => {
			console.log('All async processes resolved. Starting game');
			this.timeout = setTimeout(() => this.mainLoop(), 1000 / this.room.roomSpeed);
		});

	}

	mainLoop () {

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
			var obj = this.project.objects[inst.object_index];

			// Draw events are executed every frame, if object is visible.
			var draw = obj.events.find((x) => x.type == 'draw');
			if (draw && inst.variables.visible) {
				this.doActions(draw.actions, inst);
			} else {
				// In case there's no draw event, draw the sprite of object, if there's one.
				if (inst.variables.sprite_index >= 0) {
					if (this.images[inst.variables.sprite_index]) {

						var sprite = this.project.sprites.find((x) => x.id = inst.variables.sprite_index);

						this.ctx.save();
						this.ctx.translate(-sprite.originx, -sprite.originy);
						this.ctx.drawImage(this.images[inst.variables.sprite_index], inst.variables.x, inst.variables.y);
						this.ctx.restore();

					}
				}
			}
		}

		// Loop though all current instances, in order of creation
		for (var i = 0; i < this.instances.length; i++) {

			var inst = this.instances[i];
			var obj = this.project.objects[inst.object_index];

			// Execute all events

			// Step events are executed every frame.
			var step = obj.events.find((x) => x.type == 'step');
			if (step) {
				this.doActions(step.actions, inst);
			}

			// Reset keyboard states
			this.keyPressed = {};
			this.keyReleased = {};

		}

		// Run main loop again, after a frame of time has passed.
		// This means the game will slow down if a loop takes too much time.
		// TODO: check if gm still runs fine if frame takes less than frame of time
		this.timeout = setTimeout(() => this.mainLoop(), 1000 / this.room.roomSpeed);
	}

	loadRoom(room) {

		//Empty room
		//TODO: save persistent?
		this.instances = [];

		this.globalVariables.room_width = room.width;
		this.globalVariables.room_height = room.height;

		var insts = room.instances;
		for (var i = 0; i < insts.length; i++) {
			this.instanceCreate(insts[i].x, insts[i].y, insts[i].object_index);
		}

	}

	doActions(actions, instance) {
		for (var k = 0; k < actions.length; k++) {
			this.doAction(actions[k], instance);
		}
	}

	doAction(action, instance) {

		var act = action;

		// Here's all the types of actions we can take. This probably should be separated into something else.
		// Currently I'm adding only drag and drop functions, but soon we will parse GML.
		// TODO: reorganize this in the way that the old Library Maker worked.

		switch (act.type) {
			case "execute_string":
				this.gml.execute(act.arg0, instance);
				break;
			case "show_message":
				alert(act.arg0);
				break;
			case "draw_set_color":
				this.ctx.fillStyle = act.arg0;
				break;
			case "draw_rectangle":
				this.ctx.fillRect(act.arg0, act.arg1, act.arg2 - act.arg0, act.arg3 - act.arg1);
				break;
			case "draw_text":
				this.ctx.fillText(act.arg2, (act.relative ? inst.variables.x : 0) + act.arg0, (act.relative ? inst.variables.y : 0) + act.arg1);
				break;
			case "action_move_to_position":
				inst.variables.x = (act.relative ? inst.variables.x : 0) + act.arg0;
				inst.variables.y = (act.relative ? inst.variables.y : 0) + act.arg1;
				break;
			case "ext":
				this.extensions[act.arg0]();
				break;
		}

	}

	instanceCreate (x, y, object) {

		// Adds instance into room.

		var instance = new Instance(x, y, object, this);
		this.instances.push(instance);

		var obj = this.project.objects[instance.object_index];
		var create = obj.events.find((x) => x.type == 'create');
		if (create) {
			this.doActions(create.actions, instance);
		}

		return instance.variables.id;
	}

	drawSprite(sprite_index, image_index, x, y) {

		if (sprite_index >= 0) {
			if (this.images[sprite_index]) {

				var sprite = this.project.sprites.find((x) => x.id = sprite_index);
				if (!sprite) {throw 'No such sprite with index '+sprite_index+'.';}

				this.ctx.save();
				this.ctx.translate(-sprite.originx, -sprite.originy);
				this.ctx.drawImage(this.images[sprite_index], x, y);
				this.ctx.restore();

			} else {
				alert('this should not happen')
			}
		} else {
			throw sprite_index+' can not be less than 0';
		}
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

		var obj = game.project.objects[this.object_index];

		this.events = [];
		this.variables = {
			id: 100001,
			x: x,
			y: y,
			sprite_index: obj.sprite_index,
			image_index: -1,
			visible: obj.visible,
			solid: obj.solid,
			depth: obj.depth,
			persistent: obj.persistent,
			parent: obj.parent,
			mask: obj.mask,
		};

	}

}