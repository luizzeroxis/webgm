import {parent, endparent, add, remove, HElement} from '../../common/H.js'
import Editor from '../Editor.js';

export default class HAreaWindows extends HElement {

	constructor(editor) {
		super('div', {class: 'windows'})

		this.editor = editor;
		this.windows = [];
	}

	onAdd() {
		this.listeners = this.editor.dispatcher.listen({
			createResource: i => {
				this.openResource(i);
			},
			deleteResource: i => {
				this.deleteId(i);
			},
		});
	}

	// onRemove() {
	// 	this.editor.dispatcher.stopListening(this.listeners);
	// }

	// Open a new window or focus on a existing one. windowClass is class that extends HWindow. It will send id, the editor and ...clientArgs as arguments. If a window with the same id is opened, it will focus on it, and return null. Otherwise it returns the newly created instance.
	open(windowClass, id, ...clientArgs) {
		if (this.windows.find(x => x.id == id)) {
			this.focus(id);
			return null;
		} else {
			parent(this)
				const w = add( new windowClass(this.editor, id, ...clientArgs) )
				endparent()

			this.windows.unshift(w);
			this.organize();
			return w;
		}
	}

	// Open or focus on a resource window.
	openResource(resource) {
		const windowClass = Editor.resourceTypesInfo.find(x => x.class == resource.constructor).windowClass;
		this.open(windowClass, resource, resource);
	}

	// Delete window instance.
	delete(w) {
		const index = this.windows.findIndex(x => x == w);
		if (index>=0) {
			remove(this.windows[index])
			this.windows.splice(index, 1);
			return true;
		}
		return false;
	}

	// Delete window by id.
	deleteId(id) {
		const index = this.windows.findIndex(x => x.id == id);
		if (index>=0) {
			remove(this.windows[index])
			this.windows.splice(index, 1);
			return true;
		}
		return false;
	}

	// Remove all windows.
	clear() {
		for (const w of this.windows) {
			remove(w);
		}
		this.windows = [];
	}

	// Move window with id to the top of the screen.
	focus(id) {
		const index = this.windows.findIndex(x => x.id == id);

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