export default class Events {
	static CREATE = 0;
	static DESTROY = 1;
	static STEP = 3;
	static ALARM = 2;
	static KEYBOARD = 5;
	static MOUSE = 6;
	static COLLISION = 4;
	static OTHER = 7;
	static DRAW = 8;
	static KEYPRESS = 9;
	static KEYRELEASE = 10;
	static TRIGGER = 11;

	static STEP_NORMAL = 0;
	static STEP_BEGIN = 1;
	static STEP_END = 2;

	static OTHER_OUTSIDE_ROOM = 0;
	static OTHER_INTERSECT_BOUNDARY = 1;
	static OTHER_OUTSIDE_VIEW = 40; // unused
	static OTHER_BOUNDARY_VIEW = 50; // unused
	static OTHER_GAME_START = 2;
	static OTHER_GAME_END = 3;
	static OTHER_ROOM_START = 4;
	static OTHER_ROOM_END = 5;
	static OTHER_NO_MORE_LIVES = 6;
	static OTHER_NO_MORE_HEALTH = 9;
	static OTHER_ANIMATION_END = 7;
	static OTHER_END_OF_PATH = 8;
	static OTHER_CLOSE_BUTTON = 30; // unused
	static OTHER_USER = 10;

	static listEventTypes = [
		{
			id: Events.CREATE, value: "create", name: "Create",
			getFullName: () => "Create",
		},
		{
			id: Events.DESTROY, value: "destroy", name: "Destroy",
			getFullName: () => "Destroy",
		},
		{
			id: Events.STEP, value: "step", name: "Step",
			getFullName: subtype => Events.listStepSubtypes.find(x => x.value == subtype).name,
		},
		{
			id: Events.ALARM, value: "alarm", name: "Alarm",
			getFullName: subtype => "Alarm "+subtype,
		},
		{
			id: Events.KEYBOARD, value: "keyboard", name: "Keyboard",
			getFullName: subtype => Events.listKeyboardSubtypes.find(x => x.value == subtype).name,
		},
		{
			id: Events.MOUSE, value: "mouse", name: "Mouse",
			getFullName: subtype => Events.listMouseSubtypes.find(x => x.value == subtype).name,
		},
		{
			id: Events.COLLISION, value: "collision", name: "Collision",
			getFullName: (subtype, project) => "Collision with "
				+ (project.resources.ProjectObject.find(x => x.id == subtype)?.name ?? "<undefined>"),
		},
		{
			id: Events.OTHER, value: "other", name: "Other",
			getFullName: subtype => Events.listOtherSubtypes.find(x => x.value == subtype).name,
		},
		{
			id: Events.DRAW, value: "draw", name: "Draw",
			getFullName: () => "Draw",
		},
		{
			id: Events.KEYPRESS, value: "keypress", name: "Key press",
			getFullName: subtype => "press " + Events.listKeyboardSubtypes.find(x => x.value == subtype).name,
		},
		{
			id: Events.KEYRELEASE, value: "keyrelease", name: "Key release",
			getFullName: subtype => "release " + Events.listKeyboardSubtypes.find(x => x.value == subtype).name,
		},
	];

	static listStepSubtypes = [
		{id: Events.STEP_NORMAL, value: "normal", name: "Step"},
		{id: Events.STEP_BEGIN, value: "begin", name: "Begin step"},
		{id: Events.STEP_END, value: "end", name: "End step"},
	];

