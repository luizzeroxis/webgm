import {parent, endparent, add, HElement, HButton} from '../common/H.js'
import HFloatingWindow from './HFloatingWindow.js';

export default class HPropertiesWindow extends HFloatingWindow {

	constructor(manager, id, editor) {
		super(manager, id)

		this.editor = editor;

		this.applyButton = null;
		this.okButton = null;
	}

	makeApplyOkButtons(applyOkFunc, okFunc) {
		parent( add( new HElement('div') ) )

			this.applyButton = add( new HButton('Apply', () => {
				applyOkFunc();
			}) );

			this.okButton = add( new HButton('Ok', () => {
				if (applyOkFunc() != false) {
					okFunc();
				}
			}) );

			endparent()
	}

}