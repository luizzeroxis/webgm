class ResourceWindow extends Window {

	constructor(editor, type, resource) {
		super();

		this.editor = editor;
		this.type = type;
		this.resource = resource;

		this.isModified = false;

		this.window.classList.add('type-'+this.type);
		this.window.classList.add('id-'+this.resource.id);

		parent(this.title)
			this.title.innerText = 'Edit '+this.editor.types[this.type].name+' ';
			add( newElem('title', 'span', this.resource.name) )
			endparent()

		parent(this.client)
			this.makeResourceClient();
			endparent();
			
		this.resetChanges();
	}

	closeWindow() {
		if (this.isModified ? confirm('Close without saving?') : true) {
			this.window.classList.add('hidden');

			this.resetChanges();
			this.isModified = false;
		}
	}

	makeApplyOkButtons() {
		parent( add ( html('div') ) )

			add( newButton(null, 'Apply', () => {
				this.editor.changeResource(this.type, this.resource, this.getResourceChanges());
				this.isModified = false;
			}) );

			add( newButton(null, 'Ok', () => {
				this.editor.changeResource(this.type, this.resource, this.getResourceChanges());
				this.window.classList.add('hidden');

				this.resetChanges();
				this.isModified = false;
			}) );

			endparent()
	}

	makeClient() {
		//
	}

	//Overridable
	makeResourceClient() {

	}

	//Overridable
	resetChanges() {
		this.changes = {};
	}

	//Overridable
	getResourceChanges() {
		return this.changes;
	}


}