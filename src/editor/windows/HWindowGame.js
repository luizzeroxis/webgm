import {parent, endparent, add, HElement, HCanvas} from "../../common/H.js";
import HMenuManager from "../HMenuManager.js";
import HWindow from "../HWindow.js";

export default class HWindowGame extends HWindow {
	constructor(editor, id) {
		super(editor, id);

		this.userClosed = false;

		this.title.html.textContent = "Game";

		parent(this.client);
			parent( add( new HElement("div", {class: "window-game"}) ) );
				this.canvas = add( new HCanvas(640, 480) );
				this.canvas.html.setAttribute("tabindex", 0);
				this.menuManager = add(new HMenuManager());
				endparent();
			endparent();
	}

	close() {
		this.userClosed = true;
		if (this.editor.game) {
			this.editor.stopGame();
		} else {
			super.close();
		}
	}
}