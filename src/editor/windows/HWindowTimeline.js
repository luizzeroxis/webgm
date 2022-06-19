import {parent, endparent, add, HElement, HTextInput} from '../../common/H.js'
import HPropertiesWindow from '../HPropertiesWindow.js';

export default class HWindowTimeline extends HPropertiesWindow {

	constructor(manager, id, editor) {
		super(manager, id, editor);

		this.timeline = id;

		this.title.html.textContent = 'Edit Time Line '+this.timeline.name;

		parent(this.client)
			parent( add( new HElement('div', {class: 'grid-resource resource-timeline'}) ) )
				parent( add( new HElement('div') ) )

					const inputName = add( new HTextInput('Name:', this.timeline.name) )
					
					endparent()
				endparent()

			this.makeApplyOkButtons(
				() => {
					this.editor.changeResourceName(this.timeline, inputName.getValue());
				},
				() => this.close()
			);
			endparent();
	}
}