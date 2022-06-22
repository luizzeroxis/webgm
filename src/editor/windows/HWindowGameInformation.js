import {parent, endparent, add, HElement} from "../../common/H.js";
import HWindow from "../HWindow.js";

export default class HWindowGameInformation extends HWindow {
	constructor(editor, id, gameInformation) {
		super(editor, id);

		this.gameInformation = gameInformation;

		this.title.html.textContent = "Game Information";

		parent(this.client);

			this.textareaText = add( new HElement("textarea", {class: "code"}, gameInformation.text) );

			this.makeApplyOkButtons(
				() => {
					gameInformation.text = this.textareaText.html.value;
					// changes here
				},
				() => this.close(),
			);
			endparent();
	}
}