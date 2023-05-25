import {parent, endparent, add, HSelect, HOption} from "~/common/H.js";

export default class HResourceSelect extends HSelect {
	constructor(editor, label, resourceType, noNone=false) {
		super(label);

		this.editor = editor;
		this.resourceType = resourceType;
		this.noNone = noNone;

		this.selectOptions = {};

		this.updateOptions();
	}

	onAdd() {
		this.updateOptions();

		this.listeners = this.editor.project.dispatcher.listen({
			createResource: i => {
				if (i.constructor != this.resourceType) return;
				parent(this.select);
					this.selectOptions[i.id] = add( new HOption(i.name, i.id) );
					endparent();
			},
			deleteResource: i => {
				if (i.constructor != this.resourceType) return;
				this.selectOptions[i.id].remove();
				delete this.selectOptions[i.id];
			},
			changeResourceName: i => {
				if (i.constructor != this.resourceType) return;
				this.selectOptions[i.id].html.textContent = i.name;
			},
			// TODO sprite changes?
		});
	}

	onRemove() {
		this.editor.project.dispatcher.stopListening(this.listeners);
	}

	updateOptions() {
		const previousValue = this.select.html.value;

		this.removeOptions();

		parent(this.select);

			if (!this.noNone) {
				add( new HOption("<none>", -1) );
			}

			this.editor.project.resources[this.resourceType.getClassName()].forEach(resource => {
				this.selectOptions[resource.id] = add( new HOption(resource.name, resource.id) );
			});

			endparent();

		this.select.html.value = previousValue;
		if (this.select.html.selectedIndex == -1) {
			this.select.html.selectedIndex = 0;
		}
	}

	getValue() {
		const value = parseInt(super.getValue());
		if (Number.isNaN(value)) return -1;
		return value;
	}
}