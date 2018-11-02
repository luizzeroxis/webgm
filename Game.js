class Game {

	constructor (project, canvas, input, extensions) {

		this.project = project;
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');

		this.instances = [];

		var promises = [];

		//load sprites

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
					this.images.push(img);

				} else {
					resolve();
				}

			}));
		}

		//load room
		this.room = this.project.rooms[0];
		var insts = this.room.instances;

		for (var i = 0; i < insts.length; i++) {
			this.instanceCreate(insts[i].x, insts[i].y, insts[i].object_index);
		}

		//actually start

		this.extensions = extensions;

		Promise.all(promises).then(() => {
			console.log('all promises resolved.');
			this.timeout = setTimeout(() => this.mainLoop(), this.room.roomSpeed);
		});

	}

	mainLoop () {

		//console.log(this);

		// first, draw the background of the room.

		this.ctx.fillStyle = this.room.background_color;
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
		this.ctx.fillStyle = "black";

		for (var i = 0; i < this.instances.length; i++) {

			// loop though all instances

			// look at events, actions, ...

			var inst = this.instances[i];
			var obj = this.project.objects[inst.object_index];

			var step = obj.events.find((x) => x.type == 'step');
			if (step) {
				doActions(step.actions);
			}

			var draw = obj.events.find((x) => x.type == 'draw');
			if (draw) {
				doActions(draw.actions);
			} else {
				//var spr = this.project.sprites.find((x) => x.id==obj.sprite_index).sprite;
				if (obj.sprite_index >= 0) {
					this.ctx.drawImage(this.images[obj.sprite_index], inst.x, inst.y);
				}
			}

		}

		//yEs
		this.timeout = setTimeout(() => this.mainLoop(), this.room.roomSpeed);
	}

	doActions(actions) {
		for (var k = 0; k < actions.length; k++) {

			var act = actions[k];
			//console.log(act);
			switch (act.type) {
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
					this.ctx.fillText(act.arg2, (act.relative ? inst.x : 0) + act.arg0, (act.relative ? inst.y : 0) + act.arg1);
					break;
				case "action_move_to_position":
					inst.x = (act.relative ? inst.x : 0) + act.arg0;
					inst.y = (act.relative ? inst.y : 0) + act.arg1;
					break;
				case "ext":
					this.extensions[act.arg0]();
					break;
			}

		}
	}

	instanceCreate (x, y, object) {
		var instance = new Instance(x, y, object, this);
		this.instances.push(instance);

		var obj = this.project.objects[instance.object_index];
		var create = obj.events.find((x) => x.type == 'create');
		if (create) {
			doActions(create.actions);
		}

		return instance;
	}

	gameEnd () {
		clearTimeout(this.timeout);
		delete this; //delet tis

		//TODO: add event system so that editor can know when game ends
		//wait i did that wtf?
	}

}