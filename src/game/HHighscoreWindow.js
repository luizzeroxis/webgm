import HModalWindow from "~/common/components/HWindowManager/HModalWindow.js";
import {parent, endparent, add, HElement, HTextInput} from "~/common/h";

export default class HHighscoreWindow extends HModalWindow {
	constructor(manager, game, options={}) {
		super(manager);

		this.setResizable(false);
		this.setMinimizeButton(false);
		this.setMaximizeButton(false);
		this.escCloses = true;

		this.setTitle("Top Ten Players");

		this.inputName = null;

		parent(this.client);
			this.client.html.classList.add("window-highscore");

			parent( add( new HElement("div", {class: "grid"}) ) );
				for (let i=0; i<10; ++i) {
					add( new HElement("div", {class: "position"}, `${i+1}.`) );

					if (options.inputPosition == i) {
						this.inputName = add( new HTextInput(null, "", "name") );
					} else {
						add( new HElement("div", {class: "name"}, game.highscores[i]?.name ?? "<nobody>") );
					}

					add( new HElement("div", {class: "score"}, game.highscores[i]?.score.toString() ?? "0") );
				}
				endparent();

			add( new HElement("div", {class: "escape-text"}, "press <Escape> to close") );

			endparent();
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