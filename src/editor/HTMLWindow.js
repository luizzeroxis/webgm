import {parent, endparent, add, remove, newElem, newButton} from '../common/H.js'

export default class HTMLWindow {

	constructor(id, editor) {

		this.id = id;
		this.editor = editor;

		this.html = parent( add( newElem('window', 'div') ) )

			parent( add( newElem('titlebar', 'div') ) )
				this.htmlTitle = add( newElem(null, 'span', '') )
				this.htmlCloseButton = add( newButton('closebutton right', 'Close', () => this.close()) );
				endparent()

			this.htmlClient = parent( add( newElem('client', 'div') ) )
				endparent();
			endparent();
	}

	makeClient(resource) {}

	makeApplyOkButtons(applyOkFunc, okFunc) {
		parent( add ( newElem(null, 'div') ) )

			this.htmlApply = add( newButton(null, 'Apply', () => {
				applyOkFunc();
			}) );

			this.htmlOk = add( newButton(null, 'Ok', () => {
				if (applyOkFunc() != false)
					okFunc();
			}) );

			endparent()
	}

	close() {
		this.editor.windowsArea.delete(this);
	}

	remove() {
		remove(this.html);
	}

}