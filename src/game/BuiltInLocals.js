export default class BuiltInLocals {
	// this = Instance

	// Game play / Moving around

	static x = {direct: true, type: "real",
		directGet() { return this.x; },
		directSet(value) { this.x = value; },
	};

	static y = {direct: true, type: "real",
		directGet() { return this.y; },
		directSet(value) { this.y = value; },
	};

	static xPrevious = {direct: true, type: "real",
		directGet() { return this.xPrevious; },
		directSet(value) { this.xPrevious = value; },
	};

	static yPrevious = {direct: true, type: "real",
		directGet() { return this.yPrevious; },
		directSet(value) { this.yPrevious = value; },
	};

	static xStart = {direct: true, type: "real",
		directGet() { return this.xStart; },
		directSet(value) { this.xStart = value; },
	};

	static yStart = {direct: true, type: "real",
		directGet() { return this.yStart; },
		directSet(value) { this.yStart = value; },
	};

	static hspeed = {direct: true, type: "real",
		directGet() { return this.hSpeed; },
		directSet(value) {
			this.setHspeedAndVspeed(value, this.vSpeed);
		},
	};

	static vspeed = {direct: true, type: "real",
		directGet() { return this.vSpeed; },
		directSet(value) {
			this.setHspeedAndVspeed(this.hSpeed, value);
		},
	};

	static direction = {direct: true, type: "real",
		directGet() { return this.direction; },
		directSet(value) {
			this.setDirectionAndSpeed(value, this.speed);
		},
	};

	static speed = {direct: true, type: "real",
		directGet() { return this.speed; },
		directSet(value) {
			this.setDirectionAndSpeed(this.direction, value);
		},
	};

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
		directGet() { return this.objectIndex; },
	};

	static id = {readOnly: true, direct: true,
		directGet() { return this.id; },
	};

	static mask_index = {direct: true, type: "integer",
		directGet() { return this.maskIndex; },
		directSet(value) { this.maskIndex = value; },
	};

	static solid = {direct: true, type: "bool",
		directGet() { return this.solid ? 1 : 0; },
		directSet(value) { this.solid = value; },
	};

	static persistent = {direct: true, type: "bool",
		directGet() { return this.persistent ? 1 : 0; },
		directSet(value) { this.persistent = value; },
	};

	// Game play / Timing

	static alarm = {direct: true, type: "integer", dimensions: 1,
		directLength() { return 12; },
		directGet(index) { return this.alarms[index] ?? -1; },
		directSet(value, index) { this.alarms[index] = value; },
	};

	static timeline_index = {type: "integer", default: -1};
	static timeline_loop = {type: "bool", default: 0};
	static timeline_position = {type: "real", default: 0};
	static timeline_running = {type: "bool", default: 0};
	static timeline_speed = {type: "real", default: 1};

	// Game Graphics / Sprites and Images

	static visible = {direct: true, type: "bool",
		directGet() { return this.visible ? 1 : 0; },
		directSet(value) { this.visible = value; },
	};

	static sprite_index = {direct: true, type: "integer",
		directGet() { return this.spriteIndex; },
		directSet(value) {
			this.spriteIndex = value;
			this.sprite = this.game.project.getResourceById("ProjectSprite", value);
			this.imageIndex = 0;
		},
	};

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

	static image_index = {direct: true, type: "real",
		directGet() { return this.imageIndex; },
		directSet(value) { this.imageIndex = value; },
	};

	static image_speed = {direct: true, type: "real",
		directGet() { return this.imageSpeed; },
		directSet(value) { this.imageSpeed = value; },
	};

	static depth = {direct: true, type: "real",
		directGet() { return this.depth; },
		directSet(value) { this.depth = value; },
	};

	static image_xscale = {type: "real", default: 1};
	static image_yscale = {type: "real", default: 1};
	static image_angle = {type: "real", default: 0};
	static image_alpha = {type: "real", default: 1};
	static image_blend = {type: "integer", default: 16777215};

	static bbox_left = {readOnly: true, direct: true, directGet() {
		if (this.sprite == null) return -100000;

		const image = this.sprite.images[this.getImageIndex()];
		return this.x + (image ? -this.sprite.originx : 0);
	}};

	static bbox_right = {readOnly: true, direct: true, directGet() {
		if (this.sprite == null) return -100000;

		const image = this.sprite.images[this.getImageIndex()];
		return this.x + (image ? (-this.sprite.originx + image.image.width) : 0);
	}};

	static bbox_top = {readOnly: true, direct: true, directGet() {
		if (this.sprite == null) return -100000;

		const image = this.sprite.images[this.getImageIndex()];
		return this.y + (image ? -this.sprite.originy : 0);
	}};

	static bbox_bottom = {readOnly: true, direct: true, directGet() {
		if (this.sprite == null) return -100000;

		const image = this.sprite.images[this.getImageIndex()];
		return this.y + (image ? (-this.sprite.originy + image.image.height) : 0);
	}};

	// Unknown

	static image_single = {direct: true, type: "real",
		directGet() { return this.imageIndex; },
		directSet(value) {
			this.imageIndex = value;
			this.imageSpeed = 0;
		},
	};
}