	static listKeyboardSubtypes = [
		{id: 37, value: 37, name: "<Left>"},
		{id: 39, value: 39, name: "<Right>"},
		{id: 38, value: 38, name: "<Up>"},
		{id: 40, value: 40, name: "<Down>"},

		{id: 17, value: 17, name: "<Ctrl>"},
		{id: 18, value: 18, name: "<Alt>"},
		{id: 16, value: 16, name: "<Shift>"},
		{id: 32, value: 32, name: "<Space>"},
		{id: 13, value: 13, name: "<Enter>"},

		{id: 96, value: 96, name: "<Keypad 0>"},
		{id: 97, value: 97, name: "<Keypad 1>"},
		{id: 98, value: 98, name: "<Keypad 2>"},
		{id: 99, value: 99, name: "<Keypad 3>"},
		{id: 100, value: 100, name: "<Keypad 4>"},
		{id: 101, value: 101, name: "<Keypad 5>"},
		{id: 102, value: 102, name: "<Keypad 6>"},
		{id: 103, value: 103, name: "<Keypad 7>"},
		{id: 104, value: 104, name: "<Keypad 8>"},
		{id: 105, value: 105, name: "<Keypad 9>"},
		{id: 111, value: 111, name: "<Keypad />"},
		{id: 106, value: 106, name: "<Keypad *>"},
		{id: 109, value: 109, name: "<Keypad ->"},
		{id: 107, value: 107, name: "<Keypad +>"},
		{id: 110, value: 110, name: "<Keypad .>"},

		{id: 48, value: 48, name: "0"},
		{id: 49, value: 49, name: "1"},
		{id: 50, value: 50, name: "2"},
		{id: 51, value: 51, name: "3"},
		{id: 52, value: 52, name: "4"},
		{id: 53, value: 53, name: "5"},
		{id: 54, value: 54, name: "6"},
		{id: 55, value: 55, name: "7"},
		{id: 56, value: 56, name: "8"},
		{id: 57, value: 57, name: "9"},

		{id: 65, value: 65, name: "A"},
		{id: 66, value: 66, name: "B"},
		{id: 67, value: 67, name: "C"},
		{id: 68, value: 68, name: "D"},
		{id: 69, value: 69, name: "E"},
		{id: 70, value: 70, name: "F"},
		{id: 71, value: 71, name: "G"},
		{id: 72, value: 72, name: "H"},
		{id: 73, value: 73, name: "I"},
		{id: 74, value: 74, name: "J"},
		{id: 75, value: 75, name: "K"},
		{id: 76, value: 76, name: "L"},
		{id: 77, value: 77, name: "M"},
		{id: 78, value: 78, name: "N"},
		{id: 79, value: 79, name: "O"},
		{id: 80, value: 80, name: "P"},
		{id: 81, value: 81, name: "Q"},
		{id: 82, value: 82, name: "R"},
		{id: 83, value: 83, name: "S"},
		{id: 84, value: 84, name: "T"},
		{id: 85, value: 85, name: "U"},
		{id: 86, value: 86, name: "V"},
		{id: 87, value: 87, name: "W"},
		{id: 88, value: 88, name: "X"},
		{id: 99, value: 99, name: "Y"},
		{id: 90, value: 90, name: "Z"},

		{id: 112, value: 112, name: "F1"},
		{id: 113, value: 113, name: "F2"},
		{id: 114, value: 114, name: "F3"},
		{id: 115, value: 115, name: "F4"},
		{id: 116, value: 116, name: "F5"},
		{id: 117, value: 117, name: "F6"},
		{id: 118, value: 118, name: "F7"},
		{id: 119, value: 119, name: "F8"},
		{id: 120, value: 120, name: "F9"},
		{id: 121, value: 121, name: "F10"},
		{id: 122, value: 122, name: "F11"},
		{id: 123, value: 123, name: "F12"},

		{id: 8, value: 8, name: "<Backspace>"},
		{id: 27, value: 27, name: "<Escape>"},
		{id: 36, value: 36, name: "<Home>"},
		{id: 35, value: 35, name: "<End>"},
		{id: 33, value: 33, name: "<Page up>"},
		{id: 34, value: 34, name: "<Page down>"},
		{id: 46, value: 46, name: "<Delete>"},
		{id: 45, value: 45, name: "<Insert>"},

		{id: 0, value: 0, name: "<No key>"},
		{id: 1, value: 1, name: "<Any key>"},
	];

