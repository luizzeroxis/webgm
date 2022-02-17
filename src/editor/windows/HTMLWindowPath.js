import {parent, endparent, add, newElem} from '../../common/H.js'
import HTMLWindow from '../HTMLWindow.js';

export default class HTMLWindowPath extends HTMLWindow {

	constructor(...args) {
		super(...args);
	}

	makeClient(path) {
		this.htmlTitle.textContent = 'Edit Path '+path.name;

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-path', 'div') ) )
				parent( add( newElem(null, 'div') ) )


					
					endparent()
				endparent()

			this.makeApplyOkButtons(
				() => {
					// changes here
				},
				() => this.close()
			);
			endparent();
	}
}