import HModalWindow from "~/common/components/HWindowManager/HModalWindow.js";
import {parent, endparent, add, HElement, HButton, HTextInput} from "~/common/h";

export default class HMessageWindow extends HModalWindow {
	constructor(manager, text, options={}) {
		super(manager);

		this.setResizable(false);
		this.setMinimizeButton(false);
		this.setMaximizeButton(false);
		this.escCloses = true;

		this.setTitle("Message");

		this.client.html.classList.add("window-message");

		parent(this.client);
			add( new HElement("div", {}, text) );

			if (options.input) {
				this.input = add( new HTextInput(null, options.input.default, "input") );
			}

			parent( add( new HElement("div", {class: "buttons"}) ) );
				this.buttons = [];
				if (options.buttons) {
					for (const [index, button] of options.buttons.entries()) {
						if (button != "") {
							this.buttons.push(add( new HButton(button, () => {
								this.close(index+1);
							}, "button") ));
						}
					}
				} else {
					this.buttons.push(add( new HButton("Ok", () => {
						if (options.input) {
							this.close(this.input.getValue());
						} else {
							this.close();
						}
					}, "button") ));
				}
				endparent();
			endparent();
	}

	onAdd() {
		super.onAdd();
		this.buttons[0]?.html.focus();
	}

	setSizeToDefault() {
		this.setSizeAuto(320, null);
	}
}