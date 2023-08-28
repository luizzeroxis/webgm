import HModalWindow from "~/common/components/HWindowManager/HModalWindow.js";
import {parent, endparent, add, HElement} from "~/common/h";

export default class HGameInformationWindow extends HModalWindow {
	constructor(manager, game) {
		super(manager);
		this.game = game;

		this.setClientOnly(true);
		this.escCloses = true;

		parent(this.client);
			this.client.html.classList.add("game-information-window");

			add( new HElement("div", {}, this.game.project.gameInformation.text) );
			endparent();
	}

	setPositionToDefault() {
		this.setPosition(0, 0);
	}

	setSizeToDefault() {
		const maxSize = this.getMaxSize();
		this.setSize(maxSize.w, maxSize.h);
	}
}