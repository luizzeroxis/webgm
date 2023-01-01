import {parent, endparent, add, HMultilineTextInput} from "../../common/H.js";
import HWindow from "../HWindow.js";

export default class HWindowGameInformation extends HWindow {
	constructor(editor, id, gameInformation) {
		super(editor, id);

		this.gameInformation = gameInformation;

		this.title.html.textContent = "Game Information";

		parent(this.client);

			this.inputText = add( new HMultilineTextInput(null, gameInformation.text, "code") );

			this.makeApplyOkButtons(
				() => {
					gameInformation.text = this.inputText.getValue();
					// changes here
				},
				() => this.close(),
			);
			endparent();
	}
}