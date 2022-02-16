import {parent, endparent, add, newElem} from '../../common/H.js'

import Editor from '../Editor.js';

export default class WindowsArea {

	constructor(editor) {
		this.editor = editor;
		
		this.html = add( newElem('windows', 'div') )

		this.windows = [];
	}

	// Open a new window or focus on a existing one. windowClass is class that extends HTMLWindow. It will send id and the editor as arguments, then call makeClient with ...clientArgs. If a window with the same id is opened, it will focus on it, and return null. Otherwise it returns the newly created instance.
	open(windowClass, id, ...clientArgs) {
		if (this.windows.find(x => x.id == id)) {
			this.focus(id);
			return null;
		} else {
			parent(this.html)
				var w = new windowClass(id, this.editor);
				w.makeClient(...clientArgs);
				endparent()

			this.windows.unshift(w);
			this.organize();
			return w;
		}
	}

	// Open or focus on a resource window.
	openResource(resource) {
		var windowClass = Editor.resourceTypesInfo.find(x => x.class == resource.constructor).windowClass;
		this.open(windowClass, resource, resource);
	}

	// Delete window instance.
	delete(w) {
		var index = this.windows.findIndex(x => x == w);
		if (index>=0) {
			this.windows[index].remove();
			this.windows.splice(index, 1);
			return true;
		}
		return false;
	}

	// Delete window by id.
	deleteId(id) {
		var index = this.windows.findIndex(x => x.id == id);
		if (index>=0) {
			this.windows[index].remove();
			this.windows.splice(index, 1);
		}
	}

	// Remove all windows.
	clear() {
		this.html.textContent = '';
		this.windows = [];
	}

	// Move window with id to the top of the screen.
	focus(id) {
		var index = this.windows.findIndex(x => x.id == id);

		// Move the window to the top of the array.
		this.windows.unshift(this.windows.splice(index, 1)[0]);

		this.organize();
	}

	// Visually orders windows in the order of the array.
	organize() {
		this.windows.forEach((w, i) => {
			w.html.style.order = i;
		});
	}

}