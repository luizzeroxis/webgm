import {parent, endparent, add, newElem} from '../../common/H.js'
import HWindow from '../HWindow.js';

export default class HWindowPath extends HWindow {

	constructor(editor, id, path) {
		super(editor, id);

		this.path = path;

		this.title.html.textContent = 'Edit Path '+path.name;

		parent(this.client)
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