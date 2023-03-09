import HWindow from "../HWindow.js";

export default class HWindowGame extends HWindow {
	constructor(editor, id) {
		super(editor, id);

		this.userClosed = false;

		this.title.html.textContent = "Game";
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