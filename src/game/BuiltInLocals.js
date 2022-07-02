import {hexToDecimal, decimalToHex} from "../common/tools.js";

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

	static xprevious = {direct: true, type: "real",
		directGet() { return this.xPrevious; },
		directSet(value) { this.xPrevious = value; },
	};

	static yprevious = {direct: true, type: "real",
		directGet() { return this.yPrevious; },
		directSet(value) { this.yPrevious = value; },
	};

	static xstart = {direct: true, type: "real",
		directGet() { return this.xStart; },
		directSet(value) { this.xStart = value; },
	};

	static ystart = {direct: true, type: "real",
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

	static friction = {direct: true, type: "real",
		directGet() { return this.friction; },
		directSet(value) { this.friction = value; },
	};

	static gravity = {direct: true, type: "real",
		directGet() { return this.gravity; },
		directSet(value) { this.gravity = value; },
	};

	static gravity_direction = {direct: true, type: "real",
		directGet() { return this.gravityDirection; },
		directSet(value) { this.gravityDirection = value; },
	};

	// Game play / Paths

	static path_index = {readOnly: true, direct: true,
		directGet() { return this.path?.id; },
	};

	static path_position = {direct: true, type: "unit",
		directGet() { return this.pathPosition; },
		directSet(value) { this.pathPosition = value; },
	};

	static path_positionprevious = {direct: true, type: "unit",
		directGet() { return this.pathPreviousPosition; },
		directSet(value) { this.pathPreviousPosition = value; },
	};

	static path_speed = {direct: true, type: "real",
		directGet() { return this.pathSpeed; },
		directSet(value) { this.pathSpeed = value; },
	};

	static path_orientation = {direct: true, type: "real",
		directGet() { return this.pathOrientation; },
		directSet(value) { this.pathOrientation = value; },
	};

	static path_scale = {direct: true, type: "real",
		directGet() { return this.pathScale; },
		directSet(value) { this.pathScale = value; },
	};

	static path_endaction = {direct: true, type: "integer",
		directGet() { return this.pathEndAction; },
		directSet(value) { this.pathEndAction = value; },
	};

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

	static timeline_index = {direct: true, type: "integer",
		directGet() { return this.timelineIndex; },
		directSet(value) { this.timelineIndex = value; },
	};

	static timeline_position = {direct: true, type: "real",
		directGet() { return this.timelinePosition; },
		directSet(value) { this.timelinePosition = value; },
	};

	static timeline_speed = {direct: true, type: "real",
		directGet() { return this.timelineSpeed; },
		directSet(value) { this.timelineSpeed = value; },
	};

	static timeline_running = {direct: true, type: "bool",
		directGet() { return this.timelineRunning ? 1 : 0; },
		directSet(value) { this.timelineRunning = value; },
	};

	static timeline_loop = {direct: true, type: "bool",
		directGet() { return this.timelineLoop ? 1 : 0; },
		directSet(value) { this.timelineLoop = value; },
	};


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

	static image_xscale = {direct: true, type: "real",
		directGet() { return this.imageXScale; },
		directSet(value) { this.imageXScale = value; },
	};

	static image_yscale = {direct: true, type: "real",
		directGet() { return this.imageYScale; },
		directSet(value) { this.imageYScale = value; },
	};

	static image_angle = {direct: true, type: "real",
		directGet() { return this.imageAngle; },
		directSet(value) { this.imageAngle = value; },
	};

	static image_alpha = {direct: true, type: "real",
		directGet() { return this.imageAlpha; },
		directSet(value) { this.imageAlpha = value; },
	};

	static image_blend = {direct: true, type: "integer",
		directGet() { return hexToDecimal(this.imageBlend); },
		directSet(value) { this.imageBlend = decimalToHex(value); },
	};

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