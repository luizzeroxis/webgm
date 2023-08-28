import HModalWindow from "~/common/components/HWindowManager/HModalWindow.js";
import {parent, endparent, add, HElement, HTextInput} from "~/common/h";

export default class HHighscoreWindow extends HModalWindow {
	constructor(manager, game, options={}) {
		super(manager);

		this.setResizable(false);
		this.setMinimizeButton(false);
		this.setMaximizeButton(false);
		this.escCloses = true;

		this.setTitle(game.windows.highscoreCaptionText);

		if (!game.windows.highscoreBorder) {
			this.setClientOnly(!game.windows.highscoreBorder);
		}

		this.inputName = null;

		parent(this.client);
			this.client.html.classList.add("highscore-window");

			if (game.windows.highscoreBackground) {
				this.client.html.style.backgroundImage = `url("${game.windows.highscoreBackground.image.src}")`;
			} else {
				this.client.html.style.backgroundColor = game.windows.highscoreBackgroundColor;
			}

			this.client.html.style.color = game.windows.highscoreOtherColor;

			this.gridDiv = parent( add( new HElement("div", {class: "grid"}) ) );
				this.gridDiv.html.style.fontFamily = game.windows.highscoreFont.name;
				this.gridDiv.html.style.fontSize = game.windows.highscoreFont.size + "pt";
				this.gridDiv.html.style.fontWeight = game.windows.highscoreFont.bold == "1" ? "bold" : null;
				this.gridDiv.html.style.fontStyle = game.windows.highscoreFont.italic == "1" ? "italic" : null;
				this.gridDiv.html.style.textDecoration = (
					[
						...(game.windows.highscoreFont.underline == "1" ? ["underline"] : []),
						...(game.windows.highscoreFont.strike == "1" ? ["line-through"] : []),
					].join(" ")
				);

				for (let i=0; i<10; ++i) {
					const row = parent( add( new HElement("div", {class: "row"}) ) );
						if (options.inputPosition == i) {
							row.html.style.color = game.windows.highscoreNewColor;
						}

						add( new HElement("div", {class: "position"}, `${i+1}.`) );

						if (options.inputPosition == i) {
							this.inputName = add( new HTextInput(null, "", "name") );
						} else {
							add( new HElement("div", {class: "name"}, game.highscores[i]?.name ?? game.windows.highscoreNobodyText) );
						}

						add( new HElement("div", {class: "score"}, game.highscores[i]?.score.toString() ?? "0") );
						endparent();
				}
				endparent();

			add( new HElement("div", {class: "escape-text"}, game.windows.highscoreEscapeText) );

			endparent();
	}

	onAdd() {
		super.onAdd();
		this.inputName?.input.html.focus();
	}

	setSizeToDefault() {
		this.setSizeAuto(360, null);
	}

	onKeyDown(e) {
		if (e.code == "Enter") {
			this.close(this.inputName?.getValue());
		}
	}
}