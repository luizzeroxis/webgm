class BuiltInLocals {

	// Set in instance at creation

	static id = {readOnly: true};
	static object_index = {readOnly: true};
	// static sprite_index = {};
	// static visible = {};
	// static solid = {};
	// static depth = {};
	// static persistent = {};
	// static parent = {};
	// static mask = {};
	// static x = {};
	// static y = {};

	//

	static alarm = {default: () => new Array(12).fill(0)};
	static image_index = {};
	static friction = {};

	static direction = {set: direction => {
		var dir = direction * this.game.constants.pi / 180;
		var speed = this.variables.speed;
		this.variables.hspeed = Math.cos(dir) * speed;
		this.variables.vspeed = Math.sin(dir) * speed;
		return direction;
	}};

	static speed = {set: speed => {
		var dir = this.variables.direction * this.game.constants.pi / 180;
		this.variables.hspeed = Math.cos(dir) * speed;
		this.variables.vspeed = Math.sin(dir) * speed;
		return speed;
	}};

	static hspeed = {set: hspeed => {
		var vspeed = this.variables.vspeed;
		this.variables.speed = Math.hypot(hspeed, vspeed);
		this.variables.direction = Math.atan2(vspeed, hspeed) * 180 / this.game.constants.pi;
		return hspeed;
	}};

	static vspeed = {set: vspeed => {
		var hspeed = this.variables.hspeed;
		this.variables.speed = Math.hypot(hspeed, vspeed);
		this.variables.direction = Math.atan2(vspeed, hspeed) * 180 / this.game.constants.pi;
		return vspeed;
	}};

/*	static getList() {
		return {
			// Id
			id: {
				readOnly: true,
			},

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
			image_index: 0,
			speed: 0
		};
	}*/
}