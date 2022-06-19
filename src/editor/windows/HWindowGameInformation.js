import {parent, endparent, add, HElement} from '../../common/H.js'
import HPropertiesWindow from '../HPropertiesWindow.js';

export default class HWindowGameInformation extends HPropertiesWindow {

	constructor(manager, id, editor) {
		super(manager, id, editor);

		this.gameInformation = id;

		this.title.html.textContent = 'Game Information';

		parent(this.client)

			this.textareaText = add( new HElement('textarea', {class: 'code'}, this.gameInformation.text) )

			this.makeApplyOkButtons(
				() => {
					this.gameInformation.text = this.textareaText.html.value;
					// changes here
				},
				() => this.close()
			);
			endparent();
	}
}