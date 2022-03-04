import {NonFatalErrorException} from '../common/Exceptions.js';

import BuiltInFunctions from './BuiltInFunctions.js';

export default class BuiltInGlobals {

	// GML Language Overview / Scripts

	static argument = {default: ()=>new Array(16).fill(0), set (value, previous, indexes) {
		while (indexes.length > 1 && indexes[0] == 0) {
			indexes.shift();
		}
		if (indexes.length != 1) return;

		this.globalVars.setBuiltIn('argument' + indexes[0].toString(), value);
	}};

	static argument0  = {default: 0, set (value) { this.globalVars.setBuiltInArray('argument', [0],  value) }};
	static argument1  = {default: 0, set (value) { this.globalVars.setBuiltInArray('argument', [1],  value) }};
	static argument2  = {default: 0, set (value) { this.globalVars.setBuiltInArray('argument', [2],  value) }};
	static argument3  = {default: 0, set (value) { this.globalVars.setBuiltInArray('argument', [3],  value) }};
	static argument4  = {default: 0, set (value) { this.globalVars.setBuiltInArray('argument', [4],  value) }};
	static argument5  = {default: 0, set (value) { this.globalVars.setBuiltInArray('argument', [5],  value) }};
	static argument6  = {default: 0, set (value) { this.globalVars.setBuiltInArray('argument', [6],  value) }};
	static argument7  = {default: 0, set (value) { this.globalVars.setBuiltInArray('argument', [7],  value) }};
	static argument8  = {default: 0, set (value) { this.globalVars.setBuiltInArray('argument', [8],  value) }};
	static argument9  = {default: 0, set (value) { this.globalVars.setBuiltInArray('argument', [9],  value) }};
	static argument10 = {default: 0, set (value) { this.globalVars.setBuiltInArray('argument', [10], value) }};
	static argument11 = {default: 0, set (value) { this.globalVars.setBuiltInArray('argument', [11], value) }};
	static argument12 = {default: 0, set (value) { this.globalVars.setBuiltInArray('argument', [12], value) }};
	static argument13 = {default: 0, set (value) { this.globalVars.setBuiltInArray('argument', [13], value) }};
	static argument14 = {default: 0, set (value) { this.globalVars.setBuiltInArray('argument', [14], value) }};
	static argument15 = {default: 0, set (value) { this.globalVars.setBuiltInArray('argument', [15], value) }};
	static argument_relative = {default: 0, readOnly: true};

	// Game play / Instances

	static instance_count = {readOnly: true, direct: true,
		directGet() {return this.instances.length},
	};
	static instance_id = {readOnly: true, direct: true, dimensions: 1,
		directLength() {return this.instances.length},
		directGet(index) {return this.instances[index].vars.getBuiltIn('id')},
	};

	// Game play / Timing

	static room_speed = {type: 'integer', default: 30, set (value) {
		if (value <= 0) {
			// TODO So, in GM you get 2 errors right after another. I have no idea how to replicate this.
			throw new NonFatalErrorException({
					type: 'trying_to_set_the_room_speed_to_a_value_less_or_equal_than_0',
					text: '\n___________________________________________\n'
						+ 'Trying to set the room speed to a value <= 0. (' + value.toString() + ')\n'
				},
			);
		}
	}};
	static fps = {default: 0, readOnly: true};
	static current_time = {default: 0, readOnly: true};
	static current_year = {default: 0, readOnly: true};
	static current_month = {default: 0, readOnly: true};
	static current_day = {default: 0, readOnly: true};
	static current_weekday = {default: 0, readOnly: true};
	static current_hour = {default: 0, readOnly: true};
	static current_minute = {default: 0, readOnly: true};
	static current_second = {default: 0, readOnly: true};

	// Game play / Rooms
	
	static room = {type: 'integer', default: 0, set (value) {
		BuiltInFunctions.room_goto.call(this.gml, [value]);
	}};
	static room_first = {default: 0, readOnly: true};
	static room_last = {default: 0, readOnly: true};
	static room_width = {default: 640, readOnly: true};
	static room_height = {default: 480, readOnly: true};
	static room_caption = {type: 'string', default: ""};
	static room_persistent = {type: 'bool', default: 0};
	static transition_kind = {type: 'integer', default: 0};
	static transition_steps = {type: 'integer', default: 80, set (value) {
		if (value < 1) {
			this.globalVars.vars.setBuiltIn('transition_steps', 1);
		}
	}};

	// Game play / Score

	static score = {type: 'integer', default: 0};
	static lives = {type: 'integer', default: -1, async set (value, previous, indexes) {
		if (value <= 0 && previous > 0) {
			var OTHER_NO_MORE_LIVES = 6;
			for (let instance of this.instances) {
				if (!instance.exists) continue;
				await this.doEvent(this.getEventOfInstance(instance, 'other', OTHER_NO_MORE_LIVES), instance);
			}
		}
	}};
	static health = {type: 'real', default: 100, async set (value, previous, indexes) {
		if (value <= 0 && previous > 0) {
			var OTHER_NO_MORE_HEALTH = 9;
			for (let instance of this.instances) {
				if (!instance.exists) continue;
				await this.doEvent(this.getEventOfInstance(instance, 'other', OTHER_NO_MORE_HEALTH), instance);
			}
		}
	}};
	static show_score = {type: 'bool', default: 1};
	static show_lives = {type: 'bool', default: 0};
	static show_health = {type: 'bool', default: 0};
	static caption_health = {type: 'string', default: "Health: "};
	static caption_lives = {type: 'string', default: "Lives: "};
	static caption_score = {type: 'string', default: "Score: "};

