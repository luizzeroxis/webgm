export default class BuiltInGlobals {

	// GML Language Overview / Scripts

	static argument = {default: ()=>new Array(16).fill(0), set (value, indexes) {
		var index = indexes.at(-1) || 0;
		this.globalVars.setNoCall('argument' + index.toString(), value);
	}};
	static argument0 = {default: 0, set (value) { this.globalVars.setNoCall('argument', value, [0]) }};
	static argument1 = {default: 0, set (value) { this.globalVars.setNoCall('argument', value, [1]) }};
	static argument2 = {default: 0, set (value) { this.globalVars.setNoCall('argument', value, [2]) }};
	static argument3 = {default: 0, set (value) { this.globalVars.setNoCall('argument', value, [3]) }};
	static argument4 = {default: 0, set (value) { this.globalVars.setNoCall('argument', value, [4]) }};
	static argument5 = {default: 0, set (value) { this.globalVars.setNoCall('argument', value, [5]) }};
	static argument6 = {default: 0, set (value) { this.globalVars.setNoCall('argument', value, [6]) }};
	static argument7 = {default: 0, set (value) { this.globalVars.setNoCall('argument', value, [7]) }};
	static argument8 = {default: 0, set (value) { this.globalVars.setNoCall('argument', value, [8]) }};
	static argument9 = {default: 0, set (value) { this.globalVars.setNoCall('argument', value, [9]) }};
	static argument10 = {default: 0, set (value) { this.globalVars.setNoCall('argument', value, [10]) }};
	static argument11 = {default: 0, set (value) { this.globalVars.setNoCall('argument', value, [11]) }};
	static argument12 = {default: 0, set (value) { this.globalVars.setNoCall('argument', value, [12]) }};
	static argument13 = {default: 0, set (value) { this.globalVars.setNoCall('argument', value, [13]) }};
	static argument14 = {default: 0, set (value) { this.globalVars.setNoCall('argument', value, [14]) }};
	static argument15 = {default: 0, set (value) { this.globalVars.setNoCall('argument', value, [15]) }};
	static argument_relative = {default: 0};

	// Game play / Instances

	static instance_count = {default: ()=>new Array(0).fill(-4), readOnly: true};
	static instance_id = {default: [], readOnly: true}; // WTF???

	// Game play / Timing

	static room_speed = {default: 30};
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
	
	static room = {default: 0};
	static room_first = {default: 0, readOnly: true};
	static room_last = {default: 0, readOnly: true};
	static room_width = {default: 640, readOnly: true};
	static room_height = {default: 480, readOnly: true};
	static room_caption = {default: ""};
	static room_persistent = {default: 0};
	static transition_kind = {default: 0};
	static transition_steps = {default: 80};

	// Game play / Score

	static score = {default: 0};
	static lives = {default: -1};
	static health = {default: 100};
	static show_score = {default: 1};
	static show_lives = {default: 0};
	static show_health = {default: 0};
	static caption_health = {default: "Health: "};
	static caption_lives = {default: "Lives: "};
	static caption_score = {default: "Score: "};

	// Game play / Generating events

	static event_type = {default: 11, readOnly: true};
	static event_number = {default: 0, readOnly: true};
	static event_object = {default: 0, readOnly: true};
	static event_action = {default: 0, readOnly: true};

	// Game play / Miscellaneous variables and functions

	static error_occurred = {default: 0};
	static error_last = {default: ""};
	static debug_mode = {default: 0, readOnly: true};
	static gamemaker_pro = {default: 1};
	static gamemaker_registered = {default: 1};
	static gamemaker_version = {default: 800};

	// User Interaction / The Keyboard

	static keyboard_lastkey = {default: 0};
	static keyboard_key = {default: 0};
	static keyboard_lastchar = {default: ""};
	static keyboard_string = {default: ""};

	// User Interaction / The Mouse

	static mouse_x = {default: 0, readOnly: true};
	static mouse_y = {default: 0, readOnly: true};
	static mouse_button = {default: 0};
	static mouse_lastbutton = {default: 0};
	static cursor_sprite = {default: -1};

	// Game Graphics / Backgrounds

	static background_color = {default: 12632256};
	static background_showcolor = {default: 1};
	static background_visible = {default: ()=>new Array(8).fill(0)};
	static background_foreground = {default: ()=>new Array(8).fill(0)};
	static background_index = {default: ()=>new Array(8).fill(-1)};
	static background_x = {default: ()=>new Array(8).fill(0)};
	static background_y = {default: ()=>new Array(8).fill(0)};
	static background_width = {default: ()=>new Array(8).fill(0), readOnly: true};
	static background_height = {default: ()=>new Array(8).fill(0), readOnly: true};
	static background_htiled = {default: ()=>new Array(8).fill(1)};
	static background_vtiled = {default: ()=>new Array(8).fill(1)};
	static background_xscale = {default: ()=>new Array(8).fill(1)};
	static background_yscale = {default: ()=>new Array(8).fill(1)};
	static background_hspeed = {default: ()=>new Array(8).fill(0)};
	static background_vspeed = {default: ()=>new Array(8).fill(0)};
	static background_blend = {default: ()=>new Array(8).fill(16777215)};
	static background_alpha = {default: ()=>new Array(8).fill(1)}

	// Game Graphics / Views

	static view_enabled = {default: 0};
	static view_current = {default: 0, readOnly: true};
	static view_visible = {default: ()=>new Array(8).fill(0)};
	static view_xview = {default: ()=>new Array(8).fill(0)};
	static view_yview = {default: ()=>new Array(8).fill(0)};
	static view_wview = {default: ()=>new Array(8).fill(640)};
	static view_hview = {default: ()=>new Array(8).fill(480)};
	static view_xport = {default: ()=>new Array(8).fill(0)};
	static view_yport = {default: ()=>new Array(8).fill(0)};
	static view_wport = {default: ()=>new Array(8).fill(640)};
	static view_hport = {default: ()=>new Array(8).fill(480)};
	static view_angle = {default: ()=>new Array(8).fill(0)};
	static view_hborder = {default: ()=>new Array(8).fill(32)};
	static view_vborder = {default: ()=>new Array(8).fill(32)};
	static view_hspeed = {default: ()=>new Array(8).fill(-1)};
	static view_vspeed = {default: ()=>new Array(8).fill(-1)};
	static view_object = {default: ()=>new Array(8).fill(-1)};

	// Files, registry, and executing programs / Files

	static game_id = {default: 0, readOnly: true};
	static working_directory = {default: "", readOnly: true};
	static program_directory = {default: "", readOnly: true};
	static temp_directory = {default: "", readOnly: true};

	// Files, registry, and executing programs / Executing programs

	static secure_mode = {default: 0, readOnly: true};
	
}