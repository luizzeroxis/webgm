import {parent, endparent, add, HElement, HButton} from "~/common/h";
import {setDraggable} from "~/common/tools";

import HWindowBorder from "./HWindowBorder.js";

export default class HWindow extends HElement {
	constructor(manager) {
		super("div", {class: "h-window"});

		this.manager = manager;

		this.x = 0;
		this.y = 0;
		this.w = 0;
		this.h = 0;

		this.restore = {x: 0, y: 0, w: 0, h: 0};
		this.isMinimized = false;
		this.isMaximized = false;

		this.windowChildren = [];
		this.windowParent = null;

		this.offX = 0;
		this.offY = 0;

		this.html.addEventListener("focusin", () => {
			this.manager.focus(this);
		});
		this.html.addEventListener("mousedown", () => {
			this.manager.focus(this);
		});

		parent(this);

			add( new HWindowBorder(this, "top-left") );
			add( new HWindowBorder(this, "top") );
			add( new HWindowBorder(this, "top-right") );
			add( new HWindowBorder(this, "left") );

			parent( add( new HElement("div", {class: "contents"}) ) );

				this.titleBar = parent( add( new HElement("div", {class: "title-bar"}) ) );

					setDraggable(this.titleBar,
						e => { // mousedown
							if (e.target != this.titleBar.html && e.target != this.title.html) return false;
							if (this.isMaximized && !this.isMinimized) return false;

							// Pos relative to window
							const rect = this.html.getBoundingClientRect();
							this.offX = e.clientX - rect.left;
							this.offY = e.clientY - rect.top;
							return true;
						},
						e => { // mousemove
							// Pos relative to window manager
							const rect = manager.html.getBoundingClientRect();
							const style = window.getComputedStyle(manager.html);

							let x = e.clientX - rect.left - parseFloat(style.borderLeftWidth) + manager.html.scrollLeft;
							let y = e.clientY - rect.top - parseFloat(style.borderTopWidth) + manager.html.scrollTop;

							if (x < 0) { x = 0; }
							if (y < 0) { y = 0; }

							this.setPosition(x - this.offX, y - this.offY);
						},
					);

					this.title = add( new HElement("div", {class: "title"}) );

					this.minimizeButton = add( new HButton("🗕", () => this.minimize(), "minimize") );
					this.minimizeButton.html.title = "Minimize";

					this.maximizeButton = add( new HButton("🗖", () => this.maximize(), "maximize") );
					this.maximizeButton.html.title = "Maximize";

					this.closeButton = add( new HButton("🗙", () => this.close(), "close") );
					this.closeButton.html.title = "Close";
					endparent();

				this.client = add( new HElement("div", {class: "client"}) );

				endparent();

			add( new HWindowBorder(this, "right") );
			add( new HWindowBorder(this, "bottom-left") );
			add( new HWindowBorder(this, "bottom") );
			add( new HWindowBorder(this, "bottom-right") );

			endparent();
	}

	onAdd() {
		this.setPositionToDefault();
		this.setSizeToDefault();
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;

		this.html.style.left = x.toString() + "px";
		this.html.style.top = y.toString() + "px";
	}

	setSize(w, h) {
		this.w = w;
		this.h = h;

		this.html.style.width = w.toString() + "px";
		this.html.style.height = h.toString() + "px";
	}

	setPositionToDefault() {
		let x = 0;
		let y = 0;

		while (true) {
			const positionTaken = this.manager.windows.some(w => (w.x == x && w.y == y)); // eslint-disable-line no-loop-func

			if (positionTaken) {
				x += this.manager.cascadeDiff;
				y += this.manager.cascadeDiff;
			} else {
				break;
			}
		}

		this.setPosition(x, y);
	}