	static listMouseSubtypes = [
		{id: 0, value: 0, kind: "button", button: 1, when: "mouse", name: "Left Button"},
		{id: 1, value: 1, kind: "button", button: 2, when: "mouse", name: "Right Button"},
		{id: 2, value: 2, kind: "button", button: 3, when: "mouse", name: "Middle Button"},
		{id: 3, value: 3, kind: "button", button: 0, when: "mouse", name: "No Button"},
		{id: 4, value: 4, kind: "button", button: 1, when: "mousePressed", name: "Left Press"},
		{id: 5, value: 5, kind: "button", button: 2, when: "mousePressed", name: "Right Press"},
		{id: 6, value: 6, kind: "button", button: 3, when: "mousePressed", name: "Middle Press"},
		{id: 7, value: 7, kind: "button", button: 1, when: "mouseReleased", name: "Left Release"},
		{id: 8, value: 8, kind: "button", button: 2, when: "mouseReleased", name: "Right Release"},
		{id: 9, value: 9, kind: "button", button: 3, when: "mouseReleased", name: "Middle Release"},
		{id: 10, value: 10, kind: "enter-leave", isEnter: true, name: "Mouse Enter"},
		{id: 11, value: 11, kind: "enter-leave", isEnter: false, name: "Mouse Leave"},
		{id: 60, value: 60, kind: "wheel-up", name: "Mouse Wheel Up"},
		{id: 61, value: 61, kind: "wheel-down", name: "Mouse Wheel Down"},
		{id: 50, value: 50, kind: "button", button: 1, global: true, when: "mouse", name: "Global Left Button"},
		{id: 51, value: 51, kind: "button", button: 2, global: true, when: "mouse", name: "Global Right Button"},
		{id: 52, value: 52, kind: "button", button: 3, global: true, when: "mouse", name: "Global Middle Button"},
		{id: 53, value: 53, kind: "button", button: 1, global: true, when: "mousePressed", name: "Global Left Press"},
		{id: 54, value: 54, kind: "button", button: 2, global: true, when: "mousePressed", name: "Global Right Press"},
		{id: 55, value: 55, kind: "button", button: 3, global: true, when: "mousePressed", name: "Global Middle Press"},
		{id: 56, value: 56, kind: "button", button: 1, global: true, when: "mouseReleased", name: "Global Left Release"},
		{id: 57, value: 57, kind: "button", button: 2, global: true, when: "mouseReleased", name: "Global Right Release"},
		{id: 58, value: 58, kind: "button", button: 3, global: true, when: "mouseReleased", name: "Global Middle Release"},

		{id: 16, value: 16, kind: "joystick", number: 1, button: 14, name: "Joystick1 Left"},
		{id: 17, value: 17, kind: "joystick", number: 1, button: 15, name: "Joystick1 Right"},
		{id: 18, value: 18, kind: "joystick", number: 1, button: 12, name: "Joystick1 Up"},
		{id: 19, value: 19, kind: "joystick", number: 1, button: 13, name: "Joystick1 Down"},
		{id: 21, value: 21, kind: "joystick", number: 1, button: 0, name: "Joystick1 Button1"},
		{id: 22, value: 22, kind: "joystick", number: 1, button: 1, name: "Joystick1 Button2"},
		{id: 23, value: 23, kind: "joystick", number: 1, button: 2, name: "Joystick1 Button3"},
		{id: 24, value: 24, kind: "joystick", number: 1, button: 3, name: "Joystick1 Button4"},
		{id: 25, value: 25, kind: "joystick", number: 1, button: 4, name: "Joystick1 Button5"},
		{id: 26, value: 26, kind: "joystick", number: 1, button: 5, name: "Joystick1 Button6"},
		{id: 27, value: 27, kind: "joystick", number: 1, button: 6, name: "Joystick1 Button7"},
		{id: 28, value: 28, kind: "joystick", number: 1, button: 7, name: "Joystick1 Button8"},
		{id: 31, value: 31, kind: "joystick", number: 2, button: 14, name: "Joystick2 Left"},
		{id: 32, value: 32, kind: "joystick", number: 2, button: 15, name: "Joystick2 Right"},
		{id: 33, value: 33, kind: "joystick", number: 2, button: 12, name: "Joystick2 Up"},
		{id: 34, value: 34, kind: "joystick", number: 2, button: 13, name: "Joystick2 Down"},
		{id: 36, value: 36, kind: "joystick", number: 2, button: 0, name: "Joystick2 Button1"},
		{id: 37, value: 37, kind: "joystick", number: 2, button: 1, name: "Joystick2 Button2"},
		{id: 38, value: 38, kind: "joystick", number: 2, button: 2, name: "Joystick2 Button3"},
		{id: 39, value: 39, kind: "joystick", number: 2, button: 3, name: "Joystick2 Button4"},
		{id: 40, value: 40, kind: "joystick", number: 2, button: 4, name: "Joystick2 Button5"},
		{id: 41, value: 41, kind: "joystick", number: 2, button: 5, name: "Joystick2 Button6"},
		{id: 42, value: 42, kind: "joystick", number: 2, button: 6, name: "Joystick2 Button7"},
		{id: 43, value: 43, kind: "joystick", number: 2, button: 7, name: "Joystick2 Button8"},
	];

