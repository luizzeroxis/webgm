import {parent, endparent, add, HElement} from '../../common/H.js'
import HWindow from '../HWindow.js';

export default class HWindowPath extends HWindow {

	constructor(editor, id, path) {
		super(editor, id);

		this.path = path;

		this.title.html.textContent = 'Edit Path '+path.name;

		parent(this.client)
			parent( add( new HElement('div', {class: 'grid-resource resource-path'}) ) )
				parent( add( new HElement('div') ) )


					
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