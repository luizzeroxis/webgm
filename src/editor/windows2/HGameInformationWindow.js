import {parent, endparent, add, HElement, HMultilineTextInput} from "~/common/h";
import HWindow from "~/common/components/HWindowManager/HWindow.js";

export default class HGameInformationWindow extends HWindow {
	constructor(manager, editor, gameInformation) {
		super(manager);

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