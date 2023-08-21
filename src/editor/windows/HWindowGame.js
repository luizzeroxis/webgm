import HWindow from "~/common/components/HWindowManager/HWindow.js";
import {parent, endparent, add} from "~/common/h";
import WebGMException from "~/common/WebGMException.js";
import Game from "~/game/Game.js";

export default class HWindowGame extends HWindow {
	constructor(manager, editor) {
		super(manager);
		this.editor = editor;

		this.setTitle("Game");

		if (this.editor.game) {
			this.editor.game.close();
		}

		this.editor.game = new Game({
			project: this.editor.project,
		});

		parent(this.client);
			add(this.editor.game.div);
			endparent();

		if (this.editor.preferences.get("scrollToGameOnRun")) {
			this.html.scrollIntoView();
		}
		if (this.editor.preferences.get("focusCanvasOnRun")) {
			this.editor.game.render.canvas.focus({preventScroll: true});
		}

		this.editor.toolBarArea.runButton.setDisabled(true);
		this.editor.toolBarArea.stopButton.setDisabled(false);

		const gameListeners = this.editor.game.dispatcher.listen({
			close: e => {
				if (e instanceof WebGMException) {
					alert("An error has ocurred when trying to run the game:\n" + e.message);
				}

				this.editor.game.dispatcher.stopListening(gameListeners);
				this.editor.game = null;

				this.close();

				this.editor.toolBarArea.stopButton.setDisabled(true);
				this.editor.toolBarArea.runButton.setDisabled(false);

				if (e) {
					throw e;
				}
			},
		});

		this.editor.game.start();
	}

	setSizeToDefault() {
		this.setSizeAuto(null, null);
	}

	close() {
		if (this.editor.game) {
			this.editor.game.closeButtonClicked();
		} else {
			super.close();
		}
	}

	forceClose() {
		if (this.editor.game) {
			this.editor.game.close();
		}

		super.forceClose();
	}
}