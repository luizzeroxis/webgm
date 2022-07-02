import Events from "../common/Events.js";
import {NonFatalErrorException} from "../common/Exceptions.js";
import {hexToDecimal, decimalToHex} from "../common/tools.js";

import BuiltInFunctions from "./BuiltInFunctions.js";

export default class BuiltInGlobals {
	// this = Game

	// GML Language Overview / Scripts

	static argument = {
		direct: true, dimensions: 1,
		directLength() { return 16; },
		directGet(index) {
			return this.arguments[index] ?? 0;
		},
		directSet(value, index) {
			this.arguments[index] = value;
		},
	};

	// Not yet supported by terser/webpack, this is defined at the end of the file
	/*
	static {
		for (let i=0; i<16; ++i) {
			this["argument" + i.toString()] = {
				direct: true,
				directGet() {
					return this.arguments[i] ?? 0;
				},
				directSet(value) {
					this.arguments[i] = value;
				},
			};
		}
	}
	*/

	static argument_relative = {readOnly: true, direct: true,
		directGet() { return this.argumentRelative; },
	};

	// Game play / Instances

	static instance_count = {readOnly: true, direct: true,
		directGet() { return this.instances.length; },
	};

	static instance_id = {readOnly: true, direct: true, dimensions: 1,
		directLength() { return this.instances.length; },
		directGet(index) { return this.instances[index].id; },
	};

	// Game play / Timing

	static room_speed = {direct: true, type: "integer",
		directGet() { return this.room.speed; },
		directSet(value) {
			if (value <= 0) {
				// TODO So, in GM you get 2 errors right after another. I have no idea how to replicate this.
				throw new NonFatalErrorException({
						type: "trying_to_set_the_room_speed_to_a_value_less_or_equal_than_0",
						text: "\n___________________________________________\n"
							+ "Trying to set the room speed to a value <= 0. (" + value.toString() + ")\n",
					},
				);
			}
			this.room.speed = value;
		},
	};

	static fps = {readOnly: true, direct: true,
		directGet() { return this.fps; },
	};

	static current_time = {readOnly: true, direct: true, directGet() {
		return Math.floor(performance.now());
	}};

	static current_year = {readOnly: true, direct: true, directGet() {
		return (new Date()).getFullYear();
	}};

	static current_month = {readOnly: true, direct: true, directGet() {
		return (new Date()).getMonth() + 1;
	}};

	static current_day = {readOnly: true, direct: true, directGet() {
		return (new Date()).getDate();
	}};

	static current_weekday = {readOnly: true, direct: true, directGet() {
		return (new Date()).getDay() + 1;
	}};

	static current_hour = {readOnly: true, direct: true, directGet() {
		return (new Date()).getHours();
	}};

	static current_minute = {readOnly: true, direct: true, directGet() {
		return (new Date()).getMinutes();
	}};

	static current_second = {readOnly: true, direct: true, directGet() {
		return (new Date()).getSeconds();
	}};

	// Game play / Rooms

	static room = {direct: true, type: "integer",
		directGet() { return this.room.resource.id; },
		directSet(value) {
			// TODO check if room value is changed immediately or only after room change
			BuiltInFunctions.room_goto.call(this.gml, [value]);
		},
	};

	static room_first = {readOnly: true, direct: true, directGet() {
		return this.project.resources.ProjectRoom[0].id;
	}};

	static room_last = {readOnly: true, direct: true, directGet() {
		return this.project.resources.ProjectRoom[this.project.resources.ProjectRoom.length - 1].id;
	}};

	static room_width = {readOnly: true, direct: true, directGet() {
		return this.room.width;
	}};

	static room_height = {readOnly: true, direct: true, directGet() {
		return this.room.height;
	}};

	static room_caption = {direct: true, type: "string",
		directGet() { return this.room.caption; },
		directSet(value) { this.room.caption = value; },
	};

	static room_persistent = {direct: true, type: "bool",
		directGet() { return this.room.persistent ? 1 : 0; },
		directSet(value) { this.room.persistent = value; },
	};

