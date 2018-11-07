class Window {

	constructor() {

		this.window = parent( add( newElem('window', 'div') ) )

			parent( add( newElem('titlebar', 'div') ) )
				this.title = add( newElem(null, 'span', '') )
				add( newButton('closebutton right', 'Close', () => this.closeWindow()) )
				endparent()

			this.client = parent( add( newElem('client', 'div') ) )
				//this.makeClient();
				endparent();
			endparent()
	}

	//Overridable
	closeWindow() {
		remove(this.window);
	}

	//Overridable
	makeClient() {
		//
	}

}