	// Game play / Generating events

	static event_type = {default: 11, readOnly: true};
	static event_number = {default: 0, readOnly: true};
	static event_object = {default: 0, readOnly: true};
	static event_action = {default: 0, readOnly: true};

	// Game play / Miscellaneous variables and functions

	static error_occurred = {type: 'bool', default: 0};
	static error_last = {type: 'string', default: ""};
	static debug_mode = {default: 0, readOnly: true};
	static gamemaker_pro = {default: 1, readOnly: true};
	static gamemaker_registered = {default: 1, readOnly: true};
	static gamemaker_version = {default: 800, readOnly: true};

	// User Interaction / The Keyboard

	static keyboard_lastkey = {type: 'integer', default: 0};
	static keyboard_key = {type: 'integer', default: 0};
	static keyboard_lastchar = {type: 'char', default: ""};
	static keyboard_string = {type: 'string', default: ""};

	// User Interaction / The Mouse

	static mouse_x = {default: 0, readOnly: true};
	static mouse_y = {default: 0, readOnly: true};
	static mouse_button = {type: 'integer', default: 0}; // TODO I think this is an enum
	static mouse_lastbutton = {type: 'integer', default: 0};
	static cursor_sprite = {type: 'integer', default: -1};

	// Game Graphics / Backgrounds

	static background_color = {type: 'integer', default: 12632256};
	static background_showcolor = {type: 'bool', default: 1};
	static background_visible = {type: 'bool', default: ()=>new Array(8).fill(0)};
	static background_foreground = {type: 'bool', default: ()=>new Array(8).fill(0)};
	static background_index = {type: 'integer', default: ()=>new Array(8).fill(-1)};
	static background_x = {type: 'real', default: ()=>new Array(8).fill(0)};
	static background_y = {type: 'real', default: ()=>new Array(8).fill(0)};
	static background_width = {default: ()=>new Array(8).fill(0), readOnly: true};
	static background_height = {default: ()=>new Array(8).fill(0), readOnly: true};
	static background_htiled = {type: 'bool', default: ()=>new Array(8).fill(1)};
	static background_vtiled = {type: 'bool', default: ()=>new Array(8).fill(1)};
	static background_xscale = {type: 'real', default: ()=>new Array(8).fill(1)};
	static background_yscale = {type: 'real', default: ()=>new Array(8).fill(1)};
	static background_hspeed = {type: 'real', default: ()=>new Array(8).fill(0)};
	static background_vspeed = {type: 'real', default: ()=>new Array(8).fill(0)};
	static background_blend = {type: 'integer', default: ()=>new Array(8).fill(16777215)};
	static background_alpha = {type: 'real', default: ()=>new Array(8).fill(1)}

	// Game Graphics / Views

	static view_enabled = {type: 'bool', default: 0};
	static view_current = {default: 0, readOnly: true};
	static view_visible = {type: 'bool', default: ()=>new Array(8).fill(0)};
	static view_xview = {type: 'integer', default: ()=>new Array(8).fill(0)};
	static view_yview = {type: 'integer', default: ()=>new Array(8).fill(0)};
	static view_wview = {type: 'integer', default: ()=>new Array(8).fill(640)};
	static view_hview = {type: 'integer', default: ()=>new Array(8).fill(480)};
	static view_xport = {type: 'integer', default: ()=>new Array(8).fill(0)};
	static view_yport = {type: 'integer', default: ()=>new Array(8).fill(0)};
	static view_wport = {type: 'integer', default: ()=>new Array(8).fill(640)};
	static view_hport = {type: 'integer', default: ()=>new Array(8).fill(480)};
	static view_angle = {type: 'real', default: ()=>new Array(8).fill(0)};
	static view_hborder = {type: 'integer', default: ()=>new Array(8).fill(32)};
	static view_vborder = {type: 'integer', default: ()=>new Array(8).fill(32)};
	static view_hspeed = {type: 'integer', default: ()=>new Array(8).fill(-1)};
	static view_vspeed = {type: 'integer', default: ()=>new Array(8).fill(-1)};
	static view_object = {type: 'integer', default: ()=>new Array(8).fill(-1)};

	// Files, registry, and executing programs / Files

	static game_id = {default: 0, readOnly: true};
	static working_directory = {default: "", readOnly: true};
	static program_directory = {default: "", readOnly: true};
	static temp_directory = {default: "", readOnly: true};

	// Files, registry, and executing programs / Executing programs

	static secure_mode = {default: 0, readOnly: true};
	
}