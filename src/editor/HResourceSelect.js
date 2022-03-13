import {parent, endparent, add, remove, HSelect, newOption} from '../common/H.js'

export default class HResourceSelect extends HSelect {
	constructor(editor, label, resourceType, noNone=false) {
		super(label)

		this.editor = editor;
		this.resourceType = resourceType;

		this.selectOptions = {};

		parent(this.select)

			if (!noNone) {
				add( newOption(null, -1, '<none>') )
			}

			this.editor.project.resources[this.resourceType.getClassName()].forEach(resource => {
				this.selectOptions[resource.id] = add( newOption(null, resource.id, resource.name) )
			})

			endparent();
	}

	onAdd() {
		this.listeners = this.editor.dispatcher.listen({
			createResource: i => {
				if (i.constructor != this.resourceType) return;
				parent(this.select)
					this.selectOptions[i.id] = add( newOption(null, i.id, i.name) )
					endparent()
			},
			deleteResource: i => {
				if (i.constructor != this.resourceType) return;
				remove(this.selectOptions[i.id])
				delete this.selectOptions[i.id];
			},
			changeResourceName: i => {
				if (i.constructor != this.resourceType) return;
				this.selectOptions[i.id].textContent = i.name;
			}
			// TODO sprite changes?
		})
	}

	onRemove() {
		this.editor.dispatcher.stopListening(this.listeners);
	}

	getValue() {
		var value = parseInt(super.getValue());
		if (Number.isNaN(value)) return -1;
		return value;
	}
	
}