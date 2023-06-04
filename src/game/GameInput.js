export default class GameInput {
	constructor(game, inputElement) {
		this.game = game;
		this.inputElement = inputElement;

		this.keyDownHandler = null;
		this.keyUpHandler = null;
		this.mouseDownHandler = null;
		this.mouseUpHandler = null;
		this.mouseMoveHandler = null;
		this.wheelHandler = null;
		this.contextMenuHandler = null;

		this.key = {};
		this.keyPressed = {};
		this.keyReleased = {};

		this.currentKey = 0;
		this.lastKey = 0;
		this.lastKeyChar = "\0";
		this.keyboardString = "";

		this.mouse = {};
		this.mousePressed = {};
		this.mouseReleased = {};
		this.mouseX = 0;
		this.mouseY = 0;
		this.mouseWheel = 0;

		this.currentMouse = 0;
		this.lastMouse = 0;

		this.mouseDisplayX = 0;
		this.mouseDisplayY = 0;

		this.mouseXInCurrentView = 0;
		this.mouseYInCurrentView = 0;
	}

	start() {
		// Keyboard

		this.keyDownHandler = (e) => {
			e.preventDefault();

			const key = GameInput.codeToWhichMap[e.code];

			this.key[key] = true;
			this.keyPressed[key] = true;

			this.currentKey = key;
			this.lastKey = key;

			if (e.key.length == 1) {
				this.lastKeyChar = e.key;
				this.keyboardString = (this.keyboardString + e.key).slice(-1024);
			} else if (e.key == "Backspace") {
				this.lastKeyChar = "\b";
				this.keyboardString = this.keyboardString.slice(0, -1);
			}
		};
		this.inputElement.addEventListener("keydown", this.keyDownHandler);

		this.keyUpHandler = (e) => {
			e.preventDefault();

			const key = GameInput.codeToWhichMap[e.code];

			this.key[key] = false;
			this.keyReleased[key] = true;

			this.currentKey = 0;
		};
		this.inputElement.addEventListener("keyup", this.keyUpHandler);

		// Mouse

		this.mouseDownHandler = (e) => {
			e.preventDefault();

			this.game.render.canvas.focus({preventScroll: true});

			const button = this.toEngineButton(e.button);
			this.mouse[button] = true;
			this.mousePressed[button] = true;

			this.currentMouse = button;
			this.lastMouse = button;
		};
		this.inputElement.addEventListener("mousedown", this.mouseDownHandler);

		this.mouseUpHandler = (e) => {
			e.preventDefault();

			const button = this.toEngineButton(e.button);
			this.mouse[button] = false;
			this.mouseReleased[button] = true;

			this.currentMouse = 0;
		};
		this.inputElement.addEventListener("mouseup", this.mouseUpHandler);

		this.mouseMoveHandler = (e) => {
			const rect = this.inputElement.getBoundingClientRect();
			this.mouseDisplayX = e.clientX + document.documentElement.scrollLeft;
			this.mouseDisplayY = e.clientY + document.documentElement.scrollTop;
			this.mouseX = Math.floor(e.clientX - rect.left);
			this.mouseY = Math.floor(e.clientY - rect.top);
		};
		this.inputElement.addEventListener("mousemove", this.mouseMoveHandler);

		this.wheelHandler = (e) => {
			e.preventDefault();
			this.mouseWheel += e.deltaY;
		};
		this.inputElement.addEventListener("wheel", this.wheelHandler);

		this.contextMenuHandler = (e) => {
			e.preventDefault();
		};
		this.inputElement.addEventListener("contextmenu", this.contextMenuHandler);
	}

	end() {
		this.inputElement.removeEventListener("keydown", this.keyDownHandler);
		this.inputElement.removeEventListener("keyup", this.keyUpHandler);
		this.inputElement.removeEventListener("mousedown", this.mouseDownHandler);
		this.inputElement.removeEventListener("mouseup", this.mouseUpHandler);
		this.inputElement.removeEventListener("mousemove", this.mouseMoveHandler);
		this.inputElement.removeEventListener("wheel", this.wheelHandler);
		this.inputElement.removeEventListener("contextmenu", this.contextMenuHandler);
	}

	clear() {
		this.key = {};
		this.currentKey = 0;
		this.mouse = {};
		this.currentMouse = 0;

		this.clearStep();
	}

	clearStep() {
		this.keyPressed = {};
		this.keyReleased = {};
		this.mousePressed = {};
		this.mouseReleased = {};
		this.mouseWheel = 0;
	}

	clearKey(key) {
		this.key[key] = false;
		this.keyPressed[key] = false;
		this.keyReleased[key] = false;
	}

	clearMouse(numb) {
		this.mouse[numb] = false;
		this.mousePressed[numb] = false;
		this.mouseReleased[numb] = false;
	}

	toEngineButton(button) {
		return button == 1 ? 3 // middle button
			: button == 2 ? 2 // right button
			: button + 1; // every other button
	}

	// Get state of a key. dict should be key, keyPressed or keyReleased.
	getKey(key, dict) {
		if (key == 0) { // vk_nokey
			return Object.values(dict).every(value => !value);
		}
		if (key == 1) { // vk_anykey
			return Object.values(dict).some(value => value);
		}
		return dict[key];
	}

	// Get state of a mouse button. dict should be mouse, mousePressed or mouseReleased.
	getMouse(numb, dict) {
		if (numb == -1) { // mb_any
			return Object.values(dict).some(value => value);
		}
		if (numb == 0) { // mb_none
			return Object.values(dict).every(value => !value);
		}
		return dict[numb];
	}

	updateMousePositionInCurrentView() {
		if (!this.game.room.viewsEnabled) {
			this.mouseXInCurrentView = this.mouseX;
			this.mouseYInCurrentView = this.mouseY;
			return;
		}

		let currentView = null;
		let firstVisibleView = null;

		for (const view of [...this.game.room.views].reverse()) {
			if (view.visible) {
				if (this.mouseX >= view.portX && this.mouseX < view.portX + view.portW
					&& this.mouseY >= view.portY && this.mouseY < view.portY + view.portH) {
					currentView = view;
					break;
				}
				firstVisibleView = view;
			}
		}

		if (currentView == null) {
			if (firstVisibleView == null) {
				this.mouseXInCurrentView = this.mouseX;
				this.mouseYInCurrentView = this.mouseY;
				return;
			}

			currentView = firstVisibleView;
		}

		const pos = this.getMousePositionOnView(currentView);
		this.mouseXInCurrentView = pos.x;
		this.mouseYInCurrentView = pos.y;
	}

	getMousePositionOnView(view) {
		let x = this.mouseX;
		let y = this.mouseY;

		[x, y] = [x - view.portX, y - view.portY];

		[x, y] = [x * view.viewW / view.portW, y * view.viewH / view.portH];

		[x, y] = [x + view.viewX, y + view.viewY];

		[x, y] = [x - view.viewW / 2, y - view.viewH / 2];

		const a = -view.angle * Math.PI/180;
		const cos = Math.cos(a);
		const sin = -Math.sin(a);
		[x, y] = [cos*x - sin*y, sin*x + cos*y];

		[x, y] = [x + view.viewW / 2, y + view.viewH / 2];

		return {x, y};
	}

	static codeToWhichMap = {
		"": -1,
		"Unidentified": -1,

		"Backspace": 8,
		"Tab": 9,
		"Enter": 13,
		"NumpadEnter": 13,
		"ShiftLeft": 16,
		"ShiftRight": 16,
		"ControlLeft": 17,
		"ControlRight": 17,
		"AltLeft": 18,
		"AltRight": 18,
		"Pause": 19,
		"CapsLock": 20,
		"Escape": 27,
		"Space": 32,
		"PageUp": 33,
		"PageDown": 34,
		"End": 35,
		"Home": 36,
		"ArrowLeft": 37,
		"ArrowUp": 38,
		"ArrowRight": 39,
		"ArrowDown": 40,
		"PrintScreen": 44,
		"Insert": 45,
		"Delete": 46,
		"Digit0": 48,
		"Digit1": 49,
		"Digit2": 50,
		"Digit3": 51,
		"Digit4": 52,
		"Digit5": 53,
		"Digit6": 54,
		"Digit7": 55,
		"Digit8": 56,
		"Digit9": 57,
		"KeyA": 65,
		"KeyB": 66,
		"KeyC": 67,
		"KeyD": 68,
		"KeyE": 69,
		"KeyF": 70,
		"KeyG": 71,
		"KeyH": 72,
		"KeyI": 73,
		"KeyJ": 74,
		"KeyK": 75,
		"KeyL": 76,
		"KeyM": 77,
		"KeyN": 78,
		"KeyO": 79,
		"KeyP": 80,
		"KeyQ": 81,
		"KeyR": 82,
		"KeyS": 83,
		"KeyT": 84,
		"KeyU": 85,
		"KeyV": 86,
		"KeyW": 87,
		"KeyX": 88,
		"KeyY": 89,
		"KeyZ": 90,
		"MetaLeft": 91,
		"OSLeft": 91,
		"MetaRight": 92,
		"OSRight": 92,
		"ContextMenu": 93,
		"Numpad0": 96,
		"Numpad1": 97,
		"Numpad2": 98,
		"Numpad3": 99,
		"Numpad4": 100,
		"Numpad5": 101,
		"Numpad6": 102,
		"Numpad7": 103,
		"Numpad8": 104,
		"Numpad9": 105,
		"NumpadMultiply": 106,
		"NumpadAdd": 107,
		"NumpadSubtract": 109,
		"NumpadDecimal": 110,
		"NumpadDivide": 111,
		"F1": 112,
		"F2": 113,
		"F3": 114,
		"F4": 115,
		"F5": 116,
		"F6": 117,
		"F7": 118,
		"F8": 119,
		"F9": 120,
		"F10": 121,
		"F11": 122,
		"F12": 123,
		"NumLock": 144,
		"ScrollLock": 145,
		// vk_lshift: 160,
		// vk_rshift: 161,
		// vk_lcontrol: 162,
		// vk_rcontrol: 163,
		// vk_lalt: 164,
		// vk_ralt: 165,
		"Semicolon": 186,
		"Equal": 187,
		"Comma": 188,
		"Minus": 189,
		"Period": 190,
		"Slash": 191,
		"Backquote": 192,
		"NumpadComma": 194,
		"BracketLeft": 219,
		"Backslash": 220,
		"BracketRight": 221,
		"Quote": 222,
		"IntlBackslash": 226,

		"AudioVolumeDown": -1,
		"AudioVolumeMute": -1,
		"AudioVolumeUp": -1,
		"BrowserBack": -1,
		"BrowserFavorites": -1,
		"BrowserForward": -1,
		"BrowserHome": -1,
		"BrowserRefresh": -1,
		"BrowserSearch": -1,
		"BrowserStop": -1,
		"Convert": -1,
		"Copy": -1,
		"Cut": -1,
		"Eject": -1,
		"F13": -1,
		"F14": -1,
		"F15": -1,
		"F16": -1,
		"F17": -1,
		"F18": -1,
		"F19": -1,
		"F20": -1,
		"F21": -1,
		"F22": -1,
		"F23": -1,
		"F24": -1,
		"IntlRo": -1,
		"IntlYen": -1,
		"KanaMode": -1,
		"Lang1": -1,
		"Lang2": -1,
		"Lang3": -1,
		"Lang4": -1,
		"LaunchApp1": -1,
		"LaunchApp2": -1,
		"LaunchMail": -1,
		"MediaPlayPause": -1,
		"MediaSelect": -1,
		"MediaStop": -1,
		"MediaTrackNext": -1,
		"MediaTrackPrevious": -1,
		"NonConvert": -1,
		"NumpadEqual": -1,
		"Paste": -1,
		"Power": -1,
		"Sleep": -1,
		"Undo": -1,
		"VolumeDown": -1,
		"VolumeUp": -1,
		"WakeUp": -1,
	};
}