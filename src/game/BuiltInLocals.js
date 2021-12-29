export default class BuiltInLocals {

	// Game play / Moving around

	static x = {default: 0}
	static y = {default: 0}
	static xprevious = {default: 0}
	static yprevious = {default: 0}
	static xstart = {default: 0}
	static ystart = {default: 0}

	static hspeed = {default: 0, set (hspeed) {
		var vspeed = this.vars.get('vspeed');
		this.vars.setNoCall('speed', Math.hypot(hspeed, vspeed));
		this.vars.setNoCall('direction', Math.atan2(-vspeed, hspeed) * (180 / Math.PI));
		return hspeed;
	}}

	static vspeed = {default: 0, set (vspeed) {
		var hspeed = this.vars.get('hspeed');
		this.vars.setNoCall('speed', Math.hypot(hspeed, vspeed));
		this.vars.setNoCall('direction', Math.atan2(-vspeed, hspeed) * (180 / Math.PI));
		return vspeed;
	}}

	static direction = {default: 0, set (direction) {
		var dir = direction * (Math.PI / 180);
		this.vars.setNoCall('hspeed', Math.cos(dir) * this.vars.get('speed'));
		this.vars.setNoCall('vspeed', -Math.sin(dir) * this.vars.get('speed'));
		return direction;
	}}

	static speed = {default: 0, set (speed) {
		var dir = this.vars.get('direction') * (Math.PI / 180);
		this.vars.setNoCall('hspeed', Math.cos(dir) * speed);
		this.vars.setNoCall('vspeed', -Math.sin(dir) * speed);
		return speed;
	}}

	static friction = {default: 0}
	static gravity = {default: 0}
	static gravity_direction = {default: 270}

	// Game play / Paths

	static path_index = {default: -1, readOnly: true}
	static path_position = {default: 0}
	static path_positionprevious = {default: 0}
	static path_speed = {default: 0}
	static path_orientation = {default: 0}
	static path_scale = {default: 1}
	static path_endaction = {default: 0}

	// Game play / Instances

	static object_index = {default: -1, readOnly: true}
	static id = {default: -1, readOnly: true}
	static mask_index = {default: -1}
	static solid = {default: 0}
	static persistent = {default: 0}

	// Game play / Timing

	static alarm = {default: () => new Array(12).fill(-1)}

	static timeline_index = {default: -1}
	static timeline_loop = {default: 0}
	static timeline_position = {default: 0}
	static timeline_running = {default: 0}
	static timeline_speed = {default: 1}

	// Game Graphics / Sprites and Images

	static visible = {default: 1}

	static sprite_index = {default: -1, set (sprite_index) {
		var sprite = this.game.getResourceById('ProjectSprite', sprite_index);

		if (sprite) {
			var image = sprite.images[this.vars.get('image_index')];

			if (image) {
				this.vars.setForce('sprite_width', image.image.width);
				this.vars.setForce('sprite_height', image.image.height);
			} else {
				// no image index
			}
			this.vars.setForce('sprite_xoffset', sprite.originx);
			this.vars.setForce('sprite_yoffset', sprite.originy);
			this.vars.setForce('image_number', sprite.images.length);
			
		} else {
			// no sprite indexs
		}

	}}
	static sprite_width = {default: 0, readOnly: true}
	static sprite_height = {default: 0, readOnly: true}
	static sprite_xoffset = {default: 0, readOnly: true}
	static sprite_yoffset = {default: 0, readOnly: true}
	
	static image_number = {default: 0, readOnly: true}
	static image_index = {default: 0}
	static image_speed = {default: 1}

	static depth = {default: 0}

	static image_xscale = {default: 1}
	static image_yscale = {default: 1}
	static image_angle = {default: 0}
	static image_alpha = {default: 1}
	static image_blend = {default: 16777215}

	static bbox_left = {default: -100000, readOnly: true}
	static bbox_right = {default: -100000, readOnly: true}
	static bbox_top = {default: -100000, readOnly: true}
	static bbox_bottom = {default: -100000, readOnly: true}

	// Unknown
	
	static image_single = {default: -1, set(image_single) {
		this.vars.set('image_number', image_single);
		this.vars.set('image_speed', 0);
	}}

}
