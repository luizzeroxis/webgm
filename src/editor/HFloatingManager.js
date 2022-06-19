import {parent, endparent, add, remove, HElement, HButton} from '../common/H.js'

export default class HFloatingManager extends HElement {
	constructor(container) {
		super('div', {class: 'h-floatings'})

		this.container = container;

		this.windows = [];
	}
	openWindow(windowClass, id, ...args) {
		let windowInstance = new windowClass(this, id, ...args);
		windowInstance.html.style.zIndex = this.windows.length;

		let containerRect = this.container.html.getBoundingClientRect();
		windowInstance.setPosition(containerRect.left + window.scrollX, containerRect.top + window.scrollY);

		this.windows.push(windowInstance);

		parent(this)
			add(windowInstance)
			endparent()

		return windowInstance;
	}
	closeWindow(windowInstance) {
		const index = this.windows.findIndex(x => x == windowInstance);
		if (index >= 0) {
			remove(this.windows[index])
			this.windows.splice(index, 1);
		}
	}
	closeWindowById(id) {
		let windowInstance = this.getWindowById(id);
		if (windowInstance) {
			this.closeWindow(windowInstance);
		}
	}
	closeAllWindows() {
		for (let windowInstance of this.windows) {
			remove(windowInstance);
		}
		this.windows = [];
	}
	focusWindow(windowInstance) {
		const index = this.windows.findIndex(x => x == windowInstance);
		if (index >= 0) {
			this.windows.push(this.windows.splice(index, 1)[0]);
			this.sortWindows();
		}
	}
	focusWindowByIdOrOpenWindow(windowClass, id, ...args) {
		let windowInstance = this.getWindowById(id);
		if (windowInstance) {
			this.focusWindow(windowInstance);
			return windowInstance;
		} else {
			return this.openWindow(windowClass, id, ...args);
		}
	}
	getWindowById(id) {
		return this.windows.find(x => x.id == id);
	}
	sortWindows() {
		// We don't move the elements because that stops some events from happening (e.g. clicking the close button on a non-focused window would make it not be clicked because it moved).
		for (let [i, windowInstance] of this.windows.entries()) {
			windowInstance.html.style.zIndex = i;
		}
	}
}