	static transition_kind = {direct: true, type: "integer",
		directGet() { return this.transitionKind; },
		directSet(value) { this.transitionKind = value; },
	};

	static transition_steps = {direct: true, type: "integer",
		directGet() { return this.transitionSteps; },
		directSet(value) { this.transitionSteps = Math.max(1, value); },
	};

	// Game play / Score

	static score = {direct: true, type: "integer",
		directGet() { return this.score; },
		directSet(value) { this.score = value; },
	};

	static lives = {direct: true, type: "integer",
		directGet() { return this.lives; },
		async directSet(value) { await this.setLives(value); },
	};

	static health = {direct: true, type: "real",
		directGet() { return this.health; },
		async directSet(value) { await this.setHealth(value); },
	};

	static show_score = {direct: true, type: "bool",
		directGet() { return this.showScore ? 1 : 0; },
		directSet(value) { this.showScore = value; },
	};

	static show_lives = {direct: true, type: "bool",
		directGet() { return this.showLives ? 1 : 0; },
		directSet(value) { this.showLives = value; },
	};

	static show_health = {direct: true, type: "bool",
		directGet() { return this.showHealth ? 1 : 0; },
		directSet(value) { this.showHealth = value; },
	};

	static caption_score = {direct: true, type: "string",
		directGet() { return this.captionScore; },
		directSet(value) { this.captionScore = value; },
	};

	static caption_lives = {direct: true, type: "string",
		directGet() { return this.captionLives; },
		directSet(value) { this.captionLives = value; },
	};

	static caption_health = {direct: true, type: "string",
		directGet() { return this.captionHealth; },
		directSet(value) { this.captionHealth = value; },
	};


	// Game play / Generating events

	static event_type = {readOnly: true, direct: true, directGet() {
		return this.currentEvent ? Events.listEventTypes.find(x => x.value == this.currentEvent.type).id : 0;
	}};

	static event_number = {readOnly: true, direct: true, directGet() {
		return this.currentEvent ? this.currentEvent.subtype : 0;
	}};

	static event_object = {readOnly: true, direct: true, directGet() {
		return this.currentEventInstance ? this.currentEventInstance.objectIndex : 0;
	}};

	static event_action = {readOnly: true, direct: true, directGet() {
		return this.currentEventActionNumber ? this.currentEventActionNumber : 0;
	}};

	// Game play / Miscellaneous variables and functions

	static error_occurred = {direct: true, type: "bool",
		directGet() { return this.errorOccurred ? 1 : 0; },
		directSet(value) { this.errorOccurred = value; },
	};

	static error_last = {direct: true, type: "string",
		directGet() { return this.errorLast; },
		directSet(value) { this.errorLast = value; },
	};

	static debug_mode = {readOnly: true, direct: true,
		directGet() { return 0; }, // TODO
	};

	static gamemaker_pro = {readOnly: true, direct: true,
		directGet() { return 1; },
	};

	static gamemaker_registered = {readOnly: true, direct: true,
		directGet() { return 1; },
	};

	static gamemaker_version = {readOnly: true, direct: true,
		directGet() { return 800; },
	};

	// User Interaction / The Keyboard

	static keyboard_lastkey = {direct: true, type: "integer",
		directGet() { return this.lastKey; },
		directSet(value) { this.lastKey = value; },
	};

	static keyboard_key = {direct: true, type: "integer",
		directGet() { return this.currentKey; },
		directSet(value) { this.currentKey = value; },
	};

	static keyboard_lastchar = {direct: true, type: "char",
		directGet() { return this.lastKeyChar; },
		directSet(value) { this.lastKeyChar = value; },
	};

	static keyboard_string = {direct: true, type: "string",
		directGet() { return this.keyboardString; },
		directSet(value) { this.keyboardString = value; },
	};

	// User Interaction / The Mouse

	static mouse_x = {readOnly: true, direct: true,
		directGet() { return this.mouseX; },
	};

