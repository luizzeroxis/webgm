import HTMLWindow from './HTMLWindow.js';

import {parent, endparent, add, newElem} from '../common/H.js'

export default class HTMLWindowTimeline extends HTMLWindow {

	constructor(...args) {
		super(...args);
	}

	makeClient(timeline) {
		this.htmlTitle.textContent = 'Edit Time Line '+timeline.name;

		parent(this.htmlClient)
			parent( add( newElem('grid-resource resource-timeline', 'div') ) )
				parent( add( newElem(null, 'div') ) )


					
					endparent()
				endparent()

			this.makeApplyOkButtons(
				() => {
					// changes here
				},
				() => this.editor.deleteWindow(this)
			);
			endparent();
	}
}