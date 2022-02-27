import VariableHolder from '../common/VariableHolder.js';

import BuiltInLocals from './BuiltInLocals.js';

export default class Instance {

	constructor (id, x, y, object_index, game) {

		this.object_index = object_index;
		this.game = game;

		this.exists = true;

		this.vars = new VariableHolder(this, BuiltInLocals);

		// Id
		this.vars.setBuiltIn('id', id);

		// Set by constructor
		this.vars.setBuiltIn('x', x);
		this.vars.setBuiltIn('y', y);
		
		// Caching of data
		this.object = game.getResourceById('ProjectObject', this.object_index);
		// this.sprite = game.getResourceById('ProjectSprite', this.object.sprite_index); // already called when setting sprite_index
		
		// Inherited from object
		this.vars.setBuiltIn('object_index', this.object.id);
		this.vars.setBuiltInCall('sprite_index', this.object.sprite_index);
		this.vars.setBuiltIn('visible', this.object.visible ? 1 : 0);
		this.vars.setBuiltIn('solid', this.object.solid ? 1 : 0);
		this.vars.setBuiltIn('depth', this.object.depth);
		this.vars.setBuiltIn('persistent', this.object.persistent ? 1 : 0);
		this.vars.setBuiltIn('mask_index', this.object.mask);

		// Started up variables
		this.vars.setBuiltIn('xprevious', x);
		this.vars.setBuiltIn('yprevious', y);
		this.vars.setBuiltIn('xstart', x);
		this.vars.setBuiltIn('ystart', y);

		this.updateBBox();

	}

	getImageIndex() {
		return Math.floor(this.vars.getBuiltIn('image_index') % this.vars.getBuiltIn('image_number'));
	}

	setDirectionAndSpeed(direction, speed) {
		this.vars.setBuiltIn('direction', direction);
		this.vars.setBuiltIn('speed', speed);

		var direction_radians = direction * (Math.PI / 180);
		this.vars.setBuiltIn('hspeed', Math.cos(direction_radians) * speed);
		this.vars.setBuiltIn('vspeed', -Math.sin(direction_radians) * speed);
	}

	setHspeedAndVspeed(hspeed, vspeed) {
		this.vars.setBuiltIn('hspeed', hspeed);
		this.vars.setBuiltIn('vspeed', vspeed);

		this.vars.setBuiltIn('speed', Math.hypot(hspeed, vspeed));
		this.vars.setBuiltIn('direction', Math.atan2(-vspeed, hspeed) * (180 / Math.PI));
	}

	updateBBox() {
		if (this.sprite) {
			var image = this.sprite.images[this.getImageIndex()];

			if (image) {
				var bbox_l = this.vars.getBuiltIn('x') - this.sprite.originx;
				var bbox_r = bbox_l + image.image.width;
				var bbox_t = this.vars.getBuiltIn('y') - this.sprite.originy;
				var bbox_b = bbox_t + image.image.height;

				this.vars.setBuiltIn('bbox_left', bbox_l);
				this.vars.setBuiltIn('bbox_right', bbox_r);
				this.vars.setBuiltIn('bbox_top', bbox_t);
				this.vars.setBuiltIn('bbox_bottom', bbox_b);

			} else {
				// no image index
				var x = this.vars.getBuiltIn('x');
				var y = this.vars.getBuiltIn('y');

				this.vars.setBuiltIn('bbox_left', x);
				this.vars.setBuiltIn('bbox_right', x);
				this.vars.setBuiltIn('bbox_top', y);
				this.vars.setBuiltIn('bbox_bottom', y);
			}
			
		} else {
			// no sprite index
		}
	}

}