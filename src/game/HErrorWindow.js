import HModalWindow from "~/common/components/HWindowManager/HModalWindow.js";
import {parent, endparent, add, HElement, HButton, HMultilineTextInput} from "~/common/h";

import {NonFatalErrorException} from "./Game.js";

export default class HErrorWindow extends HModalWindow {
	constructor(manager, game, exception) {
		super(manager);

		this.game = game;
		this.exception = exception;

		this.setResizable(false);
		this.setMinimizeButton(false);
		this.setMaximizeButton(false);
		this.escCloses = true;

		this.setTitle("Error Messages");

		parent(this.client);

			const messages = add( new HMultilineTextInput(null, this.game.errorMessages, "error-messages") );
			messages.setReadOnly(true);

			parent( add( new HElement("div") ) );

				add( new HButton("Abort", () => this.close({abort: true})) );

				if (this.exception instanceof NonFatalErrorException) {
					add( new HButton("Ignore", () => this.close({abort: false})) );
				}

				add( new HButton("Copy", () => {
					navigator.clipboard.writeText(this.game.errorMessages);
				}) );

				add( new HButton("Clear", () => {
					this.game.errorMessages = "";
					messages.setValue("");
				}) );
				endparent();

			endparent();
	}
}