import {parent, endparent, add, newElem} from '../common/H.js'

import HTMLWindow from './HTMLWindow.js';

export default class HTMLWindowGameInformation extends HTMLWindow {

	constructor(...args) {
		super(...args);
	}

	makeClient(gameInformation) {
		this.htmlTitle.textContent = 'Game Information';

		parent(this.htmlClient)

			this.textareaText = add( newElem('code', 'textarea', gameInformation.text) )

			this.makeApplyOkButtons(
				() => {
					gameInformation.text = this.textareaText.value;
					// changes here
				},
				() => this.close()
			);
			endparent();
	}
}