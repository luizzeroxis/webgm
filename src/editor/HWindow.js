import {parent, endparent, add, HElement, HButton} from "../common/H.js";

export default class HWindow extends HElement {
	constructor(editor, id) {
		super("div", {class: "window"});

		this.editor = editor;
		this.id = id;

		this.x = 0;
		this.y = 0;

		this.html.addEventListener("focusin", () => {
			this.editor.windowsArea.focus(this.id);
		});
		this.html.addEventListener("mousedown", () => {
			this.editor.windowsArea.focus(this.id);
		});

		parent(this);

			this.titlebar = parent( add( new HElement("div", {class: "titlebar"}) ) );

			this.titlebar.html.addEventListener("mousedown", e => {
				if (e.button != 0) return;
				if (e.target != this.html && e.target != this.title.html) return;

				// this.html.style.position = "absolute";

				// Pos relative to window
				const rect = this.html.getBoundingClientRect();
				this.offX = e.clientX - rect.left;
				this.offY = e.clientY - rect.top;

				document.removeEventListener("mousemove", this.mouseMoveHandler);
				document.removeEventListener("mouseup", this.mouseUpHandler);

				this.mouseMoveHandler = e => {
					// Pos relative to windowarea
					const rect = editor.windowsArea.html.getBoundingClientRect();
					const style = window.getComputedStyle(editor.windowsArea.html);

					let x = e.clientX - rect.left - parseFloat(style.borderLeftWidth) + editor.windowsArea.html.scrollLeft;
					let y = e.clientY - rect.top - parseFloat(style.borderTopWidth) + editor.windowsArea.html.scrollTop;

					if (x < 0) { x = 0; }
					if (y < 0) { y = 0; }

					this.setPosition(x - this.offX, y - this.offY);
				};

				document.addEventListener("mousemove", this.mouseMoveHandler);

				this.mouseUpHandler = () => {
					document.removeEventListener("mousemove", this.mouseMoveHandler);
					document.removeEventListener("mouseup", this.mouseUpHandler);
				};

				document.addEventListener("mouseup", this.mouseUpHandler);
			});

				this.title = add( new HElement("div", {class: "title"}) );
				this.restoreMaximizeButton = add( new HButton("Maximize", () => this.restoreMaximize(), "restore-maximize") );
				this.closeButton = add( new HButton("Close", () => this.close(), "close") );
				endparent();

			this.client = add( new HElement("div", {class: "client"}) );

			endparent();

		this.applyButton = null;
		this.okButton = null;
	}

	onAdd() {
		this.setPositionToDefault();
		this.setSizeToDefault();
	}

	makeApplyOkButtons(applyOkFunc, okFunc) {
		parent( add( new HElement("div") ) );

			this.applyButton = add( new HButton("Apply", () => {
				applyOkFunc();
			}) );

			this.okButton = add( new HButton("Ok", () => {
				if (applyOkFunc() != false)
					okFunc();
			}) );

			endparent();
	}

	getMaxSize() {
		const windowAreaStyle = window.getComputedStyle(this.editor.windowsArea.html);
		const windowStyle = window.getComputedStyle(this.html);
		const titleBarStyle = window.getComputedStyle(this.titlebar.html);
		const style = window.getComputedStyle(this.client.html);

		let w = parseFloat(windowAreaStyle.width);
		let h = parseFloat(windowAreaStyle.height);

		w = w - parseFloat(windowStyle.borderLeftWidth) - parseFloat(windowStyle.borderRightWidth);
		h = h - parseFloat(windowStyle.borderTopWidth) - parseFloat(windowStyle.borderBottomWidth);

		h -= parseFloat(titleBarStyle.height);

		w = w - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
		h = h - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);

		return {w, h};
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;

		this.html.style.left = x.toString() + "px";
		this.html.style.top = y.toString() + "px";
	}

	setSize(w, h) {
		this.client.html.style.width = w.toString() + "px";
		this.client.html.style.height = h.toString() + "px";
	}

	setPositionToDefault() {
		let x = 0;
		let y = 0;

		while (true) {
			const positionTaken = this.editor.windowsArea.windows.some(w => (w.x == x && w.y == y)); // eslint-disable-line no-loop-func

			if (positionTaken) {
				x += this.editor.windowsArea.cascadeDiff;
				y += this.editor.windowsArea.cascadeDiff;
			} else {
				break;
			}
		}

		this.setPosition(x, y);
	}

	setSizeToDefault(hasMaxSize=true) {
		this.client.html.style.removeProperty("width");
		this.client.html.style.removeProperty("height");

		const style = window.getComputedStyle(this.client.html);

		let w = parseFloat(style.width);
		let h = parseFloat(style.height);

		if (hasMaxSize) {
			const maxSize = this.getMaxSize();
			w = Math.min(maxSize.w, w);
			h = Math.min(maxSize.h, h);
		}

		this.setSize(w, h);
	}

	restoreMaximize() {
		const {w, h} = this.getMaxSize();
		this.setSize(w, h);
		this.setPosition(0, 0);
	}

	close() {
		this.editor.windowsArea.delete(this);
	}
}