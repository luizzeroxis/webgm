import {parent, endparent, add, HElement, newButton} from '../common/H.js'

export default class HWindow extends HElement {

	constructor(editor, id) {
		super('div', {class: 'window'})

		this.editor = editor;
		this.id = id;

		parent(this)

			parent( add( new HElement('div', {class: 'titlebar'}) ) )
				this.title = add( new HElement('span') )
				this.closeButton = add( newButton('closebutton right', 'Close', () => this.close()) );
				endparent()

			this.client = add( new HElement('div', {class: 'client'}) )

			endparent();

		this.applyButton = null;
		this.okButton = null;
	}

	makeApplyOkButtons(applyOkFunc, okFunc) {
		parent( add( new HElement('div') ) )

			this.applyButton = add( newButton(null, 'Apply', () => {
				applyOkFunc();
			}) );

			this.okButton = add( newButton(null, 'Ok', () => {
				if (applyOkFunc() != false)
					okFunc();
			}) );

			endparent()
	}

	close() {
		this.editor.windowsArea.delete(this);
	}

}