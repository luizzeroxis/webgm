export default class BuiltInLocals {

	// Set in instance at creation

	static id = {readOnly: true};
	static object_index = {readOnly: true};
	static sprite_index = {default: -1};
	static visible = {};
	static solid = {};
	static depth = {};
	static persistent = {};
	static parent = {default: -1};
	static mask = {default: -1};
	static x = {};
	static y = {};

	//

	static alarm = {default: () => new Array(12).fill(0)};
	static image_index = {};
	static friction = {};

	static direction = {set (direction) {
		var dir = direction * this.game.constants.pi / 180;
		this.vars.setNoCall('hspeed', Math.cos(dir) * this.vars.get('speed'));
		this.vars.setNoCall('vspeed', Math.sin(dir) * this.vars.get('speed'));
		return direction;
	}};

	static speed = {set (speed) {
		var dir = this.vars.get('direction') * this.game.constants.pi / 180;
		this.vars.setNoCall('hspeed', Math.cos(dir) * speed);
		this.vars.setNoCall('vspeed', Math.sin(dir) * speed);
		return speed;
	}};

	static hspeed = {set (hspeed) {
		var vspeed = this.vars.get('vspeed');
		this.vars.setNoCall('speed', Math.hypot(hspeed, vspeed));
		this.vars.setNoCall('direction', Math.atan2(vspeed, hspeed) * 180 / this.game.constants.pi);
		return hspeed;
	}};

	static vspeed = {set (vspeed) {
		var hspeed = this.vars.get('hspeed');
		this.vars.setNoCall('speed', Math.hypot(hspeed, vspeed));
		this.vars.setNoCall('direction', Math.atan2(vspeed, hspeed) * 180 / this.game.constants.pi);
		return vspeed;
	}};

}