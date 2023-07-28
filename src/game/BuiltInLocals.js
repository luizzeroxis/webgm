import {hexToDecimal, decimalToHex} from "~/common/tools.js";

export default class BuiltInLocals {
	// this = Instance

	// Game play / Moving around

	static x = {type: "real",
		get() { return this.x; },
		set(value) { this.x = value; },
	};

	static y = {type: "real",
		get() { return this.y; },
		set(value) { this.y = value; },
	};

	static xprevious = {type: "real",
		get() { return this.xPrevious; },
		set(value) { this.xPrevious = value; },
	};

	static yprevious = {type: "real",
		get() { return this.yPrevious; },
		set(value) { this.yPrevious = value; },
	};

	static xstart = {type: "real",
		get() { return this.xStart; },
		set(value) { this.xStart = value; },
	};

	static ystart = {type: "real",
		get() { return this.yStart; },
		set(value) { this.yStart = value; },
	};

	static hspeed = {type: "real",
		get() { return this.hSpeed; },
		set(value) {
			this.setHspeedAndVspeed(value, this.vSpeed);
		},
	};

	static vspeed = {type: "real",
		get() { return this.vSpeed; },
		set(value) {
			this.setHspeedAndVspeed(this.hSpeed, value);
		},
	};

	static direction = {type: "real",
		get() { return this.direction; },
		set(value) {
			this.setDirectionAndSpeed(value, this.speed);
		},
	};

	static speed = {type: "real",
		get() { return this.speed; },
		set(value) {
			this.setDirectionAndSpeed(this.direction, value);
		},
	};

	static friction = {type: "real",
		get() { return this.friction; },
		set(value) { this.friction = value; },
	};

	static gravity = {type: "real",
		get() { return this.gravity; },
		set(value) { this.gravity = value; },
	};

	static gravity_direction = {type: "real",
		get() { return this.gravityDirection; },
		set(value) { this.gravityDirection = value; },
	};

	// Game play / Paths

	static path_index = {readOnly: true,
		get() { return this.path?.id ?? -1; },
	};

	static path_position = {type: "unit",
		get() { return this.pathPosition; },
		set(value) { this.pathPosition = value; },
	};

	static path_positionprevious = {type: "unit",
		get() { return this.pathPreviousPosition; },
		set(value) { this.pathPreviousPosition = value; },
	};

	static path_speed = {type: "real",
		get() { return this.pathSpeed; },
		set(value) { this.pathSpeed = value; },
	};

	static path_orientation = {type: "real",
		get() { return this.pathOrientation; },
		set(value) { this.pathOrientation = value; },
	};

	static path_scale = {type: "real",
		get() { return this.pathScale; },
		set(value) { this.pathScale = value; },
	};

	static path_endaction = {type: "integer",
		get() { return this.pathEndAction; },
		set(value) { this.pathEndAction = value; },
	};

	// Game play / Instances

	static object_index = {readOnly: true,
		get() { return this.objectIndex; },
	};

	static id = {readOnly: true,
		get() { return this.id; },
	};

	static mask_index = {type: "integer",
		get() { return this.maskIndex; },
		set(value) { this.maskIndex = value; },
	};

	static solid = {type: "bool",
		get() { return this.solid ? 1 : 0; },
		set(value) { this.solid = value; },
	};

	static persistent = {type: "bool",
		get() { return this.persistent ? 1 : 0; },
		set(value) { this.persistent = value; },
	};

	// Game play / Timing

	static alarm = {type: "integer", dimensions: 1,
		length() { return 12; },
		get(index) { return this.alarms[index] ?? -1; },
		set(value, index) { this.alarms[index] = value; },
	};

	static timeline_index = {type: "integer",
		get() { return this.timelineIndex; },
		set(value) {
			this.timelineIndex = value;
			this.timeline = this.game.project.getResourceById("ProjectTimeline", value);
		},
	};

	static timeline_position = {type: "real",
		get() { return this.timelinePosition; },
		set(value) { this.timelinePosition = value; },
	};

	static timeline_speed = {type: "real",
		get() { return this.timelineSpeed; },
		set(value) { this.timelineSpeed = value; },
	};

	static timeline_running = {type: "bool",
		get() { return this.timelineRunning ? 1 : 0; },
		set(value) { this.timelineRunning = value; },
	};

	static timeline_loop = {type: "bool",
		get() { return this.timelineLoop ? 1 : 0; },
		set(value) { this.timelineLoop = value; },
	};


	// Game Graphics / Sprites and Images

	static visible = {type: "bool",
		get() { return this.visible ? 1 : 0; },
		set(value) { this.visible = value; },
	};

	static sprite_index = {type: "integer",
		get() { return this.spriteIndex; },
		set(value) {
			this.spriteIndex = value;
			this.sprite = this.game.project.getResourceById("ProjectSprite", value);
			this.imageIndex = 0;
		},
	};

	static sprite_width = {readOnly: true, get() {
		if (this.sprite == null) return 0;
		return this.getImage()?.width ?? 1;
	}};

	static sprite_height = {readOnly: true, get() {
		if (this.sprite == null) return 0;
		return this.getImage()?.height ?? 1;
	}};

	static sprite_xoffset = {readOnly: true, get() {
		if (this.sprite == null) return 0;
		return this.sprite.originx;
	}};

	static sprite_yoffset = {readOnly: true, get() {
		if (this.sprite == null) return 0;
		return this.sprite.originy;
	}};

	static image_number = {readOnly: true, get() {
		if (this.sprite == null) return 0;
		return this.sprite.images.length;
	}};

	static image_index = {type: "real",
		get() { return this.imageIndex; },
		set(value) { this.imageIndex = value; },
	};

	static image_speed = {type: "real",
		get() { return this.imageSpeed; },
		set(value) { this.imageSpeed = value; },
	};

	static depth = {type: "real",
		get() { return this.depth; },
		set(value) { this.depth = value; },
	};

	static image_xscale = {type: "real",
		get() { return this.imageXScale; },
		set(value) { this.imageXScale = value; },
	};

	static image_yscale = {type: "real",
		get() { return this.imageYScale; },
		set(value) { this.imageYScale = value; },
	};

	static image_angle = {type: "real",
		get() { return this.imageAngle; },
		set(value) { this.imageAngle = value; },
	};

	static image_alpha = {type: "real",
		get() { return this.imageAlpha; },
		set(value) { this.imageAlpha = value; },
	};

	static image_blend = {type: "integer",
		get() { return hexToDecimal(this.imageBlend); },
		set(value) { this.imageBlend = decimalToHex(value); },
	};

	static bbox_left = {readOnly: true, get() {
		if (this.sprite == null) return -100000;
		return (this.getBoundingBox().x1);
	}};

	static bbox_right = {readOnly: true, get() {
		if (this.sprite == null) return -100000;
		return (this.getBoundingBox().x2);
	}};

	static bbox_top = {readOnly: true, get() {
		if (this.sprite == null) return -100000;
		return (this.getBoundingBox().y1);
	}};

	static bbox_bottom = {readOnly: true, get() {
		if (this.sprite == null) return -100000;
		return (this.getBoundingBox().y2);
	}};

	// Unknown

	static image_single = {type: "real",
		get() { return this.imageIndex; },
		set(value) {
			this.imageIndex = value;
			this.imageSpeed = 0;
		},
	};
}