	static listOtherSubtypes = [
		{id: 0, value: 0, name: "Outside room"},
		{id: 1, value: 1, name: "Intersect boundary"},
		{id: 40, value: 40, name: "Outside view 0"},
		{id: 41, value: 41, name: "Outside view 1"},
		{id: 42, value: 42, name: "Outside view 2"},
		{id: 43, value: 43, name: "Outside view 3"},
		{id: 44, value: 44, name: "Outside view 4"},
		{id: 45, value: 45, name: "Outside view 5"},
		{id: 46, value: 46, name: "Outside view 6"},
		{id: 47, value: 47, name: "Outside view 7"},
		{id: 50, value: 50, name: "Boundary view 0"},
		{id: 51, value: 51, name: "Boundary view 1"},
		{id: 52, value: 52, name: "Boundary view 2"},
		{id: 53, value: 53, name: "Boundary view 3"},
		{id: 54, value: 54, name: "Boundary view 4"},
		{id: 55, value: 55, name: "Boundary view 5"},
		{id: 56, value: 56, name: "Boundary view 6"},
		{id: 57, value: 57, name: "Boundary view 7"},
		{id: 2, value: 2, name: "Game start"},
		{id: 3, value: 3, name: "Game end"},
		{id: 4, value: 4, name: "Room start"},
		{id: 5, value: 5, name: "Room end"},
		{id: 6, value: 6, name: "No more lives"},
		{id: 9, value: 9, name: "No more health"},
		{id: 7, value: 7, name: "Animation end"},
		{id: 8, value: 8, name: "End of path"},
		{id: 30, value: 30, name: "Close button"},
		{id: 10, value: 10, name: "User 0"},
		{id: 11, value: 11, name: "User 1"},
		{id: 12, value: 12, name: "User 2"},
		{id: 13, value: 13, name: "User 3"},
		{id: 14, value: 14, name: "User 4"},
		{id: 15, value: 15, name: "User 5"},
		{id: 16, value: 16, name: "User 6"},
		{id: 17, value: 17, name: "User 7"},
		{id: 18, value: 18, name: "User 8"},
		{id: 19, value: 19, name: "User 9"},
		{id: 20, value: 20, name: "User 10"},
		{id: 21, value: 21, name: "User 11"},
		{id: 22, value: 22, name: "User 12"},
		{id: 23, value: 23, name: "User 13"},
		{id: 24, value: 24, name: "User 14"},
		{id: 25, value: 25, name: "User 15"},
	];

	static getEventName(eventType, eventSubtype, project) {
		return Events.listEventTypes.find(x => x.value == eventType).getFullName(eventSubtype, project);
	}
}