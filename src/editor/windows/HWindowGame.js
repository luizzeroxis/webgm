import HWindow from "~/common/components/HWindowManager/HWindow.js";

export default class HWindowGame extends HWindow {
	constructor(manager, editor) {
		super(manager);
		this.editor = editor;

		this.setTitle("Game");
	}

	close() {
		if (this.editor.game) {
			this.editor.stopGame();
		}

		super.close();
	}
}