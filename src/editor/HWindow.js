import {parent, endparent, add, HElement, HButton} from '../common/H.js'

export default class HWindow extends HElement {

	constructor(editor, id) {
		super('div', {class: 'window'})

		this.editor = editor;
		this.id = id;

		parent(this)

			parent( add( new HElement('div', {class: 'titlebar'}) ) )
				this.title = add( new HElement('div', {class: 'title'}) )
				this.closeButton = add( new HButton('Close', () => this.close(), 'close') );
				endparent()

			this.client = add( new HElement('div', {class: 'client'}) )

			endparent();

		this.applyButton = null;
		this.okButton = null;
	}

	makeApplyOkButtons(applyOkFunc, okFunc) {
		parent( add( new HElement('div') ) )

			this.applyButton = add( new HButton('Apply', () => {
				applyOkFunc();
			}) );

			this.okButton = add( new HButton('Ok', () => {
				if (applyOkFunc() != false)
					okFunc();
			}) );

			endparent()
	}

	close() {
		this.editor.windowsArea.delete(this);
	}

}