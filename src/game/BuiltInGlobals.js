import Events from "~/common/Events.js";
import {hexToDecimal, decimalToHex} from "~/common/tools.js";

import {NonFatalErrorException} from "./Game.js";

export default class BuiltInGlobals {
	// this = Game

	// GML Language Overview / Scripts

	static argument = {dimensions: 1,
		length() { return 16; },
		get(index) {
			return this.gml.arguments[index] ?? 0;
		},
		set(value, index) {
			this.gml.arguments[index] = value;
		},
	};

	static {
		for (let i=0; i<16; ++i) {
			this["argument" + i.toString()] = {
				get() {
					return this.gml.arguments[i] ?? 0;
				},
				set(value) {
					this.gml.arguments[i] = value;
				},
			};
		}
	}

	static argument_relative = {readOnly: true,
		get() { return this.gml.argumentRelative; },
	};

	// Game play / Instances

	static instance_count = {readOnly: true,
		get() { return this.instances.length; },
	};

	static instance_id = {readOnly: true, dimensions: 1,
		length() { return this.instances.length; },
		get(index) { return this.instances[index].id; },
	};

	// Game play / Timing

	static room_speed = {type: "integer",
		get() { return this.room.speed; },
		set(value) {
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

	static fps = {readOnly: true,
		get() { return this.fps; },
	};

	static current_time = {readOnly: true, get() {
		return Math.floor(performance.now());
	}};

	static current_year = {readOnly: true, get() {
		return (new Date()).getFullYear();
	}};

	static current_month = {readOnly: true, get() {
		return (new Date()).getMonth() + 1;
	}};

	static current_day = {readOnly: true, get() {
		return (new Date()).getDate();
	}};

	static current_weekday = {readOnly: true, get() {
		return (new Date()).getDay() + 1;
	}};

	static current_hour = {readOnly: true, get() {
		return (new Date()).getHours();
	}};

	static current_minute = {readOnly: true, get() {
		return (new Date()).getMinutes();
	}};

	static current_second = {readOnly: true, get() {
		return (new Date()).getSeconds();
	}};

	// Game play / Rooms

	static room = {type: "integer",
		get() { return this.room.resource.id; },
		set(value) {
			this.loadRoomAtStepStop(value);
		},
	};

	static room_first = {readOnly: true, get() {
		return this.project.resources.ProjectRoom[0].id;
	}};

	static room_last = {readOnly: true, get() {
		return this.project.resources.ProjectRoom[this.project.resources.ProjectRoom.length - 1].id;
	}};

	static room_width = {readOnly: true, get() {
		return this.room.width;
	}};

	static room_height = {readOnly: true, get() {
		return this.room.height;
	}};

	static room_caption = {type: "string",
		get() { return this.room.caption; },
		set(value) { this.room.caption = value; },
	};

	static room_persistent = {type: "bool",
		get() { return this.room.persistent ? 1 : 0; },
		set(value) { this.room.persistent = value; },
	};

	static transition_kind = {type: "integer",
		get() { return this.transitionKind; },
		set(value) { this.transitionKind = value; },
	};

	static transition_steps = {type: "integer",
		get() { return this.transitionSteps; },
		set(value) { this.transitionSteps = Math.max(1, value); },
	};

	// Game play / Score

	static score = {type: "integer",
		get() { return this.score; },
		set(value) { this.score = value; },
	};

	static lives = {type: "integer",
		get() { return this.lives; },
		async set(value) { await this.setLives(value); },
	};

	static health = {type: "real",
		get() { return this.health; },
		async set(value) { await this.setHealth(value); },
	};

	static show_score = {type: "bool",
		get() { return this.showScore ? 1 : 0; },
		set(value) { this.showScore = value; },
	};

	static show_lives = {type: "bool",
		get() { return this.showLives ? 1 : 0; },
		set(value) { this.showLives = value; },
	};

	static show_health = {type: "bool",
		get() { return this.showHealth ? 1 : 0; },
		set(value) { this.showHealth = value; },
	};

	static caption_score = {type: "string",
		get() { return this.captionScore; },
		set(value) { this.captionScore = value; },
	};

	static caption_lives = {type: "string",
		get() { return this.captionLives; },
		set(value) { this.captionLives = value; },
	};

	static caption_health = {type: "string",
		get() { return this.captionHealth; },
		set(value) { this.captionHealth = value; },
	};


	// Game play / Generating events

	static event_type = {readOnly: true, get() {
		return this.currentEvent ? Events.listEventTypes.find(x => x.value == this.currentEvent.event.type).id : 0;
	}};

	static event_number = {readOnly: true, get() {
		return this.currentEvent ? this.currentEvent.event.subtype : 0;
	}};

	static event_object = {readOnly: true, get() {
		return this.currentEvent ? this.currentEvent.object.id : 0;
	}};

	static event_action = {readOnly: true, get() {
		return this.currentEventActionNumber ? this.currentEventActionNumber : 0;
	}};

	// Game play / Miscellaneous variables and functions

	static error_occurred = {type: "bool",
		get() { return this.errorOccurred ? 1 : 0; },
		set(value) { this.errorOccurred = value; },
	};

	static error_last = {type: "string",
		get() { return this.errorLast; },
		set(value) { this.errorLast = value; },
	};

	static debug_mode = {readOnly: true,
		get() { return 0; }, // TODO
	};

	static gamemaker_pro = {readOnly: true,
		get() { return 1; },
	};

	static gamemaker_registered = {readOnly: true,
		get() { return 1; },
	};

	static gamemaker_version = {readOnly: true,
		get() { return 800; },
	};

	// User Interaction / The Keyboard

	static keyboard_lastkey = {type: "integer",
		get() { return this.input.lastKey; },
		set(value) { this.input.lastKey = value; },
	};

	static keyboard_key = {type: "integer",
		get() { return this.input.currentKey; },
		set(value) { this.input.currentKey = value; },
	};

	static keyboard_lastchar = {type: "char",
		get() { return this.input.lastKeyChar; },
		set(value) { this.input.lastKeyChar = value; },
	};

	static keyboard_string = {type: "string",
		get() { return this.input.keyboardString; },
		set(value) { this.input.keyboardString = value; },
	};

	// User Interaction / The Mouse

	static mouse_x = {readOnly: true,
		get() { return this.input.mouseXInCurrentView; },
	};

	static mouse_y = {readOnly: true,
		get() { return this.input.mouseYInCurrentView; },
	};

	static mouse_button = {type: "integer",
		get() { return this.input.currentMouse; },
		set(value) { this.input.currentMouse = value; }, // TODO I think this is an enum, should check bounds or something
	};

	static mouse_lastbutton = {type: "integer",
		get() { return this.input.lastMouse; },
		set(value) { this.input.lastMouse = value; },
	};

	static cursor_sprite = {type: "integer",
		get() { return this.render.cursorSprite?.id ?? -1; },
		set(value) {
			this.render.cursorSprite = this.project.getResourceById("ProjectSprite", value);
		},
	};

	// Game Graphics / Backgrounds

	static background_color = {type: "integer",
		get() { return hexToDecimal(this.room.backgroundColor); },
		set(value) { this.room.backgroundColor = decimalToHex(value); },
	};

	static background_showcolor = {type: "bool",
		get() { return this.room.backgroundShowColor ? 1 : 0; },
		set(value) { this.room.backgroundShowColor = value; },
	};

	static background_visible = {type: "bool", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomBackground(index).visible ? 1 : 0; },
		set(value, index) { this.getRoomBackground(index).visible = value; },
	};

	static background_foreground = {type: "bool", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomBackground(index).isForeground ? 1 : 0; },
		set(value, index) { this.getRoomBackground(index).isForeground = value; },
	};

