//
class Window {
	constructor(editor, type, resource) {

		this.editor = editor;
		this.type = type;
		this.resource = resource;

		this.isModified = false;

		parent( add( newElem('titlebar', 'div') ) )
			parent( add( newElem(null, 'span', 'Edit '+this.editor.types[this.type].name+' ') ) )
				add( newElem('title', 'span', this.resource.name) )
				endparent()
			add( newButton('closebutton right', 'Close', () => {
				if (this.isModified ? confirm('Close without saving?') : true) {
					this.closeWindow();
					this.resetChanges();
					this.isModified = false;
				}
			}) )
			endparent()

		parent( add( newElem('client', 'div') ) )
			this.makeClient();
			this.resetChanges();
			endparent();

		parent( add ( html('div') ) )

			add( newButton(null, 'Apply', () => {
				this.editor.changeResource(this.type, this.resource, this.getResourceChanges());
				this.isModified = false;
			}) );

			add( newButton(null, 'Ok', () => {
				this.editor.changeResource(this.type, this.resource, this.getResourceChanges());
				this.closeWindow();
				this.resetChanges();
				this.isModified = false;
			}) );

			endparent()
	}

	closeWindow() {
		$('.windows .type-'+this.type+'.id-'+this.resource.id).classList.add('hidden');
	}

	//Overridable
	makeClient() {
		add( html( 'div', null, null, 'There is nothing here, yet.' ) )
	}

	//Overridable
	getResourceChanges() {
		return this.changes;
	}

	//Overridable
	resetChanges() {
		this.changes = {};
	}

}