	setSizeToDefault(hasMaxSize=true) {
		this.html.style.removeProperty("width");
		this.html.style.removeProperty("height");

		const style = window.getComputedStyle(this.html);

		let w = parseFloat(style.width);
		let h = parseFloat(style.height);

		if (hasMaxSize) {
			const maxSize = this.getMaxSize();
			w = Math.min(maxSize.w, w);
			h = Math.min(maxSize.h, h);
		}

		this.setSize(w, h);
	}

	minimize() {
		if (!this.isMinimized) {
			this.html.classList.add("minimized");

			if (!this.isMaximized) {
				this.restore = {x: this.x, y: this.y, w: this.w, h: this.h};
			} else {
				this.html.classList.remove("maximized");

				this.maximizeButton.html.textContent = "🗖";
				this.maximizeButton.html.title = "Maximize";
			}

			this.setSizeToDefault();
			this.setSize(this.manager.minimizedSize, this.h);

			const pos = this.getNextMinimizePosition();
			this.setPosition(pos.x, pos.y );

			this.minimizeButton.html.textContent = "🗗";
			this.minimizeButton.html.title = "Restore";

			this.isMinimized = true;
		} else {
			this.html.classList.remove("minimized");

			if (!this.isMaximized) {
				this.setSize(this.restore.w, this.restore.h);
				this.setPosition(this.restore.x, this.restore.y);
			} else {
				this.html.classList.add("maximized");

				this.html.style.removeProperty("width");
				this.html.style.removeProperty("height");

				this.setPosition(0, 0);

				this.maximizeButton.html.textContent = "🗗";
				this.maximizeButton.html.title = "Restore";
			}

			this.minimizeButton.html.textContent = "🗕";
			this.minimizeButton.html.title = "Minimize";

			this.isMinimized = false;
		}
	}

	maximize() {
		if (this.isMinimized) {
			this.html.classList.remove("minimized");

			this.minimizeButton.html.textContent = "🗕";
			this.minimizeButton.html.title = "Minimize";

			this.isMinimized = false;

			this.html.classList.add("maximized");

			this.html.style.removeProperty("width");
			this.html.style.removeProperty("height");

			this.setPosition(0, 0);

			this.maximizeButton.html.textContent = "🗗";
			this.maximizeButton.html.title = "Restore";

			this.isMaximized = true;
		} else {
			if (!this.isMaximized) {
				this.html.classList.add("maximized");

				this.restore = {x: this.x, y: this.y, w: this.w, h: this.h};

				this.html.style.removeProperty("width");
				this.html.style.removeProperty("height");

				this.setPosition(0, 0);

				this.maximizeButton.html.textContent = "🗗";
				this.maximizeButton.html.title = "Restore";

				this.isMaximized = true;
			} else {
				this.html.classList.remove("maximized");

				this.setSize(this.restore.w, this.restore.h);
				this.setPosition(this.restore.x, this.restore.y);

				this.maximizeButton.html.textContent = "🗖";
				this.maximizeButton.html.title = "Maximize";

				this.isMaximized = false;
			}
		}
	}

	getMaxSize() {
		const style = window.getComputedStyle(this.manager.html);

		const w = parseFloat(style.width);
		const h = parseFloat(style.height);

		return {w, h};
	}

	getNextMinimizePosition() {
		let x = 0;
		let y = this.getMaxSize().h - this.h;

		for (const w of [...this.manager.windows].reverse()) {
			if (w.isMinimized && w.x == x && w.y == y) {
				x += this.manager.minimizedSize;
			}
		}

		return {x, y};
	}

	openAsChild(windowClass, idFunc, ...args) {
		const w = this.manager.open(windowClass, idFunc, ...args);
		w.parent = this;
		this.windowChildren.push(w);
	}

	close() {
		for (const child of this.windowChildren) {
			child.close();
		}

		this.manager.delete(this);

		if (this.windowParent) {
			this.windowParent.children.splice(this.windowParent.children.indexOf(this), 1);
		}
	}

	// DEPRECATED: delete this later
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
}