	static background_index = {type: "integer", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomBackground(index).backgroundIndex; },
		set(value, index) { this.getRoomBackground(index).backgroundIndex = value; },
	};

	static background_x = {type: "real", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomBackground(index).x; },
		set(value, index) { this.getRoomBackground(index).x = value; },
	};

	static background_y = {type: "real", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomBackground(index).y; },
		set(value, index) { this.getRoomBackground(index).y = value; },
	};

	static background_width = {readOnly: true, dimensions: 1,
		length() { return 8; },
		get(index) {
			const background = this.project.getResourceById("ProjectBackground", this.getRoomBackground(index));
			return background?.image.width ?? 0;
		},
	};

	static background_height = {readOnly: true, dimensions: 1,
		length() { return 8; },
		get(index) {
			const background = this.project.getResourceById("ProjectBackground", this.getRoomBackground(index));
			return background?.image.height ?? 0;
		},
	};

	static background_htiled = {type: "bool", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomBackground(index).tileHorizontally ? 1 : 0; },
		set(value, index) { this.getRoomBackground(index).tileHorizontally = value; },
	};

	static background_vtiled = {type: "bool", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomBackground(index).tileVertically ? 1 : 0; },
		set(value, index) { this.getRoomBackground(index).tileVertically = value; },
	};

	static background_xscale = {type: "real", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomBackground(index).xScale; },
		set(value, index) { this.getRoomBackground(index).xScale = value; },
	};

	static background_yscale = {type: "real", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomBackground(index).yScale; },
		set(value, index) { this.getRoomBackground(index).yScale = value; },
	};

	static background_hspeed = {type: "real", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomBackground(index).horizontalSpeed; },
		set(value, index) { this.getRoomBackground(index).horizontalSpeed = value; },
	};

	static background_vspeed = {type: "real", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomBackground(index).verticalSpeed; },
		set(value, index) { this.getRoomBackground(index).verticalSpeed = value; },
	};

	static background_blend = {type: "integer", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomBackground(index).blend; },
		set(value, index) { this.getRoomBackground(index).blend = value; },
	};

	static background_alpha = {type: "real", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomBackground(index).alpha; },
		set(value, index) { this.getRoomBackground(index).alpha = value; },
	};

	// Game Graphics / Views

	static view_enabled = {type: "bool",
		get() { return this.room.viewsEnabled ? 1 : 0; },
		set(value) { this.room.viewsEnabled = value; },
	};

	static view_current = {readOnly: true,
		get() { return this.render.currentView ? 1 : 0; },
	};

	static view_visible = {type: "bool", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomView(index).visible ? 1 : 0; },
		set(value, index) { this.getRoomView(index).visible = value; },
	};

	static view_xview = {type: "integer", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomView(index).viewX; },
		set(value, index) { this.getRoomView(index).viewX = value; },
	};

	static view_yview = {type: "integer", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomView(index).viewY; },
		set(value, index) { this.getRoomView(index).viewY = value; },
	};

	static view_wview = {type: "integer", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomView(index).viewW; },
		set(value, index) { this.getRoomView(index).viewW = value; },
	};

	static view_hview = {type: "integer", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomView(index).viewH; },
		set(value, index) { this.getRoomView(index).viewH = value; },
	};

	static view_xport = {type: "integer", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomView(index).portX; },
		set(value, index) { this.getRoomView(index).portX = value; },
	};

	static view_yport = {type: "integer", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomView(index).portY; },
		set(value, index) { this.getRoomView(index).portY = value; },
	};

	static view_wport = {type: "integer", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomView(index).portW; },
		set(value, index) { this.getRoomView(index).portW = value; },
	};

	static view_hport = {type: "integer", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomView(index).portH; },
		set(value, index) { this.getRoomView(index).portH = value; },
	};

	static view_angle = {type: "real", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomView(index).angle; },
		set(value, index) { this.getRoomView(index).angle = value; },
	};

	static view_hborder = {type: "integer", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomView(index).objectFollowHorizontalBorder; },
		set(value, index) { this.getRoomView(index).objectFollowHorizontalBorder = value; },
	};

	static view_vborder = {type: "integer", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomView(index).objectFollowVerticalBorder; },
		set(value, index) { this.getRoomView(index).objectFollowVerticalBorder = value; },
	};

	static view_hspeed = {type: "integer", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomView(index).objectFollowHorizontalSpeed; },
		set(value, index) { this.getRoomView(index).objectFollowHorizontalSpeed = value; },
	};

	static view_vspeed = {type: "integer", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomView(index).objectFollowVerticalSpeed; },
		set(value, index) { this.getRoomView(index).objectFollowVerticalSpeed = value; },
	};

	static view_object = {type: "integer", dimensions: 1,
		length() { return 8; },
		get(index) { return this.getRoomView(index).objectFollowIndex; },
		set(value, index) { this.getRoomView(index).objectFollowIndex = value; },
	};

	// Files, registry, and executing programs / Files

	static game_id = {readOnly: true,
		get() { return 0; }, // TODO
	};

	static working_directory = {readOnly: true,
		get() { return ""; }, // TODO?
	};

	static program_directory = {readOnly: true,
		get() { return ""; }, // TODO?
	};

	static temp_directory = {readOnly: true,
		get() { return ""; }, // TODO?
	};

	// Files, registry, and executing programs / Executing programs

	static secure_mode = {readOnly: true,
		get() { return 0; }, // TODO?
	};
}