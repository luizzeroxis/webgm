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

		this.imageIndex = 0;
		this.imageSpeed = 1;
	}

	getImageIndex() {
		return Math.floor(this.imageIndex % (this.sprite ? this.sprite.images.length : 0));
	}

	setDirectionAndSpeed(direction, speed) {
		this.vars.setBuiltIn("direction", direction);
		this.vars.setBuiltIn("speed", speed);

		const direction_radians = direction * (Math.PI / 180);
		this.vars.setBuiltIn("hspeed", Math.cos(direction_radians) * speed);
		this.vars.setBuiltIn("vspeed", -Math.sin(direction_radians) * speed);
	}

	setHspeedAndVspeed(hspeed, vspeed) {
		this.vars.setBuiltIn("hspeed", hspeed);
		this.vars.setBuiltIn("vspeed", vspeed);

		this.vars.setBuiltIn("speed", Math.hypot(hspeed, vspeed));
		this.vars.setBuiltIn("direction", Math.atan2(-vspeed, hspeed) * (180 / Math.PI));
	}
}