import {parent, endparent, add, newElem} from '../../common/H.js'
import HWindow from '../HWindow.js';

export default class HWindowTimeline extends HWindow {

	constructor(editor, id, timeline) {
		super(editor, id);

		this.timeline = timeline;

		this.title.html.textContent = 'Edit Time Line '+timeline.name;

		parent(this.client)
			parent( add( newElem('grid-resource resource-timeline', 'div') ) )
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