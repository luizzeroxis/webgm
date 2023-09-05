// const b = {type: 'b'}; // All text bold
const i = {type: "i"}; // All text italic
const r = {type: "r"}; // Replaced by 'relative '
const n = {type: "n"}; // Replaced by 'not '
const w = {type: "w"}; // Replaced by 'for the other object: ' or 'for object <name of object>: ' if apply to is not self
const a = Array.from(new Array(6).keys()).map(x => ({type: "a", number: x})); // Replaced by argument value

export default class BuiltInLibraries {
	static list = [
		{
			name: "move",
			items: [
				{
					name: "Move",
					kind: "label",
				},
				{
					id: 101,
					description: "Move Fixed",
					listText: ["Start moving in a direction"],
					hintText: [w, "start moving in directions ", a[0], " with speed set ", r, "to ", a[1]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_move",

					interfaceKind: "arrows",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,
				},
				{
					id: 102,
					description: "Move Free",
					listText: ["Set direction and speed of motion"],
					hintText: [w, "set speed ", r, "to ", a[1], " and direction to ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_set_motion",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "direction:",
							kind: "expression",
							default: "0",
						},
						{
							name: "speed:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					id: 105,
					description: "Move Towards",
					listText: ["Move towards point (", a[0], ",", a[1], ")"],
					hintText: [w, "start moving ", r, "in the direction of position (", a[0], ",", a[1], ") with speed ", a[2]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_move_point",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "x:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y:",
							kind: "expression",
							default: "0",
						},
						{
							name: "speed:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					id: 103,
					description: "Speed Horizontal",
					listText: ["Set the horizontal speed"],
					hintText: [w, "set the horizontal speed ", r, "to ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_set_hspeed",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "hor. speed:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					id: 104,
					description: "Speed Vertical",
					listText: ["Speed Vertical"],
					hintText: [w, "set the vertical speed ", r, "to ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_set_vspeed",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "vert. speed:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					id: 107,
					description: "Set Gravity",
					listText: ["Set the gravity"],
					hintText: [w, "set the gravity ", r, "to ", a[1], " in direction ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_set_gravity",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "direction:",
							kind: "expression",
							default: "0",
						},
						{
							name: "gravity:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					id: 113,
					description: "Reverse Horizontal",
					listText: ["Reverse horizontal direction"],
					hintText: [w, "reverse horizontal direction"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_reverse_xdir",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: false,

					args: [],
				},
				{
					id: 114,
					description: "Reverse Vertical",
					listText: ["Reverse vertical direction"],
					hintText: [w, "reverse vertical direction"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_reverse_ydir",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: false,

					args: [],
				},
				{
					id: 108,
					description: "Set Friction",
					listText: ["Set the friction"],
					hintText: [w, "set the friction ", r, "to ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_set_friction",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "friction:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					name: "Jump",
					kind: "label",
				},
				{
					id: 109,
					description: "Jump to Position",
					listText: ["Jump to position (", a[0], ",", a[1], ")"],
					hintText: [w, "jump ", r, "to position (", a[0], ",", a[1], ")"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_move_to",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "x:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					id: 110,
					description: "Jump to Start",
					listText: ["Jump to the start position"],
					hintText: [w, "jump to the start position"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_move_start",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: false,

					args: [],
				},
				{
					id: 111,
					description: "Jump to Random",
					listText: ["Jump to a random position"],
					hintText: [w, "jump to a random position with hor snap ", a[0], " and vert snap ", a[1]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_move_random",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: false,

					args: [
						{
							name: "snap hor:",
							kind: "expression",
							default: "0",
						},
						{
							name: "snap vert:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					id: 117,
					description: "Align to Grid",
					listText: ["Align to a grid of ", a[0], " by ", a[1]],
					hintText: [w, "align position to a grid with cells of ", a[0], " by ", a[1], " pixels"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_snap",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: false,

					args: [
						{
							name: "snap hor:",
							kind: "expression",
							default: "16",
						},
						{
							name: "snap vert:",
							kind: "expression",
							default: "16",
						},
					],
				},
				{
					id: 112,
					description: "Wrap Screen",
					listText: ["Wrap ", a[0], " when outside"],
					hintText: [w, "wrap ", a[0], " when an instance moves outside the room"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_wrap",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: false,

					args: [
						{
							name: "direction:",
							kind: "menu",
							menu: ["horizontal", "vertical", "in both directions"],
							default: 0,
						},
					],
				},
				{
					kind: "separator",
				},
				{
					id: 116,
					description: "Move to Contact",
					listText: ["Move to contact in direction ", a[0]],
					hintText: [w, "move in direction ", a[0], " at most ", a[1], " till a contact with ", a[2]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_move_contact",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: false,

					args: [
						{
							name: "direction:",
							kind: "expression",
							default: "0",
						},
						{
							name: "maximum:",
							kind: "expression",
							default: "-1",
						},
						{
							name: "against:",
							kind: "menu",
							menu: ["solid objects", "all objects"],
							default: 0,
						},
					],
				},
				{
					id: 115,
					description: "Bounce",
					listText: ["Bounce against ", a[1]],
					hintText: [w, "bounce ", a[0], " against ", a[1]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_bounce",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: false,

					args: [
						{
							name: "precise:",
							kind: "menu",
							menu: ["not precisely", "precisely"],
							default: 0,
						},
						{
							name: "against:",
							kind: "menu",
							menu: ["solid objects", "all objects"],
							default: 0,
						},
					],
				},
				{
					name: "Paths",
					kind: "label",
				},
				{
					id: 119,
					description: "Set Path",
					listText: ["Set a path for the instance"],
					hintText: [w, "set the ", a[3], " path to ", a[0], " with speed ", a[1], " and at the end ", a[2]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_path",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: false,

					args: [
						{
							name: "path:",
							kind: "path",
							default: -1,
						},
						{
							name: "speed:",
							kind: "expression",
							default: "0",
						},
						{
							name: "at end:",
							kind: "menu",
							menu: ["stop", "continue from start", "continue from here", "reverse"],
							default: 0,
						},
						{
							name: "relative:",
							kind: "menu",
							menu: ["relative", "absolute"],
							default: 0,
						},
					],
				},
				{
					id: 124,
					description: "End Path",
					listText: ["End the path for the instance"],
					hintText: [w, "end the path"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_path_end",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: false,

					args: [],
				},
				{
					kind: "separator",
				},
				{
					id: 122,
					description: "Path Position",
					listText: ["Set path position to ", a[0]],
					hintText: [w, "set the position on the path ", r, "to ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_path_position",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "position (0-1):",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					id: 123,
					description: "Path Speed",
					listText: ["Set path speed to ", a[0]],
					hintText: [w, "set the speed for the path ", r, "to ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_path_speed",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "speed:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					name: "Steps",
					kind: "label",
				},
				{
					id: 120,
					description: "Step Towards",
					listText: ["Step towards point (", a[0], ",", a[1], ")"],
					hintText: [w, "perform a step ", r, "towards position (", a[0], ",", a[1], ") with speed ", a[2], " stop at ", a[3]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_linear_step",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "x",
							kind: "expression",
							default: "0",
						},
						{
							name: "y",
							kind: "expression",
							default: "0",
						},
						{
							name: "speed",
							kind: "expression",
							default: "0",
						},
						{
							name: "stop at",
							kind: "menu",
							menu: ["solid only", "all instances"],
							default: 0,
						},
					],
				},
				/*
				{
					id: 999,
					description: "Step Avoiding",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				*/
			],
		},
		{
			name: "main1",
			items: [
				{
					name: "Objects",
					kind: "label",
				},
				{
					id: 201,
					description: "Create Instance",
					listText: ["Create instance of object ", a[0]],
					hintText: [w, "create instance of object ", a[0], " at ", r, "position (", a[1], ",", a[2], ")"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_create_object",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "object:",
							kind: "object",
							default: -100,
						},
						{
							name: "x:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					id: 206,
					description: "Create Moving",
					listText: ["Create moving instance of ", a[0]],
					hintText: [w, "create instance of object ", a[0], " at ", r, "position (", a[1], ",", a[2], ") with speed ", a[3], " in direction ", a[4]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_create_object_motion",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "object:",
							kind: "object",
							default: -100,
						},
						{
							name: "x:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y:",
							kind: "expression",
							default: "0",
						},
						{
							name: "speed:",
							kind: "expression",
							default: "0",
						},
						{
							name: "direction:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					id: 207,
					description: "Create Random",
					listText: ["Create instance of random object"],
					hintText: [w, "create instance of object ", a[0], ", ", a[1], ", ", a[2], ", or ", a[3], " at ", r, "position (", a[4], ",", a[5], ")"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_create_object_random",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "object 1:",
							kind: "object",
							default: -100,
						},
						{
							name: "object 2:",
							kind: "object",
							default: -100,
						},
						{
							name: "object 3:",
							kind: "object",
							default: -100,
						},
						{
							name: "object 4:",
							kind: "object",
							default: -100,
						},
						{
							name: "x:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					id: 202,
					description: "Change Instance",
					listText: ["Change instance into ", a[0]],
					hintText: [w, "change the instance into object ", a[0], ", ", a[1], " performing events"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_change_object",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: false,

					args: [
						{
							name: "change into:",
							kind: "object",
							default: -100,
						},
						{
							name: "perform events:",
							kind: "menu",
							menu: ["not", "yes"],
							default: 0,
						},
					],
				},
				{
					id: 203,
					description: "Destroy Instance",
					listText: ["Destroy the instance"],
					hintText: [w, "destroy the instance"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_kill_object",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: false,

					args: [],
				},
				{
					id: 204,
					description: "Destroy at Position",
					listText: ["Destroy instances at a position"],
					hintText: ["kill all instances at ", r, "position (", a[0], ",", a[1], ")"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_kill_position",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "x:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					name: "Sprite",
					kind: "label",
				},
				{
					id: 541,
					description: "Change Sprite",
					listText: ["Change sprite into ", a[0]],
					hintText: [w, "set the sprite to ", a[0], " with subimage ", a[1], " and speed ", a[2]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_sprite_set",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: false,

					args: [
						{
							name: "sprite:",
							kind: "sprite",
							default: -1,
						},
						{
							name: "subimage:",
							kind: "expression",
							default: "0",
						},
						{
							name: "speed:",
							kind: "expression",
							default: "1",
						},
					],
				},
				{
					id: 542,
					description: "Transform Sprite",
					listText: ["Transform the sprite"],
					hintText: [w, "scale the sprite with ", a[0], " in the xdir, ", a[1], " in the ydir, rotate over ", a[2], ", and ", a[3]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_sprite_transform",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: false,

					args: [
						{
							name: "xscale:",
							kind: "expression",
							default: "1",
						},
						{
							name: "yscale:",
							kind: "expression",
							default: "1",
						},
						{
							name: "angle:",
							kind: "expression",
							default: "0",
						},
						{
							name: "mirror:",
							kind: "menu",
							menu: ["no mirroring", "mirror horizontally", "flip vertically", "mirror and flip"],
							default: 0,
						},
					],
				},
				/*
				{
					id: 999,
					description: "Color Sprite",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				*/
				{
					name: "Sounds",
					kind: "label",
				},
				{
					id: 211,
					description: "Play Sound",
					listText: ["Play sound ", a[0]],
					hintText: ["play sound ", a[0], "; looping: ", a[1]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_sound",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "sound:",
							kind: "sound",
							default: -1,
						},
						{
							name: "loop:",
							kind: "boolean",
							default: false,
						},
					],
				},
				{
					id: 212,
					description: "Stop Sound",
					listText: ["Stop sound ", a[0]],
					hintText: ["stop sound ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_end_sound",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "sound:",
							kind: "sound",
							default: -1,
						},
					],
				},
				{
					id: 213,
					description: "Check Sound",
					listText: ["If sound ", a[0], " is ", n, "playing"],
					hintText: ["if sound ", a[0], " is ", n, "playing"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_if_sound",

					interfaceKind: "normal",
					isQuestion: true,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "sound:",
							kind: "sound",
							default: -1,
						},
					],
				},
				{
					name: "Rooms",
					kind: "label",
				},
				{
					id: 221,
					description: "Previous Room",
					listText: ["Go to previous room"],
					hintText: ["go to previous room with transition effect ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_previous_room",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "transition:",
							kind: "menu",
							menu: ["<no effect>", "Create from left", "Create from right", "Create from top", "Create from bottom", "Create from center", "Shift from left", "Shift from right", "Shift from top", "Shift from bottom", "Interlaced from left", "Interlaced from right", "Interlaced from top", "Interlaced from bottom", "Push from left", "Push from right", "Push from top", "Push from bottom", "Rotate left", "Rotate right", "Blend", "Fade out and in"],
							default: 0,
						},
					],
				},
				{
					id: 222,
					description: "Next Room",
					listText: ["Go to next room"],
					hintText: ["go to next room with transition effect ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_next_room",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "transition:",
							kind: "menu",
							menu: ["<no effect>", "Create from left", "Create from right", "Create from top", "Create from bottom", "Create from center", "Shift from left", "Shift from right", "Shift from top", "Shift from bottom", "Interlaced from left", "Interlaced from right", "Interlaced from top", "Interlaced from bottom", "Push from left", "Push from right", "Push from top", "Push from bottom", "Rotate left", "Rotate right", "Blend", "Fade out and in"],
							default: 0,
						},
					],
				},
				{
					id: 223,
					description: "Restart Room",
					listText: ["Restart the current room"],
					hintText: ["restart the current room with transition effect ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_current_room",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "transition:",
							kind: "menu",
							menu: ["<no effect>", "Create from left", "Create from right", "Create from top", "Create from bottom", "Create from center", "Shift from left", "Shift from right", "Shift from top", "Shift from bottom", "Interlaced from left", "Interlaced from right", "Interlaced from top", "Interlaced from bottom", "Push from left", "Push from right", "Push from top", "Push from bottom", "Rotate left", "Rotate right", "Blend", "Fade out and in"],
							default: 0,
						},
					],
				},
				{
					id: 224,
					description: "Different Room",
					listText: ["Go to room ", a[0]],
					hintText: ["go to room ", a[0], " with transition effect ", a[1]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_another_room",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "new room:",
							kind: "room",
							default: -1,
						},
						{
							name: "transition:",
							kind: "menu",
							menu: ["<no effect>", "Create from left", "Create from right", "Create from top", "Create from bottom", "Create from center", "Shift from left", "Shift from right", "Shift from top", "Shift from bottom", "Interlaced from left", "Interlaced from right", "Interlaced from top", "Interlaced from bottom", "Push from left", "Push from right", "Push from top", "Push from bottom", "Rotate left", "Rotate right", "Blend", "Fade out and in"],
							default: 0,
						},
					],
				},
				{
					id: 225,
					description: "Check Previous",
					listText: ["If previous room exists"],
					hintText: ["if previous room exists"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_if_previous_room",

					interfaceKind: "none",
					isQuestion: true,
				},
				{
					id: 226,
					description: "Check Next",
					listText: ["If next room exists"],
					hintText: ["if next room exists"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_if_next_room",

					interfaceKind: "none",
					isQuestion: true,
				},
			],
		},
		{
			name: "main2",
			items: [
				{
					name: "Timing",
					kind: "label",
				},
				{
					id: 301,
					description: "Set Alarm",
					listText: ["Set ", a[1], " ", r, "to ", a[0]],
					hintText: [w, "set ", a[1], " ", r, "to ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_set_alarm",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "number of steps:",
							kind: "expression",
							default: "0",
						},
						{
							name: "in alarm no:",
							kind: "menu",
							menu: ["Alarm 0", "Alarm 1", "Alarm 2", "Alarm 3", "Alarm 4", "Alarm 5", "Alarm 6", "Alarm 7", "Alarm 8", "Alarm 9", "Alarm 10", "Alarm 11"],
							default: 0,
						},
					],
				},
				{
					id: 302,
					description: "Sleep",
					listText: ["Sleep ", a[0], " milliseconds"],
					hintText: ["sleep ", a[0], " milliseconds; redrawing the screen: ", a[1]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_sleep",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "milliseconds:",
							kind: "both",
							default: "1000",
						},
						{
							name: "redraw:",
							kind: "boolean",
							default: true,
						},
					],
				},
				{
					kind: "separator",
				},
				{
					id: 305,
					description: "Set Time Line",
					listText: ["Set time line ", a[0]],
					hintText: [w, "set time line ", a[0], " at position ", a[1], ", ", a[2], " and ", a[3]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_timeline_set",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: false,

					args: [
						{
							name: "time line:",
							kind: "timeline",
							default: -1,
						},
						{
							name: "position:",
							kind: "expression",
							default: "0",
						},
						{
							name: "start:",
							kind: "menu",
							menu: ["Start Immediately", "Don't Start"],
							default: 0,
						},
						{
							name: "loop:",
							kind: "menu",
							menu: ["Don't Loop", "Loop"],
							default: 0,
						},
					],
				},
				{
					id: 304,
					description: "Time Line Position",
					listText: ["Set time line position to ", a[0]],
					hintText: [w, "set the time line position ", r, "to ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_set_timeline_position",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "position:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					id: 309,
					description: "Time Line Speed",
					listText: ["Set time line speed to ", a[0]],
					hintText: [w, "set the speed of the time line ", r, "to ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_set_timeline_speed",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "speed:",
							kind: "expression",
							default: "1",
						},
					],
				},
				{
					id: 306,
					description: "Start Time Line",
					listText: ["Start/resume time line"],
					hintText: [w, "start or resume the current time line"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_timeline_start",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: false,

					args: [],
				},
				{
					id: 307,
					description: "Pause Time Line",
					listText: ["Pause time line"],
					hintText: [w, "pause the current time line"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_timeline_pause",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: false,

					args: [],
				},
				{
					id: 308,
					description: "Stop Time Line",
					listText: ["Stop and reset time line"],
					hintText: [w, "stop and reset the current time line"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_timeline_stop",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: false,

					args: [],
				},
				{
					name: "Info",
					kind: "label",
				},
				{
					id: 321,
					description: "Display Message",
					listText: ["Display a message"],
					hintText: ["display message: ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_message",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "message:",
							kind: "both",
							default: "",
						},
					],
				},
				/*
				{
					id: 999,
					description: "Show Info",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					kind: "separator",
				},
				{
					id: 999,
					description: "Splash Text",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Splash Image",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Splash Webpage",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Splash Video",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Splash Settings",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				*/
				{
					name: "Game",
					kind: "label",
				},
				{
					id: 331,
					description: "Restart Game",
					listText: ["Restart the game"],
					hintText: ["restart the game"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_restart_game",

					interfaceKind: "none",
					isQuestion: false,
				},
				{
					id: 332,
					description: "End Game",
					listText: ["End the game"],
					hintText: ["end the game"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_end_game",

					interfaceKind: "none",
					isQuestion: false,
				},
				/*
				{
					kind: "separator",
				},
				{
					id: 999,
					description: "Save Game",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Load Game",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					name: "Resources",
					kind: "label",
				},
				{
					id: 999,
					description: "Replace Sprite",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Replace Sound",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Replace Background",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				*/
			],
		},
		{
			name: "control",
			items: [
				{
					name: "Questions",
					kind: "label",
				},
				{
					id: 401,
					description: "Check Empty",
					listText: ["If a position is collision free"],
					hintText: [w, "if ", r, "position (", a[0], ",", a[1], ") is ", n, "collision free for ", a[2], " objects"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_if_empty",

					interfaceKind: "normal",
					isQuestion: true,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "x:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y:",
							kind: "expression",
							default: "0",
						},
						{
							name: "objects",
							kind: "menu",
							menu: ["Only solid", "All"],
							default: 0,
						},
					],
				},
				{
					id: 402,
					description: "Check Collision",
					listText: ["If there is a collision at a position"],
					hintText: [w, "if ", r, "position (", a[0], ",", a[2], ") gives ", n, "a collision with ", a[2], " objects"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_if_collision",

					interfaceKind: "normal",
					isQuestion: true,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "x:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y:",
							kind: "expression",
							default: "0",
						},
						{
							name: "objects",
							kind: "menu",
							menu: ["Only solid", "All"],
							default: 0,
						},
					],
				},
				{
					id: 403,
					description: "Check Object",
					listText: ["If there is an object at a position"],
					hintText: [w, "if at ", r, "position (", a[1], ",", a[2], ") there is ", n, "object ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_if_object",

					interfaceKind: "normal",
					isQuestion: true,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "object:",
							kind: "object",
							default: -100,
						},
						{
							name: "x:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					id: 404,
					description: "Test Instance Count",
					listText: ["If the number of instances is a value"],
					hintText: ["if number of objects ", a[0], " is ", n, a[2], " ", a[1]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_if_number",

					interfaceKind: "normal",
					isQuestion: true,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "object:",
							kind: "object",
							default: -100,
						},
						{
							name: "number:",
							kind: "expression",
							default: "0",
						},
						{
							name: "operation:",
							kind: "menu",
							menu: ["Equal to", "Smaller than", "Larger than"],
							default: 0,
						},
					],
				},
				{
					id: 405,
					description: "Test Chance",
					listText: ["With chance 1 out of ", a[0], " perform next ", n],
					hintText: ["with a chance of 1 out of ", a[0], " do ", n, " perform the next action"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_if_dice",

					interfaceKind: "normal",
					isQuestion: true,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "sides:",
							kind: "expression",
							default: "2",
						},
					],
				},
				{
					id: 407,
					description: "Check Question",
					listText: ["If the user answers yes to a question"],
					hintText: ["if the player does ", n, "say yes to the question: ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_if_question",

					interfaceKind: "normal",
					isQuestion: true,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "question:",
							kind: "both",
							default: "",
						},
					],
				},
				{
					id: 408,
					description: "Test Expression",
					listText: ["If an expression is true"],
					hintText: [w, "if expression ", a[0], " is ", n, "true"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_if",

					interfaceKind: "normal",
					isQuestion: true,
					hasApplyTo: true,
					hasRelative: false,

					args: [
						{
							name: "expression:",
							kind: "expression",
							default: "",
						},
					],
				},
				{
					id: 409,
					description: "Check Mouse",
					listText: ["If ", a[0], " mouse button is ", n, "pressed"],
					hintText: ["if ", a[0], " mouse button is ", n, "pressed"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_if_mouse",

					interfaceKind: "normal",
					isQuestion: true,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "button",
							kind: "menu",
							menu: ["no", "left", "right", "middle"],
							default: 1,
						},
					],
				},
				{
					id: 410,
					description: "Check Grid",
					listText: ["If instance is aligned with grid"],
					hintText: [w, "if object is ", n, "aligned with grid with cells of ", a[0], " by ", a[1], " pixels"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_if_aligned",

					interfaceKind: "normal",
					isQuestion: true,
					hasApplyTo: true,
					hasRelative: false,

					args: [
						{
							name: "snap hor:",
							kind: "expression",
							default: "16",
						},
						{
							name: "snap vert:",
							kind: "expression",
							default: "16",
						},
					],
				},
				{
					name: "Other",
					kind: "label",
				},
				{
					id: 422,
					description: "Start Block",
					listText: ["Start of a block"],
					hintText: ["start of a block"],
					kind: "begin",
				},
				{
					id: 421,
					description: "Else",
					listText: ["Else"],
					hintText: ["else"],
					kind: "else",
				},
				{
					id: 425,
					description: "Exit Event",
					listText: ["Exit this event"],
					hintText: ["exit this event"],
					kind: "exit",
				},
				{
					id: 424,
					description: "End Block",
					listText: ["End of a block"],
					hintText: ["end of a block"],
					kind: "end",
				},
				{
					id: 423,
					description: "Repeat",
					listText: ["Repeat ", a[0], " times"],
					hintText: ["repeat next action (block) ", a[0], " times"],
					kind: "repeat",
				},
				{
					id: 604,
					description: "Call Parent Event",
					listText: ["Call the inherited event"],
					hintText: ["call the inherited event of the parent object"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_inherited",

					interfaceKind: "none",
					isQuestion: false,
				},
				{
					name: "Code",
					kind: "label",
				},
				{
					id: 603,
					description: "Execute Code",
					listText: ["Execute a piece of code"],
					hintText: [w, "execute code:\n\n", a[0]],
					kind: "code",
				},
				{
					id: 601,
					description: "Execute Script",
					listText: ["Execute script: ", a[0]],
					hintText: [w, "execute script ", a[0], " with arguments (", a[1], ",", a[2], ",", a[3], ",", a[4], ",", a[5], ")"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_execute_script",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: false,

					args: [
						{
							name: "script:",
							kind: "script",
							default: -1,
						},
						{
							name: "argument0:",
							kind: "expression",
							default: "0",
						},
						{
							name: "argument1:",
							kind: "expression",
							default: "0",
						},
						{
							name: "argument2:",
							kind: "expression",
							default: "0",
						},
						{
							name: "argument3:",
							kind: "expression",
							default: "0",
						},
						{
							name: "argument4:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					id: 605,
					description: "Comment",
					listText: [i, a[0]],
					hintText: ["COMMENT: ", a[0]],
					kind: "normal",
					execution: "nothing",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "comment:",
							kind: "string",
							default: "",
						},
					],
				},
				{
					name: "Variables",
					kind: "label",
				},
				{
					id: 611,
					description: "Set Variable",
					listText: ["Set variable ", a[0], " to ", a[1]],
					hintText: [w, "set variable ", a[0], " ", r, "to ", a[1]],
					kind: "variable",
				},
				{
					id: 612,
					description: "Test Variable",
					listText: ["If ", a[0], " is ", n, a[2], " ", a[1]],
					hintText: [w, "if ", a[0], " is ", n, a[2], " ", a[1]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_if_variable",

					interfaceKind: "normal",
					isQuestion: true,
					hasApplyTo: true,
					hasRelative: false,

					args: [
						{
							name: "variable:",
							kind: "expression",
							default: "",
						},
						{
							name: "value:",
							kind: "expression",
							default: "0",
						},
						{
							name: "operation:",
							kind: "menu",
							menu: ["equal to", "smaller than", "larger than"],
							default: "0",
						},
					],
				},
				{
					id: 613,
					description: "Draw Variable",
					listText: ["Draw the value of variable ", a[0]],
					hintText: [w, "at ", r, "position (", a[1], ",", a[2], ") draw the value of: ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_draw_variable",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "variable:",
							kind: "expression",
							default: "",
						},
						{
							name: "x:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y:",
							kind: "expression",
							default: "0",
						},
					],
				},
			],
		},
		{
			name: "score",
			items: [
				{
					name: "Score",
					kind: "label",
				},
				{
					id: 701,
					description: "Set Score",
					listText: ["Set the score ", r, "to ", a[0]],
					hintText: ["set the score ", r, "to ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_set_score",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: true,

					args: [
						{
							name: "new score:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					id: 702,
					description: "Test Score",
					listText: ["If score is ", n, a[1], " ", a[0]],
					hintText: ["if score is ", n, a[1], " ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_if_score",

					interfaceKind: "normal",
					isQuestion: true,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "value:",
							kind: "expression",
							default: "0",
						},
						{
							name: "operation:",
							kind: "menu",
							menu: ["equal to", "smaller than", "larger than"],
							default: 0,
						},
					],
				},
				{
					id: 703,
					description: "Draw Score",
					listText: ["Draw the value of score"],
					hintText: ["at ", r, "position (", a[0], ",", a[1], ") draw the value of score with caption ", a[2]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_draw_score",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: true,

					args: [
						{
							name: "x:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y:",
							kind: "expression",
							default: "0",
						},
						{
							name: "caption:",
							kind: "string",
							default: "Score: ",
						},
					],
				},
				{
					id: 709,
					description: "Show Highscore",
					listText: ["Show the highscore table"],
					hintText: ["show the highscore table\n    background: ", a[0], "\n     ", a[1], " the border\n     new color: ", a[2], ", other color: ", a[3], "\n     Font: ", a[4]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_highscore_show",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "background:",
							kind: "background",
							default: -1,
						},
						{
							name: "border:",
							kind: "menu",
							menu: ["don't show", "show"],
							default: 1,
						},
						{
							name: "new color:",
							kind: "color",
							default: 255,
						},
						{
							name: "other color:",
							kind: "color",
							default: 0,
						},
						{
							name: "font:",
							kind: "string", // TODO should be fontstring
							default: "\"Times New Roman\",10,0,0,0,0,0",
						},
					],
				},
				{
					id: 707,
					description: "Clear Highscore",
					listText: ["Clear the highscore table"],
					hintText: ["clear the highscore table"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_highscore_clear",

					interfaceKind: "none",
					isQuestion: false,
				},
				{
					name: "Lives",
					kind: "label",
				},
				{
					id: 711,
					description: "Set Lives",
					listText: ["Set lives ", r, "to ", a[0]],
					hintText: ["set the number of lives ", r, "to ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_set_life",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: true,

					args: [
						{
							name: "new lives:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					id: 712,
					description: "Test Lives",
					listText: ["If lives are ", n, a[1], " ", a[0]],
					hintText: ["If lives are ", n, a[1], " ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_if_life",

					interfaceKind: "normal",
					isQuestion: true,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "value:",
							kind: "expression",
							default: "0",
						},
						{
							name: "operation:",
							kind: "menu",
							menu: ["equal to", "smaller than", "larger than"],
							default: 0,
						},
					],
				},
				{
					id: 713,
					description: "Draw Lives",
					listText: ["Draw the number of lives"],
					hintText: ["at ", r, "position (", a[0], ",", a[1], ") draw the number of lives with caption ", a[2]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_draw_life",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: true,

					args: [
						{
							name: "x:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y:",
							kind: "expression",
							default: "0",
						},
						{
							name: "caption:",
							kind: "string",
							default: "Lives: ",
						},
					],
				},
				{
					id: 714,
					description: "Draw Life Images",
					listText: ["Draw the lives as image"],
					hintText: ["draw the lives ", r, "at (", a[0], ",", a[1], ") with sprite ", a[2]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_draw_life_images",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: true,

					args: [
						{
							name: "x:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y:",
							kind: "expression",
							default: "0",
						},
						{
							name: "image:",
							kind: "sprite",
							default: -1,
						},
					],
				},
				{
					name: "Health",
					kind: "label",
				},
				{
					id: 721,
					description: "Set Health",
					listText: ["Set the health ", r, "to ", a[0]],
					hintText: ["set the health ", r, "to ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_set_health",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: true,

					args: [
						{
							name: "value (0-100):",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					id: 722,
					description: "Test Health",
					listText: ["If health is ", n, a[1], " ", a[0]],
					hintText: ["if health is ", n, a[1], " ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_if_health",

					interfaceKind: "normal",
					isQuestion: true,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "value:",
							kind: "expression",
							default: "0",
						},
						{
							name: "operation:",
							kind: "menu",
							menu: ["equal to", "smaller than", "larger than"],
							default: 0,
						},
					],
				},
				/*
				{
					id: 999,
					description: "Draw Health",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Score Caption",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				*/
			],
		},
		{
			name: "extra",
			items: [
				/*
				{
					name: "Particles",
					kind: "label",
				},
				{
					id: 999,
					description: "Create Part System",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Destroy Part System",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Clear Part System",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Create Particle",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Particle Color",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Particle Life",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Particle Speed",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Particle Gravity",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Particle Secondary",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Create Emitter",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Destroy Emitter",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Burst from Emitter",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Stream from Emitter",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					name: "CD",
					kind: "label",
				},
				{
					id: 999,
					description: "Play CD",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Stop CD",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Pause CD",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Resume CD",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Check CD",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Check CD Playing",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				*/
				{
					name: "Other",
					kind: "label",
				},
				{
					id: 801,
					description: "Set Cursor",
					listText: ["Set mouse to ", a[0]],
					hintText: ["set the mouse cursor to sprite ", a[0], " and ", a[1], " the windows cursor"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_set_cursor",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "sprite:",
							kind: "sprite",
							default: -1,
						},
						{
							name: "cursor:",
							kind: "menu",
							menu: ["don't show", "show"],
							default: 0,
						},
					],
				},
			],
		},
		{
			name: "draw",
			items: [
				{
					name: "Drawing",
					kind: "label",
				},
				{
					id: 501,
					description: "Draw Sprite",
					listText: ["Draw sprite ", a[0]],
					hintText: [w, "at ", r, "position (", a[1], ",", a[2], ") draw image ", a[3], " of sprite ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_draw_sprite",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "sprite:",
							kind: "sprite",
							default: -1,
						},
						{
							name: "x:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y:",
							kind: "expression",
							default: "0",
						},
						{
							name: "subimage:",
							kind: "expression",
							default: "-1",
						},
					],
				},
				{
					id: 502,
					description: "Draw Background",
					listText: ["Draw background ", a[0]],
					hintText: ["at ", r, "position (", a[1], ",", a[2], ") draw background ", a[0], "; tiled: ", a[3]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_draw_background",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: true,

					args: [
						{
							name: "background:",
							kind: "background",
							default: -1,
						},
						{
							name: "x:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y:",
							kind: "expression",
							default: "0",
						},
						{
							name: "tiled:",
							kind: "boolean",
							default: false,
						},
					],
				},
				{
					kind: "separator",
				},
				{
					id: 514,
					description: "Draw Text",
					listText: ["Draw a text"],
					hintText: [w, "at ", r, "position (", a[1], ",", a[2], ") draw text: ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_draw_text",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "text:",
							kind: "both",
							default: "",
						},
						{
							name: "x:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					id: 519,
					description: "Draw Scaled Text",
					listText: ["Draw a text transformed"],
					hintText: [w, "at ", r, "position (", a[1], ",", a[2], ") draw text: ", a[0], " scaled horizontally with ", a[3], ", vertically with ", a[4], ", and rotated over ", a[5], " degrees"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_draw_text_transformed",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "text:",
							kind: "both",
							default: "",
						},
						{
							name: "x:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y:",
							kind: "expression",
							default: "0",
						},
						{
							name: "xscale:",
							kind: "expression",
							default: "1",
						},
						{
							name: "xyscale:",
							kind: "expression",
							default: "1",
						},
						{
							name: "angle:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					kind: "separator",
				},
				{
					id: 511,
					description: "Draw Rectangle",
					listText: ["Draw a rectangle"],
					hintText: [w, "draw rectangle with ", r, "vertices (", a[0], ",", a[1], ") and (", a[2], ",", a[3], "), ", a[4]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_draw_rectangle",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "x1:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y1:",
							kind: "expression",
							default: "0",
						},
						{
							name: "x2:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y2:",
							kind: "expression",
							default: "0",
						},
						{
							name: "filled:",
							kind: "menu",
							menu: ["filled", "outline"],
							default: 0,
						},
					],
				},
				/*
				{
					id: 999,
					description: "Horizontal Gradient",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Vertical Gradient",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				*/
				{
					id: 512,
					description: "Draw Ellipse",
					listText: ["Draw an ellipse"],
					hintText: [w, "draw an ellipse with ", r, "vertices (", a[0], ",", a[1], ") and (", a[2], ",", a[3], "), ", a[4]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_draw_ellipse",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "x1:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y1:",
							kind: "expression",
							default: "0",
						},
						{
							name: "x2:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y2:",
							kind: "expression",
							default: "0",
						},
						{
							name: "filled:",
							kind: "menu",
							menu: ["filled", "outline"],
							default: 0,
						},
					],
				},
				/*
				{
					id: 999,
					description: "Gradient Ellipse",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				*/
				{
					kind: "separator",
				},
				{
					id: 513,
					description: "Draw Line",
					listText: ["Draw a line"],
					hintText: [w, "draw a line ", r, "between (", a[0], ",", a[1], ") and (", a[2], ",", a[3], ")"],
					kind: "normal",
					execution: "function",
					executionFunction: "action_draw_line",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "x1:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y1:",
							kind: "expression",
							default: "0",
						},
						{
							name: "x2:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y2:",
							kind: "expression",
							default: "0",
						},
					],
				},
				{
					id: 515,
					description: "Draw Arrow",
					listText: ["Draw an arrow"],
					hintText: [w, "draw an arrow ", r, "between (", a[0], ",", a[1], ") and (", a[2], ",", a[3], ") with size ", a[4]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_draw_arrow",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: true,
					hasRelative: true,

					args: [
						{
							name: "x1:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y1:",
							kind: "expression",
							default: "0",
						},
						{
							name: "x2:",
							kind: "expression",
							default: "0",
						},
						{
							name: "y2:",
							kind: "expression",
							default: "0",
						},
						{
							name: "tip size:",
							kind: "expression",
							default: "12",
						},
					],
				},
				{
					name: "Settings",
					kind: "label",
				},
				{
					id: 524,
					description: "Set Color",
					listText: ["Set the color"],
					hintText: ["set the drawing color to ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_color",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "color",
							kind: "color",
							default: 16777215,
						},
					],
				},
				{
					id: 526,
					description: "Set Font",
					listText: ["Set font to ", a[0]],
					hintText: ["set the font for drawing text to ", a[0], " and align ", a[1]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_font",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "Font:",
							kind: "font",
							default: -1,
						},
						{
							name: "align:",
							kind: "menu",
							menu: ["left", "center", "right"],
							default: 0,
						},
					],
				},
				{
					id: 531,
					description: "Set Full Screen",
					listText: ["Change full screen mode"],
					hintText: ["set screen mode to: ", a[0]],
					kind: "normal",
					execution: "function",
					executionFunction: "action_fullscreen",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "action:",
							kind: "menu",
							menu: ["switch", "window", "fullscreen"],
							default: 0,
						},
					],
				},
				/*
				{
					name: "Other",
					kind: "label",
				},
				{
					id: 999,
					description: "Take Snapshot",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				{
					id: 999,
					description: "Create Effect",
					listText: [""],
					hintText: [""],
					kind: "normal",
					execution: "function",
					executionFunction: "",

					interfaceKind: "normal",
					isQuestion: false,
					hasApplyTo: false,
					hasRelative: false,

					args: [
						{
							name: "",
							kind: "",
							default: "",
						},
					],
				},
				*/
			],
		},
	];

	static {
		this.list.forEach(library => library.items.forEach(item => {
			if (item.kind != "label" && item.kind != "separator") {
				import(
					"./img/actions/action-" + library.name + "-" + item.id + "-icon.png"
				).then(({default: image}) => {
					item.image = image;
				});
			}
		}));
	}
}