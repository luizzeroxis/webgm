import {parent, endparent, add, HElement} from "~/common/h";

import "./HWindowManager.scss";

export default class HWindowManager extends HElement {
	constructor() {
		super("div", {class: "h-window-manager"});

		this.windows = [];
		this.cascadeDiff = 24;
		this.minimizedSize = 250;
	}

	// Opens or focus on a window. idFunc(window) will be called for each window; it should return a bool that determines if it's the same window as the one you're tryng to open. If window doesn't exist yet, a new windowClass(manager, ...args) will be created. If window exists, it will be focused on.
	open(windowClass, idFunc, ...args) {
		let w = this.find(windowClass, idFunc);
		if (w) {
			this.focus(w);
		} else {
			parent(this);
				w = add( new windowClass(this, ...args) );
				endparent();

			this.windows.unshift(w);
			this.organize();
		}
		return w;
	}

	openModal(windowClass, ...args) {
		parent(this);
			const modal = parent( add( new HElement("div", {class: "modal"}) ) );
				const w = add( new windowClass(this, ...args) );
				w.setModal(modal);
				endparent();
			endparent();

		this.windows.unshift(w);
		this.organize();

		return w;
	}

	find(windowClass, idFunc) {
		return this.windows.find(w => w.constructor == windowClass && (idFunc?.(w) ?? true));
	}

	// Move window to the top.
	focus(w) {
		const index = this.windows.findIndex(x => x == w);
		if (index >= 0) {
			// Move the window to the top of the array.
			this.windows.unshift(this.windows.splice(index, 1)[0]);

			this.organize();
		}
	}

	// Visually orders windows in the order of the array.
	organize() {
		this.windows.forEach((w, i) => {
			w.html.style.zIndex = this.windows.length - i;
			if (w.modal) {
				w.modal.html.style.zIndex = w.html.style.zIndex;
			}
		});
	}

	// Delete window instance.
	delete(w) {
		const index = this.windows.findIndex(x => x == w);
		if (index >= 0) {
			this.windows[index].modal?.remove();
			this.windows[index].remove();
			this.windows.splice(index, 1);
			this.organize();
			return true;
		}
		return false;
	}

	// Moves all windows into a cascanding pattern.
	cascade() {
		let x = 0;
		let y = 0;

		for (const w of [...this.windows].reverse()) {
			w.setPosition(x, y);
			x += this.cascadeDiff;
			y += this.cascadeDiff;
		}
	}

	// Remove all windows.
	clear() {
		this.removeChildren();
		this.windows = [];
	}
}