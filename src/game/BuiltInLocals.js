export default class BuiltInLocals {
	// this = Instance

	// Game play / Moving around

	static x = {type: "real", default: 0};
	static y = {type: "real", default: 0};
	static xprevious = {type: "real", default: 0};
	static yprevious = {type: "real", default: 0};
	static xstart = {type: "real", default: 0};
	static ystart = {type: "real", default: 0};

	static hspeed = {type: "real", default: 0, set(hspeed) {
		const vspeed = this.vars.getBuiltIn("vspeed");
		this.vars.setBuiltIn("speed", Math.hypot(hspeed, vspeed));
		this.vars.setBuiltIn("direction", Math.atan2(-vspeed, hspeed) * (180 / Math.PI));
	}};

	static vspeed = {type: "real", default: 0, set(vspeed) {
		const hspeed = this.vars.getBuiltIn("hspeed");
		this.vars.setBuiltIn("speed", Math.hypot(hspeed, vspeed));
		this.vars.setBuiltIn("direction", Math.atan2(-vspeed, hspeed) * (180 / Math.PI));
	}};

	static direction = {type: "real", default: 0, set(direction) {
		const dir = direction * (Math.PI / 180);
		this.vars.setBuiltIn("hspeed", Math.cos(dir) * this.vars.getBuiltIn("speed"));
		this.vars.setBuiltIn("vspeed", -Math.sin(dir) * this.vars.getBuiltIn("speed"));
	}};

	static speed = {type: "real", default: 0, set(speed) {
		const dir = this.vars.getBuiltIn("direction") * (Math.PI / 180);
		this.vars.setBuiltIn("hspeed", Math.cos(dir) * speed);
		this.vars.setBuiltIn("vspeed", -Math.sin(dir) * speed);
	}};

	static friction = {type: "real", default: 0};
	static gravity = {type: "real", default: 0};
	static gravity_direction = {type: "real", default: 270};

	// Game play / Paths

	static path_index = {default: -1, readOnly: true};
	static path_position = {type: "unit", default: 0};
	static path_positionprevious = {type: "unit", default: 0};
	static path_speed = {type: "real", default: 0};
	static path_orientation = {type: "real", default: 0};
	static path_scale = {type: "real", default: 1};
	static path_endaction = {type: "integer", default: 0};

	// Game play / Instances

	static object_index = {readOnly: true, direct: true,
		directGet() { return this.object_index; },
	};

	static id = {readOnly: true, direct: true,
		directGet() { return this.id; },
	};

	static mask_index = {type: "integer", default: -1};
	static solid = {type: "bool", default: 0};
	static persistent = {type: "bool", default: 0};

	// Game play / Timing

	static alarm = {type: "integer", dimensions: 1, default: () => new Array(12).fill(-1)};

	static timeline_index = {type: "integer", default: -1};
	static timeline_loop = {type: "bool", default: 0};
	static timeline_position = {type: "real", default: 0};
	static timeline_running = {type: "bool", default: 0};
	static timeline_speed = {type: "real", default: 1};

	// Game Graphics / Sprites and Images

	static visible = {type: "bool", default: 1};

	static sprite_index = {type: "integer", default: -1, set(sprite_index) {
		// Update sprite cache
		this.sprite = this.game.getResourceById("ProjectSprite", sprite_index);
		this.vars.setBuiltIn("image_index", 0);
	}};

	static sprite_width = {readOnly: true, direct: true, directGet() {
		if (this.sprite == null) return 0;

		const image = this.sprite.images[this.getImageIndex()];
		return image ? image.image.width : 1;
	}};

	static sprite_height = {readOnly: true, direct: true, directGet() {
		if (this.sprite == null) return 0;

		const image = this.sprite.images[this.getImageIndex()];
		return image ? image.image.height : 1;
	}};

	static sprite_xoffset = {readOnly: true, direct: true, directGet() {
		if (this.sprite == null) return 0;
		return this.sprite.originx;
	}};

	static sprite_yoffset = {readOnly: true, direct: true, directGet() {
		if (this.sprite == null) return 0;
		return this.sprite.originy;
	}};

	static image_number = {readOnly: true, direct: true, directGet() {
		if (this.sprite == null) return 0;
		return this.sprite.images.length;
	}};

	static image_index = {type: "real", default: 0};
	static image_speed = {type: "real", default: 1};

	static depth = {type: "real", default: 0};

	static image_xscale = {type: "real", default: 1};
	static image_yscale = {type: "real", default: 1};
	static image_angle = {type: "real", default: 0};
	static image_alpha = {type: "real", default: 1};
	static image_blend = {type: "integer", default: 16777215};

	static bbox_left = {readOnly: true, direct: true, directGet() {
		if (this.sprite == null) return -100000;

		const image = this.sprite.images[this.getImageIndex()];
		return this.vars.getBuiltIn("x") + (image ? -this.sprite.originx : 0);
	}};

	static bbox_right = {readOnly: true, direct: true, directGet() {
		if (this.sprite == null) return -100000;

		const image = this.sprite.images[this.getImageIndex()];
		return this.vars.getBuiltIn("x") + (image ? -this.sprite.originx + image.image.width: 0);
	}};

	static bbox_top = {readOnly: true, direct: true, directGet() {
		if (this.sprite == null) return -100000;

		const image = this.sprite.images[this.getImageIndex()];
		return this.vars.getBuiltIn("y") + (image ? -this.sprite.originy : 0);
	}};

	static bbox_bottom = {readOnly: true, direct: true, directGet() {
		if (this.sprite == null) return -100000;

		const image = this.sprite.images[this.getImageIndex()];
		return this.vars.getBuiltIn("y") + (image ? -this.sprite.originy + image.image.height: 0);
	}};

	// Unknown

	static image_single = {type: "real", default: -1, set(image_single) {
		this.vars.setBuiltIn("image_index", image_single);
		this.vars.setBuiltIn("image_speed", 0);
	}};
}