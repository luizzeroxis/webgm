import {parent, endparent, add, HElement, HMultilineTextInput} from "~/common/H.js";
import HWindow from "~/editor/HWindow.js";

export default class HWindowGameInformation extends HWindow {
	constructor(editor, id, gameInformation) {
		super(editor, id);

		this.gameInformation = gameInformation;

		this.title.html.textContent = "Game Information";

		parent(this.client);
			parent( add( new HElement("div", {class: "window-game-information"}) ) );
				this.inputText = add( new HMultilineTextInput(null, gameInformation.text) );
				endparent();

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