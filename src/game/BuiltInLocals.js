export default class BuiltInLocals {

	// Game play / Moving around

	static x = {type: 'real', default: 0, set (x) {
		updateBBox(this);
	}}
	static y = {type: 'real', default: 0, set (y) {
		updateBBox(this);
	}}
	static xprevious = {type: 'real', default: 0}
	static yprevious = {type: 'real', default: 0}
	static xstart = {type: 'real', default: 0}
	static ystart = {type: 'real', default: 0}

	static hspeed = {type: 'real', default: 0, set (hspeed) {
		var vspeed = this.vars.get('vspeed');
		this.vars.setNoCall('speed', Math.hypot(hspeed, vspeed));
		this.vars.setNoCall('direction', Math.atan2(-vspeed, hspeed) * (180 / Math.PI));
		return hspeed;
	}}

	static vspeed = {type: 'real', default: 0, set (vspeed) {
		var hspeed = this.vars.get('hspeed');
		this.vars.setNoCall('speed', Math.hypot(hspeed, vspeed));
		this.vars.setNoCall('direction', Math.atan2(-vspeed, hspeed) * (180 / Math.PI));
		return vspeed;
	}}

	static direction = {type: 'real', default: 0, set (direction) {
		var dir = direction * (Math.PI / 180);
		this.vars.setNoCall('hspeed', Math.cos(dir) * this.vars.get('speed'));
		this.vars.setNoCall('vspeed', -Math.sin(dir) * this.vars.get('speed'));
		return direction;
	}}

	static speed = {type: 'real', default: 0, set (speed) {
		var dir = this.vars.get('direction') * (Math.PI / 180);
		this.vars.setNoCall('hspeed', Math.cos(dir) * speed);
		this.vars.setNoCall('vspeed', -Math.sin(dir) * speed);
		return speed;
	}}

	static friction = {type: 'real', default: 0}
	static gravity = {type: 'real', default: 0}
	static gravity_direction = {type: 'real', default: 270}

	// Game play / Paths

	static path_index = {default: -1, readOnly: true}
	static path_position = {type: 'unit', default: 0}
	static path_positionprevious = {type: 'unit', default: 0}
	static path_speed = {type: 'real', default: 0}
	static path_orientation = {type: 'real', default: 0}
	static path_scale = {type: 'real', default: 1}
	static path_endaction = {type: 'integer', default: 0}

	// Game play / Instances

	static object_index = {default: -1, readOnly: true}
	static id = {default: -1, readOnly: true}
	static mask_index = {type: 'integer', default: -1}
	static solid = {type: 'bool', default: 0}
	static persistent = {type: 'bool', default: 0}

	// Game play / Timing

	static alarm = {type: 'integer', default: () => new Array(12).fill(-1)}

	static timeline_index = {type: 'integer', default: -1}
	static timeline_loop = {type: 'bool', default: 0}
	static timeline_position = {type: 'real', default: 0}
	static timeline_running = {type: 'bool', default: 0}
	static timeline_speed = {type: 'real', default: 1}

	// Game Graphics / Sprites and Images

	static visible = {type: 'bool', default: 1}

	static sprite_index = {type: 'integer', default: -1, set (sprite_index) {
		// Update sprite cache
		this.sprite = this.game.getResourceById('ProjectSprite', sprite_index);

		if (this.sprite) {
			var image = this.sprite.images[this.getImageIndex()];

			if (image) {
				this.vars.setForce('sprite_width', image.image.width);
				this.vars.setForce('sprite_height', image.image.height);

				var bbox_l = this.vars.get('x') - this.sprite.originx;
				var bbox_r = bbox_l + image.image.width;
				var bbox_t = this.vars.get('y') - this.sprite.originy;
				var bbox_b = bbox_t + image.image.height;

				this.vars.setForce('bbox_left', bbox_l);
				this.vars.setForce('bbox_right', bbox_r);
				this.vars.setForce('bbox_top', bbox_t);
				this.vars.setForce('bbox_bottom', bbox_b);

			} else {
				// no image index
				this.vars.setForce('sprite_width', 1);
				this.vars.setForce('sprite_height', 1);

				var x = this.vars.get('x');
				var y = this.vars.get('y');

				this.vars.setForce('bbox_left', x);
				this.vars.setForce('bbox_right', x);
				this.vars.setForce('bbox_top', y);
				this.vars.setForce('bbox_bottom', y);
			}
			this.vars.setForce('sprite_xoffset', this.sprite.originx);
			this.vars.setForce('sprite_yoffset', this.sprite.originy);
			this.vars.setForce('image_number', this.sprite.images.length);
			
		} else {
			// no sprite index
			this.vars.setForce('sprite_width', 0);
			this.vars.setForce('sprite_height', 0);
			this.vars.setForce('bbox_left', -100000);
			this.vars.setForce('bbox_right', -100000);
			this.vars.setForce('bbox_top', -100000);
			this.vars.setForce('bbox_bottom', -100000);
			this.vars.setForce('sprite_xoffset', 0);
			this.vars.setForce('sprite_yoffset', 0);
			this.vars.setForce('image_number', 0);
		}

	}}
	static sprite_width = {default: 0, readOnly: true}
	static sprite_height = {default: 0, readOnly: true}
	static sprite_xoffset = {default: 0, readOnly: true}
	static sprite_yoffset = {default: 0, readOnly: true}
	
	static image_number = {default: 0, readOnly: true}
	static image_index = {type: 'real', default: 0}
	static image_speed = {type: 'real', default: 1}

	static depth = {type: 'real', default: 0}

	static image_xscale = {type: 'real', default: 1}
	static image_yscale = {type: 'real', default: 1}
	static image_angle = {type: 'real', default: 0}
	static image_alpha = {type: 'real', default: 1}
	static image_blend = {type: 'integer', default: 16777215}

	static bbox_left = {default: -100000, readOnly: true}
	static bbox_right = {default: -100000, readOnly: true}
	static bbox_top = {default: -100000, readOnly: true}
	static bbox_bottom = {default: -100000, readOnly: true}

	// Unknown
	
	static image_single = {type: 'real', default: -1, set(image_single) {
		this.vars.set('image_number', image_single);
		this.vars.set('image_speed', 0);
	}}

}

function updateBBox(instance) {
	if (instance.sprite) {
		var image = instance.sprite.images[instance.getImageIndex()];

		if (image) {
			var bbox_l = instance.vars.get('x') - instance.sprite.originx;
			var bbox_r = bbox_l + image.image.width;
			var bbox_t = instance.vars.get('y') - instance.sprite.originy;
			var bbox_b = bbox_t + image.image.height;

			instance.vars.setForce('bbox_left', bbox_l);
			instance.vars.setForce('bbox_right', bbox_r);
			instance.vars.setForce('bbox_top', bbox_t);
			instance.vars.setForce('bbox_bottom', bbox_b);

		} else {
			// no image index
			var x = instance.vars.get('x');
			var y = instance.vars.get('y');

			instance.vars.setForce('bbox_left', x);
			instance.vars.setForce('bbox_right', x);
			instance.vars.setForce('bbox_top', y);
			instance.vars.setForce('bbox_bottom', y);
		}
		
	} else {
		// no sprite index
	}
}