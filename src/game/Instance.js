import VariableHolder from "../common/VariableHolder.js";

import BuiltInLocals from "./BuiltInLocals.js";

export default class Instance {
	constructor(id, x, y, objectIndex, game) {
		// Arguments
		this.id = id;
		this.x = x;
		this.y = y;
		this.objectIndex = objectIndex;
		this.game = game;

		this.object = game.project.getResourceById("ProjectObject", this.objectIndex);

		// Inherited from object
		this.spriteIndex = this.object.sprite_index;
		this.visible = this.object.visible;
		this.solid = this.object.solid;
		this.depth = this.object.depth;
		this.persistent = this.object.persistent;
		this.maskIndex = this.object.mask_index;

		// Internal
		this.exists = true;
		this.vars = new VariableHolder(this, BuiltInLocals);
		this.sprite = this.game.project.getResourceById("ProjectSprite", this.spriteIndex);

		// Variables
		this.xPrevious = x;
		this.yPrevious = y;
		this.xStart = x;
		this.yStart = y;

		this.hSpeed = 0;
		this.vSpeed = 0;
		this.direction = 0;
		this.speed = 0;
		this.friction = 0;

		this.gravity = 0;
		this.gravityDirection = 270;

		this.path = null;
		this.pathPosition = 0;
		this.pathPreviousPosition = 0;
		this.pathSpeed = 0;
		this.pathOrientation = 0;
		this.pathScale = 1;
		this.pathEndAction = 0;

		this.alarms = [];

		this.timelineIndex = -1;
		this.timelinePosition = 0;
		this.timelineSpeed = 1;
		this.timelineRunning = false;
		this.timelineLoop = false;

		this.imageIndex = 0;
		this.imageSpeed = 1;
		this.imageXScale = 1;
		this.imageYScale = 1;
		this.imageAngle = 0;
		this.imageAlpha = 1;
		this.imageBlend = "#ffffff";
	}

	getImage() {
		return this.sprite?.images[Math.floor(this.imageIndex % this.sprite.images.length)]?.image;
	}

	getImageIndex() {
		if (this.sprite == null || this.sprite.images.length == 0) return null;
		return Math.floor(this.imageIndex % this.sprite.images.length);
	}

	setHspeedAndVspeed(hspeed, vspeed) {
		this.hSpeed = hspeed;
		this.vSpeed = vspeed;

		this.speed = Math.hypot(hspeed, vspeed);
		this.direction = Math.atan2(-vspeed, hspeed) * (180 / Math.PI);
	}

	setDirectionAndSpeed(direction, speed) {
		this.direction = direction;
		this.speed = speed;

		const directionRadians = direction * (Math.PI / 180);
		this.hSpeed = Math.cos(directionRadians) * speed;
		this.vSpeed = -Math.sin(directionRadians) * speed;
	}
}