	static mouse_y = {readOnly: true, direct: true,
		directGet() { return this.mouseY; },
	};

	static mouse_button = {direct: true, type: "integer",
		directGet() { return this.currentMouse; },
		directSet(value) { this.currentMouse = value; }, // TODO I think this is an enum, should check bounds or something
	};

	static mouse_lastbutton = {direct: true, type: "integer",
		directGet() { return this.lastMouse; },
		directSet(value) { this.lastMouse = value; },
	};

	static cursor_sprite = {direct: true, type: "integer",
		directGet() { return this.cursorSprite?.id ?? -1; },
		directSet(value) {
			this.cursorSprite = this.project.getResourceById("ProjectSprite", value);
		},
	};

	// Game Graphics / Backgrounds

	static background_color = {direct: true, type: "integer",
		directGet() { return hexToDecimal(this.room.backgroundColor); },
		directSet(value) { this.room.backgroundColor = decimalToHex(value); },
	};

	static background_showcolor = {direct: true, type: "bool",
		directGet() { return this.room.backgroundShowColor ? 1 : 0; },
		directSet(value) { this.room.backgroundShowColor = value; },
	};

	static background_visible = {direct: true, type: "bool", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomBackground(index).visible ? 1 : 0; },
		directSet(value, index) { this.getRoomBackground(index).visible = value; },
	};

	static background_foreground = {direct: true, type: "bool", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomBackground(index).isForeground ? 1 : 0; },
		directSet(value, index) { this.getRoomBackground(index).isForeground = value; },
	};

	static background_index = {direct: true, type: "integer", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomBackground(index).backgroundIndex; },
		directSet(value, index) { this.getRoomBackground(index).backgroundIndex = value; },
	};

	static background_x = {direct: true, type: "real", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomBackground(index).x; },
		directSet(value, index) { this.getRoomBackground(index).x = value; },
	};

	static background_y = {direct: true, type: "real", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomBackground(index).y; },
		directSet(value, index) { this.getRoomBackground(index).y = value; },
	};

	static background_width = {readOnly: true, direct: true, dimensions: 1,
		directLength() { return 8; },
		directGet(index) {
			const background = this.project.getResourceById("ProjectBackground", this.getRoomBackground(index));
			return background?.image.image.width ?? 0;
		},
	};

	static background_height = {readOnly: true, direct: true, dimensions: 1,
		directLength() { return 8; },
		directGet(index) {
			const background = this.project.getResourceById("ProjectBackground", this.getRoomBackground(index));
			return background?.image.image.height ?? 0;
		},
	};

	static background_htiled = {direct: true, type: "bool", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomBackground(index).tileHorizontally ? 1 : 0; },
		directSet(value, index) { this.getRoomBackground(index).tileHorizontally = value; },
	};

	static background_vtiled = {direct: true, type: "bool", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomBackground(index).tileVertically ? 1 : 0; },
		directSet(value, index) { this.getRoomBackground(index).tileVertically = value; },
	};

	static background_xscale = {direct: true, type: "real", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomBackground(index).xScale; },
		directSet(value, index) { this.getRoomBackground(index).xScale = value; },
	};

	static background_yscale = {direct: true, type: "real", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomBackground(index).yScale; },
		directSet(value, index) { this.getRoomBackground(index).yScale = value; },
	};

	static background_hspeed = {direct: true, type: "real", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomBackground(index).horizontalSpeed; },
		directSet(value, index) { this.getRoomBackground(index).horizontalSpeed = value; },
	};

	static background_vspeed = {direct: true, type: "real", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomBackground(index).verticalSpeed; },
		directSet(value, index) { this.getRoomBackground(index).verticalSpeed = value; },
	};

	static background_blend = {direct: true, type: "integer", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomBackground(index).blend; },
		directSet(value, index) { this.getRoomBackground(index).blend = value; },
	};

	static background_alpha = {direct: true, type: "real", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomBackground(index).alpha; },
		directSet(value, index) { this.getRoomBackground(index).alpha = value; },
	};

	// Game Graphics / Views

	static view_enabled = {direct: true, type: "bool",
		directGet() { return this.room.viewsEnabled ? 1 : 0; },
		directSet(value) { this.room.viewsEnabled = value; },
	};

	static view_current = {readOnly: true, direct: true,
		directGet() { return this.currentView ? 1 : 0; },
	};

	static view_visible = {direct: true, type: "bool", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomView(index).visible ? 1 : 0; },
		directSet(value, index) { this.getRoomView(index).visible = value; },
	};

	static view_xview = {direct: true, type: "integer", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomView(index).viewX; },
		directSet(value, index) { this.getRoomView(index).viewX = value; },
	};

	static view_yview = {direct: true, type: "integer", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomView(index).viewY; },
		directSet(value, index) { this.getRoomView(index).viewY = value; },
	};

	static view_wview = {direct: true, type: "integer", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomView(index).viewW; },
		directSet(value, index) { this.getRoomView(index).viewW = value; },
	};

	static view_hview = {direct: true, type: "integer", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomView(index).viewH; },
		directSet(value, index) { this.getRoomView(index).viewH = value; },
	};

	static view_xport = {direct: true, type: "integer", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomView(index).portX; },
		directSet(value, index) { this.getRoomView(index).portX = value; },
	};

	static view_yport = {direct: true, type: "integer", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomView(index).portY; },
		directSet(value, index) { this.getRoomView(index).portY = value; },
	};

	static view_wport = {direct: true, type: "integer", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomView(index).portW; },
		directSet(value, index) { this.getRoomView(index).portW = value; },
	};

	static view_hport = {direct: true, type: "integer", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomView(index).portH; },
		directSet(value, index) { this.getRoomView(index).portH = value; },
	};

	static view_angle = {direct: true, type: "real", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomView(index).angle; },
		directSet(value, index) { this.getRoomView(index).angle = value; },
	};

	static view_hborder = {direct: true, type: "integer", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomView(index).objectFollowHorizontalBorder; },
		directSet(value, index) { this.getRoomView(index).objectFollowHorizontalBorder = value; },
	};

	static view_vborder = {direct: true, type: "integer", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomView(index).objectFollowVerticalBorder; },
		directSet(value, index) { this.getRoomView(index).objectFollowVerticalBorder = value; },
	};

	static view_hspeed = {direct: true, type: "integer", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomView(index).objectFollowHorizontalSpeed; },
		directSet(value, index) { this.getRoomView(index).objectFollowHorizontalSpeed = value; },
	};

	static view_vspeed = {direct: true, type: "integer", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomView(index).objectFollowVerticalSpeed; },
		directSet(value, index) { this.getRoomView(index).objectFollowVerticalSpeed = value; },
	};

	static view_object = {direct: true, type: "integer", dimensions: 1,
		directLength() { return 8; },
		directGet(index) { return this.getRoomView(index).objectFollowIndex; },
		directSet(value, index) { this.getRoomView(index).objectFollowIndex = value; },
	};

	// Files, registry, and executing programs / Files

	static game_id = {readOnly: true, direct: true,
		directGet() { return 0; }, // TODO
	};

	static working_directory = {readOnly: true, direct: true,
		directGet() { return ""; }, // TODO?
	};

	static program_directory = {readOnly: true, direct: true,
		directGet() { return ""; }, // TODO?
	};

	static temp_directory = {readOnly: true, direct: true,
		directGet() { return ""; }, // TODO?
	};

	// Files, registry, and executing programs / Executing programs

	static secure_mode = {readOnly: true, direct: true,
		directGet() { return 0; }, // TODO?
	};
}

// Static initialization

for (let i=0; i<16; ++i) {
	BuiltInGlobals["argument" + i.toString()] = {
		direct: true,
		directGet() {
			return this.arguments[i] ?? 0;
		},
		directSet(value) {
			this.arguments[i] = value;
		},
	};
}