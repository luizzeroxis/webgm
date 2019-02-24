class Game {

	constructor (project, canvas, input) {

		//Store arguments
		this.project = project;
		this.canvas = canvas;
		this.input = input;

		// Draws
		this.ctx = this.canvas.getContext('2d');
		this.ctx.imageSmoothingEnabled = false;

		// Input system
		this.key = {};
		this.keyPressed = {};
		this.keyReleased = {};

		this.input.addEventListener('keydown', (e) => {
			this.key[e.which] = true;
			this.keyPressed[e.which] = true;
			e.preventDefault();
		});
		this.input.addEventListener('keyup', (e) => {
			this.key[e.which] = false;
			this.keyReleased[e.which] = true;
			e.preventDefault();
		})

		// Execution system
		this.globalVariables = {
			argument: [],
			argument0: 0,
			argument1: 0,
			argument10: 0,
			argument11: 0,
			argument12: 0,
			argument13: 0,
			argument14: 0,
			argument15: 0,
			argument2: 0,
			argument3: 0,
			argument4: 0,
			argument5: 0,
			argument6: 0,
			argument7: 0,
			argument8: 0,
			argument9: 0,
			argument_relative: 0,
			background_alpha: 1,
			background_blend: 16777215,
			background_color: 12632256,
			background_foreground: 0,
			background_height: 0,
			background_hspeed: 0,
			background_htiled: 1,
			background_index: -1,
			background_showcolor: 1,
			background_visible: 0,
			background_vspeed: 0,
			background_vtiled: 1,
			background_width: 0,
			background_x: 0,
			background_xscale: 1,
			background_y: 0,
			background_yscale: 1,
			caption_health: "Health: ",
			caption_lives: "Lives: ",
			caption_score: "Score: ",
			current_day: 0,
			current_hour: 0,
			current_minute: 0,
			current_month: 0,
			current_second: 0,
			current_time: 0,
			current_weekday: 0,
			current_year: 0,
			cursor_sprite: -1,
			debug_mode: 0,
			error_last: "",
			error_occurred: 0,
			event_action: 0,
			event_number: 0,
			event_object: 0,
			event_type: 11,
			fps: 0,
			game_id: 0,
			gamemaker_pro: 1,
			gamemaker_registered: 1,
			gamemaker_version: 800,
			health: 100,
			instance_count: 1,
			instance_id: [],
			keyboard_key: 0,
			keyboard_lastchar: "",
			keyboard_lastkey: 0,
			keyboard_string: "",
			lives: -1,
			mouse_button: 0,
			mouse_lastbutton: 0,
			mouse_x: 0,
			mouse_y: 0,
			program_directory: "",
			room: 0,
			room_caption: "",
			room_first: 0,
			room_height: 480,
			room_last: 0,
			room_persistent: 0,
			room_speed: 30,
			room_width: 640,
			score: 0,
			secure_mode: 0,
			show_health: 0,
			show_lives: 0,
			show_score: 1,
			temp_directory: "",
			transition_kind: 0,
			transition_steps: 80,
			view_angle: [],
			view_current: 0,
			view_enabled: 0,
			view_hborder: [],
			view_hport: [],
			view_hspeed: [],
			view_hview: [],
			view_object: [],
			view_vborder: [],
			view_visible: [],
			view_vspeed: [],
			view_wport: [],
			view_wview: [],
			view_xport: [],
			view_xview: [],
			view_yport: [],
			view_yview: [],
			working_directory: "",
		}

		// Add resources names as global variables
		this.project.resources.ProjectSprite .forEach(x => {this.globalVariables[x.name] = x.id});
		this.project.resources.ProjectSound  .forEach(x => {this.globalVariables[x.name] = x.id});
		this.project.resources.ProjectScript .forEach(x => {this.globalVariables[x.name] = x.id});
		this.project.resources.ProjectFont   .forEach(x => {this.globalVariables[x.name] = x.id});
		this.project.resources.ProjectObject .forEach(x => {this.globalVariables[x.name] = x.id});
		this.project.resources.ProjectRoom   .forEach(x => {this.globalVariables[x.name] = x.id});

		// Initialize game vars
		this.drawColor = 0;
		this.drawAlpha = 1;
		this.drawFont = -1;
		this.drawHAlign = 0;
		this.drawVAlign = 0;

		this.constants = {

			// Basic
			true: 1,
			false: 0,
			pi: 3.141592654,

			// Keyboard keys
			vk_nokey: 0,
			vk_anykey: 1,
			vk_backspace: 8,
			vk_tab: 9,
			vk_enter: 13,
			vk_return: 13,
			vk_shift: 16,
			vk_control: 17,
			vk_alt: 18,
			vk_pause: 19,
			vk_escape: 27,
			vk_space: 32,
			vk_pageup: 33,
			vk_pagedown: 34,
			vk_end: 35,
			vk_home: 36,
			vk_left: 37,
			vk_up: 38,
			vk_right: 39,
			vk_down: 40,
			vk_printscreen: 44,
			vk_insert: 45,
			vk_delete: 46,
			vk_numpad0: 96,
			vk_numpad1: 97,
			vk_numpad2: 98,
			vk_numpad3: 99,
			vk_numpad4: 100,
			vk_numpad5: 101,
			vk_numpad6: 102,
			vk_numpad7: 103,
			vk_numpad8: 104,
			vk_numpad9: 105,
			vk_multiply: 106,
			vk_add: 107,
			vk_subtract: 109,
			vk_decimal: 110,
			vk_divide: 111,
			vk_f1: 112,
			vk_f2: 113,
			vk_f3: 114,
			vk_f4: 115,
			vk_f5: 116,
			vk_f6: 117,
			vk_f7: 118,
			vk_f8: 119,
			vk_f9: 120,
			vk_f10: 121,
			vk_f11: 122,
			vk_f12: 123,
			vk_lshift: 160,
			vk_rshift: 161,
			vk_lcontrol: 162,
			vk_rcontrol: 163,
			vk_lalt: 164,
			vk_ralt: 165,

			// Mouse buttons
			mb_any: -1,
			mb_left: 1,
			mb_middle: 3,
			mb_none: 0,
			mb_right: 2,

			// Event constants
			ev_create: 0,
			ev_destroy: 1,
			ev_alarm: 2,
			ev_step: 3,
			ev_collision: 4,
			ev_keyboard: 5,
			ev_mouse: 6,
			ev_other: 7,
			ev_draw: 8,
			ev_keypress: 9,
			ev_keyrelease: 10,
			ev_trigger: 11,

			// Step event constants
			ev_step_normal: 0,
			ev_step_begin: 1,
			ev_step_end: 2,

			// Mouse event constants
			ev_left_button: 0,
			ev_right_button: 1,
			ev_middle_button: 2,
			ev_no_button: 3,
			ev_left_press: 4,
			ev_right_press: 5,
			ev_middle_press: 6,
			ev_left_release: 7,
			ev_right_release: 8,
			ev_middle_release: 9,
			ev_mouse_enter: 10,
			ev_mouse_leave: 11,
			ev_global_press: 12,
			ev_global_release: 13,
			ev_joystick1_left: 16,
			ev_joystick1_right: 17,
			ev_joystick1_up: 18,
			ev_joystick1_down: 19,
			ev_joystick1_button1: 21,
			ev_joystick1_button2: 22,
			ev_joystick1_button3: 23,
			ev_joystick1_button4: 24,
			ev_joystick1_button5: 25,
			ev_joystick1_button6: 26,
			ev_joystick1_button7: 27,
			ev_joystick1_button8: 28,
			ev_joystick2_left: 31,
			ev_joystick2_right: 32,
			ev_joystick2_up: 33,
			ev_joystick2_down: 34,
			ev_joystick2_button1: 36,
			ev_joystick2_button2: 37,
			ev_joystick2_button3: 38,
			ev_joystick2_button4: 39,
			ev_joystick2_button5: 40,
			ev_joystick2_button6: 41,
			ev_joystick2_button7: 42,
			ev_joystick2_button8: 43,
			ev_global_left_button: 50,
			ev_global_right_button: 51,
			ev_global_middle_button: 52,
			ev_global_left_press: 53,
			ev_global_right_press: 54,
			ev_global_middle_press: 55,
			ev_global_left_release: 56,
			ev_global_right_release: 57,
			ev_global_middle_release: 58,
			ev_mouse_wheel_up: 60,
			ev_mouse_wheel_down: 61,

			// Other event constants
			ev_outside: 0,
			ev_boundary: 1,
			ev_game_start: 2,
			ev_game_end: 3,
			ev_room_start: 4,
			ev_room_end: 5,
			ev_no_more_lives: 6,
			ev_animation_end: 7,
			ev_end_of_path: 8,
			ev_no_more_health: 9,
			ev_user0: 10,
			ev_user1: 11,
			ev_user2: 12,
			ev_user3: 13,
			ev_user4: 14,
			ev_user5: 15,
			ev_user6: 16,
			ev_user7: 17,
			ev_user8: 18,
			ev_user9: 19,
			ev_user10: 20,
			ev_user11: 21,
			ev_user12: 22,
			ev_user13: 23,
			ev_user14: 24,
			ev_user15: 25,
			ev_close_button: 30,

			// Blending modes
			bm_normal: 0,
			bm_add: 1,
			bm_subtract: 3,
			bm_max: 2,

			// Extended blending modes
			bm_zero: 1,
			bm_one: 2,
			bm_src_color: 3,
			bm_inv_src_color: 4,
			bm_src_alpha: 5,
			bm_inv_src_alpha: 6,
			bm_dest_alpha: 7,
			bm_inv_dest_alpha: 8,
			bm_dest_color: 9,
			bm_inv_dest_color: 10,
			bm_src_alpha_sat: 11,

			// Colors
			c_black: 0,
			c_maroon: 128,
			c_red: 255,
			c_green: 32768,
			c_olive: 32896,
			c_lime: 65280,
			c_yellow: 65535,
			c_dkgray: 4210752,
			c_orange: 4235519,
			c_navy: 8388608,
			c_purple: 8388736,
			c_teal: 8421376,
			c_gray: 8421504,
			c_ltgray: 12632256,
			c_silver: 12632256,
			c_blue: 16711680,
			c_fuchsia: 16711935,
			c_aqua: 16776960,
			c_white: 16777215,

			// Cursors
			cr_default: 0,
			cr_none: -1,
			cr_arrow: -2,
			cr_arrrow: -2, //WTF?
			cr_cross: -3,
			cr_beam: -4,
			cr_size_nesw: -6,
			cr_size_ns: -7,
			cr_size_nwse: -8,
			cr_size_we: -9,
			cr_uparrow: -10,
			cr_hourglass: -11,
			cr_drag: -12,
			cr_nodrop: -13,
			cr_hsplit: -14,
			cr_vsplit: -15,
			cr_multidrag: -16,
			cr_sqlwait: -17,
			cr_no: -18,
			cr_appstart: -19,
			cr_help: -20,
			cr_handpoint: -21,
			cr_size_all: -22,

			// DLL
			dll_cdecl: 0,
			dll_stdcall: 1,

			// Effects
			ef_explosion: 0,
			ef_ring: 1,
			ef_ellipse: 2,
			ef_firework: 3,
			ef_smoke: 4,
			ef_smokeup: 5,
			ef_star: 6,
			ef_spark: 7,
			ef_flare: 8,
			ef_cloud: 9,
			ef_rain: 10,
			ef_snow: 11,

			// File attributes
			fa_readonly: 1,
			fa_hidden: 2,
			fa_sysfile: 4,
			fa_volumeid: 8,
			fa_directory: 16,
			fa_archive: 32,

			// Font alignments
			fa_left: 0,
			fa_middle: 1,
			fa_right: 2,
			fa_top: 0,
			fa_center: 1,
			fa_bottom: 2,

			// Object categories
			self: -1,
			other: -2,
			all: -3,
			noone: -4,
			global: -5,
			local: -7,

			// Primitives
			pr_pointlist: 1,
			pr_linelist: 2,
			pr_linestrip: 3,
			pr_trianglelist: 4,
			pr_trianglestrip: 5,
			pr_trianglefan: 6,

			// Particle system
			ps_change_all: 0,
			ps_change_motion: 2,
			ps_change_shape: 1,
			ps_deflect_vertical: 0,
			ps_deflect_horizontal: 1,
			ps_distr_linear: 0,
			ps_distr_gaussian: 1,
			ps_distr_invgaussian: 2,
			ps_force_constant: 0,
			ps_force_linear: 1,
			ps_force_quadratic: 2,
			ps_shape_rectangle: 0,
			ps_shape_ellipse: 1,
			ps_shape_diamond: 2,
			ps_shape_line: 3,

			// Particle types
			pt_shape_pixel: 0,
			pt_shape_disk: 1,
			pt_shape_square: 2,
			pt_shape_line: 3,
			pt_shape_star: 4,
			pt_shape_circle: 5,
			pt_shape_ring: 6,
			pt_shape_sphere: 7,
			pt_shape_flare: 8,
			pt_shape_spark: 9,
			pt_shape_explosion: 10,
			pt_shape_cloud: 11,
			pt_shape_smoke: 12,
			pt_shape_snow: 13,

			// Sound effects
			se_none: 0,
			se_chorus: 1,
			se_echo: 2,
			se_flanger: 4,
			se_gargle: 8,
			se_reverb: 16,
			se_compressor: 32,
			se_equalizer: 64,

			// Types
			ty_real: 0,
			ty_string: 1,

		}

		// Loading system

		//Promises to load before starting
		var promises = [];

		//Check all sprite images are loaded
		for (var i = 0; i < this.project.resources.ProjectSprite.length; i++) {
			for (var j = 0; j < this.project.resources.ProjectSprite[i].images.length; j++) {
				promises.push(this.project.resources.ProjectSprite[i].images[j].promise);
			};
		}

		//Check all sounds are loaded
		for (var i = 0; i < this.project.resources.ProjectSound.length; i++) {
			promises.push(this.project.resources.ProjectSound[i].sound.promise);
		}

		//Prepare all GML codes

		this.gml = new GML();
		this.gml.game = this;

		this.preparedCodes = new Map();

		this.project.resources.ProjectScript.forEach(script => {
			var preparedCode = this.gml.prepare(script.code);
			if (preparedCode.succeeded()) {
				this.preparedCodes.set(script, preparedCode);
			} else {
				console.log(preparedCode.message);
				alert("FATAL ERROR in script "+script.name+'\n'+preparedCode.message);
			}
		})

		this.project.resources.ProjectObject.forEach(object => {
			object.events.forEach(event => {
				event.actions.forEach(action => {

					if (action.type.kind == 'code') {
						var preparedCode = this.gml.prepare(action.args[0]);

						if (preparedCode.succeeded()) {
							this.preparedCodes.set(action, preparedCode);
						} else {
							console.log(preparedCode.message);
							alert("FATAL ERROR in action "+action.getName()+" in event "+event.getName()+" in object "+object.name+'\n'+preparedCode.message);
						}
					}

				})
			})
		});

		console.log(this.preparedCodes)

		//Load first room
		this.instances = [];
		this.room = this.project.resources.ProjectRoom[0];
		this.loadRoom(this.room);

		//Only start when all async processes finished.
		Promise.all(promises).then(() => {

			this.timeout = setTimeout(() => this.mainLoop(), 1000 / this.room.roomSpeed);
			this.timeoutPreviousTime = performance.now();

		});

	}

	mainLoop () {

		// Draw

		// First, draw the background of the room.

		this.ctx.fillStyle = this.room.background_color;
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
		this.ctx.fillStyle = "black";

		// Draw instances by depth.
		var instances_by_depth = [...this.instances].sort(
			(a, b) => a.depth - b.depth
		);

		for (var i = 0; i < instances_by_depth.length; i++) {

			var inst = instances_by_depth[i];
			var obj = this.project.resources.ProjectObject[inst.object_index];

			// Draw events are executed every frame, if object is visible.
			var draw = obj.events.find((x) => x.type == 'draw');
			if (draw) {
				if (inst.variables.visible) {
					this.doActions(draw.actions, inst);
				}
			} else {
				// In case there's no draw event, draw the sprite of object, if there's one.
				if (inst.variables.sprite_index >= 0) {

					var sprite = this.project.resources.ProjectSprite.find((x) => x.id == inst.variables.sprite_index);
					if (sprite) {
						var image = sprite.images[inst.variables.image_index];
						if (image) {
							this.ctx.save();
							this.ctx.translate(-sprite.originx, -sprite.originy);
							this.ctx.drawImage(image.image, inst.variables.x, inst.variables.y);
							this.ctx.restore();
						}
					}

				}
			}
		}

		// Get all events
		var eventsToRun = {};

		this.instances.forEach(instance => {
			 var object = this.project.resources.ProjectObject.find(x => x.id == instance.variables.object_index);

			 object.events.forEach(event => {

			 	if (eventsToRun[event.type] == null) {
			 		eventsToRun[event.type] = {};
			 	}
			 	if (eventsToRun[event.type][event.subtype] == null) {
			 		eventsToRun[event.type][event.subtype] = [];
			 	}
			 	eventsToRun[event.type][event.subtype].push({event: event, instance: instance})

			 })
		})

		/*
Begin step events 
Alarm events 
Keyboard, Key press, and Key release events 
Mouse events 
Normal step events 
(now all instances are set to their new positions) 
Collision events 
End step events 
Draw events // LIE!!!!!!!!1111111

		*/

		// Run all events, in order

		// Begin step
		if (eventsToRun['step'] && eventsToRun['step']['begin']) {
			eventsToRun['step']['begin'].forEach(event => {
				this.doActions(event.event.actions, event.instance);
			})
		}

		// Alarms
		if (eventsToRun['alarm']) {
			Object.entries(eventsToRun['alarm']).forEach(([subtype, listevents]) => {
				listevents.forEach(event => {
					// TODO should i update alarm here?
					if (event.instance.variables.alarm[subtype] == 0) {
						this.doActions(event.event.actions, event.instance);
					}
				})
			})
		}

		// Keyboard
		if (eventsToRun['keyboard']) {
			Object.entries(eventsToRun['keyboard']).forEach(([subtype, listevents]) => {
				listevents.forEach(event => {
					if (this.key[subtype]) {
						this.doActions(event.event.actions, event.instance);
					}
				})
			})
		}

		if (eventsToRun['keypress']) {
			Object.entries(eventsToRun['keypress']).forEach(([subtype, listevents]) => {
				listevents.forEach(event => {
					if (this.keyPressed[subtype]) {
						this.doActions(event.event.actions, event.instance);
					}
				})
			})
		}

		if (eventsToRun['keyrelease']) {
			Object.entries(eventsToRun['keyrelease']).forEach(([subtype, listevents]) => {
				listevents.forEach(event => {
					if (this.keyReleased[subtype]) {
						this.doActions(event.event.actions, event.instance);
					}
				})
			})
		}

		// Mouse
		// TODO

		// Step
		if (eventsToRun['step'] && eventsToRun['step']['normal']) {
			eventsToRun['step']['normal'].forEach(event => {
				this.doActions(event.event.actions, event.instance);
			})
		}

		/* UPDATE INSTANCE POSITIONS */

		// Collisions
		// TODO

		// End step
		if (eventsToRun['step'] && eventsToRun['step']['end']) {
			eventsToRun['step']['end'].forEach(event => {
				this.doActions(event.event.actions, event.instance);
			})
		}

		// Reset keyboard states
		this.keyPressed = {};
		this.keyReleased = {};

		// Run main loop again, after a frame of time has passed.
		// This means the game will slow down if a loop takes too much time.
		// TODO: check if gm still runs fine if frame takes less than frame of time
		// It seems like so

		var currentTime = performance.now()
		var deltaTime = currentTime - this.timeoutPreviousTime;
		var waitTime = Math.max(0, (1000 / this.globalVariables.room_speed) - deltaTime);
		this.timeoutPreviousTime = currentTime;

		this.timeout = setTimeout(() => this.mainLoop(), waitTime);
	}
 
	loadRoom(room) {

		//Empty room
		//TODO: save persistent?
		this.instances = [];

		this.canvas.width = room.width;
		this.canvas.height = room.height;

		this.globalVariables.room_width = room.width;
		this.globalVariables.room_height = room.height;
		this.globalVariables.room_speed = room.speed;

		var insts = room.instances;
		for (var i = 0; i < insts.length; i++) {
			this.instanceCreate(insts[i].x, insts[i].y, insts[i].object_index);
		}

	}

	doActions(actions, instance) {
		for (var k = 0; k < actions.length; k++) {
			this.doAction(actions[k], instance);
		}
	}

	doAction(action, instance) {

		//var object = this.project.objects.find(x => x.id == instance.variables.object_index);

		switch (action.type.kind) {
			case 'code':
				this.gml.execute(this.preparedCodes.get(action), instance);
				break;
			default:
			//case 'gmfunction':
				//action.appliesTo
				//action.not
				console.log(action);
				this.gml.builtInFunction(action.type.gmfunction, action.args, instance, action.relative);
				break;
		}

	}

	instanceCreate (x, y, object) {

		// Adds instance into room.

		var instance = new Instance(x, y, object, this);
		this.instances.push(instance);

		var obj = this.project.resources.ProjectObject.find(x => x.id == instance.object_index);
		var create = obj.events.find((x) => x.type == 'create');
		if (create) {
			this.doActions(create.actions, instance);
		}

		return instance.variables.id;
	}

	gameEnd () {

		console.log('Stopping game.')

		clearTimeout(this.timeout);
		delete this; //delet tis

		//TODO: add event system so that editor can know when game ends
	}

}

class Instance {

	constructor (x, y, object, game) {

		this.object_index = object;

		var obj = game.project.resources.ProjectObject[this.object_index];

		this.variables = {
			id: 100001,
			object_index: object,
			x: x,
			y: y,
			sprite_index: obj.sprite_index,
			image_index: 0,
			visible: obj.visible,
			solid: obj.solid,
			depth: obj.depth,
			persistent: obj.persistent,
			parent: obj.parent,
			mask: obj.mask,
		};

	}

}