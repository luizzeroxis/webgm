import {parent, endparent, add, HElement, HTextInput} from '../../common/H.js'
import HPropertiesWindow from '../HPropertiesWindow.js';

export default class HWindowPath extends HPropertiesWindow {

	constructor(manager, id, editor) {
		super(manager, id, editor);

		this.path = id;

		this.title.html.textContent = 'Edit Path '+this.path.name;

		parent(this.client)
			parent( add( new HElement('div', {class: 'grid-resource resource-path'}) ) )
				parent( add( new HElement('div') ) )

					const inputName = add( new HTextInput('Name:', this.path.name) )
					
					endparent()
				endparent()

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(this.path, inputName.getValue());
				},
				() => this.close()
			);
			endparent();
	}
}