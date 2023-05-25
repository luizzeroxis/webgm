import {parent, endparent, add, HElement, HButton} from "~/common/h";

class HWindowBorder extends HElement {
	constructor(win, side) {
		super("div", {class: "border "+side});

		this.setEvent("mousedown", e => {
			if (e.button != 0) return;

			document.removeEventListener("mousemove", this.mouseMoveHandler);
			document.removeEventListener("mouseup", this.mouseUpHandler);

			const rect = win.html.getBoundingClientRect();
			this.offX = rect.width - (e.clientX - rect.left);
			this.offY = rect.height - (e.clientY - rect.top);

			this.offLeft = e.clientX - rect.left;
			this.offTop = e.clientY - rect.top;

			this.mouseMoveHandler = e => {
				let x = win.x;
				let y = win.y;
				let w = win.w;
				let h = win.h;

				const rect = win.html.getBoundingClientRect();

				const windowsAreaRect = win.editor.windowsArea.html.getBoundingClientRect();
				const windowsAreaStyle = window.getComputedStyle(win.editor.windowsArea.html);

				// right
				if (side == "bottom-right" || side == "right" || side == "top-right") {
					w = e.clientX + this.offX - rect.left;
				}
				// bottom
				if (side == "bottom-left" || side == "bottom" || side == "bottom-right") {
					h = e.clientY + this.offY - rect.top;
				}
				// left
				if (side == "bottom-left" || side == "left" || side == "top-left") {
					x = e.clientX - this.offLeft - (windowsAreaRect.left + parseFloat(windowsAreaStyle.borderLeftWidth)) + win.editor.windowsArea.html.scrollLeft;
					if (x < 0) { x = 0; }
					w = win.w + (win.x - x);
				}
				// top
				if (side == "top-left" || side == "top" || side == "top-right") {
					y = e.clientY - this.offTop - (windowsAreaRect.top + parseFloat(windowsAreaStyle.borderTopWidth)) + win.editor.windowsArea.html.scrollTop;
					if (y < 0) { y = 0; }
					h = win.h + (win.y - y);
				}

				win.setSize(w, h);
				win.setPosition(x, y);
			};

			document.addEventListener("mousemove", this.mouseMoveHandler);

			this.mouseUpHandler = () => {
				document.removeEventListener("mousemove", this.mouseMoveHandler);
				document.removeEventListener("mouseup", this.mouseUpHandler);
			};

			document.addEventListener("mouseup", this.mouseUpHandler);
		});
	}
}

export default class HWindow extends HElement {
	constructor(editor, id) {
		super("div", {class: "window"});

		this.editor = editor;
		this.id = id;

		this.x = 0;
		this.y = 0;
		this.w = 0;
		this.h = 0;

		this.restore = {x: 0, y: 0, w: 0, h: 0};
		this.isMaximized = false;

		this.windowChildren = [];
		this.windowParent = null;

		this.html.addEventListener("focusin", () => {
			this.editor.windowsArea.focus(this.id);
		});
		this.html.addEventListener("mousedown", () => {
			this.editor.windowsArea.focus(this.id);
		});

		parent(this);

			add( new HWindowBorder(this, "top-left") );
			add( new HWindowBorder(this, "top") );
			add( new HWindowBorder(this, "top-right") );
			add( new HWindowBorder(this, "left") );

			parent( add( new HElement("div", {class: "contents"}) ) );

				this.titlebar = parent( add( new HElement("div", {class: "titlebar"}) ) );

				this.titlebar.html.addEventListener("mousedown", e => {
					if (e.button != 0) return;
					if (e.target != this.titlebar.html && e.target != this.title.html) return;
					if (this.isMaximized) return;

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

			add( new HWindowBorder(this, "right") );
			add( new HWindowBorder(this, "bottom-left") );
			add( new HWindowBorder(this, "bottom") );
			add( new HWindowBorder(this, "bottom-right") );

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

		const w = parseFloat(windowAreaStyle.width);
		const h = parseFloat(windowAreaStyle.height);

		return {w, h};
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

	restoreMaximize() {
		if (!this.isMaximized) {
			this.html.classList.add("maximized");

			this.restore = {x: this.x, y: this.y, w: this.w, h: this.h};

			const {w, h} = this.getMaxSize();
			this.setSize(w, h);
			this.setPosition(0, 0);

			this.restoreMaximizeButton.html.textContent = "Restore";
			this.isMaximized = true;
		} else {
			this.html.classList.remove("maximized");

			this.setSize(this.restore.w, this.restore.h);
			this.setPosition(this.restore.x, this.restore.y);

			this.restoreMaximizeButton.html.textContent = "Maximize";
			this.isMaximized = false;
		}
	}

	openAsChild(windowClass, id, ...clientArgs) {
		const w = this.editor.windowsArea.open(windowClass, id, ...clientArgs);
		w.parent = this;
		this.windowChildren.push(w);
	}

	close() {
		this.editor.windowsArea.delete(this);

		for (const child of this.windowChildren) {
			child.close();
		}

		if (this.windowParent) {
			this.windowParent.children.splice(this.windowParent.children.indexOf(this), 1);
		}
	}
}