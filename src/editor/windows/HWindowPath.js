import {parent, endparent, add, HElement, HTextInput} from '../../common/H.js'
import HWindow from '../HWindow.js';

export default class HWindowPath extends HWindow {
	constructor(editor, id, path) {
		super(editor, id);

		this.path = path;

		this.title.html.textContent = 'Edit Path '+path.name;

		parent(this.client)
			parent( add( new HElement('div', {class: 'grid-resource resource-path'}) ) )
				parent( add( new HElement('div') ) )

					const inputName = add( new HTextInput('Name:', path.name) )

					endparent()
				endparent()

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(path, inputName.getValue());
				},
				() => this.close(),
			);
			endparent();
	}
}