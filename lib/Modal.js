class Modal {
	constructor() {

		parent(document.body);

			this.modal = parent( add( newElem('modal', 'div') ) )

				this.window = parent( add( newElem('modalwindow', 'div') ) )

					this.client = add( newElem('modalwindowclient', 'div') )

					endparent()
				endparent()
			endparent()
	}
	close() {

		remove(this.modal);

	}
}