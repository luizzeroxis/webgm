export default class GameWindows {
	constructor(game) {
		this.game = game;

		this.modals = [];

		this.initVariables();
	}

	initVariables() {
		this.messageBackground = -1;
		this.messageAlpha = 1;
		this.messageButtonSprite = -1;
		this.messageTextFont = null;
		this.messageButtonFont = null;
		this.messageInputFont = null;
		this.messageButtonHoverColor = null;
		this.messageInputColor = null;
		this.messageCaption = null;
		this.messagePosition = {x: -1, y: -1};
		this.messageSize = {w: -1, h: -1};

		this.highscoreBackground = -1;
		this.highscoreBorder = true;
		this.highscoreFont = null;
		this.highscoreBackgroundColor = null;
		this.highscoreNewColor = null;
		this.highscoreOtherColor = null;
		this.highscoreCaptionText = "Top Ten Players";
		this.highscoreNobodyText = "<nobody>";
		this.highscoreEscapeText = "press <Escape> to close";
	}

	end() {
		this.modals.forEach(w => w.forceClose());
	}

	async openModal(_class, ...args) {
		this.game.input.clear();

		const modal = this.game.windowManager.openModal(_class, this.game, ...args);
		this.modals.push(modal);

		const result = await modal.promise;

		this.modals.splice(this.modals.indexOf(modal), 1);

		this.game.render.canvas.focus({preventScroll: true});

		return result;
	}
}