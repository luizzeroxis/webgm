import { parent, endparent, add, remove, HSelect, newOption} from '../common/H.js'

export default class HTMLResourceSelect {
	constructor(editor, labelContent, resourceType, noNone=false) {

		this.editor = editor;

		this.html = add( new HSelect(labelContent) )
		this.select = this.html.select;

		var selectOptions = {};

		parent( this.select )

			if (!noNone) {
				add( newOption(null, -1, '<none>') );
			}
			this.editor.project.resources[resourceType.getClassName()].forEach(resource => {
				selectOptions[resource.id] = add( newOption(null, resource.id, resource.name) )
			})

			endparent();

		this.listeners = this.editor.dispatcher.listen({
			createResource: i => {
				if (i.constructor != resourceType) return;
				parent(this.select)
					selectOptions[i.id] = add( newOption(null, i.id, i.name) )
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
		var value = parseInt(this.html.getValue());
		if (Number.isNaN(value)) return -1;
		return value;
	}

	setValue(value) {
		this.html.setValue(value);
	}

	remove() {
		remove(this.html);
		this.editor.dispatcher.stopListening(this.listeners);
	}
	
}