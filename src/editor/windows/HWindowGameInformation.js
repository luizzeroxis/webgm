import {parent, endparent, add, newElem} from '../../common/H.js'
import HWindow from '../HWindow.js';

export default class HWindowGameInformation extends HWindow {

	constructor(editor, id, gameInformation) {
		super(editor, id);

		this.gameInformation = gameInformation;

		this.title.html.textContent = 'Game Information';

		parent(this.client)

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