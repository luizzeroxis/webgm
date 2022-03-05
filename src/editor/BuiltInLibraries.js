let b = {type: 'b'}; // All text bold
let i = {type: 'i'}; // All text italic
let r = {type: 'r'}; // Replaced by 'relative '
let n = {type: 'n'}; // Replaced by 'not '
let w = {type: 'w'}; // Replaced by 'for the other object: ' or 'for object <name of object>: ' if apply to is not self
let a = Array.from(new Array(6).keys()).map(x => ({type: 'a', number: x})); // Replaced by argument value

export default class BuiltInLibraries {
	static getList() {
		return [
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
							}
						],
					},
					/*
					{
						kind: "separator",
					},
					{
						id: 999,
						description: "Move to Contact",
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
						description: "Bounce",
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
						name: "Paths",
						kind: "label",
					},
					{
						id: 999,
						description: "Set Path",
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
						description: "End Path",
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
						description: "Path Position",
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
						description: "Path Speed",
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
						name: "Steps",
						kind: "label",
					},
					{
						id: 999,
						description: "Step Towards",
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
					/*
					{
						id: 999,
						description: "Create Moving",
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
						description: "Create Random",
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
						description: "Change Instance",
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
					/*
					{
						id: 999,
						description: "Destroy at Position",
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
					/*
					{
						id: 999,
						description: "Transform Sprite",
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
					{
						name: "Sounds",
						kind: "label",
					},
					{
						id: 999,
						description: "Play Sound",
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
						description: "Stop Sound",
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
						description: "Check Sound",
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
							}
						]
					},
					/*
					{
						kind: "separator",
					},
					{
						id: 999,
						description: "Set Time Line",
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
						description: "Time Line Position",
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
						description: "Time Line Speed",
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
						description: "Start Time Line",
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
						description: "Pause Time Line",
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
						description: "Stop Time Line",
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
							}
						]
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
					/*
					{
						id: 999,
						description: "Restart Game",
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
					/*
					{
						id: 999,
						description: "Call Parent Event",
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
						]
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
						]
					},
					/*
					{
						id: 999,
						description: "Draw Variable",
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
					
				]
			},
			{
				name: "score",
				items: [
					
				],
			},
			{
				name: "extra",
				items: [
					
				],
			},
			{
				name: "draw",
				items: [
					
				],
			},
		];
	}

}

/*
					{
						id: 999,
						description: "",
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