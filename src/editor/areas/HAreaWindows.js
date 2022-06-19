import {parent, endparent, add, remove, HElement} from '../../common/H.js'
import Editor from '../Editor.js';
import HFloatingManager from '../HFloatingManager.js';

export default class HAreaWindows extends HElement {

	constructor(editor) {
		super('div', {class: 'windows'})

		this.editor = editor;

		parent(this)
			this.floatingManager = add( new HFloatingManager(this) )
			endparent()
	}

	onAdd() {
		this.listeners = this.editor.dispatcher.listen({
			createResource: resource => {
				this.openResource(resource);
			},
			deleteResource: resource => {
				this.closeResource(resource);
			},
		});
	}

	// onRemove() {
	// 	this.editor.dispatcher.stopListening(this.listeners);
	// }

	openResource(resource) {
		const windowClass = Editor.resourceTypesInfo.find(x => x.class == resource.constructor).windowClass;
		this.floatingManager.focusWindowByIdOrOpenWindow(windowClass, resource, this.editor);
	}

	closeResource(resource) {
		this.floatingManager.closeWindowById(resource);
	}

	closeAll() {
		this.floatingManager.closeAllWindows();
	}

	open(windowClass, id, ...args) {
		this.floatingManager.focusWindowByIdOrOpenWindow(windowClass, id, this.editor, ...args);
	}

}