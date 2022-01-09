import {$, parent, endparent, add, remove, html, newSelect} from '../common/H.js'

export default class HTMLResourceSelect {
	constructor(editor, labelContent, resourceType, noNone=false) {

		this.editor = editor;

		this.e = add( newSelect(null, labelContent) );

		var selectOptions = {};
		this.select = parent($(this.e, 'select'))

			if (!noNone) {
				add( html('option', {value: -1}, null, '<none>') );
			}
			this.editor.project.resources[resourceType.getClassName()].forEach(resource => {
				selectOptions[resource.id] = add( html('option', {value: resource.id}, null, resource.name) )
			})
			endparent();

		this.editor.dispatcher.listen({
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
		return parseInt(this.select.value);
	}

	setValue(value) {
		this.select.value = value;
	}
}