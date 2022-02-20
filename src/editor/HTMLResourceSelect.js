import {$, parent, endparent, add, remove, html, newSelect} from '../common/H.js'

export default class HTMLResourceSelect {
	constructor(editor, labelContent, resourceType, noNone=false) {

		this.editor = editor;

		this.html = add( newSelect(null, labelContent) );

		var selectOptions = {};
		this.select = parent($(this.html, 'select'))

			if (!noNone) {
				add( html('option', {value: -1}, null, '<none>') );
			}
			this.editor.project.resources[resourceType.getClassName()].forEach(resource => {
				selectOptions[resource.id] = add( html('option', {value: resource.id}, null, resource.name) )
			})
			endparent();

		this.listeners = this.editor.dispatcher.listen({
			createResource: i => {
				if (i.constructor != resourceType) return;
				parent(this.select)
					selectOptions[i.id] = add( html('option', {value: i.id}, null, i.name) )
					endparent()
			},
			deleteResource: i => {
				if (i.constructor != resourceType) return;
				remove(selectOptions[i.id])
				delete selectOptions[i.id];
			},
			changeResourceName: i => {
				if (i.constructor != resourceType) return;
				selectOptions[i.id].textContent = i.name;
			}
			// TODO sprite changes?
		})

	}

	getValue() {
		var value = parseInt(this.select.value);
		if (Number.isNaN(value)) return -1;
		return value;
	}

	setValue(value) {
		this.select.value = value;
	}

	remove() {
		remove(this.html);
		this.editor.dispatcher.stopListening(this.listeners);
	}
	
}