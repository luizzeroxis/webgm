import HWindow from "~/common/components/HWindowManager/HWindow.js";

export default class HWindowGame extends HWindow {
	constructor(manager, editor) {
		super(manager);
		this.editor = editor;

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